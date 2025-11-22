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

    console.log('Processing video approval action:', { orderId, videoType, action })

    // Get current order
    const { data: order, error: orderError } = await supabase
      .from('santa_video_orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    // Get the queue entry for this video
    const { data: queueEntry, error: queueError } = await supabase
      .from('video_generation_queue')
      .select('*')
      .eq('order_id', orderId)
      .eq('video_type', videoType)
      .is('superseded_by', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (queueError || !queueEntry) {
      throw new Error('Video not found')
    }

    if (action === 'approve') {
      // Approve the video
      const { error: approveError } = await supabase
        .from('video_generation_queue')
        .update({
          approved: true,
          approved_at: new Date().toISOString(),
        })
        .eq('id', queueEntry.id)

      if (approveError) throw approveError

      // Update order status and copy preview URL to final URL
      const previewUrlField = getUrlField(videoType, true)
      const finalUrlField = getUrlField(videoType, false)
      const statusField = getStatusField(videoType)

      const updateData: any = {
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (statusField) updateData[statusField] = 'approved'
      if (finalUrlField && previewUrlField) {
        updateData[finalUrlField] = order[previewUrlField]
      }

      const { error: updateError } = await supabase
        .from('santa_video_orders')
        .update(updateData)
        .eq('id', orderId)

      if (updateError) throw updateError

      // Update queue final sent timestamp
      await supabase
        .from('video_generation_queue')
        .update({ final_sent_at: new Date().toISOString() })
        .eq('id', queueEntry.id)

      // Send final video delivery email
      await sendFinalVideoEmail(order, videoType, order[previewUrlField])

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Video approved successfully! Your final video is ready for download.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )

    } else if (action === 'request_revision') {
      // Check if already approved
      if (queueEntry.approved) {
        throw new Error('This video has already been approved and cannot be revised.')
      }

      // Check if revision already requested
      if (order.revision_requested) {
        throw new Error('You have already used your free re-record. Please contact support for further changes.')
      }

      // Mark current video as superseded
      const newQueueId = crypto.randomUUID()
      
      await supabase
        .from('video_generation_queue')
        .update({ superseded_by: newQueueId })
        .eq('id', queueEntry.id)

      // Update order to mark revision requested
      const statusField = getStatusField(videoType)
      const updateData: any = {
        revision_requested: true,
        revision_notes: revisionNotes,
        updated_at: new Date().toISOString()
      }
      if (statusField) updateData[statusField] = 'revision_requested'

      await supabase
        .from('santa_video_orders')
        .update(updateData)
        .eq('id', orderId)

      // Create new queue entry for re-record
      const { error: newQueueError } = await supabase
        .from('video_generation_queue')
        .insert({
          id: newQueueId,
          order_id: orderId,
          video_type: videoType,
          template_type: queueEntry.template_type,
          personalization_data: {
            ...queueEntry.personalization_data,
            revision_notes: revisionNotes
          },
          status: 'queued',
          priority: 'high',
          scheduled_for: new Date().toISOString(),
          created_at: new Date().toISOString(),
          attempts: 0
        })

      if (newQueueError) throw newQueueError

      // Trigger HeyGen video generation for revision
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/heygen-video-generator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queueId: newQueueId,
          orderId: orderId,
          videoType: videoType,
          personalizationData: {
            ...queueEntry.personalization_data,
            revision_notes: revisionNotes
          }
        })
      })

      // Send revision confirmation email
      await sendRevisionConfirmationEmail(order, videoType, revisionNotes)

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Re-record requested successfully! We will create a new version based on your feedback and send you a new preview within 24-48 hours.'
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
    console.error('Error in video approval action:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function getUrlField(videoType: string, isPreview: boolean): string | null {
  const suffix = isPreview ? '_preview_url' : '_url'
  if (videoType === 'standard' || videoType === 'greeting') return 'video' + suffix
  if (videoType === 'two_part_1') return 'video_1' + suffix
  if (videoType === 'two_part_2') return 'video_2' + suffix
  return null
}

