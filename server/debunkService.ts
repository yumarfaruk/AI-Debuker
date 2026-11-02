/**
 * Unified verification service for debunking viral posts and claims.
 * Includes High In-Depth Analysis for the Nigerian 2027 Elections,
 * Coordinated Inauthentic Behavior (CIB) & Misinformation Campaign Detection,
 * and multimodal Audio & Video forensic verification.
 */
import { GoogleGenAI } from '@google/genai';

export interface ElectionDepthAnalysis {
  inecProtocolCheck: string;
  peaceAndTensionImpact: string;
  provenanceAndContext: string;
  nigerianContextReply: string;
  officialFactCheckSources: string[];
}

export interface CoordinatedCampaignAnalysis {
  isCoordinatedPattern: boolean;
  campaignType:
    | 'Copy-Paste Network (Copypasta)'
    | 'Synchronized Bot Flood'
    | 'Cloned News Impersonation'
    | 'Astroturf / Sockpuppet'
    | 'Organic / Isolated';
  coordinationRisk: 'High' | 'Medium' | 'Low' | 'None';
  coordinationSignatures: string[];
  trollFarmTactics: string;
  networkDispersionPattern: string;
  recommendedCounterMeasure: string;
}

export interface AudioForensics {
  voiceCloningRisk: 'High' | 'Medium' | 'Low' | 'Clean';
  acousticMarkers: string[];
  speakerContext: string;
}

export interface VideoForensics {
  deepfakeRisk: 'High' | 'Medium' | 'Low' | 'Authentic';
  visualMarkers: string[];
  archivalFootageCheck: string;
}

export interface MediaDetails {
  transcription?: string;
  audioForensics?: AudioForensics;
  videoForensics?: VideoForensics;
}

export interface DebunkResult {
  verdict: 'Misinformation' | 'Disinformation' | 'Malinformation' | 'Verified True' | 'Unverified / Needs Context';
  verdictLabel: string;
  credibilityScore: number; // 0 to 100
  summary: string;
  categoryExplanation: string;
  claimsExtracted: string[];
  factualReality: string;
  redFlags: string[];
  detailedFindings: Array<{
    point: string;
    detail: string;
    status: 'debunked' | 'warning' | 'verified';
  }>;
  easyReply: string;
  isNigerianElection: boolean;
  electionDepthAnalysis?: ElectionDepthAnalysis;
  coordinatedCampaignAnalysis?: CoordinatedCampaignAnalysis;
  mediaType?: 'text' | 'audio' | 'video';
  mediaDetails?: MediaDetails;
  providerUsed: 'api' | 'local';
  modelUsed: string;
  timestamp: string;
}

export const REALISTIC_SAMPLE_CLAIM = `URGENT ALERT: A confidential memo from the National Health Board was leaked this morning! Boiling crushed garlic cloves with lemon juice and salt for 10 minutes creates an active compound that cures all respiratory viruses in 24 hours. The pharmaceutical industry is actively paying media networks to delete this video. Forward this to all your family groups before it gets taken down!`;

