/**
 * DebunkAI - Fact-check viral posts, rumors, and claims.
 * Powered by Gemma 4 and local Ollama fallback.
 */
import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FindingPoint {
  point: string;
  detail: string;
  status: 'debunked' | 'warning' | 'verified';
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
}

const SAMPLE_POSTS = [
  {
    title: 'Boiled Garlic Cure (Medical Hoax)',
    badge: 'Disinformation',
    text: 'URGENT ALERT: A confidential memo from the National Health Board was leaked this morning! Boiling crushed garlic cloves with lemon juice and salt for 10 minutes creates an active compound that cures all respiratory viruses in 24 hours. The pharmaceutical industry is actively paying media networks to delete this video. Forward this to all your family groups before it gets taken down!',
  },
  {
    title: 'Emergency Banking Freeze (Phishing Scam)',
    badge: 'Disinformation',
    text: 'ATTENTION ALL CITIZENS: Due to mandatory cyber system upgrades, all national bank accounts and mobile debit cards will be frozen tonight at midnight for 72 hours. To safeguard your remaining balance, transfer your money immediately to the emergency safety reserve at link: http://secure-reserve-check.info. Share immediately!',
  },
  {
    title: 'Out-of-Context Quote (Altered Context)',
    badge: 'Malinformation',
    text: 'Breaking: Watch this video where the Mayor explicitly admits: "We are shutting off city power to poor neighborhoods next month." They really said this on microphone yesterday!',
  },
  {
    title: 'NASA Exoplanet Discovery (Genuine News)',
    badge: 'Verified True',
    text: 'Astronomers using the James Webb Space Telescope have detected signs of water vapor and carbon-bearing molecules in the atmosphere of a habitable-zone exoplanet 120 light years away, according to a peer-reviewed paper in The Astrophysical Journal.',
  },
];

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Consulting Gemma 4...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<DebunkResult | null>(null);
  const [copiedReply, setCopiedReply] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [providerConfig, setProviderConfig] = useState<ProviderConfig | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  // Smoke test modal state
  const [showSmokeModal, setShowSmokeModal] = useState(false);
  const [smokeLoading, setSmokeLoading] = useState(false);
  const [smokeOutput, setSmokeOutput] = useState<any>(null);

  // Load provider info on mount
  useEffect(() => {
    fetch('/api/provider-info')
      .then((res) => res.json())
      .then((data) => setProviderConfig(data))
      .catch(() => {
        // Fallback default
        setProviderConfig({
          provider: 'api',
          geminiModel: 'gemma-4-26b-a4b-it',
          ollamaEndpoint: 'http://localhost:11434',
          ollamaModel: 'gemma4:e2b',
          hasApiKey: true,
        });
      });

    // Load history
    try {
      const saved = localStorage.getItem('debunkai_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

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
    } catch (e) {
      // Ignore
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('debunkai_history');
    } catch (e) {}
  };

  const handleAnalyze = async (textToTest?: string) => {
    const text = (textToTest || inputText).trim();
    if (!text) {
      setErrorMsg('Please paste a viral post, rumor, or note first.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    // Staged feedback for the user
    setLoadingStage('Scanning claims with Gemma 4...');
    const timer1 = setTimeout(() => setLoadingStage('Cross-checking facts and red flags...'), 1800);
    const timer2 = setTimeout(() => setLoadingStage('Preparing detailed findings and advice...'), 4500);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error (${response.status})`);
      }

      const data: DebunkResult = await response.json();
      setResult(data);
      saveToHistory(text, data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete analysis. Please check your provider settings.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
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

  const copyEasyReply = () => {
    if (!result?.easyReply) return;
    navigator.clipboard.writeText(result.easyReply);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2200);
  };

  const copyFullReport = () => {
    if (!result) return;
    const reportText = `[DEBUNK-AI REPORT]
Verdict: ${result.verdict} (${result.verdictLabel})
Credibility: ${result.credibilityScore}/100
Summary: ${result.summary}
What the post claims: ${result.claimsExtracted.join('; ')}
Verified Reality: ${result.factualReality}
Red Flags: ${result.redFlags.join(', ')}
Model: ${result.modelUsed} (${result.providerUsed.toUpperCase()})

Gentle Reply for Family/Chats:
"${result.easyReply}"`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2200);
  };

  // Verdict style helpers
  const getVerdictTheme = (verdict: string) => {
    switch (verdict) {
      case 'Disinformation':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          badge: 'bg-rose-600 text-white',
          accent: 'border-rose-500 text-rose-700',
          barColor: 'bg-rose-500',
          icon: <XCircle className="w-7 h-7 text-rose-600 flex-shrink-0" />,
        };
      case 'Misinformation':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          badge: 'bg-amber-500 text-slate-900 font-bold',
          accent: 'border-amber-500 text-amber-800',
          barColor: 'bg-amber-500',
          icon: <AlertTriangle className="w-7 h-7 text-amber-600 flex-shrink-0" />,
        };
      case 'Malinformation':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-900',
          badge: 'bg-purple-600 text-white',
          accent: 'border-purple-500 text-purple-800',
          barColor: 'bg-purple-600',
          icon: <ShieldAlert className="w-7 h-7 text-purple-600 flex-shrink-0" />,
        };
      case 'Verified True':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          accent: 'border-emerald-500 text-emerald-800',
          barColor: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />,
        };
      default:
        return {
          bg: 'bg-slate-100 border-slate-300 text-slate-900',
          badge: 'bg-slate-700 text-white',
          accent: 'border-slate-500 text-slate-800',
          barColor: 'bg-slate-500',
          icon: <Info className="w-7 h-7 text-slate-600 flex-shrink-0" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-50 text-slate-900 pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">DebunkAI</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                  Gemma 4
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Fact-check viral posts & rumors in simple words</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active Provider Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {providerConfig?.provider === 'local' ? 'Ollama Local' : 'Google AI Studio'}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 font-mono text-[11px]">
                {providerConfig?.provider === 'local'
                  ? providerConfig?.ollamaModel || 'gemma4:e2b'
                  : providerConfig?.geminiModel || 'gemma-4-26b-a4b-it'}
              </span>
            </div>

            {/* Run Smoke Test Button */}
            <button
              onClick={handleRunSmokeTest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition"
              title="Run smoke test on the active provider"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Smoke Test</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 pt-8">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Stop Viral Hoaxes Before They Spread
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Paste any viral tweet, forwarded message, or rumor. Gemma 4 analyzes what is real, what is false, and gives you a polite reply to share.
          </p>
        </div>

        {/* 3 Categories Guide (Educational Card) */}
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowGuide(!showGuide)}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Understanding the 3 Types of False Information
              </h2>
            </div>
            <button className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline">
              {showGuide ? (
                <>
                  <span>Hide Guide</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Read Guide</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {showGuide && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>1. Misinformation</span>
                </div>
                <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                  <strong>Untrue info shared by mistake.</strong> The sender believes it is true and does not mean any harm (e.g. old folklore or misunderstood news).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs sm:text-sm">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>2. Disinformation</span>
                </div>
                <p className="mt-1 text-xs text-rose-800 leading-relaxed">
                  <strong>Deliberate lies and hoaxes.</strong> Created on purpose to deceive, manipulate votes, spark panic, or steal money via scams.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs sm:text-sm">
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span>3. Malinformation</span>
                </div>
                <p className="mt-1 text-xs text-purple-800 leading-relaxed">
                  <strong>Real facts twisted out of context.</strong> Genuine video clips, quotes, or private data weaponized to harm or mislead people.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="post-input" className="block text-sm font-bold text-slate-800">
              Paste the Viral Message, Tweet, or Rumor
            </label>
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear text
              </button>
            )}
          </div>

          <textarea
            id="post-input"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste forwarded WhatsApp text, social media caption, or news claim here..."
            className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-sm leading-relaxed placeholder:text-slate-400 transition"
          />

          {/* Quick Examples */}
          <div className="mt-3">
            <span className="text-xs font-semibold text-slate-500 block mb-1.5">
              Or test with realistic examples (1-click):
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_POSTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(sample.text);
                    handleAnalyze(sample.text);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-slate-700 font-medium transition text-left"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {inputText.length > 0 ? `${inputText.length} characters` : 'No text entered'}
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
                onClick={() => handleAnalyze()}
                disabled={isLoading || !inputText.trim()}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 text-white shadow-sm transition ${
                  isLoading || !inputText.trim()
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 cursor-pointer active:scale-98'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{loadingStage}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Fact-Check with Gemma 4</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent History Drawer */}
        {showHistory && history.length > 0 && (
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Recent Verifications
              </span>
              <button
                onClick={clearHistory}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear history</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setResult(item.result);
                    setShowHistory(false);
                  }}
                  className="text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-800 truncate">{item.snippet}</p>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex-shrink-0 ${
                      item.result.verdict === 'Verified True'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.result.verdict === 'Disinformation'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.result.verdict}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Findings Result Card */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Top Verdict Banner */}
            {(() => {
              const theme = getVerdictTheme(result.verdict);
              return (
                <div className={`rounded-2xl border p-6 shadow-sm ${theme.bg}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/10">
                    <div className="flex items-center gap-3">
                      {theme.icon}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
                            {result.verdict}
                          </span>
                          <span className="font-bold text-base text-slate-800">
                            {result.verdictLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Verified with {result.modelUsed} via {result.providerUsed.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Credibility Gauge */}
                    <div className="bg-white/80 backdrop-blur-xs border border-black/10 rounded-xl p-3 min-w-[180px]">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Credibility Score</span>
                        <span className="text-slate-900 font-extrabold">{result.credibilityScore}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${theme.barColor}`}
                          style={{ width: `${Math.max(result.credibilityScore, 4)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block text-right">
                        {result.credibilityScore > 70
                          ? 'High Credibility'
                          : result.credibilityScore > 35
                          ? 'Needs Context / Caution'
                          : 'Severe Deception Risk'}
                      </span>
                    </div>
                  </div>

                  {/* Summary in plain words */}
                  <div className="mt-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Verdict in Plain Words
                    </h3>
                    <p className="mt-1 text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                      {result.summary}
                    </p>
                  </div>

                  {/* Why this category */}
                  <div className="mt-3 p-3 rounded-xl bg-white/60 border border-black/5 text-xs text-slate-700">
                    <strong>Why this category: </strong>
                    <span>{result.categoryExplanation}</span>
                  </div>
                </div>
              );
            })()}

            {/* Detailed Findings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Claims Extracted */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">What This Post Claims</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.claimsExtracted.map((claim, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{claim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The Verified Reality */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">The Verified Reality</h3>
                </div>
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-950 leading-relaxed">
                  {result.factualReality}
                </div>
              </div>
            </div>

            {/* Red Flags Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">Red Flags Detected by Gemma 4</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.redFlags.map((flag, idx) => (
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

            {/* Evidence Breakdown List */}
            {result.detailedFindings && result.detailedFindings.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Evidence-Based Breakdown
                </h3>
                <div className="space-y-2.5">
                  {result.detailedFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                          {finding.point}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            finding.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : finding.status === 'debunked'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {finding.status}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{finding.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp / Chat Polite Reply Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      How to Reply Politely (Copy & Share)
                    </h3>
                    <p className="text-[11px] text-blue-700">
                      Send this to a friend or family group to gently correct them without arguing
                    </p>
                  </div>
                </div>

                <button
                  onClick={copyEasyReply}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  {copiedReply ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReply ? 'Copied!' : 'Copy Reply'}</span>
                </button>
              </div>

              <div className="p-3 bg-white border border-blue-100 rounded-xl text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                "{result.easyReply}"
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setInputText('');
                  setResult(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verify Another Post</span>
              </button>

              <button
                onClick={copyFullReport}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReport ? 'Full Report Copied' : 'Copy Full Debunk Report'}</span>
              </button>
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
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold disabled:opacity-50"
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
      <footer className="mt-16 text-center text-xs text-slate-500 max-w-xl mx-auto px-4">
        <p>
          DebunkAI uses Google AI Studio Gemma 4 to analyze viral misinformation, disinformation, and malinformation.
        </p>
        <p className="mt-1">
          Always check with verified health and journalistic institutions for critical decisions.
        </p>
      </footer>
    </div>
  );
}
