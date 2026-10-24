import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import {
  analyzeClaim,
  getActiveProviderConfig,
  REALISTIC_SAMPLE_CLAIM,
} from './server/debunkService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API Routes
app.get('/api/provider-info', (req, res) => {
  try {
    const config = getActiveProviderConfig();
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, provider } = req.body || {};
    const result = await analyzeClaim(text, provider);
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
