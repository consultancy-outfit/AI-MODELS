'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import AudiotrackOutlined from '@mui/icons-material/AudiotrackOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import CodeOutlined from '@mui/icons-material/CodeOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SlideshowOutlined from '@mui/icons-material/SlideshowOutlined';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import StyleOutlined from '@mui/icons-material/StyleOutlined';
import TranslateOutlined from '@mui/icons-material/TranslateOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import VideoCallOutlined from '@mui/icons-material/VideoCallOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import SvgIcon from '@mui/material/SvgIcon';
import {
  agents,
  models,
} from '@/lib/mock/platformData';
import {
  clearGuestSessionState,
  createGuestSessionState,
  getGuestSessionState,
  saveGuestSessionState,
} from '@/utils/guestSession';
import {
  clearPendingLaunch,
  getPendingLaunch,
  hasPendingLaunch,
} from '@/utils/pendingLaunch';
import type {
  SpeechRecognitionCtor,
  SpeechRecognitionEventLite,
} from '@/interface';
import { useAppSelector } from '@/store/hooks';
import {
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useGetChatHistoryQuery,
  useImportGuestSessionsMutation,
  useSendMessageMutation,
} from '@/services/chatApi';
import type { Attachment, ChatSession, Message } from '@/interface';

/* ─── input mode icons (match dashboard) ────────────────────── */

function VoiceConversationIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </SvgIcon>
  );
}

function VoiceTypingIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="14" width="20" height="7" rx="2" />
      <path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z" />
      <path d="M18 10v1a6 6 0 0 1-12 0v-1" />
      <line x1="8" y1="17.5" x2="8" y2="17.51" />
      <line x1="12" y1="17.5" x2="12" y2="17.51" />
      <line x1="16" y1="17.5" x2="16" y2="17.51" />
    </SvgIcon>
  );
}

function VideoInputIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </SvgIcon>
  );
}

function ScreenShareIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <polyline points="8 21 12 17 16 21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </SvgIcon>
  );
}

function AttachFileIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </SvgIcon>
  );
}

function UploadImageIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </SvgIcon>
  );
}

/* ─── constants ──────────────────────────────────────────────── */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
const starterModel = models[0];

const WELCOME_ACTIONS = [
  { emoji: '🚀', label: 'Write content',    sub: 'Emails, posts, stories',   prompt: 'Help me write compelling content for ' },
  { emoji: '🎨', label: 'Create images',    sub: 'Art, photos, designs',      prompt: 'Generate a detailed image of '         },
  { emoji: '🔧', label: 'Build something',  sub: 'Apps, tools, websites',     prompt: 'Help me build '                        },
  { emoji: '⚡', label: 'Automate work',    sub: 'Save hours every week',     prompt: 'Help me automate '                     },
  { emoji: '📊', label: 'Analyse data',     sub: 'PDFs, sheets, reports',     prompt: 'Analyze this data: '                   },
  { emoji: '🔍', label: 'Just exploring',   sub: "Show me what's possible",   prompt: 'Tell me about your capabilities.'     },
];

