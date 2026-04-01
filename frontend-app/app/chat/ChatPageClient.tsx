'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AnalyticsOutlined from '@mui/icons-material/AnalyticsOutlined';
import AudiotrackOutlined from '@mui/icons-material/AudiotrackOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import AutoModeRounded from '@mui/icons-material/AutoModeRounded';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import BuildRounded from '@mui/icons-material/BuildRounded';
import CodeOutlined from '@mui/icons-material/CodeOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import EditRounded from '@mui/icons-material/EditRounded';
import ExploreRounded from '@mui/icons-material/ExploreRounded';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import ImageRounded from '@mui/icons-material/ImageRounded';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import MicOutlinedIcon from '@mui/icons-material/MicOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SlideshowOutlined from '@mui/icons-material/SlideshowOutlined';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import StyleOutlined from '@mui/icons-material/StyleOutlined';
import TranslateOutlined from '@mui/icons-material/TranslateOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VideoCallOutlined from '@mui/icons-material/VideoCallOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import { SiteShell } from '@/components/layout/SiteShell';
import {
  agents,
  getActionPrompt,
  models,
  suggestedPrompts,
} from '@/lib/mock/platformData';
import {
  clearGuestSessionState,
  createGuestSessionState,
  getGuestSessionState,
  saveGuestSessionState,
} from '@/lib/utils/guestSession';
import { useAppSelector } from '@/lib/store/hooks';
import {
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useGetChatHistoryQuery,
  useImportGuestSessionsMutation,
  useSendMessageMutation,
} from '@/lib/services/chatApi';
import type { Attachment, ChatSession, Message } from '@/lib/types/chat.types';

/* ─── constants ──────────────────────────────────────────────── */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
const starterModel = models[0];

const WELCOME_ACTIONS = [
  { label: 'Write content',  Icon: EditRounded,     prompt: 'Help me write compelling content for ' },
  { label: 'Create images',  Icon: ImageRounded,    prompt: 'Generate a detailed image of '         },
  { label: 'Build something',Icon: BuildRounded,    prompt: 'Help me build '                        },
  { label: 'Automate work',  Icon: AutoModeRounded, prompt: 'Help me automate '                     },
  { label: 'Analyze data',   Icon: AnalyticsOutlined, prompt: 'Analyze this data: '                 },
  { label: 'Just exploring', Icon: ExploreRounded,  prompt: 'Tell me about your capabilities.'     },
];

const RIGHT_PANEL_GROUPS = [
  {
    title: 'Navigation & Tools',
    color: '#C8622A',
    items: [
      { label: 'Browse Marketplace',  Icon: StorefrontOutlined,  href: '/marketplace'                                              },
      { label: 'Create an Agent',     Icon: SmartToyOutlined,    href: '/agents'                                                   },
      { label: 'How to use Guide',    Icon: MenuBookOutlined,    prompt: 'Give me a guide on how to use NexusAI effectively.'     },
      { label: 'Prompt Engineering',  Icon: TuneOutlined,        prompt: 'Teach me advanced prompt engineering techniques.'        },
      { label: 'Vision Pricing',      Icon: VisibilityOutlined,  prompt: 'Explain vision model pricing options.'                   },
      { label: '10+ Models feature',  Icon: AutoAwesomeOutlined, href: '/marketplace'                                              },
    ],
  },
  {
    title: 'Create & Generate',
    color: '#1E4DA8',
    items: [
      { label: 'Create image',      Icon: ImageOutlined,      prompt: 'Create a detailed image of '        },
      { label: 'Generate Audio',    Icon: AudiotrackOutlined, prompt: 'Generate audio content for '        },
      { label: 'Create video',      Icon: VideoCallOutlined,  prompt: 'Write a video script for '          },
      { label: 'Create slides',     Icon: SlideshowOutlined,  prompt: 'Create a slide deck about '         },
      { label: 'Create Flashcards', Icon: StyleOutlined,      prompt: 'Create flashcards for the topic: '  },
      { label: 'Create Mind Map',   Icon: AccountTreeOutlined,prompt: 'Create a mind map for '             },
    ],
  },
  {
    title: 'Analyze & Write',
    color: '#0A5E49',
    items: [
      { label: 'Analyze Data',        Icon: BarChartOutlined,    prompt: 'Analyze this data: '            },
      { label: 'Write content',       Icon: EditOutlined,        prompt: 'Write content about '           },
      { label: 'Code Generation',     Icon: CodeOutlined,        prompt: 'Write code that '               },
      { label: 'Document Analysis',   Icon: DescriptionOutlined, prompt: 'Analyze this document: '        },
      { label: 'Translate',           Icon: TranslateOutlined,   prompt: 'Translate the following text: ' },
    ],
  },
];

