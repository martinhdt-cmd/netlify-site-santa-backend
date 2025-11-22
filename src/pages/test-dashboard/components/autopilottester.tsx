import { useState } from 'react';
import { supabase } from '../../../utils/supabase';

interface AutopilotTestResult {
  orderId: string;
  productType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  message?: string;
  timestamp: string;
}

interface AutopilotProgress {
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  results: AutopilotTestResult[];
  isRunning: boolean;
}

const sampleOrders = [
  {
    product_type: 'santa_standard_video',
    parent_name: 'Test Parent 1',
    parent_email: 'test1@example.com',
    child_name: 'Emma',
    child_age: '5',
    child_pronouns: 'she/her',
    town_city: 'London',
    video_details: 'Emma loves unicorns and drawing. She has been very kind to her little brother this year.',
    wish_list_option: 'received',
    order_amount: 27.00
  },
  {
    product_type: 'santa_standard_video',
    parent_name: 'Test Parent 2',
    parent_email: 'test2@example.com',
    child_name: 'Oliver',
    child_age: '7',
    child_pronouns: 'he/him',
    town_city: 'Manchester',
    video_details: 'Oliver is passionate about football and science. He helped his mum with chores every day.',
    wish_list_option: 'received',
    order_amount: 27.00
  },
  {
    product_type: 'two_part_santa_video',
    parent_name: 'Test Parent 3',
    parent_email: 'test3@example.com',
    child_name: 'Sophie',
    child_age: '6',
    child_pronouns: 'she/her',
    town_city: 'Birmingham',
    video_1_details: 'Sophie loves reading books and playing with her dog. She has been very helpful at school.',
    video_2_details: 'Sophie is excited for Christmas morning and can\'t wait to see what Santa brings!',
    wish_list_option: 'received',
    video_2_scheduled_date: '2024-12-24T00:00:00Z',
    order_amount: 41.00
  },
  {
    product_type: 'greeting_video',
    sender_name: 'Test Parent 4',
    parent_email: 'test4@example.com',
    recipient_name: 'Jack',
    recipient_age: '8',
    occasion: 'Christmas',
    relationship: 'nephew',
    message_details: 'Jack enjoys building with Lego and playing video games. Wishing him a magical Christmas!',
    order_amount: 20.00
  },
  {
    product_type: 'santa_standard_video',
    parent_name: 'Test Parent 5',
    parent_email: 'test5@example.com',
    child_name: 'Lily',
    child_age: '4',
    child_pronouns: 'she/her',
    town_city: 'Edinburgh',
    video_details: 'Lily loves singing and dancing. She always shares her toys with friends.',
    wish_list_option: 'received',
    order_amount: 27.00
  }
];

