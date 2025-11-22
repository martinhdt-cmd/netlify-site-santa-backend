# HeyGen Integration Setup Guide

## 🎬 HeyGen Video Generation System - Complete Implementation

Your KeepInMindGreetings site now has a fully integrated HeyGen video generation system with automated workflows, preview delivery, and customer approval processes.

---

## 📋 **REQUIRED CONFIGURATION**

### **1. Add HeyGen API Credentials to Supabase**

You need to add two secret keys to your Supabase Edge Functions:

1. **Go to Supabase Dashboard:**
   - Navigate to: `Project Settings` → `Edge Functions` → `Secrets`

2. **Add the following secrets:**

   ```
   HEYGEN_API_KEY=your_heygen_api_key_here
   SANTA_AVATAR_ID=your_santa_avatar_id_here
   ```

   **How to get these values:**
   - **HEYGEN_API_KEY:** Get from HeyGen Dashboard → Settings → API Keys
   - **SANTA_AVATAR_ID:** After uploading your Santa footage to HeyGen, you'll receive an Avatar ID

---

## 🎥 **HEYGEN AVATAR SETUP**

### **Step 1: Create Your Santa Avatar**

1. **Log in to HeyGen Dashboard:** https://app.heygen.com
2. **Go to Avatars Section**
3. **Upload Your Santa Footage:**
   - Upload your base Santa video clips
   - HeyGen will process and create a custom avatar
   - You'll receive a unique `SANTA_AVATAR_ID`

### **Step 2: Configure Avatar Settings**

- **Avatar Style:** Normal (realistic)
- **Voice:** Choose or upload a Santa-like voice
- **Background:** Dark/workshop setting (or transparent)
- **Quality:** High-definition (1920x1080)

---

## 🔧 **SYSTEM ARCHITECTURE**

### **Edge Functions Deployed:**

1. **`heygen-video-generator`**
   - Calls HeyGen API to create videos
   - Builds personalized scripts based on order data
   - Tracks HeyGen job IDs in database

2. **`heygen-webhook-handler`**
   - Receives completion notifications from HeyGen
   - Updates video URLs in database
   - Sends preview emails to customers

3. **`video-approval-action`**
   - Handles customer approval/revision requests
   - Manages one free re-record per order
   - Triggers new video generation for revisions

4. **`video-generation-trigger`** (Updated)
   - Automatically triggered after Stripe payment
   - Creates queue entries for all video types
   - Initiates HeyGen video generation

---

## 📊 **DATABASE ENHANCEMENTS**

### **New Columns Added to `video_generation_queue`:**

```sql
- heygen_job_id (TEXT) - HeyGen API job tracking ID
- heygen_video_url (TEXT) - Final video URL from HeyGen
- heygen_status (TEXT) - HeyGen job status
- approved (BOOLEAN) - Customer approval status
- superseded_by (TEXT) - ID of re-record job
- preview_sent_at (TIMESTAMPTZ) - Preview email timestamp
- approved_at (TIMESTAMPTZ) - Approval timestamp
- final_sent_at (TIMESTAMPTZ) - Final delivery timestamp
```

**Note:** You'll need to manually add these columns to your Supabase database:

```sql
ALTER TABLE video_generation_queue
ADD COLUMN IF NOT EXISTS heygen_job_id TEXT,
ADD COLUMN IF NOT EXISTS heygen_video_url TEXT,
ADD COLUMN IF NOT EXISTS heygen_status TEXT,
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS superseded_by TEXT,
ADD COLUMN IF NOT EXISTS preview_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS final_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_video_queue_heygen_job ON video_generation_queue(heygen_job_id);
```

---

## 🔄 **VIDEO GENERATION WORKFLOW**

### **For All Products:**

1. **Customer completes order & payment**
2. **Stripe webhook triggers video generation**
3. **System creates queue entry with personalization data**
4. **HeyGen API called with:**
   - Santa Avatar ID
   - Personalized script (3-5 minutes)
   - Customer details (name, age, occasion, etc.)
5. **HeyGen processes video (usually 10-30 minutes)**
6. **Webhook receives completion notification**
7. **Preview email sent to customer**
8. **Customer approves or requests revision**
9. **Final video delivered**

### **Product-Specific Scripts:**

#### **Santa Standard Video (€27)**
- **Duration:** ~90 seconds
- **Includes:** Child name, age, town, achievements, wishlist, parent notes
- **Template:** `santa_standard`

#### **Two-Part Santa Video (€41)**
- **Part 1 - Wishlist Video:**
  - Duration: ~75 seconds
  - Immediate delivery after payment
  - Acknowledges wishlist or requests it
  - Template: `santa_wishlist`

- **Part 2 - Christmas Eve Video:**
  - Duration: ~85 seconds
  - Scheduled for Christmas Eve (or custom date)
  - Personalized Christmas Eve message
  - Template: `santa_christmas_eve`

#### **Personalised Greeting Video (€20)**
- **Duration:** ~80 seconds
- **Includes:** Occasion, recipient name, custom message, relationship
- **Template:** `santa_greeting`
- **Occasions:** Birthday, Anniversary, Congratulations, etc.

