import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { supabase } from '../../utils/supabase';
import AvatarBrowser from './components/AvatarBrowser';
import AutopilotTester from './components/AutopilotTester';

interface SampleVideo {
  name: string;
  description?: string;
  type: string;
  heygenJobId?: string;
  queueId?: string;
  orderId?: string;
  status: string;
  scriptPreview?: string;
  estimatedDuration?: string;
  error?: string;
  previewUrl?: string;
  finalUrl?: string;
  createdAt?: string;
}

interface TestResult {
  step: string;
  status: string;
  timestamp: string;
  details: any;
}

interface EndToEndTestResults {
  success: boolean;
  finalStatus: string;
  summary: string;
  detailedResults: {
    timestamp: string;
    steps: TestResult[];
    finalStatus: string;
    summary: string;
  };
  videoId?: string;
  orderId?: string;
  monitorUrl?: string;
  error?: string;
}

interface Voice {
  voice_id: string;
  name: string;
  language: string;
  gender: string;
  age?: string;
  accent?: string;
  preview_audio?: string;
}

interface VoiceListResponse {
  success: boolean;
  totalVoices: number;
  maleEnglishVoices: number;
  voices: Voice[];
  allVoices: Voice[];
  error?: string;
}

// Product testing flows data
const testProductFlows = [
  {
    name: 'Standard Santa Video',
    description: 'Personalized video message from Santa',
    price: '€27',
    icon: 'ri-video-line',
    testUrl: '/santa-messages'
  },
  {
    name: 'Premium Santa Video',
    description: 'Extended video with special effects',
    price: '€41',
    icon: 'ri-star-line',
    testUrl: '/santa-messages'
  },
  {
    name: 'Two-Part Video',
    description: 'Pre-Christmas + Christmas Day videos',
    price: '€41',
    icon: 'ri-calendar-event-line',
    testUrl: '/santa-messages'
  },
  {
    name: 'Christmas Greetings',
    description: 'Holiday greeting videos',
    price: '€20',
    icon: 'ri-gift-line',
    testUrl: '/greeting-videos'
  },
  {
    name: 'Bundle Packages',
    description: 'Multiple video bundles',
    price: 'From €90',
    icon: 'ri-stack-line',
    testUrl: '/bundles'
  },
  {
    name: 'Cards & Gifts',
    description: 'Physical cards with video messages',
    price: 'From €5',
    icon: 'ri-mail-line',
    testUrl: '/cards-gifts'
  }
];