export default function AutopilotTester() {
  const [progress, setProgress] = useState<AutopilotProgress>({
    currentStep: '',
    totalSteps: 0,
    completedSteps: 0,
    results: [],
    isRunning: false
  });

  const updateProgress = (step: string, result?: AutopilotTestResult) => {
    setProgress(prev => ({
      ...prev,
      currentStep: step,
      completedSteps: result ? prev.completedSteps + 1 : prev.completedSteps,
      results: result ? [...prev.results, result] : prev.results
    }));
  };

  const createTestOrder = async (orderData: any): Promise<string> => {
    const orderId = crypto.randomUUID();
    const paymentIntentId = `pi_test_autopilot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const testOrder = {
      id: orderId,
      stripe_payment_intent_id: paymentIntentId,
      stripe_customer_id: `cus_test_${Date.now()}`,
      product_type: orderData.product_type,
      parent_name: orderData.parent_name,
      parent_email: orderData.parent_email,
      child_name: orderData.child_name,
      child_age: orderData.child_age,
      child_pronouns: orderData.child_pronouns,
      town_city: orderData.town_city,
      video_details: orderData.video_details,
      wish_list_option: orderData.wish_list_option,
      video_status: 'pending',
      order_amount: orderData.order_amount,
      currency: 'eur',
      payment_status: 'paid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('santa_video_orders')
      .insert(testOrder);

    if (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }

    return orderId;
  };

  const triggerVideoGeneration = async (orderId: string, productType: string, orderData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/video-generation-trigger`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderId,
          productType,
          orderData
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to trigger video generation');
    }

    return await response.json();
  };

  const checkOrderStatus = async (orderId: string): Promise<any> => {
    const { data, error } = await supabase
      .from('santa_video_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      throw new Error(`Failed to check order status: ${error.message}`);
    }

    return data;
  };

  const runAutopilotTest = async () => {
    setProgress({
      isRunning: true,
      currentStep: 'Initializing autopilot test...',
      completedSteps: 0,
      results: []
    });

    const testOrders = [
      {
        productType: 'santa_standard_video',
        orderData: {
          child_name: 'Emma',
          child_age: 5,
          child_pronouns: 'she/her',
          parent_name: 'Sarah',
          town_city: 'Boston',
          video_details: 'being kind to her little brother',
          pronunciation_notes: '',
          special_requests: '',
          customer_email: 'test-autopilot-1@example.com',
          payment_status: 'paid',
          product_type: 'santa_standard_video',
          amount: 2999
        }
      },
      {
        productType: 'santa_standard_video',
        orderData: {
          child_name: 'Oliver',
          child_age: 7,
          child_pronouns: 'he/him',
          parent_name: 'Michael',
          town_city: 'Seattle',
          video_details: 'helping with homework and being a great big brother',
          pronunciation_notes: '',
          special_requests: '',
          customer_email: 'test-autopilot-2@example.com',
          payment_status: 'paid',
          product_type: 'santa_standard_video',
          amount: 2999
        }
      },
      {
        productType: 'two_part_santa_video',
        orderData: {
          child_name: 'Sophie',
          child_age: 6,
          child_pronouns: 'she/her',
          parent_name: 'Jennifer',
          town_city: 'Portland',
          wish_list_option: 'parent_provided',
          video_1_details: 'wants a bicycle and art supplies',
          video_2_details: 'reminder to be good and go to bed early',
          video_2_scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          pronunciation_notes: '',
          special_requests: '',
          customer_email: 'test-autopilot-3@example.com',
          payment_status: 'paid',
          product_type: 'two_part_santa_video',
          amount: 4999
        }
      },
      {
        productType: 'greeting_video',
        orderData: {
          child_name: 'Jack',
          child_age: 8,
          recipient_name: 'Jack',
          recipient_age: 8,
          sender_name: 'Grandma Mary',
          occasion: 'Christmas',
          message_details: 'Wishing you a magical Christmas filled with joy',
          pronunciation_notes: '',
          special_requests: '',
          delivery_date: new Date().toISOString(),
          customer_email: 'test-autopilot-4@example.com',
          payment_status: 'paid',
          product_type: 'greeting_video',
          amount: 3499
        }
      },
      {
        productType: 'santa_standard_video',
        orderData: {
          child_name: 'Lily',
          child_age: 4,
          child_pronouns: 'she/her',
          parent_name: 'David',
          town_city: 'Denver',
          video_details: 'sharing toys with friends at preschool',
          pronunciation_notes: '',
          special_requests: '',
          customer_email: 'test-autopilot-5@example.com',
          payment_status: 'paid',
          product_type: 'santa_standard_video',
          amount: 2999
        }
      }
    ];

    const totalSteps = testOrders.length * 3; // Create order + trigger video + wait
    setProgress(prev => ({ ...prev, totalSteps }));

    for (let i = 0; i < testOrders.length; i++) {
      const { productType, orderData } = testOrders[i];
      const result: AutopilotTestResult = {
        orderId: '',
        productType,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      try {
        // Step 1: Create order in database
        setProgress(prev => ({ 
          ...prev, 
          currentStep: `Creating order ${i + 1}/${testOrders.length}...`,
          completedSteps: i * 3 + 1
        }));

        const { data: order, error: orderError } = await supabase
          .from('santa_video_orders')
          .insert({
            ...orderData,
            payment_status: 'paid',
            video_status: 'pending',
            created_at: new Date().toISOString(),
            stripe_payment_intent_id: `pi_test_autopilot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            stripe_customer_id: `cus_test_${Date.now()}`,
            currency: 'eur'
          })
          .select()
          .single();

        if (orderError) throw orderError;
        if (!order) throw new Error('No order returned');

        result.orderId = order.id;

        // Step 2: Trigger video generation
        setProgress(prev => ({ 
          ...prev, 
          currentStep: `Triggering video generation for order ${i + 1}...`,
          completedSteps: i * 3 + 2
        }));

        const { data: videoData, error: videoError } = await supabase.functions.invoke(
          'video-generation-trigger',
          {
            body: {
              orderId: order.id,
              productType,
              orderData
            }
          }
        );

        if (videoError) throw videoError;

        // Step 3: Wait a moment
        setProgress(prev => ({ 
          ...prev, 
          currentStep: `Waiting for order ${i + 1} to process...`,
          completedSteps: i * 3 + 3
        }));
        await new Promise(resolve => setTimeout(resolve, 1000));

        result.status = 'completed';
        result.message = `Order created and video generation triggered successfully`;

      } catch (error: any) {
        result.status = 'failed';
        result.error = error.message;
        console.error(`Autopilot test failed for order ${i + 1}:`, error);
      }

      setProgress(prev => ({ ...prev, results: [...prev.results, result] }));
    }

    setProgress(prev => ({ 
      ...prev, 
      currentStep: 'All tests completed!',
      completedSteps: totalSteps,
      isRunning: false 
    }));
  };

  const clearTestData = async () => {
    if (!confirm('Are you sure you want to delete all test orders? This cannot be undone.')) {
      return;
    }

    try {
      // Delete test orders (those with test payment intent IDs)
      const { error } = await supabase
        .from('santa_video_orders')
        .delete()
        .like('stripe_payment_intent_id', 'pi_test_autopilot_%');

      if (error) {
        alert(`Error clearing test data: ${error.message}`);
      } else {
        alert('✅ Test data cleared successfully!');
        setProgress({
          currentStep: '',
          totalSteps: 0,
          completedSteps: 0,
          results: [],
          isRunning: false
        });
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-100 border-2 border-purple-300 rounded-xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-purple-900 mb-2">
            <i className="ri-robot-line mr-3"></i>
            Autopilot Order Testing
          </h2>
          <p className="text-purple-800 text-lg">
            Automatically generate and process 5 sample orders end-to-end
          </p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={runAutopilotTest}
          disabled={progress.isRunning}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center"
        >
          {progress.isRunning ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-3 text-xl"></i>
              Running Autopilot...
            </>
          ) : (
            <>
              <i className="ri-play-circle-fill mr-3 text-xl"></i>
              Start Autopilot Test
            </>
          )}
        </button>

        <button
          onClick={clearTestData}
          disabled={progress.isRunning}
          className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center"
        >
          <i className="ri-delete-bin-line mr-3 text-xl"></i>
          Clear Test Data
        </button>
      </div>

      {/* Progress Display */}
      {progress.isRunning && (
        <div className="bg-white rounded-xl p-6 mb-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              <i className="ri-time-line mr-2 text-purple-600"></i>
              Progress
            </h3>
            <span className="text-lg font-semibold text-purple-600">
              {progress.completedSteps} / {progress.totalSteps} steps
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(progress.completedSteps / progress.totalSteps) * 100}%` }}
            ></div>
          </div>

          <p className="text-gray-700 font-medium">
            <i className="ri-arrow-right-line mr-2"></i>
            {progress.currentStep}
          </p>
        </div>
      )}

      {/* Results Display */}
      {progress.results.length > 0 && (
        <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            <i className="ri-file-list-3-line mr-2 text-purple-600"></i>
            Test Results ({progress.results.length} orders)
          </h3>

          <div className="space-y-3">
            {progress.results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.status === 'completed' ? 'bg-green-50 border-green-300' :
                  result.status === 'processing' ? 'bg-blue-50 border-blue-300' :
                  result.status === 'pending' ? 'bg-yellow-50 border-yellow-300' :
                  'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <i className={`${
                        result.status === 'completed' ? 'ri-checkbox-circle-fill text-green-600' :
                        result.status === 'processing' ? 'ri-loader-4-line animate-spin text-blue-600' :
                        result.status === 'pending' ? 'ri-time-line text-yellow-600' :
                        'ri-close-circle-fill text-red-600'
                      } text-xl`}></i>
                      <span className="font-bold text-gray-900">
                        {result.productType.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <span className="font-semibold">Order ID:</span> {result.orderId}
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span> {result.status}
                      </div>
                      {result.message && (
                        <div className="text-green-600">
                          <span className="font-semibold">Message:</span> {result.message}
                        </div>
                      )}
                      {result.error && (
                        <div className="text-red-600">
                          <span className="font-semibold">Error:</span> {result.error}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {progress.results.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-green-700 font-medium mt-1">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {progress.results.filter(r => r.status === 'processing').length}
                </div>
                <div className="text-sm text-blue-700 font-medium mt-1">Processing</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {progress.results.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-yellow-700 font-medium mt-1">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {progress.results.filter(r => r.status === 'failed').length}
                </div>
                <div className="text-sm text-red-700 font-medium mt-1">Failed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          <i className="ri-information-line mr-2"></i>
          <strong>What this does:</strong> Creates 5 test orders with different product types, triggers video generation for each, and tracks their progress. Videos will be processed by HeyGen in the background (5-10 minutes per video).
        </p>
      </div>
    </div>
  );
}