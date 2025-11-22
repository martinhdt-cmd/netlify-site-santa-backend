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
    const webhookData = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('HeyGen webhook received:', webhookData)

    const { video_id, status, video_url, error } = webhookData

    if (!video_id) {
      throw new Error('No video_id in webhook data')
    }

    // Find the queue entry with this HeyGen job ID
    const { data: queueEntry, error: findError } = await supabase
      .from('video_generation_queue')
      .select('*')
      .eq('heygen_job_id', video_id)
      .single()

    if (findError || !queueEntry) {
      console.error('Queue entry not found for HeyGen job:', video_id)
      throw new Error('Queue entry not found')
    }

    if (status === 'completed' && video_url) {
      // Video generation successful
      const { error: updateError } = await supabase
        .from('video_generation_queue')
        .update({
          heygen_status: 'completed',
          heygen_video_url: video_url,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', queueEntry.id)

      if (updateError) {
        throw updateError
      }

      // Update order with preview URL
      const urlField = getUrlField(queueEntry.video_type, true)
      const statusField = getStatusField(queueEntry.video_type)
      
      if (urlField && statusField) {
        await supabase
          .from('santa_video_orders')
          .update({
            [urlField]: video_url,
            [statusField]: 'preview_ready',
            updated_at: new Date().toISOString()
          })
          .eq('id', queueEntry.order_id)
      }

      // Send preview email to customer
      await sendPreviewEmail(supabase, queueEntry, video_url)

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Video completed and preview email sent'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )

    } else if (status === 'failed') {
      // Video generation failed
      const { error: updateError } = await supabase
        .from('video_generation_queue')
        .update({
          heygen_status: 'failed',
          status: 'failed',
          error_message: error || 'HeyGen video generation failed',
          failed_at: new Date().toISOString(),
        })
        .eq('id', queueEntry.id)

      if (updateError) {
        throw updateError
      }

      // Update order status
      const statusField = getStatusField(queueEntry.video_type)
      if (statusField) {
        await supabase
          .from('santa_video_orders')
          .update({
            [statusField]: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', queueEntry.order_id)
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Video generation failure recorded'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Webhook processed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in HeyGen webhook handler:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function sendPreviewEmail(supabase: any, queueEntry: any, videoUrl: string) {
  // Get order details
  const { data: order } = await supabase
    .from('santa_video_orders')
    .select('*')
    .eq('id', queueEntry.order_id)
    .single()

  if (!order) return

  const customerEmail = order.parent_email || order.sender_email
  const customerName = order.parent_name || order.sender_name
  const videoTypeName = getVideoTypeName(queueEntry.video_type)

  // Update preview sent timestamp
  await supabase
    .from('video_generation_queue')
    .update({ preview_sent_at: new Date().toISOString() })
    .eq('id', queueEntry.id)

  const emailData = {
    to: customerEmail,
    subject: `🎅 Your ${videoTypeName} Preview is Ready!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Your Magical Santa Video Preview is Ready! 🎅✨</h2>
        <p>Dear ${customerName},</p>
        
        <p>Ho ho ho! We're excited to share that your personalized <strong>${videoTypeName}</strong> is ready for preview!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📺 Watch Your Preview</h3>
          <p>Click the button below to watch your video preview:</p>
          <a href="${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/approve-video?order=${queueEntry.order_id}&type=${queueEntry.video_type}" 
             style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0;">
            Watch Preview & Approve
          </a>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h4 style="margin-top: 0;">⚠️ Important: Preview Watermark</h4>
          <p style="margin-bottom: 0;">This preview includes a small watermark which will be removed in your final video after approval.</p>
        </div>

        <h3>Next Steps:</h3>
        <ol>
          <li><strong>Watch the preview video</strong> - Make sure everything is perfect!</li>
          <li><strong>Approve it</strong> - If you love it, click "Approve Video" to receive your final version</li>
          <li><strong>Request one change</strong> - If you'd like adjustments, you can request one free re-record with your feedback</li>
        </ol>

        <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⏰ Please review within 7 days</strong> - After approval, your final high-quality video will be delivered within 24 hours!</p>
        </div>

        <p>Thank you for choosing KeepInMindGreetings! We hope this brings magical moments to your family.</p>
        
        <p>Ho ho ho!<br>
        The Santa Video Team 🎅</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          Need help? Reply to this email or contact our support team.<br>
          Order ID: ${queueEntry.order_id}
        </p>
      </div>
    `
  }

  console.log('Preview email would be sent:', emailData)
  // TODO: Integrate with your email service (SendGrid, Mailgun, etc.)
}

function getVideoTypeName(videoType: string): string {
  if (videoType === 'standard') return 'Santa Standard Video'
  if (videoType === 'two_part_1') return 'Santa Two-Part Video (Part 1)'
  if (videoType === 'two_part_2') return 'Santa Two-Part Video (Part 2)'
  if (videoType === 'greeting') return 'Personalised Greeting Video'
  return 'Santa Video'
}

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