export default function TestDashboard() {
  const [sampleVideos, setSampleVideos] = useState<SampleVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingVideos, setGenerating] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [runningE2ETest, setRunningE2ETest] = useState(false);
  const [e2eTestResults, setE2eTestResults] = useState<EndToEndTestResults | null>(null);
  const [showE2EModal, setShowE2EModal] = useState(false);
  const [listingAvatars, setListingAvatars] = useState(false);
  const [avatarList, setAvatarList] = useState<any>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [autoTestRunning, setAutoTestRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [videoStatus, setVideoStatus] = useState<any>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [autoCheckInterval, setAutoCheckInterval] = useState<number | null>(null);
  const [sampleStatus, setSampleStatus] = useState<{
    checked: number;
    completed: number;
    processing: number;
    failed: number;
  }>({
    checked: 0,
    completed: 0,
    processing: 0,
    failed: 0,
  });
  const [listingVoices, setListingVoices] = useState(false);
  const [voiceList, setVoiceList] = useState<VoiceListResponse | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [retrievedVoiceData, setRetrievedVoiceData] = useState<any>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  // Auto-run full system test on mount (simulating autopilot)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autotest') === 'true' && !autoTestRunning) {
      console.log('🚀 AUTOPILOT MODE ACTIVATED');
      setTimeout(() => {
        runFullSystemTest();
      }, 1000);
    }

    // Auto-run on first load if user just updated avatar
    const justUpdatedAvatar = sessionStorage.getItem('avatar_just_updated');
    if (justUpdatedAvatar === 'true' && !autoTestRunning) {
      sessionStorage.removeItem('avatar_just_updated');
      console.log('🔄 Running validation after avatar update...');
      setTimeout(() => {
        runFullSystemTest();
      }, 1500);
    }
  }, []);

  const runFullSystemTest = async () => {
    setAutoTestRunning(true);
    setShowE2EModal(true);

    console.log('🔍 Step 1: Scanning HeyGen avatars...');
    await listHeyGenAvatars();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('🧪 Step 2: Running end-to-end integration test...');
    await runEndToEndTest();

    setAutoTestRunning(false);
    console.log('✅ AUTOPILOT VALIDATION COMPLETE');
  };

  const listHeyGenAvatars = async () => {
    setListingAvatars(true);
    setShowAvatarModal(true);
    setAvatarList(null);

    try {
      const { data, error } = await supabase.functions.invoke('list-heygen-avatars', {
        body: {}
      });

      if (error) {
        console.error('Error listing avatars:', error);
        setAvatarList({
          success: false,
          error: error.message
        });
        return;
      }

      console.log('Avatar list response:', data);
      setAvatarList(data);
    } catch (error: any) {
      console.error('Error:', error);
      setAvatarList({
        success: false,
        error: error.message
      });
    } finally {
      setListingAvatars(false);
    }
  };

  const listHeyGenVoices = async () => {
    setListingVoices(true);
    setShowVoiceModal(true);
    setVoiceList(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/list-heygen-voices`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Error listing voices:', data);
        setVoiceList({
          success: false,
          totalVoices: 0,
          maleEnglishVoices: 0,
          voices: [],
          allVoices: [],
          error: data.error || 'Failed to fetch voices'
        });
        return;
      }

      console.log('Voice list response:', data);
      setVoiceList(data);
    } catch (error: any) {
      console.error('Error:', error);
      setVoiceList({
        success: false,
        totalVoices: 0,
        maleEnglishVoices: 0,
        voices: [],
        allVoices: [],
        error: error.message
      });
    } finally {
      setListingVoices(false);
    }
  };

  const playVoicePreview = (audioUrl: string, voiceId: string) => {
    if (playingAudio === voiceId) {
      // Stop playing
      const audio = document.getElementById(`audio-${voiceId}`) as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      if (playingAudio) {
        const prevAudio = document.getElementById(`audio-${playingAudio}`) as HTMLAudioElement;
        if (prevAudio) {
          prevAudio.pause();
          prevAudio.currentTime = 0;
        }
      }

      // Play new audio
      const audio = document.getElementById(`audio-${voiceId}`) as HTMLAudioElement;
      if (audio) {
        audio.play();
        setPlayingAudio(voiceId);
      }
    }
  };

  const copyVoiceId = (voiceId: string) => {
    navigator.clipboard.writeText(voiceId);
    alert(
      `✅ Voice ID copied to clipboard!\n\n${voiceId}\n\nNow:\n1. Go to Supabase Dashboard → Edge Functions → Secrets\n2. Find HEYGEN_VOICE_ID and click Edit\n3. Paste this voice ID\n4. Click Save\n5. Come back and regenerate sample videos`
    );
  };

  const retrieveVoiceFromVideo = async () => {
    const videoId = '187b26354c01491ba8f81027438fb637';
    setRetrievingVoice(true);
    setShowRetrievedVoiceModal(true);
    setRetrievedVoiceData(null);

    try {
      console.log('🔍 Retrieving voice from video:', videoId);

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-heygen-video-details`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ videoId })
        }
      );

      const data = await response.json();
      console.log('📥 Retrieved data:', data);

      if (!response.ok) {
        setRetrievedVoiceData({
          success: false,
          error: data.error || 'Failed to retrieve video details'
        });
        return;
      }

      setRetrievedVoiceData(data);

      // If voice ID found, automatically copy it
      if (data.voiceId) {
        navigator.clipboard.writeText(data.voiceId);
        console.log('✅ Voice ID copied to clipboard:', data.voiceId);
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      setRetrievedVoiceData({
        success: false,
        error: error.message
      });
    } finally {
      setRetrievingVoice(false);
    }
  };

  const getVoiceFromVideo = async () => {
    setIsLoadingVoice(true);
    try {
      console.log('🔍 Fetching voice from production video...');

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-heygen-video-details`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            videoId: '187b26354c01491ba8f81027438fb637'
          })
        }
      );

      const result = await response.json();
      console.log('📥 Voice retrieval result:', result);

      if (result.success && result.voiceId) {
        console.log('✅ Voice ID found:', result.voiceId);

        // Store the data and show modal
        setRetrievedVoiceData(result);
        setShowVoiceModal(true);

        // Still try to copy to clipboard as backup
        try {
          await navigator.clipboard.writeText(result.voiceId);
          console.log('📋 Voice ID copied to clipboard');
        } catch (clipboardError) {
          console.warn('⚠️ Clipboard copy failed, but modal will show the ID');
        }
      } else {
        alert(
          `❌ Could not retrieve voice ID\n\nError: ${result.error || 'Unknown error'}\n\nPlease check the console for details.`
        );
      }
    } catch (error) {
      console.error('❌ Error fetching voice:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingVoice(false);
    }
  };

  const runEndToEndTest = async () => {
    setRunningE2ETest(true);
    setE2eTestResults(null);
    setShowE2EModal(true);

    const results: TestResult[] = [];
    let criticalError: string | null = null;

    const addResult = (
      step: string,
      status: 'started' | 'success' | 'error' | 'info',
      message: string
    ) => {
      const newResult = { step, status, message, timestamp: new Date().toISOString() };
      results.push(newResult);

      setE2eTestResults({
        success: !criticalError,
        finalStatus: criticalError ? 'FAIL' : status === 'error' ? 'FAIL' : 'IN_PROGRESS',
        summary: criticalError || message,
        detailedResults: {
          timestamp: new Date().toISOString(),
          steps: [...results],
          finalStatus: criticalError ? 'FAIL' : status === 'error' ? 'FAIL' : 'IN_PROGRESS',
          summary: criticalError || message
        }
      });
    };

    try {
      // Step 1: Check database connection
      addResult('Database Connection', 'started', 'Testing database connection...');
      const { error: connectionError } = await supabase
        .from('video_generation_queue')
        .select('count')
        .limit(1);
      if (connectionError) {
        addResult('Database Connection', 'error', `Connection failed: ${connectionError.message}`);
        criticalError = `Database connection failed: ${connectionError.message}`;
        throw new Error(criticalError);
      }
      addResult('Database Connection', 'success', 'Database connection successful');

      // Step 2: Create test order
      addResult('Create Test Order', 'started', 'Creating test order record...');
      const testOrderId = crypto.randomUUID();

      const testOrder = {
        id: testOrderId,
        stripe_payment_intent_id: `pi_test_${Date.now()}`,
        stripe_customer_id: `cus_test_${Date.now()}`,
        product_type: 'santa_standard_video',
        parent_name: 'Test Parent',
        parent_email: 'test@example.com',
        child_name: 'Test Child',
        child_age: '5',
        child_pronouns: 'they/them',
        town_city: 'Test City',
        video_details: 'This is a test video for end-to-end testing',
        wish_list_option: 'received',
        video_status: 'pending',
        order_amount: 29.99,
        currency: 'gbp',
        payment_status: 'paid',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: orderError } = await supabase.from('santa_video_orders').insert(testOrder);

      if (orderError) {
        addResult('Create Test Order', 'error', `Failed to create test order: ${orderError.message}`);
        criticalError = `Test order creation failed: ${orderError.message}`;
        throw new Error(criticalError);
      }

      addResult('Create Test Order', 'success', `Test order created with ID: ${testOrderId}`);

      // Step 3: Test HeyGen API call
      addResult('HeyGen API Test', 'started', 'Testing HeyGen video generation...');
      try {
        const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

        console.log('🔍 Calling HeyGen Test Edge Function...');

        const rawResponse = await fetch(`${supabaseUrl}/functions/v1/test-heygen-integration`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify()
        });

        console.log('📥 Response Status:', rawResponse.status);

        const responseText = await rawResponse.text();
        console.log('📥 Response Body:', responseText);

        let heygenData;
        try {
          heygenData = JSON.parse(responseText);
        } catch (e) {
          console.error('❌ Failed to parse JSON:', e);
          addResult('HeyGen API Test', 'error', `Invalid JSON response: ${responseText}`);
          criticalError = `Edge Function returned invalid JSON: ${responseText}`;
          throw new Error(criticalError);
        }

        if (!rawResponse.ok) {
          console.error('❌ HeyGen Error:', heygenData);
          addResult('HeyGen API Test', 'error', `HeyGen API Error (${rawResponse.status}): ${heygenData.error || heygenData.details || 'Unknown error'}`);
          criticalError = `HeyGen API Error (${rawResponse.status}): ${heygenData.error || heygenData.details || 'Unknown error'}`;
          throw new Error(criticalError);
        }

        if (!heygenData.success || !heygenData.heygenJobId) {
          addResult('HeyGen API Test', 'error', `Invalid HeyGen response - missing job ID`);
          criticalError = 'Invalid response from HeyGen - missing job ID';
          throw new Error(criticalError);
        }

        console.log('✅ HeyGen Success:', heygenData);

        addResult('HeyGen API Test', 'success', `✅ Video generation started!\n\nJob ID: ${heygenData.heygenJobId}\nAvatar Type: ${heygenData.avatarType || 'N/A'}\nTest Script: "${heygenData.testScript || 'N/A'}"`);
      } catch (error: any) {
        console.error('❌ HeyGen Test Failed:', error);
        if (!criticalError) {
          criticalError = error.message;
        }
        throw error;
      }

      // Step 4: Cleanup test data
      addResult('Cleanup', 'started', 'Removing test data...');

      await supabase.from('video_generation_queue').delete().eq('order_id', testOrderId);
      await supabase.from('santa_video_orders').delete().eq('id', testOrderId);

      addResult('Cleanup', 'success', 'Test data cleaned up successfully');

      // Final summary
      if (!criticalError) {
        addResult('Test Complete', 'success', '🎉 All tests passed! Your HeyGen integration is working correctly with your updated Santa avatar.');
        setE2eTestResults({
          success: true,
          finalStatus: 'PASS',
          summary: '🎉 All tests passed! Your HeyGen integration is working correctly.',
          detailedResults: {
            timestamp: new Date().toISOString(),
            steps: results,
            finalStatus: 'PASS',
            summary: '🎉 All tests passed! Your HeyGen integration is working correctly.'
          }
        });
      }
    } catch (error: any) {
      if (!criticalError) {
        criticalError = error.message;
      }
      addResult('Test Failed', 'error', criticalError || 'Unknown error occurred');
      setE2eTestResults({
        success: false,
        finalStatus: 'FAIL',
        summary: criticalError || 'Unknown error occurred',
        error: criticalError || 'Unknown error occurred',
        detailedResults: {
          timestamp: new Date().toISOString(),
          steps: results,
          finalStatus: 'FAIL',
          summary: criticalError || 'Unknown error occurred'
        }
      });
    } finally {
      setRunningE2ETest(false);
    }
  };

  // Auto-check video status every 30 seconds
  useEffect(() => {
    return () => {
      if (autoCheckInterval) {
        clearInterval(autoCheckInterval);
      }
    };
  }, [autoCheckInterval]);

  const checkVideoStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/video-generation-processor`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();

      if (result.success) {
        setSampleStatus({
          checked: result.results.checked || 0,
          completed: result.results.completed || 0,
          processing: result.results.stillProcessing || 0,
          failed: result.results.failed || 0
        });
        alert(`Status checked! ${result.results.completed} videos completed, ${result.results.stillProcessing} still processing`);
      } else {
        throw new Error(result.error || 'Failed to check status');
      }
    } catch (error: any) {
      console.error('Error checking video status:', error);
      alert(`Error checking status: ${error.message}`);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleGenerateSamples = async () => {
    setIsGenerating(true);
    setGenerationStatus('Starting sample video generation...');
    setVideoStatus(null);

    try {
      const { data: session } = await supabase.auth.getSession();

      console.log('🎬 Calling generate-sample-videos function...');

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/generate-sample-videos`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📥 Response status:', response.status);

      const responseText = await response.text();
      console.log('📥 Response body:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Failed to parse response:', e);
        setGenerationStatus(`❌ Error: Invalid response from server\n\n${responseText}`);
        setIsGenerating(false);
        return;
      }

      console.log('📊 Parsed result:', result);

      if (result.success) {
        setGenerationStatus(
          `✅ ${result.message}\n\n` +
            `Total Generated: ${result.totalGenerated}/${result.totalAttempted}\n` +
            `Avatar Type: ${result.avatarType}\n` +
            `Voice: ${result.voice}\n` +
            `Resolution: ${result.resolution}\n\n` +
            `Videos are being generated. This takes 5-10 minutes.\n` +
            `Click "Check Status" to see progress.`
        );

        // Show detailed results
        if (result.results && result.results.length > 0) {
          console.log('📋 Detailed results:', result.results);
          const failedVideos = result.results.filter((r: any) => !r.success);
          if (failedVideos.length > 0) {
            console.error('❌ Failed videos:', failedVideos);
            setGenerationStatus(
              (prev) =>
                prev +
                '\n\n⚠️ Some videos failed:\n' + failedVideos.map((v: any) => `Sample ${v.sampleNumber}: ${v.error}`).join('\n')
            );
          }
        }

        // Check status after 5 seconds
        setTimeout(() => checkVideoStatus(), 5000);
      } else {
        console.error('❌ Generation failed:', result);
        setGenerationStatus(
          `❌ Error: ${result.error || 'Failed to generate samples'}\n\nPlease check:\n` +
            `1. HEYGEN_API_KEY is set in Supabase Edge Function secrets\n` +
            `2. SANTA_AVATAR_ID is set correctly\n` +
            `3. Your HeyGen account has sufficient credits`
        );
      }
    } catch (error) {
      console.error('❌ Exception:', error);
      setGenerationStatus(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
          `This usually means:\n` +
          `1. Edge function is not deployed\n` +
          `2. Network connection issue\n` +
          `3. Supabase configuration problem`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckStatus = () => {
    checkVideoStatus();
  };

  const updateAvatarId = async (avatarId: string, avatarName: string) => {
    if (!confirm(`🎅 Update Santa Avatar?\n\nYou're about to set:\n${avatarName}\n(${avatarId})\n\nThis will update your SANTA_AVATAR_ID in Supabase and all future videos will use this avatar.\n\nContinue?`)) {
      return;
    }

    setUpdatingAvatar(true);
    
    try {
      console.log('🔄 Updating SANTA_AVATAR_ID to:', avatarId);
      
      // Call a new edge function to update the secret
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/update-avatar-secret`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ avatarId, avatarName })
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(`✅ Avatar Updated Successfully!\n\n${avatarName}\n${avatarId}\n\nYour Santa avatar has been updated. All future videos will use this avatar.\n\nClick "Run Full Autopilot Validation" to test it!`);
        
        // Mark that avatar was just updated
        sessionStorage.setItem('avatar_just_updated', 'true');
        
        // Close modal
        setShowAvatarModal(false);
        
        // Refresh avatar list
        await listHeyGenAvatars();
      } else {
        throw new Error(result.error || 'Failed to update avatar');
      }
    } catch (error: any) {
      console.error('❌ Error updating avatar:', error);
      alert(`❌ Failed to update avatar\n\n${error.message}\n\nPlease update SANTA_AVATAR_ID manually in Supabase Dashboard → Edge Functions → Secrets`);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50">
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Autopilot Status Banner */}
            {autoTestRunning && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-8 shadow-2xl animate-pulse">
                <div className="flex items-center justify-center">
                  <i className="ri-rocket-line text-4xl mr-4"></i>
                  <div>
                    <h2 className="text-2xl font-bold">🚀 AUTOPILOT MODE ACTIVE</h2>
                    <p className="text-blue-100">Running complete system validation...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Avatar Error Alert */}
            {generationStatus.includes('Avatar') && generationStatus.includes('not found') && (
              <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8 rounded-lg">
                <div className="flex items-start">
                  <i className="ri-error-warning-line text-3xl text-red-600 mr-4 mt-1"></i>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-red-900 mb-2">❌ Avatar Not Found</h3>
                    <p className="text-red-800 mb-4">
                      Your current SANTA_AVATAR_ID is no longer available in your HeyGen account. 
                      This usually happens when an avatar is deleted or expired.
                    </p>
                    <button
                      onClick={listHeyGenAvatars}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold flex items-center"
                    >
                      <i className="ri-search-line mr-2"></i>
                      🔍 Browse Available Avatars & Fix This
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-t-4 border-red-600">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    <i className="ri-test-tube-line text-red-600 mr-3"></i>
                    Pre-Launch Testing Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Complete system testing before going live. All payments are in{' '}
                    <span className="font-semibold text-blue-600">TEST MODE</span>.
                  </p>
                </div>
                {lastChecked && (
                  <div className="text-sm text-gray-500">
                    Last checked: {lastChecked.toLocaleTimeString()}
                  </div>
                )}
              </div>

              {/* Quick Autopilot Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={runFullSystemTest}
                  disabled={autoTestRunning}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center"
                >
                  {autoTestRunning ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-3 text-xl"></i>
                      Running Autopilot Validation...
                    </>
                  ) : (
                    <>
                      <i className="ri-rocket-line mr-3 text-xl"></i>
                      🚀 Run Full Autopilot Validation
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  <i className="ri-information-line mr-1"></i>
                  Automatically scans avatars and runs complete integration test
                </p>
              </div>
            </div>

            {/* Quick Access Avatar Browser - NEW PROMINENT SECTION */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 flex items-center">
                    <i className="ri-user-star-line text-3xl mr-3"></i>
                    Santa Avatar Manager
                  </h2>
                  <p className="text-blue-100 mb-4">
                    Browse all your HeyGen avatars and select the one you want to use for Santa videos. 
                    This will automatically update your configuration.
                  </p>
                </div>
                <button
                  onClick={listHeyGenAvatars}
                  disabled={listingAvatars}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center ml-6"
                >
                  {listingAvatars ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-3"></i>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="ri-search-line mr-3"></i>
                      🎅 Browse & Select Avatar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* HeyGen Integration Testing */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <i className="ri-video-line text-blue-600 mr-3"></i>
                HeyGen Integration Testing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={listHeyGenAvatars}
                  disabled={listingAvatars}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center"
                >
                  {listingAvatars ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Loading Avatars...
                    </>
                  ) : (
                    <>
                      <i className="ri-user-line mr-2"></i>
                      🎅 Browse & Select Santa Avatar
                    </>
                  )}
                </button>

                <button
                  onClick={getVoiceFromVideo}
                  disabled={isLoadingVoice}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center"
                >
                  {isLoadingVoice ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Retrieving Voice...
                    </>
                  ) : (
                    <>
                      <i className="ri-search-line mr-2"></i>
                      🔍 Get Voice from Production Video
                    </>
                  )}
                </button>

                <button
                  onClick={listHeyGenVoices}
                  disabled={listingVoices}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center"
                >
                  {listingVoices ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Loading Voices...
                    </>
                  ) : (
                    <>
                      <i className="ri-mic-line mr-2"></i>
                      Browse Male Santa Voices
                    </>
                  )}
                </button>

                <button
                  onClick={runEndToEndTest}
                  disabled={runningE2ETest}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center font-semibold"
                >
                  {runningE2ETest ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Running Test...
                    </>
                  ) : (
                    <>
                      <i className="ri-play-circle-line mr-2"></i>
                      Run End-to-End Test
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sample Video Generation */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <i className="ri-film-line text-red-600 mr-3"></i>
                Sample Video Generation - O'Reilly Family
              </h2>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                <p className="text-blue-900 font-semibold mb-2">Test Data:</p>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Liam O'Reilly (8 years old) - Loves soccer and dinosaurs</li>
                  <li>• Emma O'Reilly (6 years old) - Loves art and unicorns</li>
                  <li>• Finn O'Reilly (4 years old) - Loves trucks and building blocks</li>
                </ul>
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleGenerateSamples}
                  disabled={isGenerating}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center font-bold text-lg shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-3"></i>
                      Generating Videos...
                    </>
                  ) : (
                    <>
                      <i className="ri-video-add-line mr-3"></i>
                      🎅 Generate 3 Sample Videos (O'Reilly Family)
                    </>
                  )}
                </button>

                <button
                  onClick={handleCheckStatus}
                  disabled={isCheckingStatus}
                  className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center"
                >
                  {isCheckingStatus ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Checking...
                    </>
                  ) : (
                    <>
                      <i className="ri-refresh-line mr-2"></i>
                      Check Status
                    </>
                  )}
                </button>
              </div>

              {generationStatus && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {generationStatus}
                  </pre>
                </div>
              )}

              {sampleStatus.checked > 0 && (
                <div className="mt-6 grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">{sampleStatus.checked}</div>
                    <div className="text-sm text-blue-800">Checked</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600">{sampleStatus.completed}</div>
                    <div className="text-sm text-green-800">Completed</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-600">{sampleStatus.processing}</div>
                    <div className="text-sm text-yellow-800">Processing</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-600">{sampleStatus.failed}</div>
                    <div className="text-sm text-red-800">Failed</div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Testing Flows */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <i className="ri-shopping-cart-line text-green-600 mr-3"></i>
                Product Testing Flows
              </h2>
              <p className="text-gray-600 mb-6">
                Test each product purchase flow end-to-end. All payments use Stripe TEST mode.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testProductFlows.map((product, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => (window.location.href = product.testUrl)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <i className={`${product.icon} text-2xl text-red-600`}></i>
                      </div>
                      <span className="text-lg font-bold text-green-600">{product.price}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 whitespace-nowrap">
                      Test This Product
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Testing Checklist */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <i className="ri-checkbox-line text-green-600 mr-3"></i>
                Pre-Launch Testing Checklist
              </h2>

              <div className="space-y-4">
                {[
                  'HeyGen avatar is correctly configured',
                  'Voice ID is set and working',
                  'End-to-end integration test passes',
                  'Sample videos generate successfully',
                  'All product pages load correctly',
                  'Stripe test payments work',
                  'Email notifications are sent',
                  'Video approval system works',
                  'Admin dashboard is accessible',
                  'Mobile responsiveness is good'
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 text-green-600 mr-4" />
                    <span className="text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Voice Retrieval Modal */}
        {showVoiceModal && retrievedVoiceData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <i className="ri-mic-line text-green-600 mr-3"></i>
                    Production Voice Retrieved
                  </h3>
                  <button
                    onClick={() => setShowVoiceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>

                {retrievedVoiceData.success ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 border-l-4 border-green-600 p-4">
                      <p className="text-green-900 font-semibold mb-2">✅ Voice ID Found!</p>
                      <p className="text-green-800 text-sm">
                        This is the exact voice used in your production video.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Voice ID:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={retrievedVoiceData.voiceId}
                          readOnly
                          onClick={(e) => e.currentTarget.select()}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(retrievedVoiceData.voiceId);
                            alert('✅ Voice ID copied to clipboard!');
                          }}
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap flex items-center"
                        >
                          <i className="ri-file-copy-line mr-2"></i>
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-900 font-semibold mb-2">📋 Next Steps:</p>
                      <ol className="text-blue-800 text-sm space-y-2 list-decimal list-inside">
                        <li>Copy the voice ID above (already in your clipboard)</li>
                        <li>Go to Supabase Dashboard → Edge Functions → Secrets</li>
                        <li>Find <code className="bg-blue-100 px-2 py-1 rounded">HEYGEN_VOICE_ID</code> and click Edit</li>
                        <li>Paste the voice ID and click Save</li>
                        <li>Come back and generate sample videos to test</li>
                      </ol>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Source Video:</strong> {retrievedVoiceData.videoId}
                      </p>
                      {retrievedVoiceData.voiceType && (
                        <p className="text-sm text-gray-600">
                          <strong>Voice Type:</strong> {retrievedVoiceData.voiceType}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-center whitespace-nowrap"
                      >
                        <i className="ri-external-link-line mr-2"></i>
                        Open Supabase Dashboard
                      </a>
                      <button
                        onClick={() => setShowVoiceModal(false)}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 whitespace-nowrap"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-50 border-l-4 border-red-600 p-4">
                      <p className="text-red-900 font-semibold mb-2">❌ Error</p>
                      <p className="text-red-800 text-sm">{retrievedVoiceData.error}</p>
                    </div>
                    <button
                      onClick={() => setShowVoiceModal(false)}
                      className="w-full bg-gray-200 text-gray-800 px-1 py-3 rounded-lg hover:bg-gray-300 whitespace-nowrap"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* E2E Test Results Modal */}
        {showE2EModal && e2eTestResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">End-to-End Test Results</h3>
                  <button
                    onClick={() => setShowE2EModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  {e2eTestResults.detailedResults.steps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        step.status === 'success'
                          ? 'bg-green-50 border-green-600'
                          : step.status === 'error'
                          ? 'bg-red-50 border-red-600'
                          : step.status === 'started'
                          ? 'bg-blue-50 border-blue-600'
                          : 'bg-gray-50 border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{step.step}</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{step.message}</p>
                        </div>
                        <div className="ml-4">
                          {step.status === 'success' && (
                            <i className="ri-checkbox-circle-fill text-2xl text-green-600"></i>
                          )}
                          {step.status === 'error' && (
                            <i className="ri-close-circle-fill text-2xl text-red-600"></i>
                          )}
                          {step.status === 'started' && (
                            <i className="ri-loader-4-line animate-spin text-2xl text-blue-600"></i>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowE2EModal(false)}
                    className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 whitespace-nowrap"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Avatar List Modal - Enhanced */}
        {showAvatarModal && (
          <AvatarBrowser
            isOpen={showAvatarModal}
            onClose={() => setShowAvatarModal(false)}
            avatarList={avatarList}
            isLoading={listingAvatars}
            onSelectAvatar={updateAvatarId}
            isUpdating={updatingAvatar}
          />
        )}

        {/* Voice List Modal */}
        {showVoiceModal && voiceList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <i className="ri-mic-line text-purple-600 mr-3"></i>
                    Male English Santa Voices
                  </h3>
                  <button
                    onClick={() => setShowVoiceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>

                {voiceList.success ? (
                  <div className="space-y-6">
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
                      <p className="text-purple-900 font-semibold">
                        Found {voiceList.maleEnglishVoices} male English voices out of {voiceList.totalVoices} total voices
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {voiceList.voices.map((voice) => (
                        <div key={voice.voice_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg mb-2">{voice.name}</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                <p><strong>Gender:</strong> {voice.gender}</p>
                                <p><strong>Language:</strong> {voice.language}</p>
                                {voice.age && <p><strong>Age:</strong> {voice.age}</p>}
                                {voice.accent && <p><strong>Accent:</strong> {voice.accent}</p>}
                              </div>
                              <div className="bg-gray-50 p-2 rounded font-mono text-xs text-gray-700 mb-3">
                                {voice.voice_id}
                              </div>
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                              {voice.preview_audio && (
                                <>
                                  <button
                                    onClick={() => playVoicePreview(voice.preview_audio!, voice.voice_id)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 whitespace-nowrap flex items-center"
                                  >
                                    <i className={`${playingAudio === voice.voice_id ? 'ri-pause-circle-line' : 'ri-play-circle-line'} mr-2`}></i>
                                    {playingAudio === voice.voice_id ? 'Pause' : 'Play'}
                                  </button>
                                  <audio id={`audio-${voice.voice_id}`} src={voice.preview_audio} onEnded={() => setPlayingAudio(null)} />
                                </>
                              )}
                              <button
                                onClick={() => copyVoiceId(voice.voice_id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap flex items-center"
                              >
                                <i className="ri-file-copy-line mr-2"></i>
                                Copy ID
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4">
                    <p className="text-red-900 font-semibold mb-2">❌ Error</p>
                    <p className="text-red-800 text-sm">{voiceList.error}</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowVoiceModal(false)}
                    className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 whitespace-nowrap"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}