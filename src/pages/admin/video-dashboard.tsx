
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

interface VideoOrder {
  id: string
  product_type: string
  child_name?: string
  recipient_name?: string
  parent_name?: string
  sender_name?: string
  video_status?: string
  video_1_status?: string
  video_2_status?: string
  payment_status: string
  created_at: string
  video_preview_url?: string
  video_1_preview_url?: string
  video_2_preview_url?: string
}

export default function VideoManagementDashboard() {
  const [orders, setOrders] = useState<VideoOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('santa_video_orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('video_status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerVideoGeneration = async (orderId: string, productType: string) => {
    try {
      const order = orders.find(o => o.id === orderId)
      if (!order) return

      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/video-generation-trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          orderId,
          productType,
          orderData: order
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Video generation triggered successfully!')
        fetchOrders()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error triggering video generation:', error)
      alert('Error triggering video generation')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'preview_ready': 'bg-purple-100 text-purple-800',
      'approved': 'bg-green-100 text-green-800',
      'revision_requested': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status?.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🎬 Video Management Dashboard</h1>
          <p className="text-gray-600">Manage and monitor all video orders and generation status</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'processing' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter('preview_ready')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'preview_ready' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Preview Ready
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'approved' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Approved
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.id.slice(0, 8)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        Payment: {getStatusBadge(order.payment_status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.parent_name || order.sender_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        For: {order.child_name || order.recipient_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.product_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {order.video_status && (
                          <div>Video: {getStatusBadge(order.video_status)}</div>
                        )}
                        {order.video_1_status && (
                          <div>Part 1: {getStatusBadge(order.video_1_status)}</div>
                        )}
                        {order.video_2_status && (
                          <div>Part 2: {getStatusBadge(order.video_2_status)}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                      {order.payment_status === 'paid' && order.video_status === 'pending' && (
                        <button
                          onClick={() => triggerVideoGeneration(order.id, order.product_type)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Generate Video
                        </button>
                      )}
                      
                      {(order.video_preview_url || order.video_1_preview_url) && (
                        <a
                          href={`/approve-video?order=${order.id}&type=${order.product_type.includes('two_part') ? 'two_part_1' : 'standard'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 block text-center"
                        >
                          View Preview
                        </a>
                      )}
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order.id)
                          alert('Order ID copied!')
                        }}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
                      >
                        Copy ID
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-video-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No video orders found</h3>
              <p className="text-gray-500">Video orders will appear here once customers make purchases.</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="ri-shopping-cart-line text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="ri-time-line text-2xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.video_status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="ri-play-circle-line text-2xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Preview Ready</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.video_status === 'preview_ready').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="ri-check-double-line text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.video_status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