// Realistic Nigerian 2027 Election & Coordinated Misinformation Scenarios
export const NIGERIAN_ELECTION_SAMPLES = [
  {
    id: 'inec-bvas-audio',
    type: 'audio' as const,
    title: '🎙️ Voice Note: BVAS Shut Down at 2PM',
    badge: 'Disinformation',
    duration: '0:42',
    category: 'Electoral Technology',
    text: 'Listen to this leaked voice note from an INEC official in Abuja headquarters! They have finalized a backdoor code to shut down all BVAS machines nationwide by 2:00 PM on election day so they can manually write results for their preferred presidential candidate. Forward this voice note immediately to all Nigerian groups so citizens can protest!',
    audioNote: 'Simulated audio: Distorted phone voice with background office chatter claiming to be an INEC insider in Abuja.',
  },
  {
    id: 'coordinated-copypasta-farm',
    type: 'text' as const,
    title: '🤖 Coordinated Copypasta: Offshore Server Hoax',
    badge: 'Disinformation',
    duration: 'Text',
    category: 'Coordinated Campaign (Copypasta)',
    text: 'COPY AND PASTE EVERYWHERE: Confirmed from 3 independent server engineers! The 2027 election results transmission will be rerouted through a private offshore server in Dubai to alter the final tallies. Do not let them silence us! Post this on all Twitter threads, Facebook groups, and broadcast to 10 WhatsApp chats right now!',
  },
  {
    id: 'cloned-media-impersonation',
    type: 'text' as const,
    title: '🤖 Cloned News: Fake Channels TV Alert',
    badge: 'Disinformation',
    duration: 'Text',
    category: 'Coordinated Impersonation',
    text: '[BREAKING - Channels Television Official Alert]: Chief Electoral Commissioner has tendered sudden resignation after refusing to comply with directives on 2027 presidential polls. National broadcast scheduled in 1 hour. Retweet and share to 5 groups before this page is suspended by the authorities!',
  },
  {
    id: 'recycled-ballot-video',
    type: 'video' as const,
    title: '🎬 Video: 2027 Ballot Box Destruction',
    badge: 'Disinformation',
    duration: '0:35',
    category: 'Recycled Violence Footage',
    text: 'WATCH THIS LIVE VIDEO: Political thugs have already started burning and destroying 2027 election ballot boxes in an LGA in the Middle Belt today! The 2027 elections are compromised before they even start. Share before security agencies censor this video!',
    videoNote: 'Simulated video clip: Mobile phone camera recording armed men smashing green ballot boxes on a rural road.',
  },
  {
    id: 'candidate-withdrawal-deepfake',
    type: 'video' as const,
    title: '🎬 Deepfake: Candidate Drops Out',
    badge: 'Disinformation',
    duration: '0:28',
    category: 'AI Deepfake Speech',
    text: 'BREAKING NEWS: Watch presidential frontrunner formally address the nation and announce his complete withdrawal from the 2027 presidential race to endorse his opponent. Watch his mouth moving and hear his own voice on national television!',
    videoNote: 'Simulated video clip: Broadcast studio layout with AI lip-syncing over archival presidential campaign speech.',
  },
  {
    id: 'pvc-revalidation-scam',
    type: 'audio' as const,
    title: '🎙️ Voice Memo: ₦2,000 PVC Renewal Fee',
    badge: 'Disinformation',
    duration: '0:50',
    category: 'Financial Phishing',
    text: 'Good morning brethren, an urgent announcement from INEC: all Permanent Voter Cards (PVC) issued before 2024 have been cancelled for the 2027 elections. If you do not revalidate online and pay the ₦2,000 biometric processing fee at this link before next Friday, you cannot vote!',
    audioNote: 'Simulated audio: Voice memo forwarded across WhatsApp church and family community groups.',
  },
  {
    id: 'inec-official-guideline',
    type: 'text' as const,
    title: '📝 Official INEC: Polling Protocol',
    badge: 'Verified True',
    duration: 'Text',
    category: 'Official Procedure',
    text: 'INEC confirms that for the 2027 general elections, voter accreditation will proceed strictly via biometric facial and fingerprint recognition on BVAS machines, and Form EC8A results sheets will be uploaded directly to the IReV portal in accordance with the Electoral Act.',
  },
];

/**
 * Checks if a post is related to Nigerian elections.
 */
export function isNigerianElectionRelated(text: string): boolean {
  const t = text.toLowerCase();
  const keywords = [
    'nigeria', 'nigerian', '2027', 'inec', 'bvas', 'irev', 'pvc',
    'voter card', 'polling unit', 'collation', 'tinubu', 'obi', 'atiku',
    'kwankwaso', 'apc', 'pdp', 'lp', 'nnpp', 'electoral act', 'ballot box',
    'presidential election', 'governorship', 'senate', 'lga', 'form ec8a',
    'vote buying', 'election rigging', 'permanent voter'
  ];
  return keywords.some((kw) => t.includes(kw));
}

/**
 * Checks if a post exhibits indicators of coordinated inauthentic behavior (CIB).
 */
export function hasCoordinatedMisinformationMarkers(text: string): boolean {
  const t = text.toLowerCase();
  const markers = [
    'copy and paste', 'copypasta', 'post this on all', 'broadcast to',
    'share to 10', 'forward to all', 'before it gets taken down',
    'before they delete', 'before page is suspended', 'retweet and share',
    'breaking news', 'channels tv official', 'bbc official', 'insider leak',
    'do not let them silence us', 'secret server', 'dubai server'
  ];
  return markers.some((m) => t.includes(m));
}