const RIGHT_PANEL_GROUPS: QuickActionGroup[] = [
  {
    title: 'Navigation & Tools',
    color: '#C8622A',
    items: [
      { label: 'Browse Marketplace',  Icon: StorefrontOutlined,  href: '/marketplace'                                              },
      { label: 'Create an Agent',     Icon: SmartToyOutlined,    detailTab: 'agent-creation'                                       },
      { label: 'How to use Guide',    Icon: MenuBookOutlined,    detailTab: 'how-to-use'                                           },
      { label: 'Prompt Engineering',  Icon: TuneOutlined,        detailTab: 'prompt-guide'                                         },
      { label: 'View Pricing',        Icon: VisibilityOutlined,  detailTab: 'pricing'                                              },
      { label: 'AI Models Analysis',  Icon: AutoAwesomeOutlined, href: '/marketplace'                                              },
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

type ModelDetailsTab = 'overview' | 'how-to-use' | 'pricing' | 'prompt-guide' | 'agent-creation' | 'reviews';
type QuickActionItem = {
  label: string;
  Icon: typeof StorefrontOutlined;
  href?: string;
  prompt?: string;
  detailTab?: ModelDetailsTab;
};
type QuickActionGroup = {
  title: string;
  color: string;
  items: QuickActionItem[];
};
const MODEL_DETAILS_TABS: Array<{ value: ModelDetailsTab; label: string }> = [
  { value: 'overview', label: 'Overview' },
  { value: 'how-to-use', label: 'How to Use' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'prompt-guide', label: 'Prompt Guide' },
  { value: 'agent-creation', label: 'Agent Creation' },
  { value: 'reviews', label: 'Reviews' },
];


/* ─── helpers ────────────────────────────────────────────────── */

function normalizeMessage(
  message: Message & { createdAt?: string; timestamp?: string },
  modelId: string,
): Message {
  const normalizedAttachments = message.attachments?.map((attachment) => ({
    ...attachment,
    id: attachment.id || crypto.randomUUID(),
    url: normalizeAttachmentUrl(attachment.url),
  }));

  return {
    ...message,
    modelId: message.modelId || modelId,
    timestamp: message.timestamp || message.createdAt || new Date().toISOString(),
    attachments: normalizedAttachments,
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

function normalizeAttachmentUrl(url?: string) {
  if (!url) return undefined;
  if (/^(data:|blob:|https?:\/\/)/i.test(url)) return url;
  if (url.startsWith('/')) {
    return `${API_BASE_URL.replace(/\/api\/?$/, '')}${url}`;
  }
  return `${API_BASE_URL.replace(/\/api\/?$/, '')}/${url.replace(/^\/+/, '')}`;
}

function formatProviderModelName(modelName: string) {
  const lower = modelName.toLowerCase();
  if (lower.includes('openai')) return 'GPT-5';
  if (lower.includes('anthropic')) return 'Claude Opus 4.5';
  if (lower.includes('google')) return 'Gemini 2.5 Pro';
  return modelName;
}

function buildPromptGuideExamples(modelName: string) {
  return [
    {
      title: 'Principle 1 - Be explicit about format',
      lines: [
        'Summarize the following text in exactly 3 bullet points.',
        'Each bullet should be one sentence and under 20 words.',
        'Text: {your_text_here}',
      ],
    },
    {
      title: 'Principle 2 - Assign a role',
      lines: [
        `You are a senior ${modelName} specialist helping with implementation reviews.`,
        'Review this code for bugs, edge cases, and maintainability risks.',
        'Code: {your_code_here}',
      ],
    },
    {
      title: 'Principle 3 - Break down complex tasks',
      lines: [
        'Solve the task step by step and show the final answer clearly.',
        'Problem: {your_problem_here}',
        'Think through: assumptions -> approach -> calculation -> answer',
      ],
    },
    {
      title: 'Principle 4 - Use examples',
      lines: [
        'Classify customer sentiment using the pattern below.',
        'Input: "Shipping was fast!" -> Output: positive',
        'Input: "It broke after a day." -> Output: negative',
      ],
    },
  ];
}

function buildHowToUseSteps(modelName: string, provider: string, supportsVision: boolean, supportsCode: boolean) {
  return [
    {
      title: 'Get API access',
      body: `Open your ${provider} or NexusAI workspace, create an API key, and keep it in a secure env file before sending requests to ${modelName}.`,
    },
    {
      title: 'Choose your integration method',
      body: `Start with playground testing for fast iteration, then move to REST or SDK integration when ${modelName} is ready for production flows.`,
    },
    {
      title: 'Understand input and output formats',
      body: `${modelName} works best when prompts clearly define context, constraints, and target output.${supportsVision ? ' It can also handle image-based inputs.' : ''}${supportsCode ? ' It is strong for coding and structured generation.' : ''}`,
    },
    {
      title: 'Set parameters for your use case',
      body: 'Use lower temperature for reliable outputs and higher temperature when you want more brainstorming and creative variation.',
    },
    {
      title: 'Test in the playground first',
      body: 'Validate sample prompts, compare outputs, and only then wire the winning prompt into your app or automation.',
    },
  ];
}

function buildReviews(modelName: string, supportsCode: boolean, supportsVision: boolean) {
  return [
    {
      name: 'Sarah K.',
      role: 'ML Engineer at Stripe',
      date: 'Mar 2025',
      rating: 5,
      text: `${modelName} has been reliable in production. ${supportsVision ? 'The multimodal understanding is especially useful for document-heavy workflows.' : 'Response consistency is strong across repeated evaluations.'}`,
    },
    {
      name: 'Tariq M.',
      role: 'Founder, EdTech Startup',
      date: 'Feb 2025',
      rating: 4,
      text: `We use ${modelName} for learning content, planning, and customer support prompts. Quality is high, though pricing matters once volume grows.`,
    },
    {
      name: 'Priya N.',
      role: 'Senior Developer at Shopify',
      date: 'Feb 2025',
      rating: 5,
      text: supportsCode
        ? `${modelName} stands out for code review, refactoring help, and debugging explanations. It is one of the better models for day-to-day developer workflows.`
        : `${modelName} is easy to steer and produces clean structured outputs, which makes it useful for product and ops workflows.`,
    },
  ];
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
  const [modelDetailsOpen, setModelDetailsOpen] = useState(false);
  const [modelDetailsTab, setModelDetailsTab] = useState<ModelDetailsTab>('overview');
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [isCameraRecording, setIsCameraRecording] = useState(false);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [launchHandled, setLaunchHandled]     = useState(false);
  const pendingLaunchAttachmentsRef = useRef<Attachment[]>([]);
  const inputRef  = useRef<HTMLInputElement | null>(null);
  const fileRef   = useRef<HTMLInputElement | null>(null);
  const imageFileRef = useRef<HTMLInputElement | null>(null);
  const videoFileRef = useRef<HTMLInputElement | null>(null);
  const videoRef  = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const cameraRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraRecordingChunksRef = useRef<Blob[]>([]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
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
  const providerModelName = useMemo(() => formatProviderModelName(activeModel.name), [activeModel.name]);
  const supportsVision = activeModel.capabilities.includes('vision');
  const supportsCode = activeModel.capabilities.includes('code');
  const supportsAudio = activeModel.capabilities.includes('audio');
  const howToUseSteps = useMemo(
    () => buildHowToUseSteps(providerModelName, activeModel.lab, supportsVision, supportsCode),
    [activeModel.lab, providerModelName, supportsCode, supportsVision],
  );
  const promptGuideExamples = useMemo(() => buildPromptGuideExamples(providerModelName), [providerModelName]);
  const reviewCards = useMemo(() => buildReviews(providerModelName, supportsCode, supportsVision), [providerModelName, supportsCode, supportsVision]);

  const { data: serverHistory } = useGetChatHistoryQuery(undefined, { skip: !isAuthenticated });
  const [createSession]         = useCreateSessionMutation();
  const [sendMessage]           = useSendMessageMutation();
  const [deleteSession]         = useDeleteSessionMutation();
  const [importGuestSessions]   = useImportGuestSessionsMutation();

  /* ── effects (unchanged logic) ── */

  // Consume pending launch (blobs/text passed from the dashboard)
  useEffect(() => {
    if (!hasPendingLaunch()) return;
    const pending = getPendingLaunch();
    clearPendingLaunch();
    if (pending.text) setDraft(pending.text);
    if (pending.files.length > 0) {
      const newAttachments: Attachment[] = pending.files.map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        type: f.type,
        url: URL.createObjectURL(f.blob),
        size: f.blob.size,
        mimeType: f.mimeType,
      }));
      pendingLaunchAttachmentsRef.current = newAttachments;
      setAttachments(newAttachments);
    }
  }, []);

  useEffect(() => {
    if (requestedAgent?.baseModelId) { setActiveModelId(requestedAgent.baseModelId); return; }
    if (requestedModelId && models.some((m) => m.id === requestedModelId)) setActiveModelId(requestedModelId);
  }, [requestedAgent, requestedModelId]);

  useEffect(() => {
    if (!requestedMode || launchHandled) return;
    if (requestedMode === 'speech-to-text') { handleStartVoice(); setLaunchHandled(true); return; }
    if (requestedMode === 'audio') { void startAudioRecording(); setLaunchHandled(true); return; }
    if (requestedMode === 'attachment') { fileRef.current?.click(); setLaunchHandled(true); return; }
    if (requestedMode === 'image') { imageFileRef.current?.click(); setLaunchHandled(true); return; }
    if (requestedMode === 'video') { void openCamera(); setLaunchHandled(true); return; }
    if (requestedMode === 'screen') { void startScreenRecording(); setLaunchHandled(true); }
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

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioRecorderRef.current && audioRecorderRef.current.state !== 'inactive') {
        audioRecorderRef.current.stop();
      }
      if (cameraRecorderRef.current && cameraRecorderRef.current.state !== 'inactive') {
        cameraRecorderRef.current.stop();
      }
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!requestedPrompt || !autoSend || launchHandled || !currentSessionId) return;
    const pendingAttachments = pendingLaunchAttachmentsRef.current;
    void send(requestedPrompt, pendingAttachments.length > 0 ? pendingAttachments : attachments);
    setLaunchHandled(true);
  }, [attachments, autoSend, currentSessionId, launchHandled, requestedPrompt]);

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
        return norm.id;
      } catch { setChatError('Unable to create a new server session right now.'); }
    }
    setSessions((prev) => [base, ...prev]);
    setCurrentSessionId(base.id);
    return base.id;
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true); setChatError('');
    try {
      const uploaded = await Promise.all(Array.from(files).map((file) => {
        const isVideo = file.type.startsWith('video/');
        if (isVideo) {
          return Promise.resolve<Attachment>({
            id: crypto.randomUUID(),
            name: file.name,
            type: 'video',
            url: URL.createObjectURL(file),
            size: file.size,
            mimeType: file.type,
          });
        }
        return new Promise<Attachment>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type.startsWith('image/') ? 'image'
              : file.type.startsWith('audio/') ? 'audio'
              : 'document',
            url: reader.result as string,
            size: file.size,
            mimeType: file.type,
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }));
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch { setChatError('File upload failed. Please try again.'); }
    finally { setIsUploading(false); }
  };

  const handleStartVoice = () => {
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
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

  const startAudioRecording = async () => {
    setChatError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioStreamRef.current = stream;
      audioRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const file = new File([blob], `audio-recording-${Date.now()}.webm`, { type: 'audio/webm' });
        audioStreamRef.current?.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
        audioRecorderRef.current = null;
        setIsAudioRecording(false);
        await uploadRecordedAudio(file);
      };
      recorder.start();
      setIsAudioRecording(true);
      setChatError('Audio recording started. Click the same icon again to stop and send it.');
    } catch {
      setChatError('Microphone access was blocked or unavailable.');
    }
  };

  const stopAudioRecording = () => {
    if (audioRecorderRef.current && audioRecorderRef.current.state !== 'inactive') {
      audioRecorderRef.current.stop();
    }
  };

  const uploadRecordedAudio = async (file: File) => {
    setIsUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const attachment: Attachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type: 'audio',
        url: dataUrl,
        size: file.size,
        mimeType: file.type,
      };
      await send('Audio recording attached.', [attachment], 'voice');
    } catch {
      setChatError('Audio recording failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const startScreenRecording = async () => {
    setChatError('');
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        setChatError('Screen recording is not supported in this browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const recorder = new MediaRecorder(stream);
      recordingChunksRef.current = [];
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordingChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || 'video/webm' });
        const name = `screen-recording-${Date.now()}.webm`;
        const mimeType = blob.type || 'video/webm';
        const url = URL.createObjectURL(blob);
        const attachment: Attachment = {
          id: crypto.randomUUID(),
          name,
          type: 'video',
          url,
          size: blob.size,
          mimeType,
        };
        void send('Screen recording attached.', [attachment], 'screen');
        stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
        setIsScreenRecording(false);
      };
      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        if (recorder.state !== 'inactive') recorder.stop();
      });
      recorder.start();
      setIsScreenRecording(true);
      setChatError('Screen recording started. Stop recording from the chat bar when you are done.');
    } catch {
      setChatError('Screen recording was blocked or unavailable.');
    }
  };

  const stopScreenRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  };

  const openCamera = async () => {
    setCameraError('');
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }
    } catch {
      setCameraError('Camera or microphone access was blocked or unavailable.');
    }
  };

  const closeCamera = () => {
    if (cameraRecorderRef.current && cameraRecorderRef.current.state !== 'inactive') {
      cameraRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    cameraRecorderRef.current = null;
    cameraRecordingChunksRef.current = [];
    setIsCameraRecording(false);
    setCameraOpen(false);
  };

  const uploadRecordedVideo = async (file: File) => {
    setIsUploading(true);
    try {
      const url = URL.createObjectURL(file);
      const attachment: Attachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type: 'video',
        url,
        size: file.size,
        mimeType: file.type,
      };
      await send('Video recording attached.', [attachment], 'video');
    } catch {
      setChatError('Video recording failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const startCameraRecording = () => {
    if (!streamRef.current) {
      setCameraError('Camera preview is not ready yet.');
      return;
    }
    try {
      const recorder = new MediaRecorder(streamRef.current);
      cameraRecorderRef.current = recorder;
      cameraRecordingChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) cameraRecordingChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(cameraRecordingChunksRef.current, { type: recorder.mimeType || 'video/webm' });
        const file = new File([blob], `camera-recording-${Date.now()}.webm`, { type: 'video/webm' });
        cameraRecorderRef.current = null;
        cameraRecordingChunksRef.current = [];
        setIsCameraRecording(false);
        setCameraOpen(false);
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        await uploadRecordedVideo(file);
      };
      recorder.start();
      setIsCameraRecording(true);
      setCameraError('');
    } catch {
      setCameraError('Video recording could not be started in this browser.');
    }
  };

  const stopCameraRecording = () => {
    if (cameraRecorderRef.current && cameraRecorderRef.current.state !== 'inactive') {
      cameraRecorderRef.current.stop();
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setChatError('Message copied to clipboard.');
    } catch {
      setChatError('Copy failed in this browser.');
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.id === id);
      if (item?.url?.startsWith('blob:')) URL.revokeObjectURL(item.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const send = async (content: string, overrideAttachments: Attachment[] = attachments, inputModeOverride: 'text' | 'voice' | 'video' | 'screen' = isListening ? 'voice' : 'text') => {
    if (!content.trim() && overrideAttachments.length === 0) return;
    let sid = currentSessionId;
    if (!sid) { sid = await createNewSession(); }
    if (!sid) return;
    const session = sessions.find((s) => s.id === sid);
    setIsSending(true); setChatError('');
    try {
      const res = await sendMessage({
        sessionId: sid, modelId: activeModel.id, content,
        systemPrompt: session?.systemPrompt || requestedAgent?.systemPrompt,
        attachments: overrideAttachments.map((a) => ({ name: a.name, type: a.type, url: a.url, mimeType: a.mimeType, size: a.size })),
        inputMode: inputModeOverride, voiceMode: inputModeOverride === 'voice',
      }).unwrap();
      const norm = normalizeSession(res.session);
      setSessions((prev) => { const ex = prev.some((s) => s.id === norm.id); return ex ? prev.map((s) => s.id === norm.id ? norm : s) : [norm, ...prev]; });
      setCurrentSessionId(norm.id);
      setDraft('');
      pendingLaunchAttachmentsRef.current = [];
      setAttachments([]);
    } catch {
      const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content, attachments: overrideAttachments, timestamp: new Date().toISOString(), modelId: activeModel.id };
      const asst = createAssistant(activeModel.id, `Offline fallback using ${activeModel.name}: ${content}\n\nI can still help structure this request, but the backend was unavailable.`);
      setSessions((prev) => prev.map((s) => s.id === sid ? { ...s, modelId: activeModel.id, updatedAt: new Date().toISOString(), messages: [...s.messages, userMsg, asst] } : s));
      setDraft('');
      pendingLaunchAttachmentsRef.current = [];
      setAttachments([]);
      setChatError('Backend send failed — a local fallback response was used.');
    } finally { setIsSending(false); }
  };

  const handleSend = () => void send(draft);
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const setDraftAndFocus = (text: string) => { setDraft(text); setTimeout(() => inputRef.current?.focus(), 50); };
  const editMessage = (message: Message) => {
    setDraftAndFocus(message.content);
    if (message.attachments?.length) {
      const clonedAttachments = message.attachments.map((attachment) => ({
        ...attachment,
        id: crypto.randomUUID(),
      }));
      setAttachments(clonedAttachments);
    }
  };
  const openModelDetails = (tab: ModelDetailsTab = 'overview') => {
    setModelDetailsTab(tab);
    setModelDetailsOpen(true);
  };

  const deleteCurrentSession = async () => {
    if (!currentSessionId) return;
    if (isAuthenticated) { try { await deleteSession(currentSessionId).unwrap(); } catch { setChatError('Could not delete the session.'); } }
    setSessions((prev) => { const next = prev.filter((s) => s.id !== currentSessionId); setCurrentSessionId(next[0]?.id ?? null); return next; });
  };

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 106px)', overflow: 'hidden', bgcolor: '#F7F3EC' }}>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'column' }}>

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
              display: { xs: 'none', md: 'flex' },
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

            {/* mobile model picker trigger — hidden on md+ */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 0.75,
                borderBottom: '1px solid rgba(28,26,22,0.07)',
                bgcolor: 'rgba(255,255,255,0.72)',
                flexShrink: 0,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Box
                  sx={{
                    width: 22, height: 22, borderRadius: '7px',
                    bgcolor: `${activeModel.bgColor}20`,
                    color: activeModel.bgColor,
                    display: 'grid', placeItems: 'center',
                    fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
                  }}
                >
                  {activeModel.icon}
                </Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1C1A16' }}>
                  {activeModel.name}
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: 'rgba(28,26,22,0.45)' }}>
                  · {activeModel.lab}
                </Typography>
              </Stack>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setModelPickerOpen(true)}
                sx={{
                  textTransform: 'none', fontSize: '0.7rem', borderRadius: 99,
                  py: 0.25, px: 1.2,
                  borderColor: 'rgba(200,98,42,0.35)', color: '#C8622A',
                  '&:hover': { bgcolor: 'rgba(200,98,42,0.06)' },
                }}
              >
                Change
              </Button>
            </Box>

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
                    <Box sx={{ width: 36, height: 36, border: '1.5px solid rgba(200,98,42,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: '#C8622A', fontSize: '1.3rem', fontWeight: 600 }}>
                      +
                    </Box>
                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 0.8, fontSize: '1.45rem' }}>
                      Welcome! I&apos;m here to help you 🤚
                    </Typography>
                    <Typography sx={{ color: 'rgba(28,26,22,0.58)', fontSize: '0.84rem', mb: 2.2, maxWidth: 430, mx: 'auto', lineHeight: 1.7 }}>
                      No tech background needed. Tell me what you&apos;d like to{' '}
                      <Box component="span" sx={{ color: '#C8622A', fontWeight: 600 }}>achieve</Box>
                      {' '}— I&apos;ll help you discover what&apos;s possible, step by step.
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.75} justifyContent="center" sx={{ mb: 1.8 }}>
                      <Typography sx={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C89A75' }}>
                        ✦ What would you like to do today?
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
                      {WELCOME_ACTIONS.map(({ emoji, label, sub, prompt }) => (
                        <Box
                          key={label}
                          onClick={() => setDraftAndFocus(prompt)}
                          sx={{
                            p: 1.4,
                            borderRadius: '14px',
                            border: '1px solid rgba(28,26,22,0.08)',
                            bgcolor: 'rgba(255,255,255,0.82)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.18s ease',
                            '&:hover': {
                              border: '1px solid rgba(200,98,42,0.3)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{emoji}</Typography>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1C1A16', lineHeight: 1.3 }}>{label}</Typography>
                          <Typography sx={{ fontSize: '0.68rem', color: 'rgba(28,26,22,0.45)', lineHeight: 1.3 }}>{sub}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Typography sx={{ mt: 1.8, color: 'rgba(28,26,22,0.34)', fontSize: '0.72rem' }}>
                      Or type anything below — there are no wrong answers ↓
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
                      {msg.attachments && msg.attachments.length > 0 && (
                        <Stack spacing={0.9} sx={{ mt: 1 }}>
                          {msg.attachments.map((attachment) => (
                            attachment.type === 'image' && attachment.url ? (
                              <Box
                                key={attachment.id}
                                sx={{
                                  p: 1,
                                  borderRadius: 2,
                                  bgcolor: msg.role === 'user' ? 'rgba(255,255,255,0.14)' : 'rgba(28,26,22,0.06)',
                                }}
                              >
                                <Typography sx={{ fontSize: '0.72rem', mb: 0.6, opacity: 0.8 }}>
                                  {attachment.name}
                                </Typography>
                                <Box
                                  component="img"
                                  src={attachment.url}
                                  alt={attachment.name}
                                  sx={{
                                    width: '100%',
                                    maxWidth: 320,
                                    borderRadius: 2,
                                    display: 'block',
                                  }}
                                />
                              </Box>
                            ) : attachment.type === 'audio' && attachment.url ? (
                              <Box
                                key={attachment.id}
                                sx={{
                                  p: 1,
                                  borderRadius: 2,
                                  bgcolor: msg.role === 'user' ? 'rgba(255,255,255,0.14)' : 'rgba(28,26,22,0.06)',
                                }}
                              >
                                <Typography sx={{ fontSize: '0.72rem', mb: 0.6, opacity: 0.8 }}>
                                  {attachment.name}
                                </Typography>
                                <Box
                                  component="audio"
                                  controls
                                  src={attachment.url}
                                  sx={{
                                    width: { xs: '100%', sm: 260 },
                                    height: 36,
                                    display: 'block',
                                  }}
                                />
                              </Box>
                            ) : attachment.type === 'video' && attachment.url ? (
                              <Box
                                key={attachment.id}
                                sx={{
                                  p: 1,
                                  borderRadius: 2,
                                  bgcolor: msg.role === 'user' ? 'rgba(255,255,255,0.14)' : 'rgba(28,26,22,0.06)',
                                }}
                              >
                                <Typography sx={{ fontSize: '0.72rem', mb: 0.6, opacity: 0.8 }}>
                                  {attachment.name}
                                </Typography>
                                <video
                                  controls
                                  preload="auto"
                                  style={{ width: '100%', maxWidth: 320, borderRadius: 8, display: 'block', background: '#000' }}
                                >
                                  <source src={attachment.url} type={attachment.mimeType || 'video/webm'} />
                                </video>
                              </Box>
                            ) : (
                              <Chip
                                key={attachment.id}
                                label={attachment.name}
                                size="small"
                                component={attachment.url ? 'a' : 'div'}
                                clickable={Boolean(attachment.url)}
                                href={attachment.url}
                                target={attachment.url ? '_blank' : undefined}
                                rel={attachment.url ? 'noreferrer' : undefined}
                                sx={{
                                  width: 'fit-content',
                                  fontSize: '0.72rem',
                                  bgcolor: msg.role === 'user' ? 'rgba(255,255,255,0.14)' : 'rgba(28,26,22,0.06)',
                                  color: msg.role === 'user' ? '#fff' : '#1C1A16',
                                }}
                              />
                            )
                          ))}
                        </Stack>
                      )}
                      {(msg.role === 'assistant' || msg.role === 'user') && (
                        <Stack direction="row" spacing={0.25} sx={{ mt: 0.6 }}>
                          {msg.role === 'assistant' && (
                            <Tooltip title="Read aloud">
                              <IconButton size="small" onClick={() => speak(msg.content)} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
                                <VolumeUpOutlinedIcon sx={{ fontSize: '0.9rem' }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {msg.role === 'user' && (
                            <Tooltip title="Copy message">
                              <IconButton size="small" onClick={() => void copyMessage(msg.content)} sx={{ color: 'rgba(255,255,255,0.72)', '&:hover': { color: '#fff' } }}>
                                <ContentCopyOutlined sx={{ fontSize: '0.9rem' }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {msg.role === 'user' && (
                            <Tooltip title="Edit and resend">
                              <IconButton size="small" onClick={() => editMessage(msg)} sx={{ color: 'rgba(255,255,255,0.72)', '&:hover': { color: '#fff' } }}>
                                <EditOutlined sx={{ fontSize: '0.9rem' }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
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
                    a.type === 'image' && a.url ? (
                      <Box
                        key={a.id}
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          border: '1px solid rgba(28,26,22,0.08)',
                          bgcolor: 'rgba(255,255,255,0.72)',
                          minWidth: { xs: '100%', sm: 280 },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                          <Typography sx={{ fontSize: '0.74rem', color: '#1C1A16' }}>{a.name}</Typography>
                          <IconButton size="small" onClick={() => removeAttachment(a.id)}>
                            <CloseRoundedIcon sx={{ fontSize: '0.95rem' }} />
                          </IconButton>
                        </Stack>
                        <Box
                          component="img"
                          src={a.url}
                          alt={a.name}
                          sx={{
                            width: '100%',
                            maxWidth: 320,
                            borderRadius: 2,
                            display: 'block',
                          }}
                        />
                      </Box>
                    ) : a.type === 'audio' && a.url ? (
                      <Box
                        key={a.id}
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          border: '1px solid rgba(28,26,22,0.08)',
                          bgcolor: 'rgba(255,255,255,0.72)',
                          minWidth: { xs: '100%', sm: 280 },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                          <Typography sx={{ fontSize: '0.74rem', color: '#1C1A16' }}>{a.name}</Typography>
                          <IconButton size="small" onClick={() => removeAttachment(a.id)}>
                            <CloseRoundedIcon sx={{ fontSize: '0.95rem' }} />
                          </IconButton>
                        </Stack>
                        <Box component="audio" controls src={a.url} sx={{ width: '100%', height: 36, display: 'block' }} />
                      </Box>
                    ) : a.type === 'video' && a.url ? (
                      <Box
                        key={a.id}
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          border: '1px solid rgba(28,26,22,0.08)',
                          bgcolor: 'rgba(255,255,255,0.72)',
                          minWidth: { xs: '100%', sm: 280 },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                          <Typography sx={{ fontSize: '0.74rem', color: '#1C1A16' }}>{a.name}</Typography>
                          <IconButton size="small" onClick={() => removeAttachment(a.id)}>
                            <CloseRoundedIcon sx={{ fontSize: '0.95rem' }} />
                          </IconButton>
                        </Stack>
                        <video controls preload="auto" style={{ width: '100%', maxWidth: 320, borderRadius: 8, display: 'block', background: '#000' }}>
                          <source src={a.url} type={a.mimeType || 'video/webm'} />
                        </video>
                      </Box>
                    ) : (
                      <Chip key={a.id} label={a.name} size="small" onDelete={() => removeAttachment(a.id)} sx={{ fontSize: '0.75rem' }} />
                    )
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
                  placeholder={`Message ${activeModel.name}...`}
                  sx={{ width: '100%', px: 2, pt: 1.35, pb: 0.4, fontSize: '0.84rem', lineHeight: 1.55 }}
                />
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, pb: 1 }}>
                  <Stack direction="row" spacing={0.25}>
                    <Tooltip title={isAudioRecording ? 'Stop audio recording' : 'Record audio'}>
                      <IconButton size="small" onClick={() => void (isAudioRecording ? stopAudioRecording() : startAudioRecording())} disabled={isUploading} sx={{ color: isAudioRecording ? '#C8622A' : 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <VoiceConversationIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Voice to text">
                      <IconButton size="small" onClick={handleStartVoice} sx={{ color: isListening ? '#C8622A' : 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <VoiceTypingIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Record video">
                      <IconButton size="small" onClick={() => void openCamera()} disabled={isUploading} sx={{ color: isCameraRecording || cameraOpen ? '#C8622A' : 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <VideoInputIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={isScreenRecording ? 'Stop screen recording' : 'Screen recording'}>
                      <IconButton size="small" onClick={() => void (isScreenRecording ? stopScreenRecording() : startScreenRecording())} sx={{ color: isScreenRecording ? '#C8622A' : 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <ScreenShareIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Upload attachment">
                      <IconButton size="small" onClick={() => fileRef.current?.click()} disabled={isUploading} sx={{ color: 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <AttachFileIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Upload image">
                      <IconButton size="small" onClick={() => imageFileRef.current?.click()} disabled={isUploading} sx={{ color: 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <UploadImageIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Prompt Tips">
                      <IconButton size="small" onClick={() => openModelDetails('prompt-guide')} sx={{ color: 'rgba(28,26,22,0.45)', '&:hover': { color: '#C8622A' } }}>
                        <AutoAwesomeOutlined sx={{ fontSize: '1.05rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Chip
                      label={activeModel.name}
                      size="small"
                      onClick={() => setModelPickerOpen(true)}
                      sx={{ ml: 0.5, fontSize: '0.65rem', height: 20, bgcolor: 'rgba(200,98,42,0.08)', color: '#C8622A', fontWeight: 600, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(200,98,42,0.16)' } }}
                    />
                  </Stack>
                  <Tooltip title="Send (Enter)">
                    <span>
                      <IconButton
                        size="small"
                        onClick={handleSend}
                        disabled={isSending || (!draft.trim() && attachments.length === 0)}
                        sx={{
                          bgcolor: (draft.trim() || attachments.length > 0) ? '#D17331' : 'rgba(28,26,22,0.08)',
                          color: (draft.trim() || attachments.length > 0) ? '#fff' : 'rgba(28,26,22,0.35)',
                          borderRadius: '50%',
                          width: 31, height: 31,
                          '&:hover': { bgcolor: (draft.trim() || attachments.length > 0) ? '#A34D1E' : 'rgba(28,26,22,0.08)' },
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
            {/* ── ACTIVE MODEL ── */}
            <Box>
              <PanelLabel>Active Model</PanelLabel>
              <Paper
                elevation={0}
                sx={{
                  p: 1.4,
                  borderRadius: 3,
                  border: '1px solid rgba(28,26,22,0.08)',
                  bgcolor: 'rgba(255,255,255,0.92)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.9 }}>
                  <Box
                    sx={{
                      width: 34, height: 34, borderRadius: 2,
                      bgcolor: activeModel.bgColor || 'rgba(200,98,42,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: 700, color: '#C8622A', flexShrink: 0,
                    }}
                  >
                    {activeModel.icon}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.2, color: '#1C1A16' }}>
                      {activeModel.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.64rem', color: 'rgba(28,26,22,0.48)' }}>
                      by {activeModel.lab}
                    </Typography>
                  </Box>
                  <Box sx={{ px: 0.85, py: 0.2, borderRadius: 99, bgcolor: '#E6F7EC', border: '1px solid #A8D8B2', flexShrink: 0 }}>
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#2E7D4F', letterSpacing: '0.03em' }}>Live</Typography>
                  </Box>
                </Stack>

                <Typography sx={{ fontSize: '0.71rem', color: 'rgba(28,26,22,0.58)', lineHeight: 1.55, mb: 1.1 }}>
                  {activeModel.description}
                </Typography>

                <Stack direction="row" spacing={0.6} sx={{ mb: 1.2 }}>
                  {[
                    { val: activeModel.contextWindow, lbl: 'Context' },
                    { val: `$${activeModel.pricePerMToken.toFixed(2)}`, lbl: '/1M TK' },
                    { val: `${activeModel.rating}⭐`, lbl: 'Rating' },
                  ].map(({ val, lbl }) => (
                    <Box
                      key={lbl}
                      sx={{
                        flex: 1, textAlign: 'center', py: 0.65,
                        borderRadius: 2, bgcolor: 'rgba(28,26,22,0.04)',
                        border: '1px solid rgba(28,26,22,0.07)',
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, fontSize: '0.73rem', color: '#1C1A16' }}>{val}</Typography>
                      <Typography sx={{ fontSize: '0.57rem', color: 'rgba(28,26,22,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{lbl}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" spacing={0.8}>
                  <Button
                    size="small" variant="outlined" fullWidth
                    sx={{ textTransform: 'none', fontSize: '0.71rem', borderRadius: 2, borderColor: 'rgba(28,26,22,0.2)', color: '#1C1A16', py: 0.4, '&:hover': { borderColor: '#C8622A', color: '#C8622A' } }}
                    onClick={() => openModelDetails('overview')}
                  >
                    Details
                  </Button>
                  <Button
                    size="small" variant="outlined" fullWidth
                    sx={{ textTransform: 'none', fontSize: '0.71rem', borderRadius: 2, borderColor: '#C8622A', color: '#C8622A', py: 0.4, '&:hover': { bgcolor: 'rgba(200,98,42,0.06)' } }}
                    onClick={() => openModelDetails('pricing')}
                  >
                    Pricing
                  </Button>
                </Stack>
              </Paper>
            </Box>

            {/* ── USAGE OVERVIEW ── */}
            <Box>
              <PanelLabel>Usage Overview</PanelLabel>
              <Stack direction="row" spacing={0.6} sx={{ mb: 1 }}>
                {[
                  { val: currentSession?.messages.filter(m => m.role === 'user').length ?? 0, lbl: 'Requests' },
                  { val: `${(currentSession?.messages.length ?? 0) > 0 ? '1.2s' : '—'}`, lbl: 'Avg Latency' },
                  { val: `$${((currentSession?.messages.filter(m => m.role === 'user').length ?? 0) * 0.002).toFixed(3)}`, lbl: 'Cost Today' },
                ].map(({ val, lbl }) => (
                  <Paper
                    key={lbl}
                    elevation={0}
                    sx={{
                      flex: 1, textAlign: 'center', py: 0.9,
                      borderRadius: 2, bgcolor: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(28,26,22,0.07)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.62rem', color: 'rgba(28,26,22,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', mb: 0.2 }}>{lbl}</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1C1A16' }}>{val}</Typography>
                  </Paper>
                ))}
              </Stack>
              {/* mini bar chart */}
              <Paper elevation={0} sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.85)', border: '1px solid rgba(28,26,22,0.07)' }}>
                <Stack direction="row" alignItems="flex-end" spacing={0.4} sx={{ height: 40 }}>
                  {[0.3,0.5,0.4,0.7,0.6,0.9,0.5,0.8,0.6,0.4,0.7,0.5,0.8,0.9,0.6,0.7,0.5,0.4,0.6,0.8,0.7,0.5,0.9,0.6].map((h, i) => (
                    <Box
                      key={i}
                      sx={{
                        flex: 1,
                        height: `${h * 100}%`,
                        bgcolor: i % 3 === 0 ? '#C8622A' : 'rgba(200,98,42,0.25)',
                        borderRadius: '2px 2px 0 0',
                        minWidth: 0,
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Box>

            <Divider sx={{ opacity: 0.5 }} />

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
                  {group.items.map(({ label, Icon, href, prompt, detailTab }) => (
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
                        onClick={() => {
                          if (detailTab) {
                            openModelDetails(detailTab);
                            return;
                          }
                          setDraftAndFocus(prompt!);
                        }}
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

      <Dialog
        open={modelDetailsOpen}
        onClose={() => setModelDetailsOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 5,
            overflow: 'hidden',
            bgcolor: '#FFFDFC',
            boxShadow: '0 24px 80px rgba(28,26,22,0.18)',
          },
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3.5, py: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: `${activeModel.bgColor}18`,
                  color: activeModel.bgColor,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                }}
              >
                {activeModel.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '1.9rem', fontWeight: 700, color: '#1C1A16', lineHeight: 1.1 }}>
                  {providerModelName}
                </Typography>
                <Typography sx={{ fontSize: '1rem', color: 'rgba(28,26,22,0.58)' }}>
                  by {activeModel.lab} · {activeModel.description}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {activeModel.badge && (
                <Chip
                  label={activeModel.badge.toUpperCase()}
                  size="small"
                  sx={{ bgcolor: '#FFF1E7', color: '#D0672D', fontWeight: 700 }}
                />
              )}
              <IconButton onClick={() => setModelDetailsOpen(false)} sx={{ bgcolor: 'rgba(28,26,22,0.06)' }}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Divider />
          <Tabs
            value={modelDetailsTab}
            onChange={(_, value: ModelDetailsTab) => setModelDetailsTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2.5,
              minHeight: 48,
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontSize: '0.95rem',
                color: 'rgba(28,26,22,0.7)',
              },
              '& .Mui-selected': { color: '#D0672D', fontWeight: 700 },
              '& .MuiTabs-indicator': { backgroundColor: '#D0672D' },
            }}
          >
            {MODEL_DETAILS_TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </DialogTitle>
        <DialogContent sx={{ px: 3.5, py: 3, bgcolor: '#FFFDFC' }}>
          {modelDetailsTab === 'overview' && (
            <Stack spacing={2.25}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Paper elevation={0} sx={{ flex: 1, p: 2.25, borderRadius: 3, border: '1px solid rgba(28,26,22,0.08)', bgcolor: '#FBF7F1' }}>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(28,26,22,0.34)', mb: 1 }}>
                    Description
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(28,26,22,0.72)' }}>
                    {providerModelName} is a {activeModel.categories.join(', ')} model optimized for production usage, prompt experimentation, and practical app workflows inside NexusAI.
                  </Typography>
                </Paper>
                <Paper elevation={0} sx={{ flex: 1, p: 2.25, borderRadius: 3, border: '1px solid rgba(28,26,22,0.08)', bgcolor: '#FBF7F1' }}>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(28,26,22,0.34)', mb: 1 }}>
                    Input / Output
                  </Typography>
                  <Stack spacing={0.6}>
                    <Typography><Box component="span" sx={{ fontWeight: 700 }}>Input:</Box> text{supportsVision ? ', images' : ''}{supportsAudio ? ', audio' : ''}, files</Typography>
                    <Typography><Box component="span" sx={{ fontWeight: 700 }}>Output:</Box> text, structured data{supportsCode ? ', code' : ''}</Typography>
                    <Typography><Box component="span" sx={{ fontWeight: 700 }}>Context:</Box> {activeModel.contextWindow}</Typography>
                    <Typography><Box component="span" sx={{ fontWeight: 700 }}>Pricing:</Box> {activeModel.priceDisplay}</Typography>
                    <Typography><Box component="span" sx={{ fontWeight: 700 }}>Rating:</Box> {activeModel.rating} / 5 from {activeModel.reviewCount.toLocaleString()} reviews</Typography>
                  </Stack>
                </Paper>
              </Stack>
              <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: '1px solid rgba(28,26,22,0.08)', bgcolor: '#FBF7F1' }}>
                <Typography sx={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(28,26,22,0.34)', mb: 1.5 }}>
                  Use Cases
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 1.25 }}>
                  {['Content writing', supportsCode ? 'Code generation' : 'Workflow automation', 'Document analysis', 'Translation', 'Education'].map((item) => (
                    <Paper key={item} elevation={0} sx={{ p: 1.8, textAlign: 'center', borderRadius: 2.5, border: '1px solid rgba(28,26,22,0.07)', bgcolor: '#fff' }}>
                      <Typography sx={{ fontWeight: 600, color: '#1C1A16' }}>{item}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Stack>
          )}

          {modelDetailsTab === 'how-to-use' && (
            <Stack spacing={2}>
              <Box>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#1C1A16', mb: 0.5 }}>
                  How to Use This Model
                </Typography>
                <Typography sx={{ color: 'rgba(28,26,22,0.6)' }}>
                  Follow these steps to integrate and start getting value from {providerModelName} quickly.
                </Typography>
              </Box>
              {howToUseSteps.map((step, index) => (
                <Stack key={step.title} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(208,103,45,0.32)', color: '#D0672D', display: 'grid', placeItems: 'center', fontWeight: 700, flexShrink: 0 }}>
                    {index + 1}
                  </Box>
                  <Box sx={{ pt: 0.2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.04rem', mb: 0.25 }}>{step.title}</Typography>
                    <Typography sx={{ color: 'rgba(28,26,22,0.66)', lineHeight: 1.7 }}>{step.body}</Typography>
                    {index === 1 && (
                      <Paper elevation={0} sx={{ mt: 1.25, p: 1.5, borderRadius: 2.5, border: '1px solid rgba(28,26,22,0.08)', bgcolor: '#FBF7F1' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(28,26,22,0.34)' }}>
                            Quick Start
                          </Typography>
                          <Button size="small" sx={{ textTransform: 'none' }} onClick={() => setDraftAndFocus(`Help me integrate ${providerModelName} into my app. `)}>
                            Copy
                          </Button>
                        </Stack>
                        <Typography component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#1E4DA8', fontSize: '0.92rem', lineHeight: 1.8 }}>
{`import nexusai

client = nexusai.Client(api_key="YOUR_KEY")
response = client.chat(
  model="${activeModel.id}",
  messages=[{"role": "user", "content": "Hello!"}]
)

print(response.content)`}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          )}

          {modelDetailsTab === 'pricing' && (
            <Stack spacing={2.25}>
              <Typography sx={{ color: 'rgba(28,26,22,0.64)', fontSize: '1rem' }}>
                Choose the plan that fits your usage. All plans include access to {providerModelName}, docs, and support.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                {[
                  { title: 'Pay-per-use', price: activeModel.priceDisplay, sub: 'best for light usage', items: ['No monthly commitment', `Context window: ${activeModel.contextWindow}`, 'Standard support', 'Usage-based billing'] },
                  { title: 'Pro Subscription', price: '$49 / month', sub: 'best for teams', items: ['Lower per-token cost', 'Priority support', 'Usage dashboard', 'Higher rate limits'], featured: true },
                  { title: 'Enterprise', price: 'Custom', sub: 'best for scale', items: ['Volume discounts', 'Dedicated capacity', 'SLA and compliance', 'Fine-tuning support'] },
                ].map((plan) => (
                  <Paper key={plan.title} elevation={0} sx={{ p: 2.25, borderRadius: 3, border: plan.featured ? '1.5px solid #E7773C' : '1px solid rgba(28,26,22,0.08)', bgcolor: '#fff', position: 'relative' }}>
                    {plan.featured && (
                      <Chip label="Most Popular" size="small" sx={{ position: 'absolute', top: -12, left: 18, bgcolor: '#E7773C', color: '#fff', fontWeight: 700 }} />
                    )}
                    <Typography sx={{ textTransform: 'uppercase', color: 'rgba(28,26,22,0.35)', fontWeight: 800, textAlign: 'center', mt: 1 }}>
                      {plan.title}
                    </Typography>
                    <Typography sx={{ fontSize: '2.1rem', fontWeight: 700, textAlign: 'center', color: '#1C1A16', mt: 1 }}>
                      {plan.price}
                    </Typography>
                    <Typography sx={{ textAlign: 'center', color: 'rgba(28,26,22,0.5)', mb: 2 }}>
                      {plan.sub}
                    </Typography>
                    <Stack spacing={0.8}>
                      {plan.items.map((item) => (
                        <Typography key={item} sx={{ color: 'rgba(28,26,22,0.7)' }}>✓ {item}</Typography>
                      ))}
                    </Stack>
                  </Paper>
                ))}
              </Box>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: '#EDF4FF', border: '1px solid #C7D8FF', color: '#2854A3' }}>
                Free tier available: start testing prompts and compare models before committing to production usage.
              </Paper>
            </Stack>
          )}

          {modelDetailsTab === 'prompt-guide' && (
            <Stack spacing={2}>
              <Box>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#1C1A16', mb: 0.5 }}>
                  Prompt Engineering for {providerModelName}
                </Typography>
                <Typography sx={{ color: 'rgba(28,26,22,0.6)' }}>
                  Well-crafted prompts improve output quality. Use these patterns to get more reliable answers from the selected model.
                </Typography>
              </Box>
              {promptGuideExamples.map((example) => (
                <Paper key={example.title} elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid rgba(28,26,22,0.08)', bgcolor: '#FBF7F1' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(28,26,22,0.34)' }}>
                      {example.title}
                    </Typography>
                    <Button size="small" sx={{ textTransform: 'none' }} onClick={() => setDraftAndFocus(example.lines.join('\n'))}>
                      Copy
                    </Button>
                  </Stack>
                  <Typography component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#214EB6', fontSize: '0.92rem', lineHeight: 1.8 }}>
                    {example.lines.join('\n')}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          )}

          {modelDetailsTab === 'agent-creation' && (
            <Stack spacing={2.25}>
              <Box>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#1C1A16', mb: 0.5 }}>
                  Build an Agent with {providerModelName}
                </Typography>
                <Typography sx={{ color: 'rgba(28,26,22,0.6)' }}>
                  Turn the selected model into a reusable workflow by combining instructions, tools, memory, and success checks.
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 1.5 }}>
                {[
                  ['1. Define the role', `Start with a clear mission for ${providerModelName}, such as support copilot, analyst, or coding assistant.`],
                  ['2. Add instructions', 'Write system guidance covering tone, constraints, escalation, and output format.'],
                  ['3. Connect tools', 'Attach search, document, CRM, or internal APIs so the agent can take useful actions.'],
                  ['4. Test and refine', 'Run realistic conversations, inspect edge cases, and tighten prompts before publishing.'],
                ].map(([title, body]) => (
                  <Paper key={title} elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(28,26,22,0.08)', bgcolor: '#FBF7F1' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.6 }}>{title}</Typography>
                    <Typography sx={{ color: 'rgba(28,26,22,0.66)', lineHeight: 1.7 }}>{body}</Typography>
                  </Paper>
                ))}
              </Box>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(231,119,60,0.25)', bgcolor: '#FFF4EC' }}>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Suggested starter prompt</Typography>
                <Typography component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.92rem', lineHeight: 1.75, color: '#7A3E1E' }}>
{`You are an expert ${providerModelName} agent.
Goal: help the user complete tasks accurately and efficiently.
Rules:
- ask only essential clarifying questions
- provide structured output
- flag risk and uncertainty clearly`}
                </Typography>
              </Paper>
            </Stack>
          )}

          {modelDetailsTab === 'reviews' && (
            <Stack spacing={2.25}>
              <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: '1px solid rgba(28,26,22,0.08)', bgcolor: '#FBF7F1' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                  <Box sx={{ minWidth: 110 }}>
                    <Typography sx={{ fontSize: '3rem', fontWeight: 700, color: '#1C1A16', lineHeight: 1 }}>
                      {activeModel.rating.toFixed(1)}
                    </Typography>
                    <Typography sx={{ color: '#D58A21', fontSize: '1.1rem' }}>
                      {'★★★★★'.slice(0, Math.round(activeModel.rating))}
                    </Typography>
                    <Typography sx={{ color: 'rgba(28,26,22,0.5)' }}>{activeModel.reviewCount.toLocaleString()} reviews</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    {[72, 20, 6, 2].map((pct, idx) => (
                      <Stack key={pct} direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                        <Typography sx={{ width: 12, color: 'rgba(28,26,22,0.6)' }}>{5 - idx}</Typography>
                        <Box sx={{ flex: 1, height: 7, borderRadius: 99, bgcolor: 'rgba(28,26,22,0.08)', overflow: 'hidden' }}>
                          <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: '#E9A03B' }} />
                        </Box>
                        <Typography sx={{ width: 36, color: 'rgba(28,26,22,0.45)' }}>{pct}%</Typography>
                      </Stack>
                    ))}
                  </Box>
                </Stack>
              </Paper>
              {reviewCards.map((review) => (
                <Box key={review.name} sx={{ pb: 2, borderBottom: '1px solid rgba(28,26,22,0.08)' }}>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.02rem' }}>{review.name}</Typography>
                      <Typography sx={{ color: 'rgba(28,26,22,0.45)', mb: 1 }}>{review.role}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ color: '#E9A03B' }}>{'★★★★★'.slice(0, review.rating)}</Typography>
                      <Typography sx={{ color: 'rgba(28,26,22,0.45)' }}>{review.date}</Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ color: 'rgba(28,26,22,0.72)', lineHeight: 1.8 }}>
                    {review.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3.5, pb: 2.5, pt: 0 }}>
          <Button onClick={() => setModelDetailsOpen(false)} sx={{ textTransform: 'none', color: 'rgba(28,26,22,0.62)' }}>
            Close
          </Button>
          <Button variant="contained" onClick={() => setDraftAndFocus(`Help me use ${providerModelName} effectively. `)} sx={{ textTransform: 'none', borderRadius: 99, bgcolor: '#D0672D', '&:hover': { bgcolor: '#B85B25' } }}>
            Ask in Chat
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── mobile model picker drawer ── */}
      <Drawer
        anchor="bottom"
        open={modelPickerOpen}
        onClose={() => setModelPickerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px 20px 0 0',
            maxHeight: '72vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#FAFAF8',
          },
        }}
      >
        {/* handle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.2, pb: 0.5 }}>
          <Box sx={{ width: 36, height: 4, borderRadius: 99, bgcolor: 'rgba(28,26,22,0.14)' }} />
        </Box>

        {/* header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1C1A16' }}>Select Model</Typography>
          <IconButton size="small" onClick={() => setModelPickerOpen(false)}>
            <CloseRoundedIcon sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        </Stack>

        {/* search */}
        <Box sx={{ px: 1.5, pb: 1 }}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.75,
              px: 1.1, py: 0.7, borderRadius: 2,
              bgcolor: '#FBF8F4', border: '1px solid rgba(28,26,22,0.1)',
            }}
          >
            <SearchRounded sx={{ fontSize: '0.95rem', color: 'rgba(28,26,22,0.4)' }} />
            <InputBase
              value={modelQuery}
              onChange={(e) => setModelQuery(e.target.value)}
              placeholder={`Search ${models.length} models...`}
              sx={{ flex: 1, fontSize: '0.85rem', '& input': { p: 0 } }}
            />
          </Paper>
        </Box>

        {/* model list */}
        <Box
          sx={{
            flex: 1, overflowY: 'auto', px: 1.5, pb: 3,
            '&::-webkit-scrollbar': { width: 3 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(28,26,22,0.15)', borderRadius: 2 },
          }}
        >
          <Stack spacing={0.4}>
            {filteredModels.map((model) => (
              <Box
                key={model.id}
                onClick={() => { setActiveModelId(model.id); setModelPickerOpen(false); }}
                sx={{
                  px: 1.2, py: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: model.id === activeModel.id ? 'rgba(200,98,42,0.1)' : 'rgba(255,255,255,0.9)',
                  border: model.id === activeModel.id ? '1px solid rgba(200,98,42,0.25)' : '1px solid rgba(28,26,22,0.07)',
                  transition: 'all 0.15s ease',
                  '&:hover': { bgcolor: 'rgba(200,98,42,0.06)', borderColor: 'rgba(200,98,42,0.2)' },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 30, height: 30, borderRadius: '9px',
                      bgcolor: `${model.bgColor}20`,
                      color: model.bgColor,
                      display: 'grid', placeItems: 'center',
                      fontSize: '0.82rem', fontWeight: 800, flexShrink: 0,
                    }}
                  >
                    {model.icon}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1C1A16', lineHeight: 1.2 }}>
                      {model.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(28,26,22,0.48)' }}>
                      {model.lab}
                    </Typography>
                  </Box>
                  {model.id === activeModel.id && (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#C8622A', flexShrink: 0 }} />
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Drawer>

      {/* camera dialog */}
      <Dialog open={cameraOpen} onClose={closeCamera} fullWidth maxWidth="md">
        <DialogTitle>{isCameraRecording ? 'Recording video' : 'Record video'}</DialogTitle>
        <DialogContent>
          {cameraError
            ? <Alert severity="error">{cameraError}</Alert>
            : <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: 12, background: '#000' }} />}
          {!cameraError && (
            <Typography sx={{ mt: 1, fontSize: '0.82rem', color: 'rgba(28,26,22,0.62)' }}>
              {isCameraRecording ? 'Recording from camera and microphone. Stop to send it straight into the chat.' : 'Preview is live. Start recording when you are ready.'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => videoFileRef.current?.click()}>Choose video file</Button>
          <Button onClick={closeCamera}>Cancel</Button>
          <Button variant="contained" onClick={isCameraRecording ? stopCameraRecording : startCameraRecording}>
            {isCameraRecording ? 'Stop and send' : 'Start recording'}
          </Button>
        </DialogActions>
      </Dialog>

      <input ref={videoFileRef} hidden type="file" accept="video/*" multiple onChange={(e) => void uploadFiles(e.target.files)} />
      <input ref={fileRef} hidden type="file" multiple onChange={(e) => void uploadFiles(e.target.files)} />
      <input ref={imageFileRef} hidden type="file" accept="image/*" multiple onChange={(e) => void uploadFiles(e.target.files)} />
    </Box>
  );
}

export default ChatPageContent;
