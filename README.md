# DebunkAI

**Check if a viral post, WhatsApp voice note, or video is true, especially during the Nigerian 2027 elections.**

DebunkAI is for citizens, community leaders, students, and families. Paste a claim, upload a voice note, or upload a video clip, and DebunkAI tells you whether it is likely true or false, why, and what to say back.

It is powered by **Gemma 4** (via Google AI Studio), with an offline fallback using **Ollama**. You can use it as a **web app** or as a **WhatsApp / Facebook Messenger chatbot**.

---

## What it does

### 1. Checks anything you send
| You send | DebunkAI checks |
|---|---|
| **Text** (post, caption, forwarded message) | The claim against known facts |
| **Voice note** (record or upload) | Fake or cloned voices (AI deepfakes), edited or spliced audio, robotic-sounding pitch, sudden background changes |
| **Video clip** (upload or paste caption) | Lip-sync that looks off, fake TV banners (e.g. cloned Channels TV, NTA, Arise News), changed dates, and old footage passed off as new |

### 2. Extra checks for Nigerian 2027 election content
Anything about the 2027 elections automatically gets a deeper review:

- **INEC rules check:** compares the claim with the Electoral Act, INEC guidelines, BVAS accreditation rules, and IReV results rules.
- **Peace and safety risk:** could this cause unrest at polling units, ethnic or religious tension, or stop people from voting?
- **Recycled content:** is this old footage from 2015, 2019, or 2023 being shared as 2027?
- **Calm reply:** a respectful message you can post in family, church, or community WhatsApp groups to stop a rumor without starting a fight.

### 3. Spots coordinated fake campaigns (troll farms)
- **Copy-paste networks:** the same paragraph shared across hundreds of groups to look popular.
- **Fake news accounts:** pages pretending to be Channels TV, BBC Hausa, INEC, etc.
- **Fake urgency:** "Forward to 10 chats before this is deleted!"
- **Spread tracing:** shows how the message is travelling and how to stop it.

---

## How to use it

### Option A: Web Fact-Checker
1. Open the app and click **Web Fact-Checker**.
2. Choose what you are checking: **Text Claim**, **Voice Note**, or **Video Clip**.
3. Add your content: type or paste it, record with your microphone, or upload a file. You can also pick a sample.
4. Click **Run Gemma 4 High-Depth Audit**.
5. Read your report:
   - credibility score (gauge)
   - INEC rules breakdown
   - troll-network analysis
   - peace-risk assessment
   - a **copyable WhatsApp reply**

### Option B: Chatbot Simulator (try it without a live bot)
1. Open the app and click **WhatsApp / FB Chatbot**.
2. Pick a style: **WhatsApp** (green) or **Messenger** (blue).
3. Pick a type: **Text**, **Voice Note**, or **Video Clip**.
4. Send your own content, or tap a ready-made 2027 election scenario:
   - Copy-paste server hoax
   - Cloned news impersonation
   - Leaked BVAS 2PM voice note
   - Recycled ballot box video
   - Candidate deepfake
   - ₦2,000 PVC renewal scam

### Option C: Connect a real WhatsApp or Facebook bot
1. Click **Meta Setup** at the top.
2. Copy these two values:
   - **Webhook Callback URL:** `/api/webhook`
   - **Verify Token:** `debunk_bot_token`
3. Follow the on-screen 4-step guide for **WhatsApp Cloud API** or **Facebook Pages**.
4. Click **Ping WhatsApp Audio Webhook** to simulate an incoming voice note and check the logs.

> For real use, change the default Verify Token to your own secret value.

---

## Test that everything works

Run the smoke test from your terminal:

```
npm run test:smoke
```

Or click the **Smoke Test** button at the top of the web app.

---

## Tips for best results

- Include the **full message**, not a screenshot crop, so nothing is missed.
- For voice notes and videos, use the **original file** when possible. Re-forwarded copies lose quality.
- Treat the score as a **guide, not a verdict**. For anything important, confirm with INEC's official channels or a trusted fact-checking outlet.
- If you are offline or out of API access, use the **Ollama fallback**.
