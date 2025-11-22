import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, videoType, action, revisionNotes } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Processing video approval:', { orderId, videoType, action })

    // Get current order
    const { data: order, error: orderError } = await supabase
      .from('santa_video_orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    if (action === 'approve') {
      // Approve the video
      const updateData: any = {
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (videoType === 'standard' || videoType === 'greeting') {
        updateData.video_status = 'approved'
      } else if (videoType === 'two_part_1') {
        updateData.video_1_status = 'approved'
      } else if (videoType === 'two_part_2') {
        updateData.video_2_status = 'approved'
      }

      const { error: updateError } = await supabase
        .from('santa_video_orders')
        .update(updateData)
        .eq('id', orderId)

      if (updateError) {
        throw updateError
      }

      // Send final video delivery email
      await sendFinalVideoEmail(order, videoType)

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Video approved successfully. Final video will be delivered shortly!'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )

    } else if (action === 'request_revision') {
      // Check if revision is allowed (only one free revision)
      if (order.revision_requested) {
        throw new Error('You have already used your free revision. Please contact support for further changes.')
      }

      // Request revision
      const updateData: any = {
        revision_requested: true,
        revision_notes: revisionNotes,
        updated_at: new Date().toISOString()
      }

      if (videoType === 'standard' || videoType === 'greeting') {
        updateData.video_status = 'revision_requested'
      } else if (videoType === 'two_part_1') {
        updateData.video_1_status = 'revision_requested'
      } else if (videoType === 'two_part_2') {
        updateData.video_2_status = 'revision_requested'
      }

      const { error: updateError } = await supabase
        .from('santa_video_orders')
        .update(updateData)
        .eq('id', orderId)

      if (updateError) {
        throw updateError
      }

      // Add revision to generation queue
      const { error: queueError } = await supabase
        .from('video_generation_queue')
        .insert({
          order_id: orderId,
          video_type: videoType + '_revision',
          template_type: getTemplateType(order.product_type, videoType),
          personalization_data: {
            ...getPersonalizationData(order, videoType),
            revision_notes: revisionNotes
          },
          status: 'queued',
          priority: 'high',
          scheduled_for: new Date().toISOString(),
          created_at: new Date().toISOString(),
          attempts: 0
        })

      if (queueError) {
        throw queueError
      }

      // Trigger revision generation
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/video-generation-processor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          videoType: videoType + '_revision',
          templateType: getTemplateType(order.product_type, videoType),
          personalizationData: {
            ...getPersonalizationData(order, videoType),
            revision_notes: revisionNotes
          }
        })
      })

      // Send revision confirmation email
      await sendRevisionConfirmationEmail(order, videoType, revisionNotes)

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Revision requested successfully. We will create a new version based on your feedback and send you a new preview within 24-48 hours.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )

    } else {
      throw new Error('Invalid action. Must be "approve" or "request_revision"')
    }

  } catch (error) {
    console.error('Error in video approval handler:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function getTemplateType(productType: string, videoType: string): string {
  if (productType === 'santa_standard_video') return 'santa_standard'
  if (productType === 'two_part_santa_video' && videoType === 'two_part_1') return 'santa_wishlist'
  if (productType === 'two_part_santa_video' && videoType === 'two_part_2') return 'santa_christmas_eve'
  if (productType === 'greeting_video') return 'santa_greeting'
  return 'santa_standard'
}

function getPersonalizationData(order: any, videoType: string): any {
  const baseData = {
    child_name: order.child_name || order.recipient_name,
    child_age: order.child_age || order.recipient_age,
    child_pronouns: order.child_pronouns,
    parent_name: order.parent_name || order.sender_name,
    parent_email: order.parent_email || order.sender_email,
    town_city: order.town_city,
    pronunciation_notes: order.pronunciation_notes,
    special_requests: order.special_requests
  }

  if (videoType === 'two_part_1') {
    return {
      ...baseData,
      wish_list_option: order.wish_list_option,
      video_1_details: order.video_1_details
    }
  } else if (videoType === 'two_part_2') {
    return {
      ...baseData,
      video_2_details: order.video_2_details
    }
  } else if (videoType === 'greeting') {
    return {
      ...baseData,
      occasion: order.occasion,
      relationship: order.relationship,
      message_details: order.message_details
    }
  } else {
    return {
      ...baseData,
      video_details: order.video_details
    }
  }
}

async function sendFinalVideoEmail(order: any, videoType: string) {
  const videoUrl = videoType === 'two_part_1' ? order.video_1_url : 
                   videoType === 'two_part_2' ? order.video_2_url : 
                   order.video_url

  const emailData = {
    to: order.parent_email || order.sender_email,
    subject: `🎅 Your Final Santa Video is Ready for Download!`,
    html: `
      <h2>Your Magical Santa Video is Ready! 🎅✨</h2>
      <p>Dear ${order.parent_name || order.sender_name},</p>
      
      <p>Ho ho ho! Your personalized Santa video${videoType.includes('two_part') ? ' (Part ' + (videoType.includes('_1') ? '1' : '2') + ')' : ''} is now ready for download in high quality!</p>
      
      <p><strong>Download Your Video:</strong> <a href="${videoUrl}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Download Final Video</a></p>
      
      <p><strong>Video Details:</strong></p>
      <ul>
        <li>High-quality MP4 format</li>
        <li>No watermarks</li>
        <li>Ready to share with family and friends</li>
        <li>Download link valid for 30 days</li>
      </ul>
      
      <p>Thank you for choosing our Santa video service. We hope this brings magical moments to your family!</p>
      
      <p>Ho ho ho!<br>The Santa Video Team 🎅</p>
      
      <p><small>Need help? Reply to this email or contact our support team.</small></p>
    `
  }

  console.log('Final video email would be sent:', emailData)
}

async function sendRevisionConfirmationEmail(order: any, videoType: string, revisionNotes: string) {
  const emailData = {
    to: order.parent_email || order.sender_email,
    subject: `🎅 Video Revision Request Received`,
    html: `
      <h2>We've Received Your Revision Request! 🎅</h2>
      <p>Dear ${order.parent_name || order.sender_name},</p>
      
      <p>Thank you for your feedback! We've received your revision request for your Santa video${videoType.includes('two_part') ? ' (Part ' + (videoType.includes('_1') ? '1' : '2') + ')' : ''}.</p>
      
      <p><strong>Your Revision Notes:</strong></p>
      <p style="background: #f3f4f6; padding: 16px; border-radius: 8px; font-style: italic;">"${revisionNotes}"</p>
      
      <p><strong>What happens next:</strong></p>
      <ul>
        <li>Our team will create a new version based on your feedback</li>
        <li>You'll receive a new preview within 24-48 hours</li>
        <li>This is your one free revision included with your purchase</li>
      </ul>
      
      <p>We're committed to making your Santa video absolutely perfect!</p>
      
      <p>Ho ho ho!<br>The Santa Video Team 🎅</p>
    `
  }

  console.log('Revision confirmation email would be sent:', emailData)
}