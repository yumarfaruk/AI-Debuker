import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { analyzeClaim, getActiveProviderConfig, REALISTIC_SAMPLE_CLAIM } from './server/debunkService.ts';

function debunkApiPlugin(): Plugin {
  return {
    name: 'debunk-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/provider-info' && req.method === 'GET') {
          try {
            const config = getActiveProviderConfig();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(config));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        if (url === '/api/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { text, provider } = JSON.parse(body || '{}');
              const result = await analyzeClaim(text, provider);
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