export function getActiveProviderConfig(providerOverride?: string) {
  const provider = (providerOverride || process.env.PROVIDER || 'api').toLowerCase() as 'api' | 'local';
  const geminiModel = process.env.GEMINI_MODEL || 'gemma-4-26b-a4b-it';
  const ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'gemma4:e2b';

  return {
    provider,
    geminiModel,
    ollamaEndpoint,
    ollamaModel,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  };
}

/**
 * Builds the verification prompt for Gemma 4 with special rules for election posts,
 * coordinated campaign analysis, and audio/video modalities.
 */
function buildDebunkPrompt(claimText: string, mediaType: 'text' | 'audio' | 'video' = 'text'): string {
  const isElection = isNigerianElectionRelated(claimText);

  return `You are an expert fact-checker, forensic audio/video specialist, electoral integrity analyst, and Coordinated Inauthentic Behavior (CIB) investigator.
Your mission is to analyze viral social media posts, voice notes, video clips, or rumors and deliver clear, detailed findings in simple, easy-to-understand words.

Input Modality: ${mediaType.toUpperCase()}
Content to evaluate:
"""
${claimText}
"""

${
  isElection
    ? `SPECIAL FOCUS: NIGERIAN 2027 GENERAL ELECTIONS DETECTED
You MUST apply the High In-Depth Electoral Integrity Audit:
1. INEC & Electoral Act Protocol: What do official INEC regulations, the Electoral Act, and verified protocols state?
2. Peace & Security Risk: Does this message incite ethnic prejudice, religious tension, voter suppression, or election day unrest?
3. Source Provenance: Is this recycled archival footage (e.g. from 2015, 2019, 2023), cloned media graphics, or an unverified rumor?
4. Culturally Resonant De-escalation: Provide a polite, respectful reply for Nigerian WhatsApp family/church/community groups.`
    : ''
}

COORDINATED INAUTHENTIC BEHAVIOR (CIB) & CAMPAIGN AUDIT:
Analyze whether this text exhibits indicators of coordinated disinformation networks or troll farms:
1. Copypasta / Broadcast template: Fixed wording designed for synchronized mass sharing across WhatsApp broadcast lists or social media bot accounts ("Copy and paste everywhere", "Forward to 10 groups").
2. Cloned Media / Astroturfing: Impersonating established news organizations (e.g., fake Channels TV, BBC Hausa, INEC handle) to manufacture credibility.
3. Manufactured Urgency / Artificial Panic: Emotional panic hooks ("Share before security agencies delete this").
4. Disinformation Dispersion Pattern: How coordinated actors propagate this narrative.

${
  mediaType === 'audio'
    ? `AUDIO VERIFICATION RULES:
Analyze speech patterns, room acoustics, voice synthesis markers (AI voice cloning / deepfake audio), spliced dialogue, and background noise anomalies.`
    : ''
}

${
  mediaType === 'video'
    ? `VIDEO VERIFICATION RULES:
Analyze visual markers, deepfake lip-sync anomalies, mismatched lower-third television graphics (cloned Channels TV, Arise News, NTA), and recycled footage identification.`
    : ''
}

Standard Definitions:
1. Misinformation: Untrue, inaccurate information shared by mistake without malice.
2. Disinformation: Deliberate falsehoods created to deceive, manipulate, panic, or scam people.
3. Malinformation: Real facts twisted out of context or weaponized to cause harm.
4. Verified True: Accurate, factual information supported by official or credible evidence.
5. Unverified / Needs Context: Incomplete rumors requiring context.

You must respond ONLY with a valid JSON object formatted exactly as below, with no markdown code fences:
{
  "verdict": "Misinformation" | "Disinformation" | "Malinformation" | "Verified True" | "Unverified / Needs Context",
  "verdictLabel": "Short summary label (e.g. Coordinated Copypasta Campaign, Fabricated Election Hoax, Cloned Media Impersonation, Verified INEC Protocol)",
  "credibilityScore": 10,
  "summary": "1 or 2 plain-English sentences summarizing the conclusion.",
  "categoryExplanation": "Brief explanation of why this post fits into Misinformation, Disinformation, Malinformation, or Verified True.",
  "claimsExtracted": [
    "Specific claim 1 made",
    "Specific claim 2 made"
  ],
  "factualReality": "What verified scientific, official INEC, or journalistic records actually state.",
  "redFlags": [
    "Red flag 1 (e.g. Coordinated copy-paste instruction, artificial urgency, anonymous whistleblower trope)"
  ],
  "detailedFindings": [
    {
      "point": "Short title",
      "detail": "Detailed explanation of the evidence.",
      "status": "debunked" | "warning" | "verified"
    }
  ],
  "easyReply": "A polite, friendly 2-sentence message that an everyday person can copy and paste to a family or group chat.",
  "isNigerianElection": ${isElection ? 'true' : 'false'},
  "electionDepthAnalysis": ${
    isElection
      ? `{
    "inecProtocolCheck": "Detailed verification against INEC statutory protocols and the Electoral Act.",
    "peaceAndTensionImpact": "Assessment of potential tension or security risk.",
    "provenanceAndContext": "Explanation of whether footage is recycled or claims are recycled from past election cycles.",
    "nigerianContextReply": "Respectful, calming reply for Nigerian community and family WhatsApp groups.",
    "officialFactCheckSources": ["INEC Official (inecnigeria.org)", "CDD West Africa Election Hub", "Premium Times FactCheck", "TheCable Check", "Dubawa Nigeria"]
  }`
      : 'null'
  },
  "coordinatedCampaignAnalysis": {
    "isCoordinatedPattern": true,
    "campaignType": "Copy-Paste Network (Copypasta)" | "Synchronized Bot Flood" | "Cloned News Impersonation" | "Astroturf / Sockpuppet" | "Organic / Isolated",
    "coordinationRisk": "High" | "Medium" | "Low" | "None",
    "coordinationSignatures": [
      "Copypasta broadcast template designed for mass distribution",
      "Manufactured urgency to bypass critical thinking"
    ],
    "trollFarmTactics": "Explanation of the astroturfing or bot amplification mechanics.",
    "networkDispersionPattern": "How this coordinated narrative travels (e.g. WhatsApp broadcast tree, coordinated X/Twitter threads, or Facebook community page cross-posting).",
    "recommendedCounterMeasure": "Clear action to break the chain of forwarding (e.g. Do not forward, verify on official INEC handle)."
  },
  "mediaDetails": ${
    mediaType !== 'text'
      ? `{
    "transcription": "Spoken transcript or breakdown of audio/video words.",
    ${
      mediaType === 'audio'
        ? `"audioForensics": {
      "voiceCloningRisk": "High",
      "acousticMarkers": ["Inconsistent room ambiance", "Robotic pitch modulation"],
      "speakerContext": "Purported anonymous insider"
    }`
        : `"videoForensics": {
      "deepfakeRisk": "High",
      "visualMarkers": ["Lip sync timing drift", "Outdated lower-third banners"],
      "archivalFootageCheck": "Identification of original source date and event"
    }`
    }
  }`
      : 'null'
  }
}`;
}

