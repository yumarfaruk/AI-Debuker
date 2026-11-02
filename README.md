# DebunkAI - Nigerian 2027 Election & Viral Fact-Checker

DebunkAI helps citizens, community leaders, students, and families fact-check viral social media posts, WhatsApp voice notes, and video clips—with special high-depth audit capabilities for the **upcoming Nigerian 2027 General Elections** and **Coordinated Inauthentic Behavior (CIB) campaigns**.

It is powered by **Gemma 4** through Google AI Studio with local offline fallback using **Ollama**, and works both as a **Web Fact-Checker** and an interactive **WhatsApp / Facebook Messenger Chatbot**.

---

## 1. Nigerian 2027 Election Special High-Depth Analysis

Any post, audio recording, or video touching on the Nigerian 2027 elections automatically activates the **Electoral Integrity Audit**:
1. **Statutory INEC Protocol Check**: Cross-references claims against the Electoral Act, official Independent National Electoral Commission (INEC) guidelines, BVAS accreditation protocols, and IReV results transmission rules.
2. **Peace & Security Impact**: Assesses the risk of inciting polling unit unrest, ethnic/religious friction, or voter suppression.
3. **Source Provenance & Recycled Context**: Checks if the content is recycled archival footage (e.g. from 2015, 2019, or 2023 elections falsely claimed to be 2027).
4. **Community De-escalation Reply**: Formats a culturally respectful message tailored for Nigerian WhatsApp family, church, and community groups to prevent panic and stop the spread of rumors without confrontation.

---

## 2. Coordinated Inauthentic Behavior (CIB) & Troll Farm Analysis

Disinformation in high-stakes election cycles is frequently weaponized through coordinated networks:
- **Copypasta Networks**: Identical paragraphs copy-pasted across hundreds of WhatsApp broadcast groups and Twitter/X threads to manufacture false consensus.
- **Cloned Media Handles**: Fake accounts impersonating credible news brands (e.g. cloned Channels TV, BBC Hausa, or INEC handles).
- **Manufactured Urgency**: Coordinated panic commands ("Forward to 10 chats before this is deleted").
- **Dispersion Tracing**: Analyzes the propagation mechanics and provides actionable advice on breaking the forwarding chain.

---

## 3. Audio Voice Notes & Video Clip Forensics

Misinformation in Nigerian and global elections circulates heavily through forwarded WhatsApp voice notes and short video clips:

### 🎙️ Audio Voice Note Features:
- **Direct Recording & Audio Upload**: Record voice notes directly from your microphone or upload audio files.
- **Interactive Audio Waveform Player**: Play voice notes in the chat or on the web dashboard.
- **Voice Forensics**: Checks for synthetic voice cloning (AI deepfakes), spliced acoustics, robotic pitch jitter, and room ambiance cuts.

### 🎬 Video Clip Features:
- **Video Upload & Frame Inspection**: Upload viral clips or paste social media captions.
- **Visual Deepfake Inspection**: Detects AI lip-syncing drift, mismatched lower-third television graphics (cloned Channels TV, NTA, Arise News banners), and manipulated date metadata.
- **Archival Verification**: Flags old footage from previous election years passed off as new.

---

## 4. How to Use

### A. WhatsApp & Facebook Chatbot Simulator
1. Open the app and click the **WhatsApp / FB Chatbot** tab.
2. Toggle between **WhatsApp** (green interface with checkmarks) and **Messenger** (blue interface).
3. Switch modality between **📝 Text**, **🎙️ Voice Note**, or **🎬 Video Clip**.
4. Test with 1-click realistic Nigerian 2027 election scenarios (e.g. *Coordinated Copypasta Server Hoax*, *Cloned News Impersonation*, *Leaked BVAS 2PM Voice Note*, *Recycled Ballot Box Video*, *Candidate Deepfake*, *₦2,000 PVC Renewal Scam*).

### B. Web Fact-Checker
1. Click the **Web Fact-Checker** tab.
2. Select **Text Claim**, **Voice Note (Audio)**, or **Video Clip**.
3. Record a voice note with your mic or select a sample.
4. Click **Run Gemma 4 High-Depth Audit** to view the full report, credibility gauge, INEC statutory breakdown, CIB network analysis, peace assessment, and copyable WhatsApp message.

### C. Live Meta Webhook Setup
1. Click **Meta Setup** in the top navigation.
2. Copy your live Webhook Callback URL (`/api/webhook`) and Verify Token (`debunk_bot_token`).
3. Follow the 4-step setup guide for WhatsApp Cloud API or Facebook Pages.
4. Use the **Ping WhatsApp Audio Webhook** button to simulate live incoming election voice notes and inspect the logs!

---

## 5. Running the Smoke Test

To run the automated smoke test script:
```bash
npm run test:smoke
```
Or click the **Smoke Test** button in the top navigation bar of the web app.
