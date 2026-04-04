"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/* ── data ──────────────────────────────────────────────────────── */

interface Option {
  emoji: string;
  label: string;
  sub: string;
  value: string;
}

interface Step {
  question: string;
  hint: string;
  options: Option[];
}

const STEPS: Step[] = [
  {
    question: "What do you want to do?",
    hint: "Pick whichever feels closest — there's no wrong answer 😊",
    options: [
      { emoji: "🚀", label: "Write something",           sub: "Emails, posts, stories, reports",     value: "write content" },
      { emoji: "🎨", label: "Make pictures or art",      sub: "Images, logos, designs, photos",      value: "create images or art" },
      { emoji: "💻", label: "Build something",           sub: "Websites, apps, tools, scripts",      value: "build or code something" },
      { emoji: "📊", label: "Make sense of info",        sub: "Files, numbers, documents, data",     value: "analyze or summarize information" },
      { emoji: "⚡", label: "Save time on boring tasks", sub: "Things that repeat every day",         value: "automate or speed up repetitive tasks" },
      { emoji: "💬", label: "Get help or answers",       sub: "Questions, ideas, brainstorming",     value: "get answers or brainstorm ideas" },
    ],
  },
  {
    question: "What best describes you?",
    hint: "Just pick the one that feels most like you",
    options: [
      { emoji: "🎓", label: "Still learning",         sub: "Student or new to this field",         value: "a student or learner" },
      { emoji: "💼", label: "I work in an office",    sub: "Business, meetings, spreadsheets",     value: "an office worker" },
      { emoji: "🎨", label: "I make things",          sub: "Art, design, writing, content",        value: "a creative person" },
      { emoji: "🏃", label: "I run or sell things",   sub: "Shop, brand, marketing, clients",     value: "a business owner or seller" },
      { emoji: "💻", label: "I build with computers", sub: "Code, websites, tech stuff",           value: "a developer or tech person" },
      { emoji: "🏠", label: "Just for myself",        sub: "Personal projects and hobbies",        value: "someone working on personal projects" },
    ],
  },
  {
    question: "Where will you use this?",
    hint: "This helps me recommend the right thing",
    options: [
      { emoji: "📊", label: "At work",                 sub: "My job or business",                   value: "at work" },
      { emoji: "🎓", label: "For school or study",     sub: "Learning, homework, research",         value: "for school or study" },
      { emoji: "📱", label: "Online or social media",  sub: "Posts, videos, followers",             value: "for online or social media" },
      { emoji: "🛒", label: "For a product or shop",   sub: "Something to sell or describe",        value: "for a product or shop" },
      { emoji: "🔍", label: "Just exploring",          sub: "Seeing what's out there",              value: "just exploring" },
    ],
  },
  {
    question: "How should it sound when it talks to you?",
    hint: "Think of the vibe you'd want from a helper",
    options: [
      { emoji: "😊", label: "Warm and friendly",  sub: "Like chatting with a mate",             value: "warm and friendly" },
      { emoji: "📋", label: "Clean and proper",   sub: "Like a polished business email",        value: "clean and professional" },
      { emoji: "📖", label: "Clear and easy",     sub: "Simple words, step-by-step",            value: "clear and simple" },
      { emoji: "🚀", label: "Bold and exciting",  sub: "Energetic, confident, punchy",          value: "bold and energetic" },
    ],
  },
  {
    question: "What should the answer look like?",
    hint: "How do you want to receive the result?",
    options: [
      { emoji: "📄", label: "A full piece of writing",   sub: "Ready to copy and use",              value: "a full written piece" },
      { emoji: "📝", label: "A simple list",             sub: "Clear bullet points or steps",       value: "a bullet-point list" },
      { emoji: "📊", label: "A short summary",           sub: "Just the key points",                value: "a short summary" },
      { emoji: "💡", label: "A few different ideas",     sub: "Options to pick from",               value: "multiple options or ideas" },
      { emoji: "💬", label: "Explained in plain words",  sub: "Like a friend explaining it",        value: "an easy plain-language explanation" },
    ],
  },
  {
    question: "Who will see or use this?",
    hint: "Who's it for?",
    options: [
      { emoji: "👤", label: "Just me",                sub: "My personal notes or use",            value: "just for myself" },
      { emoji: "👥", label: "My team or coworkers",   sub: "People I work with",                  value: "for my team or colleagues" },
      { emoji: "🛒", label: "Customers or clients",   sub: "People who buy from me",              value: "for customers or clients" },
      { emoji: "🌍", label: "Anyone and everyone",    sub: "The general public",                  value: "for the general public" },
    ],
  },
  {
    question: "How much detail do you want?",
    hint: "This shapes how thorough the answer is",
    options: [
      { emoji: "⚡", label: "Short and sweet",    sub: "Quick, no extra info",           value: "short and concise" },
      { emoji: "📋", label: "Full and detailed",  sub: "Cover everything properly",     value: "fully detailed and thorough" },
      { emoji: "🎯", label: "One clear answer",   sub: "Just tell me the best option",  value: "one clear direct answer" },
      { emoji: "🧩", label: "Bite-sized pieces",  sub: "Break it into small chunks",    value: "broken into small digestible steps" },
    ],
  },
  {
    question: "Have you used AI tools before?",
    hint: "Totally fine if you haven't — that's what I'm here for!",
    options: [
      { emoji: "👋", label: "Never tried it",         sub: "Complete beginner",                     value: "a complete beginner with AI" },
      { emoji: "😀", label: "A little bit",            sub: "Played around with ChatGPT etc.",      value: "someone who has tried AI a little" },
      { emoji: "🧠", label: "I use it regularly",     sub: "Comfortable with AI already",           value: "a regular AI user" },
      { emoji: "🔧", label: "I build things with it", sub: "Connecting it to apps and code",        value: "an advanced AI developer" },
    ],
  },
  {
    question: "Anything you want to avoid?",
    hint: "Totally optional — skip if you're not sure",
    options: [
      { emoji: "🔒", label: "Keep it simple",  sub: "No big words or confusing terms",    value: "overly complex language" },
      { emoji: "🌐", label: "Stay neutral",    sub: "No strong opinions or bias",         value: "strong opinions or bias" },
      { emoji: "🎯", label: "Be direct",       sub: "No fluff, straight to the point",   value: "unnecessary filler content" },
      { emoji: "✅", label: "No preference",   sub: "Whatever works best is fine",        value: "nothing in particular" },
    ],
  },
];