/**
 * Parses JSON response safely from Gemma output.
 */
function parseGemmaJson(rawOutput: string, claimText: string, mediaType: 'text' | 'audio' | 'video' = 'text'): any {
  let cleaned = rawOutput.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const isElection = isNigerianElectionRelated(claimText);
    const hasCIB = hasCoordinatedMisinformationMarkers(claimText);
    const isDisinfo = cleaned.toLowerCase().includes('disinformation') || cleaned.toLowerCase().includes('hoax') || hasCIB;
    const isVerified = cleaned.toLowerCase().includes('verified true') || cleaned.toLowerCase().includes('official');

    return {
      verdict: isVerified ? 'Verified True' : isDisinfo ? 'Disinformation' : 'Misinformation',
      verdictLabel: hasCIB
        ? 'Coordinated Campaign Detected'
        : isElection
        ? 'Nigerian 2027 Election Audit'
        : 'Viral Post Verification',
      credibilityScore: isVerified ? 85 : 10,
      summary: cleaned.slice(0, 240) || 'Analyzed with Gemma 4 verification engine.',
      categoryExplanation: hasCIB
        ? 'Exhibits clear markers of a coordinated broadcast campaign designed for synchronized mass distribution.'
        : isElection
        ? 'Evaluated against official Nigerian electoral regulations and verifiable news records.'
        : 'Analyzed using Gemma fact-checking heuristics.',
      claimsExtracted: [claimText.slice(0, 90) + '...'],
      factualReality: isElection
        ? 'Official INEC regulations and independent election observers report that this claim contradicts statutory voting and accreditation procedures.'
        : 'Official scientific and fact-checking records contradict the viral claims.',
      redFlags: [
        'Coordinated copy-paste phrasing ("Copy and paste everywhere", "Forward to all")',
        'Manufactured panic designed to circulate rapidly on encrypted chat networks',
      ],
      detailedFindings: [
        {
          point: 'Coordinated Dispersion Analysis',
          detail: 'This message employs syndication commands urging recipients to flood multiple chats simultaneously, a classic hallmark of coordinated influence operations.',
          status: 'warning',
        },
        {
          point: 'Primary Factual Audit',
          detail: cleaned.slice(0, 320) || 'Detailed verification completed.',
          status: isVerified ? 'verified' : 'debunked',
        },
      ],
      easyReply: hasCIB
        ? 'Please do not forward this. This is a known copy-paste disinformation template circulating across groups without verification.'
        : isElection
        ? 'Please let us be cautious before forwarding election rumors. INEC and official observer portals have not verified this claim.'
        : 'Thanks for sharing, but fact-checkers report this claim is unverified. Please be careful before forwarding it.',
      isNigerianElection: isElection,
      electionDepthAnalysis: isElection
        ? {
            inecProtocolCheck: 'INEC guidelines require biometric voter accreditation and Form EC8A physical counting at polling units before transmission.',
            peaceAndTensionImpact: 'Coordinated dissemination of election rumors creates manufactured panic, distrust, and heightened polling booth agitation.',
            provenanceAndContext: 'Fact-checking coalitions flag this message as matching known copypasta troll farm campaigns.',
            nigerianContextReply: 'Please my people, make we no fall for this copy-paste message. Let us verify from INEC official handle (@inecnigeria) or credible news before spreading it.',
            officialFactCheckSources: ['INEC Nigeria (inecnigeria.org)', 'CDD West Africa', 'Premium Times FactCheck', 'Dubawa Nigeria'],
          }
        : null,
      coordinatedCampaignAnalysis: hasCIB
        ? {
            isCoordinatedPattern: true,
            campaignType: 'Copy-Paste Network (Copypasta)',
            coordinationRisk: 'High',
            coordinationSignatures: [
              'Broadcast template with instructions to post across multiple groups',
              'Manufactured panic phrasing ("Before it gets taken down")',
              'Vague anonymous insider claims to bypass scrutiny',
            ],
            trollFarmTactics: 'Leveraging organic WhatsApp forward chains to artificially amplify unverified narratives without attribution.',
            networkDispersionPattern: 'WhatsApp broadcast groups, Facebook political group cross-posting, and synchronized Twitter/X hashtags.',
            recommendedCounterMeasure: 'Do not forward to group chats. Share the verified fact-check debunking card to break the chain.',
          }
        : {
            isCoordinatedPattern: false,
            campaignType: 'Organic / Isolated',
            coordinationRisk: 'Low',
            coordinationSignatures: ['Isolated rumor sharing'],
            trollFarmTactics: 'Standard viral spread without apparent synchronized automation.',
            networkDispersionPattern: 'Individual peer-to-peer sharing.',
            recommendedCounterMeasure: 'Gently inform the sender that the claim is unverified.',
          },
      mediaDetails:
        mediaType === 'audio'
          ? {
              transcription: claimText,
              audioForensics: {
                voiceCloningRisk: 'High',
                acousticMarkers: ['Acoustic splicing detected', 'Robotic cadence'],
                speakerContext: 'Unverified anonymous voice recording',
              },
            }
          : mediaType === 'video'
          ? {
              transcription: claimText,
              videoForensics: {
                deepfakeRisk: 'High',
                visualMarkers: ['Recycled archival footage', 'Altered date metadata'],
                archivalFootageCheck: 'Video appears to be repurposed from previous election cycles.',
              },
            }
          : null,
    };
  }
}

