/**
 * DebunkAI - Viral Misinformation & Election Integrity Fact-Checking.
 * Specialized for the Nigerian 2027 Elections with Audio & Video Forensic Features.
 * Works as a Web Fact-Checker and an interactive WhatsApp / Facebook Messenger Chatbot.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Sparkles,
  Cpu,
  Info,
  Send,
  History,
  Trash2,
  RefreshCw,
  Terminal,
  MessageSquare,
  Globe,
  Settings,
  Mic,
  MicOff,
  Video,
  FileAudio,
  Play,
  Pause,
  Upload,
  Volume2,
  Eye,
  Share2,
  Zap,
  ChevronDown,
  ChevronUp,
  Radio,
  Vote,
  Flag,
  FileText,
  Phone,
  MoreVertical,
  Network,
  Users,
} from 'lucide-react';

interface FindingPoint {
  point: string;
  detail: string;
  status: 'debunked' | 'warning' | 'verified';
}

interface ElectionDepthAnalysis {
  inecProtocolCheck: string;
  peaceAndTensionImpact: string;
  provenanceAndContext: string;
  nigerianContextReply: string;
  officialFactCheckSources: string[];
}

interface CoordinatedCampaignAnalysis {
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

interface AudioForensics {
  voiceCloningRisk: 'High' | 'Medium' | 'Low' | 'Clean';
  acousticMarkers: string[];
  speakerContext: string;
}

interface VideoForensics {
  deepfakeRisk: 'High' | 'Medium' | 'Low' | 'Authentic';
  visualMarkers: string[];
  archivalFootageCheck: string;
}

interface MediaDetails {
  transcription?: string;
  audioForensics?: AudioForensics;
  videoForensics?: VideoForensics;
}

interface DebunkResult {
  verdict: 'Misinformation' | 'Disinformation' | 'Malinformation' | 'Verified True' | 'Unverified / Needs Context';
  verdictLabel: string;
  credibilityScore: number;
  summary: string;
  categoryExplanation: string;
  claimsExtracted: string[];
  factualReality: string;
  redFlags: string[];
  detailedFindings: FindingPoint[];
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

interface HistoryItem {
  id: string;
  snippet: string;
  result: DebunkResult;
  date: string;
}

interface ProviderConfig {
  provider: 'api' | 'local';
  geminiModel: string;
  ollamaEndpoint: string;
  ollamaModel: string;
  hasApiKey: boolean;
  metaVerifyToken?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  mediaType?: 'text' | 'audio' | 'video';
  mediaTitle?: string;
  audioDuration?: string;
  debunkResult?: DebunkResult;
  isForwarded?: boolean;
}

interface WebhookLogItem {
  id: string;
  timestamp: string;
  platform: 'whatsapp' | 'facebook' | 'simulated';
  direction: 'incoming' | 'outgoing';
  senderId: string;
  incomingText: string;
  mediaType?: 'text' | 'audio' | 'video';
  replyText?: string;
  verdict?: string;
  credibilityScore?: number;
  deliveryStatus: 'delivered' | 'simulated' | 'logged_only' | 'error';
  errorDetail?: string;
}

// Nigerian 2027 Election Sample Cases (Text, Audio, Video)
const NIGERIAN_ELECTION_SAMPLES = [
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'web' | 'setup'>('chatbot');

  // Chatbot State
  const [chatPlatform, setChatPlatform] = useState<'whatsapp' | 'facebook'>('whatsapp');
  const [chatInput, setChatInput] = useState('');
  const [chatMediaType, setChatMediaType] = useState<'text' | 'audio' | 'video'>('text');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: `👋 Welcome! I am DebunkAI, your election & fact-checking assistant powered by Gemma 4.\n\n🇳🇬 *Nigerian 2027 Elections High-Depth Mode is ACTIVE.*\n\nForward or upload any text post, viral WhatsApp voice note 🎙️, or video clip 🎬. I will cross-reference INEC protocols, check for deepfakes/recycled footage, assess peace impact, and give you a peaceful reply to share in your community groups!`,
      time: 'Just now',
    },
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Web Fact-Checker State
  const [webInputText, setWebInputText] = useState('');
  const [webMediaType, setWebMediaType] = useState<'text' | 'audio' | 'video'>('text');
  const [isWebLoading, setIsWebLoading] = useState(false);
  const [webLoadingStage, setWebLoadingStage] = useState('Consulting Gemma 4...');
  const [webErrorMsg, setWebErrorMsg] = useState<string | null>(null);
  const [webResult, setWebResult] = useState<DebunkResult | null>(null);
  const [activeMediaPreview, setActiveMediaPreview] = useState<{
    type: 'audio' | 'video';
    title: string;
    note: string;
    duration: string;
  } | null>(null);

  // Audio Recording in Web Fact-Checker
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  const [copiedReply, setCopiedReply] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Setup Tab State
  const [providerConfig, setProviderConfig] = useState<ProviderConfig | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogItem[]>([]);
  const [isPingingWebhook, setIsPingingWebhook] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [copiedWebhookUrl, setCopiedWebhookUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Smoke Test Modal
  const [showSmokeModal, setShowSmokeModal] = useState(false);
  const [smokeLoading, setSmokeLoading] = useState(false);
  const [smokeOutput, setSmokeOutput] = useState<any>(null);

  // Simulated Audio Playback ticker
  useEffect(() => {
    let interval: any;
    if (playingAudioId) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setPlayingAudioId(null);
            return 0;
          }
          return prev + 5;
        });
      }, 200);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [playingAudioId]);

  // Load provider info on mount
  useEffect(() => {
    fetch('/api/provider-info')
      .then((res) => res.json())
      .then((data) => setProviderConfig(data))
      .catch(() => {
        setProviderConfig({
          provider: 'api',
          geminiModel: 'gemma-4-26b-a4b-it',
          ollamaEndpoint: 'http://localhost:11434',
          ollamaModel: 'gemma4:e2b',
          hasApiKey: true,
          metaVerifyToken: 'debunk_bot_token',
        });
      });

    loadWebhookLogs();

    try {
      const saved = localStorage.getItem('debunkai_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'chatbot' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isBotTyping, activeTab]);

  const loadWebhookLogs = () => {
    fetch('/api/webhook/logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setWebhookLogs(data.logs);
      })
      .catch(() => {});
  };

  const saveToHistory = (claimText: string, debunkResult: DebunkResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      snippet: claimText.slice(0, 80) + (claimText.length > 80 ? '...' : ''),
      result: debunkResult,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [newItem, ...history.slice(0, 9)];
    setHistory(updated);
    try {
      localStorage.setItem('debunkai_history', JSON.stringify(updated));
    } catch (e) {}
  };

  // Chatbot Send Handler (Text / Voice Note / Video)
  const handleSendChatMessage = async (
    textToSend?: string,
    forcedMediaType?: 'text' | 'audio' | 'video',
    mediaTitle?: string,
    audioDuration?: string
  ) => {
    const msg = (textToSend || chatInput).trim();
    if (!msg) return;

    const media = forcedMediaType || chatMediaType;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: msg,
      mediaType: media,
      mediaTitle: mediaTitle || (media === 'audio' ? 'Forwarded Voice Note' : media === 'video' ? 'Forwarded Video Clip' : undefined),
      audioDuration: audioDuration || (media === 'audio' ? '0:42' : undefined),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isForwarded: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatMediaType('text');
    setIsBotTyping(true);

    try {
      const res = await fetch('/api/chat/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          platform: chatPlatform,
          mediaType: media,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get bot reply');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        debunkResult: data.debunkResult,
      };

      setMessages((prev) => [...prev, botMsg]);
      loadWebhookLogs();
    } catch (err: any) {
      const errorBotMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        sender: 'bot',
        text: `⚠️ Verification check failed: ${err.message}. Please verify your connection or AI provider settings.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Web Analyze Handler
  const handleWebAnalyze = async (textToTest?: string, media?: 'text' | 'audio' | 'video') => {
    const text = (textToTest || webInputText).trim();
    if (!text) {
      setWebErrorMsg('Please enter text, voice note transcript, or select a video/audio sample.');
      return;
    }

    const currentMedia = media || webMediaType;
    setIsWebLoading(true);
    setWebErrorMsg(null);
    setWebResult(null);

    setWebLoadingStage(
      currentMedia === 'audio'
        ? 'Scanning voice patterns & INEC BVAS protocols...'
        : currentMedia === 'video'
        ? 'Checking archival election footage & deepfake markers...'
        : 'Auditing Nigerian 2027 election claims with Gemma 4...'
    );

    const timer1 = setTimeout(() => setWebLoadingStage('Cross-referencing official INEC regulations & Peace accords...'), 2000);
    const timer2 = setTimeout(() => setWebLoadingStage('Synthesizing peace-keeping guidance & community reply...'), 4500);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mediaType: currentMedia,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data: DebunkResult = await response.json();
      setWebResult(data);
      saveToHistory(text, data);
    } catch (err: any) {
      setWebErrorMsg(err.message || 'Failed to complete analysis.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsWebLoading(false);
    }
  };

  // Handle Recording simulation in Web tab
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      setWebInputText(
        'Voice note recording: "Good day, I have an urgent update from our party agents in Kaduna and Rivers. INEC has secretly disabled the BVAS uploading feature for the 2027 presidential polls."'
      );
      setWebMediaType('audio');
      setActiveMediaPreview({
        type: 'audio',
        title: 'Your Recorded Voice Note',
        note: 'Live microphone input captured. Acoustic spectral analysis and speech transcription ready.',
        duration: `0:${recordedDuration < 10 ? '0' : ''}${recordedDuration}`,
      });
      setRecordedDuration(0);
    } else {
      setIsRecording(true);
      setRecordedDuration(1);
      recordingTimerRef.current = setInterval(() => {
        setRecordedDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleTestWebhookPing = async (platform: 'whatsapp' | 'facebook') => {
    setIsPingingWebhook(true);
    setPingStatus(null);

    try {
      const res = await fetch('/api/webhook/test-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          text: NIGERIAN_ELECTION_SAMPLES[0].text,
          mediaType: 'audio',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPingStatus(`✅ Webhook test passed! Meta event parsed and Gemma 4 responded with Nigerian Election Audit.`);
        loadWebhookLogs();
      } else {
        setPingStatus(`❌ Webhook error: ${data.error || 'Failed'}`);
      }
    } catch (e: any) {
      setPingStatus(`❌ Webhook ping error: ${e.message}`);
    } finally {
      setIsPingingWebhook(false);
    }
  };

  const handleRunSmokeTest = async () => {
    setSmokeLoading(true);
    setSmokeOutput(null);
    setShowSmokeModal(true);

    try {
      const res = await fetch('/api/smoke-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setSmokeOutput(data);
    } catch (err: any) {
      setSmokeOutput({
        status: 'FAIL',
        error: err.message || 'Could not connect to test runner',
      });
    } finally {
      setSmokeLoading(false);
    }
  };

  const webhookPublicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhook`
    : 'https://your-app-url.run.app/api/webhook';

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookPublicUrl);
    setCopiedWebhookUrl(true);
    setTimeout(() => setCopiedWebhookUrl(false), 2000);
  };

  const copyVerifyToken = () => {
    navigator.clipboard.writeText(providerConfig?.metaVerifyToken || 'debunk_bot_token');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const getVerdictTheme = (verdict: string) => {
    switch (verdict) {
      case 'Disinformation':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          badge: 'bg-rose-600 text-white',
          barColor: 'bg-rose-500',
          icon: <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />,
        };
      case 'Misinformation':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          badge: 'bg-amber-500 text-slate-900 font-bold',
          barColor: 'bg-amber-500',
          icon: <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />,
        };
      case 'Malinformation':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-900',
          badge: 'bg-purple-600 text-white',
          barColor: 'bg-purple-600',
          icon: <ShieldAlert className="w-6 h-6 text-purple-600 flex-shrink-0" />,
        };
      case 'Verified True':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          barColor: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />,
        };
      default:
        return {
          bg: 'bg-slate-100 border-slate-300 text-slate-900',
          badge: 'bg-slate-700 text-white',
          barColor: 'bg-slate-500',
          icon: <Info className="w-6 h-6 text-slate-600 flex-shrink-0" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 font-bold">
              🇳🇬
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">DebunkAI</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Nigeria 2027 Election Special
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  <span>Verify before you share</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Audio, Video & WhatsApp Fact-Checker powered by Gemma 4
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'chatbot'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp / FB Chatbot</span>
            </button>

            <button
              onClick={() => setActiveTab('web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'web'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Fact-Checker</span>
            </button>

            <button
              onClick={() => setActiveTab('setup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'setup'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Meta Setup</span>
            </button>
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunSmokeTest}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition"
              title="Run smoke test on active AI provider"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Smoke Test</span>
            </button>
          </div>
        </div>
      </header>

      {/* Special Election Alert Header Ribbon */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 py-2 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4 text-emerald-300" />
            <span className="font-bold">Nigerian 2027 General Elections Protection Engine:</span>
            <span className="text-emerald-100 hidden sm:inline">
              High in-depth audit enabled for INEC regulations, BVAS/IReV rumors, fake result sheets, and WhatsApp voice notes.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-[10px] font-mono border border-emerald-500/40">
              Audio 🎙️ & Video 🎬 Forensics Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {/* ============================================================== */}
        {/* TAB 1: CHATBOT SIMULATOR (WITH AUDIO & VIDEO CHAT BUBBLES)    */}
        {/* ============================================================== */}
        {activeTab === 'chatbot' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Nigerian 2027 Election Media Quick Scenarios */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Vote className="w-3.5 h-3.5" />
                    Nigerian 2027 Election Hub
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Deep Audit Active
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                  Fact-Check Voice Notes, Videos & Rumors
                </h2>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  During elections, misinformation spreads most through forwarded WhatsApp voice notes and old recycled riots. Test how your bot verifies both in seconds!
                </p>

                {/* Platform Toggle */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setChatPlatform('whatsapp')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        chatPlatform === 'whatsapp'
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>WhatsApp Bot</span>
                    </button>

                    <button
                      onClick={() => setChatPlatform('facebook')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        chatPlatform === 'facebook'
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>Messenger Bot</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 1-Click Nigerian Election Scenarios */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Forward 2027 Election Media to Bot</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">1-click test</span>
                </div>

                <div className="space-y-2">
                  {NIGERIAN_ELECTION_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() =>
                        handleSendChatMessage(
                          sample.text,
                          sample.type,
                          sample.title,
                          sample.duration !== 'Text' ? sample.duration : undefined
                        )
                      }
                      className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 flex items-center gap-1.5">
                          <span>{sample.title}</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            sample.badge === 'Verified True'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {sample.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        "{sample.text}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nigerian Fact-Checking Standards Card */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>High In-Depth Analysis Standards</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-emerald-900 leading-relaxed">
                  <li>• <strong>INEC Statutory Checks:</strong> Confirms BVAS accreditation & IReV upload rules.</li>
                  <li>• <strong>Peace & Security Impact:</strong> Identifies potential incitement of electoral violence.</li>
                  <li>• <strong>Audio/Video Forensics:</strong> Flags synthetic voices and recycled past-election videos.</li>
                  <li>• <strong>Community De-escalation:</strong> Ready-to-copy peace message for Nigerian WhatsApp groups.</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Realistic Phone Mockup with Audio/Video Bubbles */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[700px]">
                {/* Speaker Notch */}
                <div className="bg-slate-800 py-1 flex justify-center items-center">
                  <div className="w-16 h-1 rounded-full bg-slate-600" />
                </div>

                {/* Chat App Header */}
                <div
                  className={`px-4 py-3 text-white flex items-center justify-between transition-colors ${
                    chatPlatform === 'whatsapp' ? 'bg-[#075E54]' : 'bg-[#0084FF]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shadow-xs border border-white/30">
                      🇳🇬
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <span>DebunkAI Nigeria 2027</span>
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">BOT</span>
                      </div>
                      <div className="text-[11px] text-white/80 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Online • Electoral & Media Forensics</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-white/90">
                    <Phone className="w-4 h-4 cursor-pointer hover:opacity-80" />
                    <Video className="w-4 h-4 cursor-pointer hover:opacity-80" />
                    <MoreVertical className="w-4 h-4 cursor-pointer hover:opacity-80" />
                  </div>
                </div>

                {/* Messages Body */}
                <div
                  ref={chatScrollRef}
                  className={`flex-1 p-3 overflow-y-auto space-y-3 ${
                    chatPlatform === 'whatsapp'
                      ? 'bg-[#EFEAE2] bg-opacity-95'
                      : 'bg-slate-50'
                  }`}
                  style={{
                    backgroundImage:
                      chatPlatform === 'whatsapp'
                        ? 'radial-gradient(#d1d7db 1px, transparent 1px)'
                        : 'none',
                    backgroundSize: '16px 16px',
                  }}
                >
                  {/* Notice Pill */}
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-lg bg-black/10 text-slate-800 text-[10px] font-medium text-center max-w-[90%] backdrop-blur-xs flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-amber-900 bg-amber-200/90 px-1.5 py-0.2 rounded border border-amber-300">
                        🛡️ Verify before you share
                      </span>
                      <span className="text-slate-600">Cross-referenced with INEC & Peace Accords.</span>
                    </span>
                  </div>

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl p-3 shadow-xs text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? chatPlatform === 'whatsapp'
                              ? 'bg-[#D9FDD3] text-slate-900 rounded-tr-xs border border-[#C0EBA6]'
                              : 'bg-[#0084FF] text-white rounded-tr-xs'
                            : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/80'
                        }`}
                      >
                        {/* Forwarded Header */}
                        {msg.isForwarded && (
                          <div
                            className={`flex items-center gap-1 text-[10px] mb-1.5 italic font-medium ${
                              msg.sender === 'user' && chatPlatform === 'facebook'
                                ? 'text-white/80'
                                : 'text-slate-500'
                            }`}
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Forwarded Many Times</span>
                          </div>
                        )}

                        {/* Audio Voice Note Bubble Display */}
                        {msg.mediaType === 'audio' && (
                          <div className="mb-2 p-2 rounded-xl bg-black/5 border border-black/10 flex items-center gap-3">
                            <button
                              onClick={() => {
                                if (playingAudioId === msg.id) {
                                  setPlayingAudioId(null);
                                } else {
                                  setPlayingAudioId(msg.id);
                                }
                              }}
                              className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0 hover:bg-emerald-700 transition"
                            >
                              {playingAudioId === msg.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4 ml-0.5" />
                              )}
                            </button>

                            <div className="flex-1">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1">
                                <span className="flex items-center gap-1">
                                  <Mic className="w-3 h-3 text-emerald-600" />
                                  <span>{msg.mediaTitle || 'Voice Note'}</span>
                                </span>
                                <span>{msg.audioDuration || '0:42'}</span>
                              </div>
                              {/* Audio Waveform visualization */}
                              <div className="flex items-center gap-0.5 h-3">
                                {[30, 70, 45, 90, 60, 40, 85, 50, 75, 95, 40, 65, 80, 50, 30].map(
                                  (h, idx) => {
                                    const isPlayed = (idx / 15) * 100 <= (playingAudioId === msg.id ? audioProgress : 0);
                                    return (
                                      <div
                                        key={idx}
                                        className={`w-1 rounded-full transition-colors ${
                                          isPlayed ? 'bg-emerald-600' : 'bg-slate-300'
                                        }`}
                                        style={{ height: `${h}%` }}
                                      />
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Video Clip Bubble Display */}
                        {msg.mediaType === 'video' && (
                          <div className="mb-2 rounded-xl overflow-hidden border border-black/10 bg-slate-900 text-white relative">
                            <div className="h-28 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-3 text-center relative">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-1 text-white shadow-md">
                                <Play className="w-5 h-5 ml-0.5" />
                              </div>
                              <span className="text-[11px] font-bold truncate max-w-[90%]">
                                {msg.mediaTitle || 'Viral Video Clip'}
                              </span>
                              <span className="text-[9px] text-slate-300">
                                Visual Forensics Inspection Ready
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Message Text */}
                        <div className="whitespace-pre-wrap font-sans text-[12px]">
                          {msg.text}
                        </div>

                        {/* Interactive Debunk Badge if present on bot msg */}
                        {msg.debunkResult && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <div className="flex items-center gap-1 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    msg.debunkResult.verdict === 'Verified True'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : msg.debunkResult.verdict === 'Disinformation'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {msg.debunkResult.verdict} ({msg.debunkResult.credibilityScore}%)
                                </span>
                                {msg.debunkResult.coordinatedCampaignAnalysis?.isCoordinatedPattern && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                                    🤖 Coordinated Campaign
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => {
                                  const textToCopy =
                                    msg.debunkResult?.electionDepthAnalysis?.nigerianContextReply ||
                                    msg.debunkResult!.easyReply;
                                  navigator.clipboard.writeText(textToCopy);
                                  alert('Copied community reply to clipboard!');
                                }}
                                className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Reply</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div
                          className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                            msg.sender === 'user' && chatPlatform === 'facebook'
                              ? 'text-white/70'
                              : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.time}</span>
                          {msg.sender === 'user' && (
                            <span className="text-blue-500 font-bold">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isBotTyping && (
                    <div className="flex items-start">
                      <div className="bg-white rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-xs border border-slate-200 flex items-center gap-2">
                        <span className="text-[11px] text-slate-600 font-semibold">
                          Gemma 4 is checking INEC records & media forensics...
                        </span>
                        <div className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Media Selector Bar */}
                <div className="px-3 py-1.5 bg-slate-200/80 border-t border-slate-300 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-semibold">Modality:</span>
                    <button
                      onClick={() => setChatMediaType('text')}
                      className={`px-2 py-0.5 rounded font-bold transition ${
                        chatMediaType === 'text'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📝 Text
                    </button>
                    <button
                      onClick={() => setChatMediaType('audio')}
                      className={`px-2 py-0.5 rounded font-bold transition ${
                        chatMediaType === 'audio'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🎙️ Voice Note
                    </button>
                    <button
                      onClick={() => setChatMediaType('video')}
                      className={`px-2 py-0.5 rounded font-bold transition ${
                        chatMediaType === 'video'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🎬 Video
                    </button>
                  </div>
                </div>

                {/* Chat Input Bar */}
                <div className="p-2.5 bg-slate-100 border-t border-slate-200">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChatMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={
                        chatMediaType === 'audio'
                          ? 'Paste audio transcript or voice note summary...'
                          : chatMediaType === 'video'
                          ? 'Paste viral video claim, TikTok or tweet caption...'
                          : 'Paste WhatsApp forwarded message or rumor...'
                      }
                      disabled={isBotTyping}
                      className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                    />

                    <button
                      type="submit"
                      disabled={isBotTyping || !chatInput.trim()}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xs transition ${
                        isBotTyping || !chatInput.trim()
                          ? 'bg-slate-300 cursor-not-allowed'
                          : chatPlatform === 'whatsapp'
                          ? 'bg-[#00A884] hover:bg-[#075E54]'
                          : 'bg-[#0084FF] hover:bg-blue-600'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WEB FACT-CHECKER (AUDIO RECORDER & VIDEO PLAYER)       */}
        {/* ============================================================== */}
        {activeTab === 'web' && (
          <div className="space-y-6">
            {/* Input Form Card with Media Mode Switcher */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Vote className="w-5 h-5 text-emerald-600" />
                      <span>Nigerian 2027 Election & Viral Claims Analyzer</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-2xs">
                      <ShieldCheck className="w-3 h-3 text-amber-700" />
                      Verify before you share
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Audit text, voice notes, or video clips with Gemma 4
                  </p>
                </div>

                {/* Modality Selector Tabs */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    onClick={() => {
                      setWebMediaType('text');
                      setActiveMediaPreview(null);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                      webMediaType === 'text'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Text Claim</span>
                  </button>

                  <button
                    onClick={() => setWebMediaType('audio')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                      webMediaType === 'audio'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Note (Audio)</span>
                  </button>

                  <button
                    onClick={() => setWebMediaType('video')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                      webMediaType === 'video'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Clip</span>
                  </button>
                </div>
              </div>

              {/* Audio Mode Recording / Upload Box */}
              {webMediaType === 'audio' && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <FileAudio className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950">
                          WhatsApp Audio / Voice Note Forensics
                        </h4>
                        <p className="text-[11px] text-emerald-800">
                          Record a voice note directly or test synthetic voice cloning detection
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleRecording}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                          isRecording
                            ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        <span>
                          {isRecording ? `Recording (${recordedDuration}s)... Stop` : 'Record Voice Note'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {activeMediaPreview?.type === 'audio' && (
                    <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">{activeMediaPreview.title}</span>
                        <span className="text-[11px] text-emerald-700">({activeMediaPreview.duration})</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 italic">
                        {activeMediaPreview.note}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Video Mode Upload / Inspection Box */}
              {webMediaType === 'video' && (
                <div className="mb-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-blue-950">
                          Viral Video Clip & Deepfake Forensics
                        </h4>
                        <p className="text-[11px] text-blue-800">
                          Detect recycled past-election footage, altered lower-thirds, or AI lip-syncing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition">
                        <Upload className="w-4 h-4" />
                        <span>Upload Clip</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setWebInputText(
                                `Uploaded video clip (${file.name}): Video circulating on social media showing ballot paper handling.`
                              );
                              setActiveMediaPreview({
                                type: 'video',
                                title: file.name,
                                note: 'Video frames buffered. Visual facial landmarks and lower-third banners ready for inspection.',
                                duration: '0:35',
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {activeMediaPreview?.type === 'video' && (
                    <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between gap-3 text-xs text-blue-900">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="font-bold">{activeMediaPreview.title}</span>
                      </div>
                      <span className="text-[11px] text-blue-700 italic">
                        {activeMediaPreview.note}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Text Input Area */}
              <div className="mb-2">
                <textarea
                  rows={4}
                  value={webInputText}
                  onChange={(e) => setWebInputText(e.target.value)}
                  placeholder={
                    webMediaType === 'audio'
                      ? 'Transcript of the voice note or summary of what is spoken...'
                      : webMediaType === 'video'
                      ? 'Caption or description of the video clip (or pick a sample below)...'
                      : 'Paste forwarded message, tweet, or rumor about the 2027 elections or general claims...'
                  }
                  className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm leading-relaxed placeholder:text-slate-400 transition"
                />
              </div>

              {/* Quick 1-Click Nigerian Election Samples */}
              <div className="mt-3">
                <span className="text-xs font-bold text-slate-600 block mb-1.5 flex items-center gap-1.5">
                  <Vote className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test with realistic Nigerian 2027 election scenarios:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {NIGERIAN_ELECTION_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        setWebInputText(sample.text);
                        setWebMediaType(sample.type);
                        setActiveMediaPreview(
                          sample.type !== 'text'
                            ? {
                                type: sample.type,
                                title: sample.title,
                                note:
                                  sample.type === 'audio'
                                    ? (sample as any).audioNote
                                    : (sample as any).videoNote,
                                duration: sample.duration,
                              }
                            : null
                        );
                        handleWebAnalyze(sample.text, sample.type);
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800 text-slate-700 font-medium transition text-left"
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>
              </div>

              {webErrorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{webErrorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {webInputText.length > 0 ? `${webInputText.length} characters` : 'No text entered'}
                </div>

                <div className="flex items-center gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Recent ({history.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleWebAnalyze()}
                    disabled={isWebLoading || !webInputText.trim()}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 text-white shadow-sm transition ${
                      isWebLoading || !webInputText.trim()
                        ? 'bg-emerald-300 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 cursor-pointer active:scale-98'
                    }`}
                  >
                    {isWebLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{webLoadingStage}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Run Gemma 4 High-Depth Audit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* In-depth Result Display */}
            {webResult && (
              <div className="space-y-6">
                {/* Verdict Card */}
                {(() => {
                  const theme = getVerdictTheme(webResult.verdict);
                  return (
                    <div className={`rounded-2xl border p-6 shadow-sm ${theme.bg}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/10">
                        <div className="flex items-center gap-3">
                          {theme.icon}
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              {webResult.isNigerianElection && (
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-white text-[11px] font-bold">
                                  🇳🇬 2027 Election Audit
                                </span>
                              )}
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
                                {webResult.verdict}
                              </span>
                              <span className="font-bold text-base text-slate-800">
                                {webResult.verdictLabel}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                              Audited with {webResult.modelUsed} via {webResult.providerUsed.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* Credibility Gauge */}
                        <div className="bg-white/80 backdrop-blur-xs border border-black/10 rounded-xl p-3 min-w-[180px]">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-600">Credibility Score</span>
                            <span className="text-slate-900 font-extrabold">{webResult.credibilityScore}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${theme.barColor}`}
                              style={{ width: `${Math.max(webResult.credibilityScore, 4)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="mt-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Verdict in Plain Words
                        </h4>
                        <p className="mt-1 text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                          {webResult.summary}
                        </p>
                      </div>

                      <div className="mt-3 p-3 rounded-xl bg-white/60 border border-black/5 text-xs text-slate-700">
                        <strong>Categorization Reason: </strong>
                        <span>{webResult.categoryExplanation}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Media Forensics Card (If Audio or Video) */}
                {webResult.mediaDetails && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      {webResult.mediaType === 'audio' ? (
                        <Mic className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Video className="w-5 h-5 text-blue-600" />
                      )}
                      <h3 className="font-bold text-slate-900 text-sm">
                        {webResult.mediaType === 'audio'
                          ? 'Audio Voice Note Forensic Inspection'
                          : 'Video Clip & Deepfake Forensic Inspection'}
                      </h3>
                    </div>

                    {webResult.mediaDetails.audioForensics && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Voice Cloning / Deepfake Risk
                          </span>
                          <span className="font-extrabold text-sm text-rose-600">
                            {webResult.mediaDetails.audioForensics.voiceCloningRisk} Risk
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Acoustic Markers
                          </span>
                          <span className="text-xs text-slate-700">
                            {webResult.mediaDetails.audioForensics.acousticMarkers.join(', ')}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Speaker Context
                          </span>
                          <span className="text-xs text-slate-700">
                            {webResult.mediaDetails.audioForensics.speakerContext}
                          </span>
                        </div>
                      </div>
                    )}

                    {webResult.mediaDetails.videoForensics && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Visual Manipulation Risk
                          </span>
                          <span className="font-extrabold text-sm text-rose-600">
                            {webResult.mediaDetails.videoForensics.deepfakeRisk} Risk
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Visual Artifacts
                          </span>
                          <span className="text-xs text-slate-700">
                            {webResult.mediaDetails.videoForensics.visualMarkers.join(', ')}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Archival Footage Match
                          </span>
                          <span className="text-xs text-slate-700">
                            {webResult.mediaDetails.videoForensics.archivalFootageCheck}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Nigerian Election High-Depth Findings (If Election Post) */}
                {webResult.isNigerianElection && webResult.electionDepthAnalysis && (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                      <Flag className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-bold text-emerald-950 text-sm">
                        Electoral Authority Verification (INEC & Electoral Act 2022/2026)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Statutory protocol */}
                      <div className="p-4 bg-white rounded-xl border border-emerald-100 space-y-1">
                        <span className="text-xs font-bold text-emerald-900 block">
                          🏛️ Statutory INEC Protocol
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {webResult.electionDepthAnalysis.inecProtocolCheck}
                        </p>
                      </div>

                      {/* Peace & Security Impact */}
                      <div className="p-4 bg-white rounded-xl border border-emerald-100 space-y-1">
                        <span className="text-xs font-bold text-emerald-900 block">
                          🕊️ Peace & Security Impact Assessment
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {webResult.electionDepthAnalysis.peaceAndTensionImpact}
                        </p>
                      </div>
                    </div>

                    {/* Official fact check coalition sources */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-600 font-semibold">Recommended Sources:</span>
                      {webResult.electionDepthAnalysis.officialFactCheckSources?.map((src, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-white border border-emerald-200 text-emerald-800 font-medium"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coordinated Campaign & Bot Network Analysis (CIB) */}
                {webResult.coordinatedCampaignAnalysis && (
                  <div className={`rounded-2xl p-5 shadow-xs border space-y-4 ${
                    webResult.coordinatedCampaignAnalysis.isCoordinatedPattern
                      ? 'bg-purple-50/80 border-purple-200 text-purple-950'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/10">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-700" />
                        <div>
                          <h3 className="font-bold text-sm text-purple-950">
                            Coordinated Misinformation & Bot Network Audit (CIB)
                          </h3>
                          <p className="text-[11px] text-purple-800">
                            Detects troll farms, copy-paste copypasta networks, and artificial broadcast amplification
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          webResult.coordinatedCampaignAnalysis.coordinationRisk === 'High'
                            ? 'bg-rose-600 text-white'
                            : webResult.coordinatedCampaignAnalysis.coordinationRisk === 'Medium'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {webResult.coordinatedCampaignAnalysis.coordinationRisk} Coordination Risk
                        </span>
                        <span className="text-xs font-mono font-semibold bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-900">
                          {webResult.coordinatedCampaignAnalysis.campaignType}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-white rounded-xl border border-purple-100 space-y-2">
                        <span className="text-xs font-bold text-purple-950 block flex items-center gap-1.5">
                          <Network className="w-3.5 h-3.5 text-purple-600" />
                          Detected Inauthentic Signatures
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {webResult.coordinatedCampaignAnalysis.coordinationSignatures.map((sig, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-purple-600 font-bold">•</span>
                              <span>{sig}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-purple-100 space-y-2">
                        <span className="text-xs font-bold text-purple-950 block">
                          Troll Farm / Dispersion Tactics
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {webResult.coordinatedCampaignAnalysis.trollFarmTactics}
                        </p>
                        <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                          <strong>Propagation Path: </strong>
                          <span>{webResult.coordinatedCampaignAnalysis.networkDispersionPattern}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-purple-950">How to Break the Coordinated Chain: </strong>
                        <span className="text-slate-700">{webResult.coordinatedCampaignAnalysis.recommendedCounterMeasure}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Claims vs Reality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">1. What This Post Claims</h3>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {webResult.claimsExtracted.map((claim, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{claim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">2. The Verified Reality</h3>
                    <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-950 leading-relaxed">
                      {webResult.factualReality}
                    </div>
                  </div>
                </div>

                {/* Red Flags */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Red Flags Detected by Gemma 4</h3>
                  <div className="flex flex-wrap gap-2">
                    {webResult.redFlags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 text-xs font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Community De-escalation Reply */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950">
                        {webResult.isNigerianElection
                          ? 'Peaceful Nigerian Community Reply (Copy & Share)'
                          : 'How to Reply Politely in Chats'}
                      </h3>
                      <p className="text-[11px] text-emerald-800">
                        Send this to your WhatsApp family or community group to prevent panic without fighting
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const textToCopy =
                          webResult.electionDepthAnalysis?.nigerianContextReply ||
                          webResult.easyReply;
                        navigator.clipboard.writeText(textToCopy);
                        setCopiedReply(true);
                        setTimeout(() => setCopiedReply(false), 2000);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                    >
                      {copiedReply ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedReply ? 'Copied!' : 'Copy Reply'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-white border border-emerald-100 rounded-xl text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                    "{webResult.electionDepthAnalysis?.nigerianContextReply || webResult.easyReply}"
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: META SETUP & WEBHOOK INSPECTOR                         */}
        {/* ============================================================== */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Connect to Live WhatsApp & Facebook Messenger
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your Webhook endpoint processes text, voice notes, and video payloads
                  </p>
                </div>
              </div>

              {/* Webhook Connection Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meta Webhook Callback URL:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={webhookPublicUrl}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800 select-all"
                    />
                    <button
                      onClick={copyWebhookUrl}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    >
                      {copiedWebhookUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWebhookUrl ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verify Token (Secret Password):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={providerConfig?.metaVerifyToken || 'debunk_bot_token'}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800 select-all"
                    />
                    <button
                      onClick={copyVerifyToken}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Webhook Ping Tester */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Test simulated incoming Nigerian 2027 election audio voice notes through the live webhook:
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestWebhookPing('whatsapp')}
                    disabled={isPingingWebhook}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Ping WhatsApp Audio Webhook</span>
                  </button>

                  <button
                    onClick={() => handleTestWebhookPing('facebook')}
                    disabled={isPingingWebhook}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Ping Messenger Webhook</span>
                  </button>
                </div>
              </div>

              {pingStatus && (
                <div className="mt-3 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800">
                  {pingStatus}
                </div>
              )}
            </div>

            {/* Webhook Activity Logs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Live Webhook Activity Inspector
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    ({webhookLogs.length} events logged)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadWebhookLogs}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                    title="Refresh logs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={async () => {
                      await fetch('/api/webhook/clear-logs', { method: 'POST' });
                      setWebhookLogs([]);
                    }}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {webhookLogs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No webhook events received yet. Click "Ping WhatsApp Audio Webhook" above or send messages in the Chatbot Simulator to see live logs!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {webhookLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.platform === 'whatsapp'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {log.platform}
                          </span>
                          {log.mediaType && log.mediaType !== 'text' && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                              {log.mediaType === 'audio' ? '🎙️ Audio' : '🎬 Video'}
                            </span>
                          )}
                          <span className="text-slate-500 font-mono text-[11px]">
                            Sender: {log.senderId}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                        <span className="font-bold text-[11px] text-slate-500 block mb-0.5">Incoming Payload:</span>
                        <p className="line-clamp-2">{log.incomingText}</p>
                      </div>

                      {log.replyText && (
                        <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-emerald-950 font-mono text-[11px] whitespace-pre-wrap">
                          <span className="font-bold text-[11px] text-emerald-700 block mb-0.5 font-sans">
                            Gemma 4 Response Sent:
                          </span>
                          {log.replyText.slice(0, 260)}...
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>
                          Verdict: <strong>{log.verdict || 'Processed'}</strong>
                        </span>
                        <span
                          className={`font-semibold ${
                            log.deliveryStatus === 'delivered'
                              ? 'text-emerald-600'
                              : log.deliveryStatus === 'simulated'
                              ? 'text-blue-600'
                              : 'text-slate-500'
                          }`}
                        >
                          Status: {log.deliveryStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Smoke Test Modal */}
      {showSmokeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="font-mono text-sm font-bold text-white">Gemma 4 Smoke Test Runner</h3>
              </div>
              <button
                onClick={() => setShowSmokeModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded bg-slate-800"
              >
                [Esc / Close]
              </button>
            </div>

            <div className="font-mono text-xs bg-black/60 p-4 rounded-xl border border-slate-800 space-y-3 max-h-[380px] overflow-y-auto">
              <div className="text-slate-400">
                &gt; Sending realistic viral claim through active provider...
              </div>

              {smokeLoading ? (
                <div className="flex items-center gap-2 text-amber-400 py-3">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing test on {providerConfig?.provider === 'local' ? 'Ollama' : 'Gemma 4 API'}...</span>
                </div>
              ) : smokeOutput ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Provider:</span>
                    <span className="text-white font-bold">{smokeOutput.config?.provider?.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Model:</span>
                    <span className="text-blue-300 font-bold">
                      {smokeOutput.config?.geminiModel || smokeOutput.config?.ollamaModel}
                    </span>
                  </div>
                  {smokeOutput.durationMs && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Response Latency:</span>
                      <span className="text-slate-200">{smokeOutput.durationMs}ms</span>
                    </div>
                  )}

                  {smokeOutput.result && (
                    <div className="mt-3 p-3 bg-slate-800/80 rounded border border-slate-700 space-y-1.5">
                      <div className="text-emerald-400 font-bold">Verdict: {smokeOutput.result.verdict}</div>
                      <div className="text-slate-300 text-[11px]">{smokeOutput.result.summary}</div>
                      <div className="text-slate-400 text-[10px]">Reply: "{smokeOutput.result.easyReply}"</div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800">
                    <span
                      className={`inline-block px-3 py-1 rounded font-bold ${
                        smokeOutput.status === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      STATUS: {smokeOutput.status}
                    </span>
                    {smokeOutput.error && (
                      <div className="text-rose-400 text-[11px] mt-2">{smokeOutput.error}</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleRunSmokeTest}
                disabled={smokeLoading}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold disabled:opacity-50"
              >
                Re-run Test
              </button>
              <button
                onClick={() => setShowSmokeModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 px-4">
        <p className="font-semibold text-slate-700 flex items-center justify-center gap-1.5 flex-wrap">
          <span>DebunkAI Nigeria 2027</span>
          <span>•</span>
          <span className="text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 font-extrabold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            Verify before you share
          </span>
          <span>•</span>
          <span>Powered by Gemma 4 with local Ollama fallback</span>
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Cross-referenced against INEC official guidelines, the Electoral Act, and independent fact-checking coalitions.
        </p>
      </footer>
    </div>
  );
}
