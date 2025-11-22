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
    const { orderId, productType, orderData } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🎬 Processing video generation for order:', orderId, 'Product type:', productType)
    console.log('👨‍👩‍👧‍👦 Number of children:', orderData.children?.length || 0)

    // Determine video generation requirements based on product type
    let videosToGenerate = []

    switch (productType) {
      case 'santa_standard_video':
        videosToGenerate.push({
          video_type: 'standard',
          order_id: orderId,
          template_type: 'santa_standard',
          personalization_data: {
            children: orderData.children || [],
            parent_name: orderData.parent_name,
            town_city: orderData.town_city,
            email: orderData.email
          },
          priority: 'normal',
          scheduled_for: new Date().toISOString()
        })
        break

      case 'two_part_santa_video':
        // Video 1 - Immediate
        videosToGenerate.push({
          video_type: 'two_part_1',
          order_id: orderId,
          template_type: 'santa_wishlist',
          personalization_data: {
            children: orderData.children || [],
            parent_name: orderData.parent_name,
            town_city: orderData.town_city,
            email: orderData.email,
            video_1_details: orderData.video_1_details
          },
          priority: 'high',
          scheduled_for: new Date().toISOString()
        })

        // Video 2 - Scheduled
        videosToGenerate.push({
          video_type: 'two_part_2',
          order_id: orderId,
          template_type: 'santa_christmas_eve',
          personalization_data: {
            children: orderData.children || [],
            parent_name: orderData.parent_name,
            town_city: orderData.town_city,
            email: orderData.email,
            video_2_details: orderData.video_2_details
          },
          priority: 'normal',
          scheduled_for: orderData.video_2_scheduled_date || '2024-12-24T00:00:00Z'
        })
        break

      case 'greeting_video':
        videosToGenerate.push({
          video_type: 'greeting',
          order_id: orderId,
          template_type: 'santa_greeting',
          personalization_data: {
            recipient_name: orderData.recipient_name,
            recipient_age: orderData.recipient_age,
            sender_name: orderData.sender_name,
            occasion: orderData.occasion,
            relationship: orderData.relationship,
            message_details: orderData.message_details,
            pronunciation_notes: orderData.pronunciation_notes,
            special_requests: orderData.special_requests
          },
          priority: 'normal',
          scheduled_for: orderData.delivery_date || new Date().toISOString()
        })
        break

      default:
        throw new Error(`Unknown product type: ${productType}`)
    }

    console.log(`📝 Adding ${videosToGenerate.length} video(s) to queue...`)

    // Add videos to generation queue
    const queuedVideos = []
    for (const video of videosToGenerate) {
      const { data: queuedVideo, error: queueError } = await supabase
        .from('video_generation_queue')
        .insert({
          ...video,
          status: 'queued',
          created_at: new Date().toISOString(),
          attempts: 0
        })
        .select()
        .single()

      if (queueError) {
        console.error('❌ Error adding video to queue:', queueError)
        throw queueError
      }

      console.log(`✅ Video queued with ID: ${queuedVideo.id}`)
      queuedVideos.push(queuedVideo)
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('santa_video_orders')
      .update({
        video_status: 'processing',
        video_1_status: productType === 'two_part_santa_video' ? 'processing' : null,
        video_2_status: productType === 'two_part_santa_video' ? 'queued' : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('❌ Error updating order status:', updateError)
      throw updateError
    }

    console.log('✅ Order status updated to processing')

    // Trigger immediate video generation for videos scheduled now
    const immediateVideos = queuedVideos.filter(v => {
      const scheduledTime = new Date(v.scheduled_for).getTime()
      const now = new Date().getTime()
      return scheduledTime <= now
    })
    
    console.log(`🎥 Triggering ${immediateVideos.length} immediate video(s)...`)

    const processorResults = []
    for (const queuedVideo of immediateVideos) {
      try {
        console.log(`🎬 Calling processor for video ID: ${queuedVideo.id}`)
        
        const processorResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/video-generation-processor`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              queueId: queuedVideo.id,
              orderId: orderId,
              videoType: queuedVideo.video_type,
              templateType: queuedVideo.template_type,
              personalizationData: queuedVideo.personalization_data
            })
          }
        )

        const processorResult = await processorResponse.json()
        
        if (processorResponse.ok) {
          console.log(`✅ Processor triggered successfully for video ${queuedVideo.id}`)
          processorResults.push({ success: true, videoId: queuedVideo.id })
        } else {
          console.error(`❌ Processor failed for video ${queuedVideo.id}:`, processorResult)
          processorResults.push({ success: false, videoId: queuedVideo.id, error: processorResult.error })
        }
      } catch (processorError) {
        console.error(`❌ Error calling processor for video ${queuedVideo.id}:`, processorError)
        processorResults.push({ success: false, videoId: queuedVideo.id, error: processorError.message })
      }
    }

    const successfulProcessors = processorResults.filter(r => r.success).length

    return new Response(
      JSON.stringify({ 
        success: true, 
        videosQueued: videosToGenerate.length,
        videosTriggered: successfulProcessors,
        processorResults: processorResults,
        message: `Successfully queued ${videosToGenerate.length} video(s), triggered ${successfulProcessors} for immediate generation`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Error in video generation trigger:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        stack: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})