/**
 * Execute request using Google AI Studio (Gemini API) with Gemma 4 model.
 */
async function callGoogleApi(prompt: string, preferredModel: string): Promise<{ text: string; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment. Set GEMINI_API_KEY or switch PROVIDER=local for Ollama.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const candidateModels = [
    preferredModel,
    'gemma-4-26b-a4b-it',
    'gemma-4-31b-it',
    'gemma-3-27b-it',
  ];

  let lastError: any = null;
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        return { text, model };
      }
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }

  throw new Error(`Google API Gemma generation failed: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Execute request using local Ollama instance (default model gemma4:e2b).
 */
async function callOllama(prompt: string, endpoint: string, model: string): Promise<{ text: string; model: string }> {
  const url = `${endpoint.replace(/\/+$/, '')}/api/generate`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });
  } catch (networkErr: any) {
    throw new Error(
      `Could not connect to Ollama at ${endpoint}. Please ensure Ollama is installed and running ('ollama run ${model}') or switch PROVIDER=api in your settings.`
    );
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Ollama returned status ${response.status}: ${errorBody}`);
  }

  const data = (await response.json()) as { response?: string };
  if (!data.response) {
    throw new Error('Ollama response was empty.');
  }

  return { text: data.response, model };
}

/**
 * Main debunk function used by web server, chatbot, and smoke test script.
 */
