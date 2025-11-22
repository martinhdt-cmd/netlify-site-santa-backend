import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const rawApiKey = Deno.env.get('HEYGEN_API_KEY');
    const SANTA_AVATAR_ID = Deno.env.get('SANTA_AVATAR_ID');
    
    if (!rawApiKey) {
      throw new Error('HEYGEN_API_KEY not configured');
    }

    const HEYGEN_API_KEY = rawApiKey.trim().replace(/^Bearer\s+/i, '');

    console.log('🔍 Starting CUSTOM avatars scan (excluding public library)...');
    console.log('📋 Current SANTA_AVATAR_ID:', SANTA_AVATAR_ID || 'NOT SET');

    const allAvatars: any[] = [];
    const allAvatarGroups: any[] = [];
    const santaAvatarsFound: any[] = [];
    const individualSantaAvatars: any[] = [];
    
    // 1. Fetch V2 avatars - ONLY CUSTOM avatars
    console.log('📥 Fetching V2 CUSTOM avatars only...');
    try {
      const v2Response = await fetch('https://api.heygen.com/v2/avatars', {
        headers: { 
          'X-Api-Key': HEYGEN_API_KEY,
          'Accept': 'application/json'
        }
      });
      
      if (v2Response.ok) {
        const v2Data = await v2Response.json();
        console.log('✅ V2 API response received');
        console.log('V2 response keys:', Object.keys(v2Data));
        
        if (v2Data.data) {
          console.log('V2 data keys:', Object.keys(v2Data.data));
          
          // SKIP public avatars - we don't want them!
          console.log('⏭️ Skipping public avatars from HeyGen library');
          
          // Process custom/private avatars ONLY
          if (v2Data.data.custom_avatars && Array.isArray(v2Data.data.custom_avatars)) {
            console.log(`🎨 Found ${v2Data.data.custom_avatars.length} custom avatars`);
            for (const avatar of v2Data.data.custom_avatars) {
              const avatarId = avatar.avatar_id || avatar.id;
              const avatarName = avatar.avatar_name || avatar.name || avatarId;
              
              const avatarInfo = {
                id: avatarId,
                name: avatarName,
                type: 'CUSTOM',
                isCurrent: avatarId === SANTA_AVATAR_ID,
                previewUrl: avatar.preview_image_url || avatar.preview_url,
                source: 'v2_custom'
              };
              
              allAvatars.push(avatarInfo);
              
              console.log(`  ✓ Custom avatar: ${avatarName} (${avatarId})`);
              
              // Check if it's Santa-related
              const nameLower = avatarName.toLowerCase();
              if (nameLower.includes('santa') || nameLower.includes('christmas') || nameLower.includes('claus') || nameLower.includes('fireplace')) {
                individualSantaAvatars.push({ ...avatarInfo, isSanta: true });
                console.log(`    🎅 SANTA MATCH!`);
              }
            }
          } else {
            console.log('⚠️ No custom_avatars field found in V2 response');
          }
          
          // Process talking photos (these are also custom)
          if (v2Data.data.talking_photos && Array.isArray(v2Data.data.talking_photos)) {
            console.log(`📸 Found ${v2Data.data.talking_photos.length} talking photos`);
            for (const photo of v2Data.data.talking_photos) {
              const photoId = photo.talking_photo_id || photo.id;
              const photoName = photo.talking_photo_name || photo.name || photoId;
              
              const photoInfo = {
                id: photoId,
                name: photoName,
                type: 'TALKING_PHOTO',
                isCurrent: photoId === SANTA_AVATAR_ID,
                previewUrl: photo.preview_image_url,
                source: 'v2_talking_photo'
              };
              
              allAvatars.push(photoInfo);
              
              console.log(`  ✓ Talking photo: ${photoName} (${photoId})`);
              
              const nameLower = photoName.toLowerCase();
              if (nameLower.includes('santa') || nameLower.includes('christmas') || nameLower.includes('claus') || nameLower.includes('fireplace')) {
                individualSantaAvatars.push({ ...photoInfo, isSanta: true });
                console.log(`    🎅 SANTA MATCH!`);
              }
            }
          }
        }
      } else {
        const errorText = await v2Response.text();
        console.error('❌ V2 API error:', v2Response.status, errorText);
      }
    } catch (e) {
      console.error('❌ V2 avatars error:', e);
    }

    // 2. Fetch avatar groups using V1 API (these are always custom)
    console.log('📥 Fetching avatar groups (V1 API)...');
    try {
      const groupsResponse = await fetch('https://api.heygen.com/v1/avatar_group.list', {
        method: 'GET',
        headers: { 
          'X-Api-Key': HEYGEN_API_KEY,
          'Accept': 'application/json'
        }
      });
      
      const responseText = await groupsResponse.text();
      console.log('Avatar groups raw response length:', responseText.length);
      
      if (groupsResponse.ok) {
        const groupsData = JSON.parse(responseText);
        const groups = groupsData.data?.avatar_groups || groupsData.data || [];
        
        if (Array.isArray(groups) && groups.length > 0) {
          console.log(`📁 Found ${groups.length} avatar groups`);
          
          for (const group of groups) {
            const groupId = group.avatar_group_id || group.id;
            const groupName = group.avatar_group_name || group.name || groupId;
            
            const groupInfo = {
              id: groupId,
              name: groupName,
              type: 'AVATAR_GROUP',
              avatarCount: group.num_avatars || 0,
              isCurrent: groupId === SANTA_AVATAR_ID,
              source: 'v1_group'
            };
            allAvatarGroups.push(groupInfo);
            
            console.log(`  ✓ Avatar group: ${groupName} (${groupId}) - ${groupInfo.avatarCount} avatars`);
            
            const nameLower = groupName.toLowerCase();
            if (nameLower.includes('santa') || nameLower.includes('christmas') || nameLower.includes('claus')) {
              santaAvatarsFound.push({ ...groupInfo, isSanta: true });
              console.log(`    🎅 SANTA GROUP MATCH!`);
              
              // Fetch individual avatars within this group
              try {
                console.log(`    📥 Fetching avatars in group ${groupId}...`);
                const groupDetailResponse = await fetch(`https://api.heygen.com/v1/avatar_group/${groupId}`, {
                  headers: { 'X-Api-Key': HEYGEN_API_KEY }
                });
                
                if (groupDetailResponse.ok) {
                  const groupDetail = await groupDetailResponse.json();
                  const avatarsInGroup = groupDetail.data?.avatars || groupDetail.data?.avatar_list || [];
                  
                  console.log(`    ✅ Found ${avatarsInGroup.length} avatars in group`);
                  
                  for (const avatar of avatarsInGroup) {
                    const avatarId = avatar.avatar_id || avatar.id;
                    const avatarName = avatar.avatar_name || avatar.name || avatarId;
                    individualSantaAvatars.push({
                      id: avatarId,
                      name: avatarName,
                      groupId: groupId,
                      groupName: groupName,
                      type: 'GROUP_MEMBER',
                      isCurrent: avatarId === SANTA_AVATAR_ID,
                      previewUrl: avatar.preview_image_url || avatar.preview_url
                    });
                    console.log(`      ✓ ${avatarName} (${avatarId})`);
                  }
                } else {
                  const errorText = await groupDetailResponse.text();
                  console.error(`    ❌ Group detail error:`, errorText);
                }
              } catch (e) {
                console.error(`    ❌ Error fetching group detail:`, e);
              }
            }
          }
        } else {
          console.log('⚠️ No avatar groups found');
        }
      } else {
        console.error('❌ Avatar groups V1 error:', groupsResponse.status, responseText);
      }
    } catch (e) {
      console.error('❌ Avatar groups V1 error:', e);
    }

    // Summary
    console.log('\n📊 SCAN COMPLETE (CUSTOM AVATARS ONLY):');
    console.log(`- Total custom avatars: ${allAvatars.length}`);
    console.log(`- Total avatar groups: ${allAvatarGroups.length}`);
    console.log(`- Santa avatar groups found: ${santaAvatarsFound.length}`);
    console.log(`- Individual Santa avatars found: ${individualSantaAvatars.length}`);

    // Check if current SANTA_AVATAR_ID is valid
    const currentIdValid = individualSantaAvatars.some(a => a.id === SANTA_AVATAR_ID) || 
                          allAvatars.some(a => a.id === SANTA_AVATAR_ID) ||
                          allAvatarGroups.some(g => g.id === SANTA_AVATAR_ID);

    // Determine recommendation
    let recommendation = '';
    if (santaAvatarsFound.length > 0) {
      const firstGroup = santaAvatarsFound[0];
      recommendation = `Use avatar group ID: ${firstGroup.id} (${firstGroup.name})`;
    } else if (individualSantaAvatars.length > 0) {
      const firstIndividual = individualSantaAvatars[0];
      recommendation = `Use avatar ID: ${firstIndividual.id} (${firstIndividual.name})`;
    } else if (allAvatarGroups.length > 0) {
      const firstGroup = allAvatarGroups[0];
      recommendation = `Use avatar group ID: ${firstGroup.id} (${firstGroup.name})`;
    } else if (allAvatars.length > 0) {
      const firstAvatar = allAvatars[0];
      recommendation = `Use avatar ID: ${firstAvatar.id} (${firstAvatar.name})`;
    }

    return new Response(JSON.stringify({
      success: true,
      currentAvatarId: SANTA_AVATAR_ID || 'NOT SET',
      currentIdValid,
      totalAvatars: allAvatars.length,
      totalAvatarGroups: allAvatarGroups.length,
      santaAvatarsFound,
      individualSantaAvatars,
      allAvatarGroups,
      allAvatars: allAvatars, // Show ALL custom avatars (no limit)
      recommendation,
      message: santaAvatarsFound.length > 0 
        ? `Found ${santaAvatarsFound.length} Santa avatar group(s)! ${currentIdValid ? '✅ Current ID is valid!' : '⚠️ Please update SANTA_AVATAR_ID with one of the group IDs shown below.'}`
        : individualSantaAvatars.length > 0
        ? `Found ${individualSantaAvatars.length} Santa avatar(s)! ${currentIdValid ? '✅ Current ID is valid!' : '⚠️ Please update SANTA_AVATAR_ID with one of the IDs shown below.'}`
        : allAvatarGroups.length > 0
        ? `Found ${allAvatarGroups.length} custom avatar group(s). ${currentIdValid ? '✅ Current ID is valid!' : '⚠️ Please select one of your avatar groups.'}`
        : allAvatars.length > 0
        ? `Found ${allAvatars.length} custom avatar(s). ${currentIdValid ? '✅ Current ID is valid!' : '⚠️ Please select one of your custom avatars.'}`
        : `❌ No custom avatars found. Please check your HeyGen account or API key.`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});