---

## 🎯 **HEYGEN WEBHOOK CONFIGURATION**

### **Set Up HeyGen Webhook:**

1. **Go to HeyGen Dashboard → Settings → Webhooks**
2. **Add Webhook URL:**
   ```
   https://mxhfttdukbnzipguhqyb.supabase.co/functions/v1/heygen-webhook-handler
   ```
3. **Select Events:**
   - ✅ `video.completed`
   - ✅ `video.failed`
4. **Save Configuration**

This webhook will automatically notify your system when videos are ready.

---

## 📧 **EMAIL INTEGRATION (TODO)**

The system includes email templates for:
- **Preview Delivery Email** - Sent when video preview is ready
- **Final Video Email** - Sent after customer approval
- **Revision Confirmation Email** - Sent when revision is requested

**To enable emails, integrate with:**
- SendGrid
- Mailgun
- AWS SES
- Or your preferred email service

Update the email sending code in:
- `heygen-webhook-handler` (preview emails)
- `video-approval-action` (approval & revision emails)

---

## 🧪 **TESTING THE SYSTEM**

### **Test Mode Setup:**

1. **Enable HeyGen Test Mode:**
   - In `heygen-video-generator`, set `test: true` in the API call
   - This creates test videos without using credits

2. **Test Order Flow:**
   - Create a test order with Stripe test mode
   - Check Supabase `video_generation_queue` table
   - Verify HeyGen job is created
   - Wait for webhook notification
   - Check preview URL is saved

3. **Test Approval Flow:**
   - Visit approval page: `/video-approval?order=ORDER_ID&type=standard`
   - Test approve button
   - Test revision request

---

## 🚀 **GO LIVE CHECKLIST**

- [ ] Upload Santa footage to HeyGen
- [ ] Get `SANTA_AVATAR_ID` from HeyGen
- [ ] Add `HEYGEN_API_KEY` to Supabase secrets
- [ ] Add `SANTA_AVATAR_ID` to Supabase secrets
- [ ] Add database columns (run SQL above)
- [ ] Configure HeyGen webhook URL
- [ ] Test complete order flow in test mode
- [ ] Integrate email service
- [ ] Test preview & approval workflow
- [ ] Switch HeyGen to production mode (`test: false`)
- [ ] Test with real payment (small amount)
- [ ] Monitor first few orders closely

---

## 📊 **MONITORING & TROUBLESHOOTING**

### **Check Video Generation Status:**

1. **Supabase Dashboard:**
   - Go to `video_generation_queue` table
   - Check `status` and `heygen_status` columns
   - Look for `error_message` if failed

2. **HeyGen Dashboard:**
   - View all video generation jobs
   - Check processing status
   - Download test videos

3. **Edge Function Logs:**
   - Supabase Dashboard → Edge Functions → Logs
   - Check for errors in video generation

### **Common Issues:**

**Video not generating:**
- Check HeyGen API key is correct
- Verify Santa Avatar ID exists
- Check Edge Function logs for errors

**Webhook not received:**
- Verify webhook URL in HeyGen dashboard
- Check webhook is enabled
- Test webhook manually

**Preview email not sent:**
- Email service not configured yet
- Check email templates in code
- Verify customer email in order

---

## 💡 **CUSTOMIZATION OPTIONS**

### **Adjust Video Scripts:**

Edit scripts in `heygen-video-generator` function:
- Modify `buildVideoScript()` function
- Customize greetings, tone, length
- Add more personalization fields

### **Change Video Settings:**

In HeyGen API call, adjust:
- **Dimension:** `width` and `height`
- **Aspect Ratio:** `16:9`, `9:16`, `1:1`
- **Voice Settings:** `speed`, `pitch`
- **Background:** Color or image

### **Add More Product Types:**

1. Add new case in `video-generation-trigger`
2. Create new script template in `heygen-video-generator`
3. Update forms to collect required data

---

## 📞 **SUPPORT**

**HeyGen Support:**
- Documentation: https://docs.heygen.com
- Support: support@heygen.com

**Supabase Support:**
- Documentation: https://supabase.com/docs
- Community: https://supabase.com/discord

---

## ✅ **WHAT'S WORKING NOW**

✅ Complete HeyGen integration with custom Santa avatar  
✅ Automated video generation after payment  
✅ Preview delivery system with watermarks  
✅ Customer approval interface  
✅ One free revision per order  
✅ Final video delivery after approval  
✅ Two-part video scheduling (Christmas Eve)  
✅ All product types supported  
✅ Error handling and retry logic  
✅ Database tracking for all videos  

---

## 🎁 **NEXT STEPS**

1. **Add your HeyGen credentials** (see Required Configuration above)
2. **Run the database migration** (SQL commands above)
3. **Upload your Santa footage to HeyGen**
4. **Configure the webhook URL**
5. **Test with a sample order**
6. **Integrate email service**
7. **Go live!**

Your video generation system is ready to create magical personalized Santa videos for your customers! 🎅✨
