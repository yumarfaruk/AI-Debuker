import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import {
  analyzeClaim,
  getActiveProviderConfig,
  REALISTIC_SAMPLE_CLAIM,
  NIGERIAN_ELECTION_SAMPLES,
} from './server/debunkService.ts';

import {
  verifyMetaWebhook,
  handleMetaWebhookPayload,
  formatChatbotResponse,
  getWebhookLogs,
  clearWebhookLogs,
  addWebhookLog,
} from './server/chatbotService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API Routes
app.get('/api/provider-info', (req, res) => {
  try {
    const config = getActiveProviderConfig();
    res.json({
      ...config,
      metaVerifyToken: process.env.META_VERIFY_TOKEN || 'debunk_bot_token',
      hasWhatsAppToken: Boolean(process.env.WHATSAPP_TOKEN),
      hasWhatsAppPhoneId: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID),
      hasFacebookToken: Boolean(process.env.PAGE_ACCESS_TOKEN),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/election-samples', (req, res) => {
  res.json({ samples: NIGERIAN_ELECTION_SAMPLES });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, provider, mediaType = 'text' } = req.body || {};
    const result = await analyzeClaim(text, provider, mediaType);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

app.post('/api/smoke-test', async (req, res) => {
  try {
    const { provider } = req.body || {};
    const config = getActiveProviderConfig(provider);
    const startTime = Date.now();
    const result = await analyzeClaim(REALISTIC_SAMPLE_CLAIM, provider);
    const durationMs = Date.now() - startTime;
    res.json({
      status: 'PASS',
      durationMs,
      config,
      sampleClaim: REALISTIC_SAMPLE_CLAIM,
      result,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'FAIL',
      error: err.message || 'Smoke test failed',
    });
  }
});

// Meta Webhook Verification (WhatsApp & Facebook Messenger)
const handleWebhookGet = (req: express.Request, res: express.Response) => {
  const mode = req.query['hub.mode'] as string;
  const token = req.query['hub.verify_token'] as string;
  const challenge = req.query['hub.challenge'] as string;

  const verification = verifyMetaWebhook(mode, token, challenge);
  if (verification.isValid && verification.challenge) {
    console.log('[Webhook] Meta verification handshake succeeded.');
    res.status(200).send(verification.challenge);
  } else {
    console.warn('[Webhook] Meta verification failed or invalid token.');
    res.sendStatus(403);
  }
};

app.get('/webhook', handleWebhookGet);
app.get('/api/webhook', handleWebhookGet);

// Meta Webhook Message Receiver
const handleWebhookPost = async (req: express.Request, res: express.Response) => {
  res.status(200).send('EVENT_RECEIVED');

  try {
    await handleMetaWebhookPayload(req.body);
  } catch (err: any) {
    console.error('[Webhook] Error handling payload:', err.message);
  }
};

app.post('/webhook', handleWebhookPost);
app.post('/api/webhook', handleWebhookPost);

// Interactive Chatbot Simulation Endpoint
app.post('/api/chat/simulate', async (req, res) => {
  try {
    const { message, platform = 'whatsapp', provider, mediaType = 'text' } = req.body || {};
    if (!message || !message.trim()) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const debunkResult = await analyzeClaim(message, provider, mediaType);
    const formattedReply = formatChatbotResponse(debunkResult, platform);

    addWebhookLog({
      platform: platform as 'whatsapp' | 'facebook',
      direction: 'incoming',
      senderId: platform === 'whatsapp' ? '+234 803 123 4567' : 'fb_user_10284',
      incomingText: message,
      mediaType,
      replyText: formattedReply,
      verdict: debunkResult.verdict,
      credibilityScore: debunkResult.credibilityScore,
      deliveryStatus: 'simulated',
    });

    res.json({
      replyText: formattedReply,
      debunkResult,
      platform,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Chatbot simulation failed' });
  }
});

// Webhook Activity Logs
app.get('/api/webhook/logs', (req, res) => {
  res.json({ logs: getWebhookLogs() });
});

app.post('/api/webhook/clear-logs', (req, res) => {
  clearWebhookLogs();
  res.json({ success: true });
});

// Test ping endpoint to trigger a simulated WhatsApp or Facebook webhook
app.post('/api/webhook/test-ping', async (req, res) => {
  try {
    const { platform = 'whatsapp', text, mediaType = 'text' } = req.body || {};
    const testText = text || NIGERIAN_ELECTION_SAMPLES[0].text;

    let testPayload: any;
    if (platform === 'whatsapp') {
      testPayload = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'WHATSAPP_BUSINESS_ID',
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '234800000000',
                    phone_number_id: '10987654321',
                  },
                  messages: [
                    {
                      from: '2348039876543',
                      id: `wamid_${Date.now()}`,
                      timestamp: Math.floor(Date.now() / 1000).toString(),
                      text: { body: testText },
                      type: mediaType === 'audio' ? 'audio' : mediaType === 'video' ? 'video' : 'text',
                    },
                  ],
                },
                field: 'messages',
              },
            ],
          },
        ],
      };
    } else {
      testPayload = {
        object: 'page',
        entry: [
          {
            id: 'PAGE_ID_98765',
            time: Date.now(),
            messaging: [
              {
                sender: { id: 'fb_user_449102' },
                recipient: { id: 'PAGE_ID_98765' },
                timestamp: Date.now(),
                message: {
                  mid: `mid_${Date.now()}`,
                  text: testText,
                },
              },
            ],
          },
        ],
      };
    }

    const handled = await handleMetaWebhookPayload(testPayload);
    res.json({
      success: true,
      handled,
      payload: testPayload,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend build if present
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  const indexHtml = path.join(distPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send('DebunkAI Server is running. Run `npm run build` to compile the frontend.');
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`DebunkAI server listening on http://0.0.0.0:${port}`);
  console.log(`Provider: ${process.env.PROVIDER || 'api'}`);
});
