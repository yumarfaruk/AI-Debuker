/**
 * Smoke test script for Gemma 4 DebunkAI.
 * Sends realistic viral claim input through the active provider (API or Ollama)
 * and prints PASS or FAIL.
 */
import dotenv from 'dotenv';
dotenv.config();

import { analyzeClaim, getActiveProviderConfig, REALISTIC_SAMPLE_CLAIM } from '../server/debunkService.ts';

async function runSmokeTest() {
  console.log('========================================================');
  console.log('           GEMMA 4 DEBUNK-AI SMOKE TEST                 ');
  console.log('========================================================');

  const config = getActiveProviderConfig();
  console.log(`Active Provider: ${config.provider.toUpperCase()}`);
  if (config.provider === 'api') {
    console.log(`Model:           ${config.geminiModel}`);
    console.log(`API Key Set:     ${config.hasApiKey ? 'YES' : 'NO (missing GEMINI_API_KEY)'}`);
  } else {
    console.log(`Ollama Endpoint: ${config.ollamaEndpoint}`);
    console.log(`Ollama Model:    ${config.ollamaModel}`);
  }

  console.log('\n--- Realistic Viral Input ---');
  console.log(REALISTIC_SAMPLE_CLAIM);
  console.log('-----------------------------\n');
  console.log('Sending claim to Gemma 4 for verification...');

  const startTime = Date.now();

  try {
    const result = await analyzeClaim(REALISTIC_SAMPLE_CLAIM);
    const durationMs = Date.now() - startTime;

    console.log('\n--- Model Verification Findings ---');
    console.log(`Verdict:          ${result.verdict} (${result.verdictLabel})`);
    console.log(`Credibility:      ${result.credibilityScore}/100`);
    console.log(`Model Used:       ${result.modelUsed}`);
    console.log(`Response Time:    ${durationMs}ms`);
    console.log(`Summary:          ${result.summary}`);
    console.log(`Category Reason:  ${result.categoryExplanation}`);
    console.log(`Extracted Claims: ${result.claimsExtracted.join(' | ')}`);
    console.log(`Factual Reality:  ${result.factualReality}`);
    console.log(`Red Flags Found:  ${result.redFlags.join(', ')}`);
    console.log(`Easy Reply:       "${result.easyReply}"`);
    console.log('-----------------------------------\n');

    // Validation checks
    const isValidVerdict = [
      'Misinformation',
      'Disinformation',
      'Malinformation',
      'Verified True',
      'Unverified / Needs Context',
    ].includes(result.verdict);

    const hasSummary = Boolean(result.summary && result.summary.length > 10);
    const hasFindings = Array.isArray(result.detailedFindings) && result.detailedFindings.length > 0;

    if (isValidVerdict && hasSummary && hasFindings) {
      console.log('SMOKE TEST VERIFICATION CHECKS:');
      console.log('  [x] Provider connection active');
      console.log('  [x] Claim parsed and evaluated by Gemma 4');
      console.log('  [x] Structured findings & verdict returned');
      console.log('\nRESULT: PASS');
      process.exit(0);
    } else {
      console.error('\nFAIL: Model returned incomplete data structure.');
      process.exit(1);
    }
  } catch (error: any) {
    console.error(`\nSmoke test error encountered: ${error.message}`);
    console.error('\nRESULT: FAIL');
    process.exit(1);
  }
}

runSmokeTest();