/* ── prompt builder ────────────────────────────────────────────── */

function buildPrompt(answers: (string | null)[]): string {
  const [goal, role, context, tone, format, audience, detail, experience, avoid] = answers;
  const parts: string[] = [];
  if (goal)       parts.push(`I want to ${goal}.`);
  if (role)       parts.push(`I am ${role}.`);
  if (context)    parts.push(`I will use this ${context}.`);
  if (audience)   parts.push(`This is ${audience}.`);
  if (tone)       parts.push(`Please use a ${tone} tone.`);
  if (format)     parts.push(`Present the answer as ${format}.`);
  if (detail)     parts.push(`Keep the response ${detail}.`);
  if (experience) parts.push(`My AI experience level: ${experience}.`);
  if (avoid && avoid !== "nothing in particular")
    parts.push(`Please avoid ${avoid}.`);
  parts.push("Help me get started.");
  return parts.join(" ");
}

/* ── sub-components ────────────────────────────────────────────── */

function OptionCard({
  option,
  selected,
  onClick,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: "10px 14px",
        borderRadius: "10px",
        border: selected
          ? "1.5px solid #C8622A"
          : "1.5px solid rgba(28,26,22,0.1)",
        bgcolor: selected ? "rgba(200,98,42,0.05)" : "#FAFAF8",
        cursor: "pointer",
        transition: "all 0.13s ease",
        "&:hover": { border: "1.5px solid rgba(200,98,42,0.45)", bgcolor: "rgba(200,98,42,0.03)" },
      }}
    >
      <Typography sx={{ fontSize: "1.2rem", lineHeight: 1, flexShrink: 0 }}>{option.emoji}</Typography>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#1C1A16", lineHeight: 1.3 }}>
          {option.label}
        </Typography>
        <Typography sx={{ fontSize: "0.74rem", color: "rgba(28,26,22,0.52)", lineHeight: 1.3 }}>
          {option.sub}
        </Typography>
      </Box>
    </Box>
  );
}