const BOTTOM_CHIPS = [
  'Use current model',
  'Create a template',
  'Build a business plan',
  'Create content',
  'Analysis & research',
  'Learn something',
];

type SpeechRecognitionAlternativeLite = {
  transcript: string;
};

type SpeechRecognitionResultLite = {
  0: SpeechRecognitionAlternativeLite;
};

type SpeechRecognitionEventLite = {
  results: ArrayLike<SpeechRecognitionResultLite>;
};

type BrowserSpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLite) => void) | null;
  start: () => void;
};

/* ─── helpers ────────────────────────────────────────────────── */

function normalizeMessage(
  message: Message & { createdAt?: string; timestamp?: string },
  modelId: string,
): Message {
  return {
    ...message,
    modelId: message.modelId || modelId,
    timestamp: message.timestamp || message.createdAt || new Date().toISOString(),
  };
}

function normalizeSession(session: ChatSession): ChatSession {
  return {
    ...session,
    source: session.source ?? 'server',
    messages: session.messages.map((m) => normalizeMessage(m, session.modelId)),
  };
}

function createAssistant(modelId: string, content: string): Message {
  return { id: crypto.randomUUID(), role: 'assistant', content, timestamp: new Date().toISOString(), modelId };
}

function remainingLabel(ms: number) {
  const safe = Math.max(ms, 0);
  const h = Math.floor(safe / 3600000);
  const m = Math.floor((safe % 3600000) / 60000);
  const s = Math.floor((safe % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

/* ─── sub-components ─────────────────────────────────────────── */

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(28,26,22,0.4)',
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

/* ─── page component ─────────────────────────────────────────── */

function ChatPageContent() {
  const searchParams    = useSearchParams();
  const requestedModelId = searchParams.get('model');
  const requestedAgentId = searchParams.get('agent');
  const requestedPrompt  = searchParams.get('prompt');
  const requestedMode    = searchParams.get('mode');
  const autoSend         = searchParams.get('autoSend') === '1';

  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const [activeModelId, setActiveModelId]     = useState(starterModel.id);
  const [modelQuery, setModelQuery]           = useState('');
  const [draft, setDraft]                     = useState('');
  const [sessions, setSessions]               = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [remaining, setRemaining]             = useState(0);
  const [guestSessionId, setGuestSessionId]   = useState<string | null>(null);
  const [attachments, setAttachments]         = useState<Attachment[]>([]);
  const [cameraOpen, setCameraOpen]           = useState(false);
  const [cameraError, setCameraError]         = useState('');
  const [isListening, setIsListening]         = useState(false);
  const [isUploading, setIsUploading]         = useState(false);
  const [chatError, setChatError]             = useState('');
  const [isSending, setIsSending]             = useState(false);
  const [launchHandled, setLaunchHandled]     = useState(false);
  const inputRef  = useRef<HTMLInputElement | null>(null);
  const fileRef   = useRef<HTMLInputElement | null>(null);
  const videoRef  = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const requestedAgent = useMemo(
    () => agents.find((a) => a.id === requestedAgentId) ?? null,
    [requestedAgentId],
  );
  const activeModel = useMemo(
    () => models.find((m) => m.id === activeModelId) ?? starterModel,
    [activeModelId],
  );
  const filteredModels = useMemo(() => {
    const q = modelQuery.toLowerCase();
    return models.filter((m) => !q || m.name.toLowerCase().includes(q) || m.lab.toLowerCase().includes(q));
  }, [modelQuery]);

  const currentSession  = sessions.find((s) => s.id === currentSessionId) ?? null;
  const hasUserMessages = (currentSession?.messages.filter((m) => m.role === 'user').length ?? 0) > 0;
  const showWelcome     = !hasUserMessages;

  const { data: serverHistory } = useGetChatHistoryQuery(undefined, { skip: !isAuthenticated });
  const [createSession]         = useCreateSessionMutation();
  const [sendMessage]           = useSendMessageMutation();
  const [deleteSession]         = useDeleteSessionMutation();
  const [importGuestSessions]   = useImportGuestSessionsMutation();

  /* ── effects (unchanged logic) ── */
  useEffect(() => {
    if (requestedAgent?.baseModelId) { setActiveModelId(requestedAgent.baseModelId); return; }
    if (requestedModelId && models.some((m) => m.id === requestedModelId)) setActiveModelId(requestedModelId);
  }, [requestedAgent, requestedModelId]);

  useEffect(() => {
    if (!requestedMode || launchHandled) return;
    if (requestedMode === 'speech-to-text') { handleStartVoice(); setLaunchHandled(true); return; }
    if (['audio','attachment','image','video','screen'].includes(requestedMode)) {
      setChatError(`Mode selected: ${requestedMode}. Continue in chat with this context.`);
      setLaunchHandled(true);
    }
  }, [launchHandled, requestedMode]);

  useEffect(() => {
    if (isAuthenticated) return;
    const saved = getGuestSessionState();
    if (saved) {
      setGuestSessionId(saved.guestSessionId);
      setSessions(saved.sessions);
      setCurrentSessionId(saved.sessions[0]?.id ?? null);
      setRemaining(saved.expiresAt - Date.now());
      return;
    }
    const session: ChatSession = {
      id: crypto.randomUUID(),
      modelId: requestedAgent?.baseModelId ?? requestedModelId ?? starterModel.id,
      title: requestedAgent ? requestedAgent.name : 'New Chat',
      systemPrompt: requestedAgent?.systemPrompt,
      source: 'guest',
      inputMode: 'text',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [createAssistant(
        requestedAgent?.baseModelId ?? requestedModelId ?? starterModel.id,
        requestedAgent
          ? `${requestedAgent.name} is ready. ${requestedAgent.description}`
          : `Welcome! I'm here to help. You're chatting with ${starterModel.name}.`,
      )],
    };
    const state = createGuestSessionState([session]);
    saveGuestSessionState(state);
    setGuestSessionId(state.guestSessionId);
    setSessions(state.sessions);
    setCurrentSessionId(session.id);
    setRemaining(state.expiresAt - Date.now());
  }, [isAuthenticated, requestedAgent, requestedModelId]);

  useEffect(() => {
    if (!isAuthenticated || !serverHistory || !('items' in serverHistory)) return;
    const next = serverHistory.items.map(normalizeSession);
    setSessions(next);
    setCurrentSessionId((prev) => prev ?? next[0]?.id ?? null);
  }, [isAuthenticated, serverHistory]);

  useEffect(() => {
    if (!isAuthenticated || !guestSessionId) return;
    const saved = getGuestSessionState();
    if (!saved || saved.sessions.length === 0) return;
    void importGuestSessions({
      guestSessionId,
      sessions: saved.sessions.map((s) => ({
        id: s.id, modelId: s.modelId, title: s.title, systemPrompt: s.systemPrompt,
        messages: s.messages.map((m) => ({ role: m.role, content: m.content })),
      })),
    }).unwrap().then(() => clearGuestSessionState()).catch(() => undefined);
  }, [guestSessionId, importGuestSessions, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated || sessions.length === 0 || !guestSessionId) return;
    const existing = getGuestSessionState();
    const state = existing ?? createGuestSessionState(sessions);
    state.guestSessionId = guestSessionId;
    state.sessions = sessions;
    saveGuestSessionState(state);
    setRemaining(state.expiresAt - Date.now());
  }, [guestSessionId, isAuthenticated, sessions]);

  useEffect(() => {
    if (isAuthenticated) return;
    const tick = () => {
      const saved = getGuestSessionState();
      if (!saved) { setRemaining(0); setSessions([]); setCurrentSessionId(null); return; }
      const next = saved.expiresAt - Date.now();
      setRemaining(next);
      if (next <= 0) { clearGuestSessionState(); setSessions([]); setCurrentSessionId(null); }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [isAuthenticated]);

  useEffect(() => { return () => streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);

  useEffect(() => {
    if (!requestedPrompt || !autoSend || launchHandled || !currentSessionId) return;
    void send(requestedPrompt);
    setLaunchHandled(true);
  }, [autoSend, currentSessionId, launchHandled, requestedPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  /* ── actions ── */
  const createNewSession = async () => {
    const base: ChatSession = {
      id: crypto.randomUUID(),
      modelId: activeModel.id,
      title: requestedAgent?.name || activeModel.name,
      systemPrompt: requestedAgent?.systemPrompt,
      source: isAuthenticated ? 'server' : 'guest',
      inputMode: 'text',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [createAssistant(activeModel.id,
        requestedAgent
          ? `${requestedAgent.name} launched with ${activeModel.name}.`
          : `New chat started with ${activeModel.name}.`,
      )],
    };
    if (isAuthenticated) {
      try {
        const created = await createSession({ modelId: activeModel.id }).unwrap();
        const norm = normalizeSession(created);
        setSessions((prev) => [norm, ...prev]);
        setCurrentSessionId(norm.id);
        return;
      } catch { setChatError('Unable to create a new server session right now.'); }
    }
    setSessions((prev) => [base, ...prev]);
    setCurrentSessionId(base.id);
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true); setChatError('');
    try {
      const uploaded = await Promise.all(Array.from(files).map(async (file) => {
        const res = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ filename: file.name, mimeType: file.type, size: file.size, sessionId: currentSessionId, modelId: activeModel.id }),
        });
        const r = await res.json();
        return { id: r.id, name: r.filename, type: file.type.startsWith('image/') ? 'image' : 'document', url: r.previewUrl || r.url, size: r.size, mimeType: r.mimeType } as Attachment;
      }));
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch { setChatError('File upload failed. Please try again.'); }
    finally { setIsUploading(false); }
  };

  const handleStartVoice = () => {
    const speechWindow = window as Window & {
      SpeechRecognition?: BrowserSpeechRecognitionCtor;
      webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
    };
    const Recognition = typeof window !== 'undefined'
      ? (speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition)
      : undefined;
    if (!Recognition) { setChatError('Voice input is not supported in this browser.'); return; }
    const r = new Recognition();
    r.lang = 'en-US'; r.interimResults = true;
    r.onstart = () => setIsListening(true);
    r.onend   = () => setIsListening(false);
    r.onerror = () => { setIsListening(false); setChatError('Voice capture failed.'); };
    r.onresult = (e: SpeechRecognitionEventLite) =>
      setDraft(Array.from(e.results).map((i) => i[0].transcript).join(' '));
    r.start();
  };

  const openCamera = async () => {
    setCameraError(''); setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { setCameraError('Camera access was blocked or unavailable.'); }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null; setCameraOpen(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current; const c = canvasRef.current;
    c.width = v.videoWidth || 640; c.height = v.videoHeight || 360;
    c.getContext('2d')?.drawImage(v, 0, 0, c.width, c.height);
    setAttachments((prev) => [...prev, { id: crypto.randomUUID(), name: `capture-${Date.now()}.png`, type: 'image', url: c.toDataURL('image/png'), size: 0, mimeType: 'image/png' }]);
    closeCamera();
  };

  const removeAttachment = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const send = async (content: string) => {
    if (!content.trim()) return;
    let sid = currentSessionId;
    if (!sid) { await createNewSession(); sid = currentSessionId; }
    if (!sid) return;
    const session = sessions.find((s) => s.id === sid);
    setIsSending(true); setChatError('');
    try {
      const res = await sendMessage({
        sessionId: sid, modelId: activeModel.id, content,
        systemPrompt: session?.systemPrompt || requestedAgent?.systemPrompt,
        attachments: attachments.map((a) => ({ name: a.name, type: a.type, url: a.url, mimeType: a.mimeType, size: a.size })),
        inputMode: isListening ? 'voice' : 'text', voiceMode: isListening,
      }).unwrap();
      const norm = normalizeSession(res.session);
      setSessions((prev) => { const ex = prev.some((s) => s.id === norm.id); return ex ? prev.map((s) => s.id === norm.id ? norm : s) : [norm, ...prev]; });
      setCurrentSessionId(norm.id);
      setDraft(''); setAttachments([]);
    } catch {
      const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content, attachments, timestamp: new Date().toISOString(), modelId: activeModel.id };
      const asst = createAssistant(activeModel.id, `Offline fallback using ${activeModel.name}: ${content}\n\nI can still help structure this request, but the backend was unavailable.`);
      setSessions((prev) => prev.map((s) => s.id === sid ? { ...s, modelId: activeModel.id, updatedAt: new Date().toISOString(), messages: [...s.messages, userMsg, asst] } : s));
      setDraft(''); setAttachments([]);
      setChatError('Backend send failed — a local fallback response was used.');
    } finally { setIsSending(false); }
  };

  const handleSend = () => void send(draft);
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const setDraftAndFocus = (text: string) => { setDraft(text); setTimeout(() => inputRef.current?.focus(), 50); };

  const deleteCurrentSession = async () => {
    if (!currentSessionId) return;
    if (isAuthenticated) { try { await deleteSession(currentSessionId).unwrap(); } catch { setChatError('Could not delete the session.'); } }
    setSessions((prev) => { const next = prev.filter((s) => s.id !== currentSessionId); setCurrentSessionId(next[0]?.id ?? null); return next; });
  };

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <SiteShell>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 78px)', overflow: 'hidden', flexDirection: 'column' }}>

        {/* alerts */}
        {!isAuthenticated && (
          <Alert
            severity="info"
            sx={{
              borderRadius: 0,
              fontSize: '0.74rem',
              py: 0.15,
              minHeight: 26,
              bgcolor: '#EAF5EF',
              color: 'rgba(28,26,22,0.72)',
              '& .MuiAlert-icon': { fontSize: '0.95rem', color: '#4B8F67', alignItems: 'center' },
            }}
          >
            Guest session expires in {remainingLabel(remaining)}. Sign in to save history.
          </Alert>
        )}
        {chatError && (
          <Alert severity="warning" sx={{ borderRadius: 0, fontSize: '0.82rem', py: 0.5 }} onClose={() => setChatError('')}>
            {chatError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* ════════════════════════ LEFT PANEL ════════════════════════ */}
          <Box
            sx={{
              width: 276,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid rgba(28,26,22,0.07)',
              bgcolor: 'rgba(255,255,255,0.62)',
              overflow: 'hidden',
            }}
          >
            {/* search */}
            <Box sx={{ p: 1.5, pb: 1 }}>
              <PanelLabel>Models</PanelLabel>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75,
                  px: 1.1, py: 0.55, borderRadius: 2,
                  bgcolor: '#FBF8F4', border: '1px solid rgba(28,26,22,0.08)',
                }}
              >
                <SearchRounded sx={{ fontSize: '0.9rem', color: 'rgba(28,26,22,0.4)' }} />
                <InputBase
                  value={modelQuery}
                  onChange={(e) => setModelQuery(e.target.value)}
                  placeholder={`Search ${models.length} models...`}
                  sx={{ flex: 1, fontSize: '0.8rem', '& input': { p: 0 } }}
                />
              </Paper>

              <Stack direction="row" spacing={0.75} sx={{ mt: 1.1, overflowX: 'auto', '&::-webkit-scrollbar': { height: 0 } }}>
                {BOTTOM_CHIPS.map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    size="small"
                    onClick={() => setDraftAndFocus(chip + ': ')}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(28,26,22,0.1)',
                      fontSize: '0.69rem',
                      height: 24,
                      flexShrink: 0,
                      color: 'rgba(28,26,22,0.7)',
                      '&:hover': { bgcolor: 'rgba(200,98,42,0.07)', borderColor: 'rgba(200,98,42,0.25)', color: '#C8622A' },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* model list */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 1, pb: 1, '&::-webkit-scrollbar': { width: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(28,26,22,0.15)', borderRadius: 2 } }}>
              <Stack spacing={0.3}>
                {filteredModels.slice(0, 140).map((model) => (
                  <Box
                    key={model.id}
                    onClick={() => setActiveModelId(model.id)}
                    sx={{
                      px: 1, py: 0.7,
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: model.id === activeModel.id ? 'rgba(200,98,42,0.12)' : 'transparent',
                      border: model.id === activeModel.id ? '1px solid rgba(200,98,42,0.2)' : '1px solid transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': { bgcolor: model.id === activeModel.id ? 'rgba(200,98,42,0.1)' : 'rgba(28,26,22,0.04)' },
                    }}
                  >
                    <Stack direction="row" spacing={0.9} alignItems="center">
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '7px',
                          bgcolor: `${model.bgColor}20`,
                          color: model.bgColor,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {model.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.73rem', lineHeight: 1.2, color: '#1C1A16' }}>
                          {model.name}
                        </Typography>
                        <Stack direction="row" spacing={0.45} alignItems="center">
                          <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#83B987', flexShrink: 0 }} />
                          <Typography sx={{ color: 'rgba(28,26,22,0.42)', fontSize: '0.64rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {model.lab}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* new chat button */}
            <Box sx={{ p: 1.25, borderTop: '1px solid rgba(28,26,22,0.07)' }}>
              <Button
                variant="contained"
                size="small"
                fullWidth
                startIcon={<AddRoundedIcon sx={{ fontSize: '0.9rem !important' }} />}
                onClick={() => void createNewSession()}
                sx={{ borderRadius: 99, textTransform: 'none', fontSize: '0.8rem', bgcolor: '#C8622A', '&:hover': { bgcolor: '#A95322' } }}
              >
                New Chat
              </Button>
            </Box>
          </Box>

          {/* ════════════════════════ CENTER PANEL ════════════════════════ */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#F8F5EF' }}>

            {/* session tabs */}
            {sessions.length > 0 && (
              <Box sx={{ px: 1.5, pt: 0.9, pb: 0.7, borderBottom: '1px solid rgba(28,26,22,0.06)', flexShrink: 0 }}>
                <Stack direction="row" spacing={0.75} sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { height: 3 } }}>
                  {sessions.map((s) => (
                    <Chip
                      key={s.id}
                      label={s.title || `Chat ${s.id.slice(0, 4)}`}
                      size="small"
                      onClick={() => { setCurrentSessionId(s.id); setActiveModelId(s.modelId); }}
                      sx={{
                        bgcolor: s.id === currentSessionId ? '#1C1A16' : 'rgba(255,255,255,0.8)',
                        color:   s.id === currentSessionId ? '#fff' : 'rgba(28,26,22,0.75)',
                        fontSize: '0.7rem', height: 22,
                        border: s.id === currentSessionId ? 'none' : '1px solid rgba(28,26,22,0.1)',
                        '&:hover': { bgcolor: s.id === currentSessionId ? '#333' : 'rgba(28,26,22,0.06)' },
                      }}
                    />
                  ))}
                  <Tooltip title="Delete session">
                    <IconButton size="small" onClick={deleteCurrentSession} disabled={!currentSessionId} sx={{ flexShrink: 0, opacity: 0.5, '&:hover': { opacity: 1 } }}>
                      <DeleteOutlineRoundedIcon sx={{ fontSize: '0.95rem' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            )}

            {/* messages / welcome */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 4 }, py: 2.2, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(28,26,22,0.12)', borderRadius: 2 } }}>
              {showWelcome ? (
                /* ── WELCOME STATE ── */
                <Box sx={{ maxWidth: 570, mx: 'auto', textAlign: 'center', pt: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 3.6 },
                      borderRadius: '34px',
                      bgcolor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(28,26,22,0.07)',
                      mb: 3,
                      boxShadow: '0 14px 30px rgba(69,47,23,0.08)',
                    }}
                  >
                    <Typography sx={{ fontSize: '1.8rem', mb: 1 }}>??</Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 0.8, fontSize: '1.55rem' }}>
                      Welcome! I&apos;m here to help you
                    </Typography>
                    <Typography sx={{ color: 'rgba(28,26,22,0.58)', fontSize: '0.84rem', mb: 2.2, maxWidth: 430, mx: 'auto', lineHeight: 1.7 }}>
                      No AI background needed. Tell me what you&apos;d like to{' '}
                      <Box component="span" sx={{ color: '#C8622A', fontWeight: 600 }}>achieve</Box>
                      {' '}and I&apos;ll help you discover what&apos;s possible, step by step.
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.75} justifyContent="center" sx={{ mb: 1.8 }}>
                      <Typography sx={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C89A75' }}>
                        ? What would you like to do today?
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 1,
                        p: 1.2,
                        borderRadius: '24px',
                        border: '1px solid rgba(28,26,22,0.06)',
                        bgcolor: '#F7F3ED',
                      }}
                    >
                      {WELCOME_ACTIONS.map(({ label, Icon, prompt }) => (
                        <Box
                          key={label}
                          onClick={() => setDraftAndFocus(prompt)}
                          sx={{
                            p: 1.45,
                            borderRadius: '14px',
                            border: '1px solid rgba(28,26,22,0.08)',
                            bgcolor: 'rgba(255,255,255,0.82)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.18s ease',
                            '&:hover': {
                              bgcolor: 'rgba(200,98,42,0.06)',
                              borderColor: 'rgba(200,98,42,0.25)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box sx={{ width: 30, height: 30, borderRadius: '9px', bgcolor: 'rgba(200,98,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.85 }}>
                            <Icon sx={{ fontSize: '0.96rem', color: '#C8622A' }} />
                          </Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.76rem', color: '#1C1A16' }}>{label}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Typography sx={{ mt: 1.8, color: 'rgba(28,26,22,0.34)', fontSize: '0.72rem' }}>
                      or type anything below — there are no wrong answers
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                /* ── CHAT MESSAGES ── */
                <Stack spacing={1.5} sx={{ maxWidth: 760, mx: 'auto' }}>
                  {currentSession?.messages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        maxWidth: msg.role === 'user' ? '78%' : '90%',
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        p: 1.75,
                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                        bgcolor: msg.role === 'user' ? '#1C1A16' : 'rgba(255,255,255,0.92)',
                        color: msg.role === 'user' ? '#fff' : '#1C1A16',
                        border: msg.role === 'assistant' ? '1px solid rgba(28,26,22,0.08)' : 'none',
                        boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(28,26,22,0.06)' : 'none',
                      }}
                    >
                      <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.9rem' }}>
                        {msg.content}
                      </Typography>
                      {msg.role === 'assistant' && (
                        <Tooltip title="Read aloud">
                          <IconButton size="small" onClick={() => speak(msg.content)} sx={{ mt: 0.5, opacity: 0.5, '&:hover': { opacity: 1 } }}>
                            <VolumeUpOutlinedIcon sx={{ fontSize: '0.9rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  ))}
                  {isSending && (
                    <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: '4px 16px 16px 16px', bgcolor: 'rgba(255,255,255,0.92)', border: '1px solid rgba(28,26,22,0.08)' }}>
                      <CircularProgress size={14} sx={{ color: '#C8622A' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: 'rgba(28,26,22,0.55)' }}>Thinking…</Typography>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Stack>
              )}
            </Box>

            {/* ── BOTTOM INPUT ── */}
            <Box sx={{ px: { xs: 2, md: 4 }, pb: 1.8, pt: 1.2, borderTop: '1px solid rgba(28,26,22,0.06)', bgcolor: '#FAFAF8', flexShrink: 0 }}>

              {/* attachment chips */}
              {attachments.length > 0 && (
                <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mb: 1, rowGap: 0.75 }}>
                  {attachments.map((a) => (
                    <Chip key={a.id} label={a.name} size="small" onDelete={() => removeAttachment(a.id)} sx={{ fontSize: '0.75rem' }} />
                  ))}
                </Stack>
              )}

              {/* input box */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '24px',
                  border: '1px solid rgba(28,26,22,0.12)',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 2px 12px rgba(28,26,22,0.07)',
                  overflow: 'hidden',
                }}
              >
                <InputBase
                  inputRef={inputRef}
                  multiline
                  minRows={2}
                  maxRows={6}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your project, ask a question, or just say hi — I'm here to help."
                  sx={{ width: '100%', px: 2, pt: 1.35, pb: 0.4, fontSize: '0.84rem', lineHeight: 1.55 }}
                />
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, pb: 1 }}>
                  <Stack direction="row" spacing={0.25}>
                    <Tooltip title="Voice input">
                      <IconButton size="small" onClick={handleStartVoice} sx={{ color: isListening ? '#C8622A' : 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <MicOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Upload file">
                      <IconButton size="small" onClick={() => fileRef.current?.click()} disabled={isUploading} sx={{ color: 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <UploadFileOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Camera snapshot">
                      <IconButton size="small" onClick={() => void openCamera()} sx={{ color: 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <PhotoCameraOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Chip label={activeModel.name} size="small" sx={{ ml: 0.5, fontSize: '0.65rem', height: 20, bgcolor: 'rgba(200,98,42,0.08)', color: '#C8622A', fontWeight: 600 }} />
                  </Stack>
                  <Tooltip title="Send (Enter)">
                    <span>
                      <IconButton
                        size="small"
                        onClick={handleSend}
                        disabled={isSending || !draft.trim()}
                        sx={{
                          bgcolor: draft.trim() ? '#D17331' : 'rgba(28,26,22,0.08)',
                          color: draft.trim() ? '#fff' : 'rgba(28,26,22,0.35)',
                          borderRadius: '50%',
                          width: 31, height: 31,
                          '&:hover': { bgcolor: draft.trim() ? '#A34D1E' : 'rgba(28,26,22,0.08)' },
                          transition: 'all 0.18s ease',
                        }}
                      >
                        {isSending ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <SendRoundedIcon sx={{ fontSize: '1rem' }} />}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Paper>
            </Box>
          </Box>

          {/* ════════════════════════ RIGHT PANEL ════════════════════════ */}
          <Box
            sx={{
              width: 284,
              flexShrink: 0,
              display: { xs: 'none', lg: 'flex' },
              flexDirection: 'column',
              overflowY: 'auto',
              borderLeft: '1px solid rgba(28,26,22,0.07)',
              bgcolor: 'rgba(255,255,255,0.55)',
              px: 1.1,
              py: 1.5,
              gap: 2,
              '&::-webkit-scrollbar': { width: 3 },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(28,26,22,0.12)', borderRadius: 2 },
            }}
          >
            <PanelLabel>Quick Actions</PanelLabel>

            {RIGHT_PANEL_GROUPS.map((group, gi) => (
              <Box key={group.title}>
                <Typography
                  sx={{
                    fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.09em',
                    textTransform: 'uppercase', color: group.color, mb: 0.75,
                  }}
                >
                  {group.title}
                </Typography>
                <Stack spacing={0.15}>
                  {group.items.map(({ label, Icon, href, prompt }) => (
                    href ? (
                      <Box
                        key={label}
                        component={Link}
                        href={href}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1,
                          px: 0.85, py: 0.55, borderRadius: 2,
                          border: '1px solid rgba(28,26,22,0.06)',
                          bgcolor: 'rgba(255,255,255,0.86)',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                          '&:hover': { bgcolor: `${group.color}0d` },
                        }}
                      >
                        <Box sx={{ width: 18, height: 18, borderRadius: '5px', bgcolor: `${group.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon sx={{ fontSize: '0.82rem', color: group.color }} />
                        </Box>
                        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(28,26,22,0.75)', fontWeight: 500 }}>{label}</Typography>
                      </Box>
                    ) : (
                      <Box
                        key={label}
                        onClick={() => setDraftAndFocus(prompt!)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1,
                          px: 0.85, py: 0.55, borderRadius: 2, cursor: 'pointer',
                          border: '1px solid rgba(28,26,22,0.06)',
                          bgcolor: 'rgba(255,255,255,0.86)',
                          transition: 'all 0.15s ease',
                          '&:hover': { bgcolor: `${group.color}0d` },
                        }}
                      >
                        <Box sx={{ width: 18, height: 18, borderRadius: '5px', bgcolor: `${group.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon sx={{ fontSize: '0.82rem', color: group.color }} />
                        </Box>
                        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(28,26,22,0.75)', fontWeight: 500 }}>{label}</Typography>
                      </Box>
                    )
                  ))}
                </Stack>
                {gi < RIGHT_PANEL_GROUPS.length - 1 && <Divider sx={{ mt: 1.5 }} />}
              </Box>
            ))}
          </Box>

        </Box>
      </Box>

      {/* camera dialog */}
      <Dialog open={cameraOpen} onClose={closeCamera} fullWidth maxWidth="md">
        <DialogTitle>Camera snapshot</DialogTitle>
        <DialogContent>
          {cameraError
            ? <Alert severity="error">{cameraError}</Alert>
            : <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 12 }} />}
          <canvas ref={canvasRef} hidden />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCamera}>Cancel</Button>
          <Button variant="contained" onClick={captureSnapshot}>Capture</Button>
        </DialogActions>
      </Dialog>

      <input ref={fileRef} hidden type="file" multiple onChange={(e) => void uploadFiles(e.target.files)} />
    </SiteShell>
  );
}

export default ChatPageContent;

