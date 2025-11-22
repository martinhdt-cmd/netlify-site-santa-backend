import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../utils/supabase'

interface Order {
  id: string
  child_name?: string
  recipient_name?: string
  parent_name?: string
  sender_name?: string
  parent_email?: string
  sender_email?: string
  product_type: string
  video_preview_url?: string
  video_1_preview_url?: string
  video_2_preview_url?: string
  video_status?: string
  video_1_status?: string
  video_2_status?: string
  revision_requested: boolean
  approved_at?: string
}

export default function VideoApprovalPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  const videoType = searchParams.get('type') || 'standard'
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [revisionNotes, setRevisionNotes] = useState('')
  const [showRevisionForm, setShowRevisionForm] = useState(false)
  const [message, setMessage] = useState('')
  const [showUrgentAlert, setShowUrgentAlert] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  // Show urgent alert when video is ready
  useEffect(() => {
    if (order?.video_status === 'preview_ready' || order?.video_1_status === 'preview_ready' || order?.video_2_status === 'preview_ready') {
      setShowUrgentAlert(true)
    }
  }, [order])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('santa_video_orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
      setMessage('Order not found. Please check your link.')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!order) return

    setSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/video-approval-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          orderId: order.id,
          videoType,
          action: 'approve'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setMessage('🎅 Ho ho ho! Video approved! Your final high-quality Christmas magic will be delivered within 24 hours!')
        fetchOrder() // Refresh order data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error approving video:', error)
      setMessage('❌ Oops! Santa\'s workshop had a hiccup. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRequestRevision = async () => {
    if (!order || !revisionNotes.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/video-approval-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          orderId: order.id,
          videoType,
          action: 'request_revision',
          revisionNotes: revisionNotes.trim()
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setMessage('✅ Revision requested! Santa\'s elves are already working on your improvements. New preview ready within 24-48 hours!')
        setShowRevisionForm(false)
        setRevisionNotes('')
        fetchOrder() // Refresh order data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error requesting revision:', error)
      setMessage('❌ Error sending your request to the North Pole. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getVideoPreviewUrl = () => {
    if (!order) return null
    
    if (videoType === 'two_part_1') return order.video_1_preview_url
    if (videoType === 'two_part_2') return order.video_2_preview_url
    return order.video_preview_url
  }

  const getVideoStatus = () => {
    if (!order) return null
    
    if (videoType === 'two_part_1') return order.video_1_status
    if (videoType === 'two_part_2') return order.video_2_status
    return order.video_status
  }

  const getVideoTitle = () => {
    if (videoType === 'two_part_1') return 'Santa Wishlist Video (Part 1)'
    if (videoType === 'two_part_2') return 'Santa Christmas Eve Video (Part 2)'
    if (order?.product_type === 'greeting_video') return 'Personalised Greeting Video'
    return 'Santa Standard Video'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🎅</div>
          </div>
          <h2 className="text-2xl font-serif text-red-900 mb-2">Loading Your Christmas Magic...</h2>
          <p className="text-red-700">Santa's checking his list twice! ✨</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-8xl mb-6">🎅</div>
          <h1 className="text-3xl font-bold text-red-900 mb-4">Ho ho ho! Order Not Found</h1>
          <p className="text-red-700 mb-6 leading-relaxed">
            Santa's elves couldn't find this order in the North Pole database. 
            Please check your email for the correct magical preview link!
          </p>
          <a href="/" className="inline-block bg-red-700 text-white px-8 py-4 rounded-xl hover:bg-red-800 transition-colors font-semibold shadow-lg">
            <i className="ri-home-line mr-2"></i>
            Return to North Pole
          </a>
        </div>
      </div>
    )
  }

  const previewUrl = getVideoPreviewUrl()
  const videoStatus = getVideoStatus()
  const customerName = order.parent_name || order.sender_name
  const childName = order.child_name || order.recipient_name

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50">
      {/* URGENT NORTH POLE ALERT */}
      {showUrgentAlert && previewUrl && (
        <div className="bg-gradient-to-r from-red-600 to-green-600 text-white text-center py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-800 opacity-20 animate-pulse"></div>
          <div className="relative z-10">
            <div className="text-3xl font-bold mb-2 animate-bounce">
              🚨 URGENT VIDEO MESSAGE FROM THE NORTH POLE 🚨
            </div>
            <div className="text-xl font-semibold">
              FOR {childName?.toUpperCase() || 'YOUR SPECIAL CHILD'} — SANTA'S PREVIEW IS READY!
            </div>
            <button 
              onClick={() => setShowUrgentAlert(false)}
              className="mt-4 bg-white text-red-700 px-6 py-2 rounded-full font-bold hover:bg-red-50 transition-colors"
            >
              🎁 CLICK TO OPEN SANTA'S MESSAGE 🎁
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Christmas Magic */}
          <div className="text-center mb-8 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-500">
            <div className="text-6xl mb-4">🎅🎬✨</div>
            <h1 className="text-4xl md:text-5xl font-serif text-red-900 mb-4">
              Ho Ho Ho! Your Video Preview
            </h1>
            <p className="text-xl text-red-700 leading-relaxed">
              Merry Christmas, <strong>{customerName}</strong>! 🎄<br/>
              Santa has prepared something magical for <strong>{childName}</strong>!
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-6 rounded-xl shadow-lg ${
              message.includes('🎅') || message.includes('✅') 
                ? 'bg-green-100 border border-green-300 text-green-800' 
                : 'bg-red-100 border border-red-300 text-red-800'
            }`}>
              <div className="flex items-start">
                <div className="text-2xl mr-3">
                  {message.includes('🎅') || message.includes('✅') ? '🎉' : '⚠️'}
                </div>
                <p className="font-medium text-lg">{message}</p>
              </div>
            </div>
          )}

          {/* Video Preview Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-red-200">
            <div className="flex items-center justify-center mb-6">
              <div className="text-3xl mr-3">🎬</div>
              <h2 className="text-3xl font-bold text-red-900">{getVideoTitle()}</h2>
              <div className="text-3xl ml-3">✨</div>
            </div>
            
            {previewUrl ? (
              <div className="mb-6">
                <div className="aspect-video bg-gradient-to-br from-red-100 to-green-100 rounded-xl overflow-hidden mb-6 border-4 border-red-200 shadow-lg">
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                    poster="https://readdy.ai/api/search-image?query=Santa%20Claus%20in%20his%20magical%20North%20Pole%20workshop%2C%20warm%20golden%20lighting%2C%20Christmas%20decorations%20everywhere%2C%20cozy%20fireplace%2C%20gift%20wrapping%20station%2C%20magical%20snow%20falling%20outside%20windows%2C%20professional%20video%20preview%20thumbnail&width=800&height=450&seq=santa_video_preview&orientation=landscape"
                  >
                    <source src={previewUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
                  <div className="flex items-start">
                    <i className="ri-information-line text-yellow-600 text-2xl mr-4 mt-1"></i>
                    <div>
                      <h3 className="font-bold text-yellow-800 mb-2 text-lg">🎄 Preview Video Notice</h3>
                      <p className="text-yellow-700">
                        This preview includes Santa's workshop watermark to protect the magic! ✨ 
                        Your final video will be crystal clear without any watermarks - perfect Christmas quality!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-red-100 to-green-100 rounded-xl flex items-center justify-center mb-6 border-4 border-dashed border-red-300">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎅</div>
                  <h3 className="text-2xl font-bold text-red-900 mb-2">Santa's Workshop is Busy!</h3>
                  <p className="text-red-700 text-lg">Your magical video is being crafted with Christmas love...</p>
                  <p className="text-red-600 mt-2">Usually ready within 24-48 hours! 🎁</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {previewUrl && videoStatus === 'preview_ready' && !order.approved_at && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <button
                    onClick={handleApprove}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xl font-bold py-6 px-8 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center">
                      <i className="ri-check-double-line text-2xl mr-3"></i>
                      {submitting ? (
                        <>
                          <span className="animate-spin mr-2">🎅</span>
                          Processing Christmas Magic...
                        </>
                      ) : (
                        <>
                          ✨ APPROVE & GET FINAL VIDEO ✨
                        </>
                      )}
                    </div>
                    <div className="text-sm font-normal mt-1 opacity-90">
                      Final video delivered within 24 hours!
                    </div>
                  </button>
                  
                  {!order.revision_requested && (
                    <button
                      onClick={() => setShowRevisionForm(true)}
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xl font-bold py-6 px-8 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50"
                    >
                      <div className="flex items-center justify-center">
                        <i className="ri-edit-line text-2xl mr-3"></i>
                        🎨 REQUEST CHANGES (FREE) 🎨
                      </div>
                      <div className="text-sm font-normal mt-1 opacity-90">
                        One free revision included!
                      </div>
                    </button>
                  )}
                </div>

                {order.revision_requested && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                    <div className="flex items-start">
                      <i className="ri-hammer-line text-blue-600 text-3xl mr-4 mt-1"></i>
                      <div>
                        <h3 className="font-bold text-blue-800 mb-2 text-lg">🔧 Santa's Workshop Update</h3>
                        <p className="text-blue-700 text-lg">
                          The elves received your revision request and are working their Christmas magic! 
                          Your improved video preview will be ready within 24-48 hours. ✨
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {order.approved_at && (
              <div className="bg-gradient-to-r from-green-100 to-red-100 border-2 border-green-300 rounded-xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉🎅🎁</div>
                  <h3 className="font-bold text-green-800 mb-4 text-2xl">Video Approved! Christmas Magic Delivered! 🎉</h3>
                  <p className="text-green-700 text-lg mb-4 leading-relaxed">
                    <strong>Ho ho ho!</strong> Thank you for approving your magical video! 🎄<br/>
                    Your final crystal-clear, watermark-free Christmas video has been delivered to your email! ✨
                  </p>
                  <div className="bg-white rounded-lg p-4 inline-block">
                    <p className="text-sm text-green-600 font-medium">
                      <i className="ri-calendar-check-line mr-1"></i>
                      Approved on {new Date(order.approved_at).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Revision Form */}
          {showRevisionForm && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-amber-300">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🎨✨</div>
                <h3 className="text-2xl font-bold text-amber-800">Request Christmas Video Changes</h3>
                <p className="text-amber-700 mt-2">Help Santa's elves make your video absolutely perfect!</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  What Christmas magic would you like us to change? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Please tell Santa's elves exactly what you'd like changed in your video... Be as detailed as possible!"
                  className="w-full px-6 py-4 border-2 border-red-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 resize-none text-lg"
                  rows={5}
                  maxLength={500}
                  required
                />
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <i className="ri-character-recognition-line mr-1"></i>
                  {revisionNotes.length}/500 characters
                </p>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <i className="ri-gift-line text-amber-600 text-2xl mr-4 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-amber-800 mb-2 text-lg">🎁 Santa's Revision Promise</h4>
                    <ul className="text-amber-700 space-y-1">
                      <li>• <strong>One FREE revision</strong> included with every order</li>
                      <li>• <strong>New preview ready in 24-48 hours</strong> - Santa works fast!</li>
                      <li>• <strong>Be specific</strong> - The more details, the better the magic!</li>
                      <li>• <strong>Family-friendly content only</strong> - Keeping Christmas pure! 🎄</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRequestRevision}
                  disabled={submitting || !revisionNotes.trim()}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  <i className="ri-send-plane-line mr-2"></i>
                  {submitting ? 'Sending to North Pole...' : '🎄 Send to Santa\'s Workshop 🎄'}
                </button>
                <button
                  onClick={() => {
                    setShowRevisionForm(false)
                    setRevisionNotes('')
                  }}
                  disabled={submitting}
                  className="flex-1 bg-gray-500 text-white font-bold text-lg py-4 px-6 rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <i className="ri-close-line mr-2"></i>
                  Cancel Changes
                </button>
              </div>
            </div>
          )}

          {/* Christmas Magic Process */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
            <div className="text-center mb-8">
              <div className="text-4xl mb-2">🎅🔧🎁</div>
              <h3 className="text-2xl font-bold text-red-900">How Santa's Video Magic Works</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-200">
                  <i className="ri-play-circle-line text-3xl text-red-600"></i>
                </div>
                <h4 className="font-bold text-red-900 mb-3 text-lg">1. 🎬 Watch Preview</h4>
                <p className="text-red-700 leading-relaxed">
                  Review your magical personalized video with Santa's workshop watermark to protect the Christmas magic!
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-200">
                  <i className="ri-thumb-up-line text-3xl text-green-600"></i>
                </div>
                <h4 className="font-bold text-red-900 mb-3 text-lg">2. ✅ Approve or Revise</h4>
                <p className="text-red-700 leading-relaxed">
                  Love the Christmas magic? Approve it! Want Santa's elves to adjust something? Request free changes!
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-200">
                  <i className="ri-gift-line text-3xl text-blue-600"></i>
                </div>
                <h4 className="font-bold text-red-900 mb-3 text-lg">3. 🎁 Get Final Magic</h4>
                <p className="text-red-700 leading-relaxed">
                  Receive your crystal-clear, high-quality video without watermarks - pure Christmas perfection!
                </p>
              </div>
            </div>

            {/* Christmas Guarantee */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-red-50 rounded-xl p-6 border-2 border-green-200">
              <div className="text-center">
                <div className="text-3xl mb-2">🎅💝</div>
                <h4 className="font-bold text-green-800 text-lg mb-2">Santa's Christmas Promise</h4>
                <p className="text-green-700">
                  <strong>✨ 24-Hour Delivery Guarantee:</strong> Your final video will arrive within 24 hours of approval, 
                  or Santa will give you a full refund! No Christmas magic should ever be late! 🎄
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}