function optionGridSize(options: Option[], index: number): number {
  return options.length % 2 === 1 && index === options.length - 1 ? 12 : 6;
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {Array.from({ length: total }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: i === current ? 18 : 7,
            height: 7,
            borderRadius: 99,
            bgcolor: i <= current ? "#C8622A" : "rgba(28,26,22,0.15)",
            transition: "all 0.25s ease",
          }}
        />
      ))}
    </Stack>
  );
}

/* ── main component ────────────────────────────────────────────── */

interface GuidedWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (prompt: string) => void;
}

export function GuidedWizard({ open, onClose, onComplete }: GuidedWizardProps) {
  const [phase, setPhase] = useState<"welcome" | "questions" | "building">("welcome");
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(STEPS.length).fill(null));
  const [selected, setSelected] = useState<string | null>(null);
  const [welcomeReady, setWelcomeReady] = useState(false);
  const answersRef = useRef(answers);
  const onCompleteRef = useRef(onComplete);
  answersRef.current = answers;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (open) {
      setPhase("welcome");
      setStepIdx(0);
      setAnswers(Array(STEPS.length).fill(null));
      setSelected(null);
      setWelcomeReady(false);
      const t = setTimeout(() => setWelcomeReady(true), 1800);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (phase !== "building") return;
    const t = setTimeout(() => {
      onCompleteRef.current(buildPrompt(answersRef.current));
    }, 1800);
    return () => clearTimeout(t);
  }, [phase]);

  const handleOptionClick = (value: string) => {
    setSelected(value);
    const newAnswers = [...answers];
    newAnswers[stepIdx] = value;
    setAnswers(newAnswers);
    // Auto-advance after brief pause so user sees selection
    setTimeout(() => {
      setSelected(null);
      if (stepIdx < STEPS.length - 1) {
        setStepIdx((i) => i + 1);
      } else {
        setPhase("building");
      }
    }, 260);
  };

  const handleSkip = () => {
    if (phase === "welcome") { onClose(); return; }
    const newAnswers = [...answers];
    newAnswers[stepIdx] = null;
    setAnswers(newAnswers);
    if (stepIdx < STEPS.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      setPhase("building");
    }
  };

  const currentStep = STEPS[stepIdx];

  return (
    <Dialog
      open={open}
      onClose={phase === "building" ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: "20px",
          border: "1.5px solid #C8622A",
          boxShadow: "0 24px 64px rgba(200,98,42,0.14), 0 8px 24px rgba(0,0,0,0.08)",
          overflow: "hidden",
          mx: 2,
        },
      }}
      slotProps={{
        backdrop: {
          sx: { bgcolor: "rgba(247,243,236,0.7)", backdropFilter: "blur(4px)" },
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>

        {/* ── WELCOME ─────────────────────────────────────────── */}
        {phase === "welcome" && (
          <Box sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
            <Typography sx={{ fontSize: "2rem", mb: 1.5 }}>✨👋✨</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: "#1C1A16", mb: 1 }}>
              Welcome! You&apos;re in the right place.
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "rgba(28,26,22,0.6)", mb: 3, maxWidth: 420, mx: "auto" }}>
              You&apos;re in a place where AI can help you explore ideas, solve problems, and create things faster —
              even if you&apos;ve never used AI before.
            </Typography>

            <Stack spacing={1} sx={{ textAlign: "left", mb: 3 }}>
              {[
                { emoji: "🧩", text: "No tech knowledge needed — we'll explain everything in plain language" },
                { emoji: "💬", text: "Just answer a few simple questions about what you'd like to do" },
                { emoji: "🚀", text: "We'll build your first AI request together — step by step" },
              ].map((item) => (
                <Box
                  key={item.emoji}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.5,
                    p: "10px 14px", borderRadius: "10px",
                    border: "1px solid rgba(28,26,22,0.08)", bgcolor: "#FAFAF8",
                  }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>{item.emoji}</Typography>
                  <Typography sx={{ fontSize: "0.84rem", color: "rgba(28,26,22,0.72)" }}>{item.text}</Typography>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: "0.75rem", color: "rgba(28,26,22,0.45)", mb: 0.8 }}>
                {welcomeReady ? "Ready!" : "Preparing your questions..."}
              </Typography>
              <LinearProgress
                variant={welcomeReady ? "determinate" : "indeterminate"}
                value={welcomeReady ? 100 : undefined}
                sx={{
                  height: 4, borderRadius: 99,
                  bgcolor: "rgba(200,98,42,0.1)",
                  "& .MuiLinearProgress-bar": { bgcolor: "#C8622A", borderRadius: 99 },
                }}
              />
            </Box>

            <Button
              variant="contained"
              disabled={!welcomeReady}
              onClick={() => setPhase("questions")}
              startIcon={<span>✨</span>}
              sx={{
                borderRadius: 99, px: 3.5, py: 1.1, fontWeight: 700,
                fontSize: "0.95rem", boxShadow: "none", mb: 1,
              }}
            >
              Let&apos;s get started
            </Button>
            <Box>
              <Typography
                component="span"
                onClick={onClose}
                sx={{
                  fontSize: "0.8rem", color: "rgba(28,26,22,0.45)",
                  cursor: "pointer", "&:hover": { color: "#C8622A" },
                }}
              >
                Skip — search directly
              </Typography>
            </Box>
          </Box>
        )}

        {/* ── QUESTIONS ───────────────────────────────────────── */}
        {phase === "questions" && currentStep && (
          <Box sx={{ p: { xs: 3, md: 3.5 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", color: "#1C1A16", mb: 0.5 }}>
              {currentStep.question}
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: "rgba(28,26,22,0.5)", mb: 2.2, fontStyle: "italic" }}>
              {currentStep.hint}
            </Typography>

            <Grid container spacing={1}>
              {currentStep.options.map((opt, idx) => (
                <Grid key={opt.value} size={optionGridSize(currentStep.options, idx)}>
                  <OptionCard
                    option={opt}
                    selected={selected === opt.value || answers[stepIdx] === opt.value}
                    onClick={() => handleOptionClick(opt.value)}
                  />
                </Grid>
              ))}
            </Grid>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2.5 }}>
              <ProgressDots total={STEPS.length} current={stepIdx} />
              <Typography
                component="span"
                onClick={handleSkip}
                sx={{
                  fontSize: "0.78rem", color: "rgba(28,26,22,0.4)",
                  cursor: "pointer", "&:hover": { color: "#C8622A" },
                  border: "1px solid rgba(28,26,22,0.15)",
                  borderRadius: "6px", px: 1, py: 0.4,
                }}
              >
                Not sure, skip →
              </Typography>
            </Stack>
          </Box>
        )}

        {/* ── BUILDING ────────────────────────────────────────── */}
        {phase === "building" && (
          <Box sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
            <Typography sx={{ fontSize: "2rem", mb: 2 }}>✨</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#1C1A16", mb: 0.8 }}>
              Building your personalised query...
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "rgba(28,26,22,0.5)" }}>
              Taking you to the Hub right away
            </Typography>
            <LinearProgress
              sx={{
                mt: 3, height: 4, borderRadius: 99,
                bgcolor: "rgba(200,98,42,0.1)",
                "& .MuiLinearProgress-bar": { bgcolor: "#C8622A", borderRadius: 99 },
              }}
            />
          </Box>
        )}

      </DialogContent>
    </Dialog>
  );
}