function getStatusField(videoType: string): string | null {
  if (videoType === 'standard' || videoType === 'greeting') return 'video_status'
  if (videoType === 'two_part_1') return 'video_1_status'
  if (videoType === 'two_part_2') return 'video_2_status'
  return null
}

async function sendFinalVideoEmail(order: any, videoType: string, videoUrl: string) {
  const customerEmail = order.parent_email || order.sender_email
  const customerName = order.parent_name || order.sender_name
  const videoTypeName = getVideoTypeName(videoType)

  const emailData = {
    to: customerEmail,
    subject: `🎅 Your Final ${videoTypeName} is Ready for Download!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Your Magical Santa Video is Ready! 🎅✨</h2>
        <p>Dear ${customerName},</p>
        
        <p>Ho ho ho! Your personalized <strong>${videoTypeName}</strong> is now ready for download in high quality!</p>
        
        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="margin-top: 0; color: #16a34a;">✅ Video Approved & Ready!</h3>
          <p>Your final video is now available without any watermarks.</p>
          <a href="${videoUrl}" 
             style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0;">
            Download Final Video
          </a>
        </div>

        <h3>Video Details:</h3>
        <ul>
          <li>✅ High-quality MP4 format</li>
          <li>✅ No watermarks</li>
          <li>✅ Ready to share with family and friends</li>
          <li>✅ Download link valid for 30 days</li>
        </ul>

        <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>💡 Tip:</strong> Download your video now and save it to your device. You can share it on social media, send it via email, or play it during your celebration!</p>
        </div>

        <p>Thank you for choosing KeepInMindGreetings. We hope this brings magical moments to your family!</p>
        
        <p>Ho ho ho!<br>
        The Santa Video Team 🎅</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          Need help? Reply to this email or contact our support team.<br>
          Order ID: ${order.id}
        </p>
      </div>
    `
  }

  console.log('Final video email would be sent:', emailData)
}

async function sendRevisionConfirmationEmail(order: any, videoType: string, revisionNotes: string) {
  const customerEmail = order.parent_email || order.sender_email
  const customerName = order.parent_name || order.sender_name
  const videoTypeName = getVideoTypeName(videoType)

  const emailData = {
    to: customerEmail,
    subject: `🎅 Video Re-Record Request Received`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">We've Received Your Re-Record Request! 🎅</h2>
        <p>Dear ${customerName},</p>
        
        <p>Thank you for your feedback! We've received your re-record request for your <strong>${videoTypeName}</strong>.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📝 Your Feedback:</h3>
          <p style="font-style: italic; background: white; padding: 15px; border-radius: 4px;">"${revisionNotes}"</p>
        </div>

        <h3>What happens next:</h3>
        <ol>
          <li><strong>Video Re-Generation</strong> - Our team will create a new version based on your feedback</li>
          <li><strong>New Preview</strong> - You'll receive a new preview within 24-48 hours</li>
          <li><strong>Final Approval</strong> - Once you approve the new version, we'll deliver your final video</li>
        </ol>

        <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0;"><strong>⚠️ Note:</strong> This is your one free re-record included with your purchase. Additional changes may require contacting support.</p>
        </div>

        <p>We're committed to making your Santa video absolutely perfect!</p>
        
        <p>Ho ho ho!<br>
        The Santa Video Team 🎅</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          Need help? Reply to this email or contact our support team.<br>
          Order ID: ${order.id}
        </p>
      </div>
    `
  }

  console.log('Revision confirmation email would be sent:', emailData)
}

function getVideoTypeName(videoType: string): string {
  if (videoType === 'standard') return 'Santa Standard Video'
  if (videoType === 'two_part_1') return 'Santa Two-Part Video (Part 1)'
  if (videoType === 'two_part_2') return 'Santa Two-Part Video (Part 2)'
  if (videoType === 'greeting') return 'Personalised Greeting Video'
  return 'Santa Video'
}