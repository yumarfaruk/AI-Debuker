import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
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

function debunkApiPlugin(): Plugin {
  return {
    name: 'debunk-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const fullUrl = req.url || '';
        const url = fullUrl.split('?')[0];

        // 1. Provider info
        if (url === '/api/provider-info' && req.method === 'GET') {
          try {
            const config = getActiveProviderConfig();
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ...config,
                metaVerifyToken: process.env.META_VERIFY_TOKEN || 'debunk_bot_token',
                hasWhatsAppToken: Boolean(process.env.WHATSAPP_TOKEN),
                hasWhatsAppPhoneId: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID),
                hasFacebookToken: Boolean(process.env.PAGE_ACCESS_TOKEN),
              })
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 2. Election samples
        if (url === '/api/election-samples' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ samples: NIGERIAN_ELECTION_SAMPLES }));
          return;
        }

        // 3. Direct claim analyze (supports mediaType: 'text' | 'audio' | 'video')
        if (url === '/api/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { text, provider, mediaType = 'text' } = JSON.parse(body || '{}');
              const result = await analyzeClaim(text, provider, mediaType);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Analysis failed' }));
            }
          });
          return;
        }

        // 4. Smoke test
        if (url === '/api/smoke-test' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { provider } = JSON.parse(body || '{}');
              const config = getActiveProviderConfig(provider);
              const startTime = Date.now();
              const result = await analyzeClaim(REALISTIC_SAMPLE_CLAIM, provider);
              const durationMs = Date.now() - startTime;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  status: 'PASS',
                  durationMs,
                  config,
                  sampleClaim: REALISTIC_SAMPLE_CLAIM,
                  result,
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  status: 'FAIL',
                  error: err.message || 'Smoke test failed',
                })
              );
            }
          });
          return;
        }

        // 5. Meta Webhook Handshake Verification (GET /webhook or /api/webhook)
        if ((url === '/webhook' || url === '/api/webhook') && req.method === 'GET') {
          const parsedUrl = new URL(fullUrl, 'http://localhost:3000');
          const mode = parsedUrl.searchParams.get('hub.mode') || undefined;
          const token = parsedUrl.searchParams.get('hub.verify_token') || undefined;
          const challenge = parsedUrl.searchParams.get('hub.challenge') || undefined;

          const verification = verifyMetaWebhook(mode, token, challenge);
          if (verification.isValid && verification.challenge) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(verification.challenge);
          } else {
            res.statusCode = 403;
            res.end('Forbidden');
          }
          return;
        }

        // 6. Meta Webhook Incoming Event Receiver (POST /webhook or /api/webhook)
        if ((url === '/webhook' || url === '/api/webhook') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('EVENT_RECEIVED');

            try {
              const json = JSON.parse(body || '{}');
              await handleMetaWebhookPayload(json);
            } catch (err: any) {
              console.error('[Vite Webhook] Payload error:', err.message);
            }
          });
          return;
        }

        // 7. Interactive Chatbot Simulator (POST /api/chat/simulate)
        if (url === '/api/chat/simulate' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { message, platform = 'whatsapp', provider, mediaType = 'text' } = JSON.parse(body || '{}');
              if (!message || !message.trim()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Message cannot be empty.' }));
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

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  replyText: formattedReply,
                  debunkResult,
                  platform,
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Chatbot simulation failed' }));
            }
          });
          return;
        }

        // 8. Webhook activity logs
        if (url === '/api/webhook/logs' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ logs: getWebhookLogs() }));
          return;
        }

        // 9. Clear logs
        if (url === '/api/webhook/clear-logs' && req.method === 'POST') {
          clearWebhookLogs();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // 10. Simulated ping test
        if (url === '/api/webhook/test-ping' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { platform = 'whatsapp', text, mediaType = 'text' } = JSON.parse(body || '{}');
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
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  handled,
                  payload: testPayload,
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), debunkApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