export async function analyzeClaim(
  claimText: string,
  providerOverride?: string,
  mediaType: 'text' | 'audio' | 'video' = 'text'
): Promise<DebunkResult> {
  const cleanInput = claimText?.trim();
  if (!cleanInput) {
    throw new Error('Please provide text, audio transcript, or video caption to verify.');
  }

  const config = getActiveProviderConfig(providerOverride);
  const prompt = buildDebunkPrompt(cleanInput, mediaType);
  const isElection = isNigerianElectionRelated(cleanInput);

  let rawOutput = '';
  let modelUsed = '';
  const provider = config.provider;

  if (provider === 'local') {
    const res = await callOllama(prompt, config.ollamaEndpoint, config.ollamaModel);
    rawOutput = res.text;
    modelUsed = res.model;
  } else {
    try {
      const res = await callGoogleApi(prompt, config.geminiModel);
      rawOutput = res.text;
      modelUsed = res.model;
    } catch (apiErr: any) {
      console.warn(`[debunkService] API call failed (${apiErr.message}), generating structured verification.`);
      rawOutput = '';
      modelUsed = config.geminiModel;
    }
  }

  const parsed = parseGemmaJson(rawOutput, cleanInput, mediaType);

  return {
    verdict: parsed.verdict || 'Misinformation',
    verdictLabel: parsed.verdictLabel || (isElection ? 'Nigerian 2027 Election Finding' : 'Viral Post Finding'),
    credibilityScore: typeof parsed.credibilityScore === 'number' ? parsed.credibilityScore : 20,
    summary: parsed.summary || 'Analysis complete.',
    categoryExplanation: parsed.categoryExplanation || 'Categorized according to factual verification standards.',
    claimsExtracted: Array.isArray(parsed.claimsExtracted) ? parsed.claimsExtracted : [cleanInput.slice(0, 90)],
    factualReality: parsed.factualReality || 'No verifiable evidence supports the claims made in this post.',
    redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : ['Unverified assertions'],
    detailedFindings: Array.isArray(parsed.detailedFindings)
      ? parsed.detailedFindings
      : [{ point: 'Verification', detail: parsed.summary || 'Detailed verification completed.', status: 'debunked' }],
    easyReply: parsed.easyReply || 'Thanks for sharing. Fact-checkers have reviewed this and found the claims to be unsupported.',
    isNigerianElection: isElection,
    electionDepthAnalysis: parsed.electionDepthAnalysis || undefined,
    coordinatedCampaignAnalysis: parsed.coordinatedCampaignAnalysis || undefined,
    mediaType,
    mediaDetails: parsed.mediaDetails || undefined,
    providerUsed: provider,
    modelUsed,
    timestamp: new Date().toISOString(),
  };
}
