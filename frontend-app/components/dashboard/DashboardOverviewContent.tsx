"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import SvgIcon from "@mui/material/SvgIcon";
import AudiotrackRounded from "@mui/icons-material/AudiotrackRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import BadgeRounded from "@mui/icons-material/BadgeRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import DashboardCustomizeRounded from "@mui/icons-material/DashboardCustomizeRounded";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import InsertChartOutlinedRounded from "@mui/icons-material/InsertChartOutlinedRounded";
import LockOutlined from "@mui/icons-material/LockOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TranslateRounded from "@mui/icons-material/TranslateRounded";
import EditOutlined from "@mui/icons-material/EditOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import { useLanguage } from "@/components/providers/LanguageProvider";
import homeSections from "@/lib/data/home-sections.json";

const heroActions = [
  {
    title: "Create image",
    hint: "visual concepts",
    color: "#F7D7E6",
    Icon: DashboardCustomizeRounded,
    iconColor: "#CC6C34",
  },
  {
    title: "Generate Audio",
    hint: "voice and sound",
    color: "#DDD7FB",
    Icon: AudiotrackRounded,
    iconColor: "#5F4BC8",
  },
  {
    title: "Create video",
    hint: "storyboards",
    color: "#E7DDFB",
    Icon: LockOutlined,
    iconColor: "#5B61C9",
  },
  {
    title: "Create slides",
    hint: "pitch decks",
    color: "#DDF7EB",
    Icon: CheckCircleRounded,
    iconColor: "#C86A34",
  },
  {
    title: "Create Infographs",
    hint: "explainer layouts",
    color: "#DDE9FB",
    Icon: InsertChartOutlinedRounded,
    iconColor: "#5B7DCC",
  },
  {
    title: "Create quiz",
    hint: "assessment flow",
    color: "#FBE6F0",
    Icon: HelpOutlineRounded,
    iconColor: "#CC6C34",
  },
  {
    title: "Create Flashcards",
    hint: "study set",
    color: "#FDE7B0",
    Icon: SearchOutlined,
    iconColor: "#CC8C22",
  },
  {
    title: "Create Mind map",
    hint: "idea clusters",
    color: "#FBD9EC",
    Icon: CancelOutlined,
    iconColor: "#5B61C9",
  },
  {
    title: "Analyze Data",
    hint: "signal review",
    color: "#E8E7FB",
    Icon: BadgeRounded,
    iconColor: "#A24E22",
  },
  {
    title: "Write content",
    hint: "copy drafting",
    color: "#FFE2C4",
    Icon: EditOutlined,
    iconColor: "#C86A34",
  },
  {
    title: "Code Generation",
    hint: "implementation help",
    color: "#DCEBFF",
    Icon: FolderOutlined,
    iconColor: "#5B7DCC",
  },
  {
    title: "Document Analysis",
    hint: "document review",
    color: "#ECE9E6",
    Icon: CheckCircleRounded,
    iconColor: "#C86A34",
  },
  {
    title: "Translate",
    hint: "localization",
    color: "#E3F0FF",
    Icon: TranslateRounded,
    iconColor: "#5B7DCC",
  },
  {
    title: "Just Exploring",
    hint: "guided discovery",
    color: "#F7F0E4",
    Icon: AutoAwesomeRounded,
    iconColor: "#A89A82",
  },
];

function VoiceConversationIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </SvgIcon>
  );
}

function VoiceTypingIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </SvgIcon>
  );
}

function ScreenShareIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <polyline points="8 21 12 17 16 21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </SvgIcon>
  );
}

function AttachFileIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </SvgIcon>
  );
}

function UploadImageIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </SvgIcon>
  );
}

const inputModes = [
  { mode: "audio", Icon: VoiceConversationIcon },
  { mode: "speech-to-text", Icon: VoiceTypingIcon },
  { mode: "video", Icon: VideoInputIcon },
  { mode: "screen", Icon: ScreenShareIcon },
  { mode: "attachment", Icon: AttachFileIcon },
  { mode: "image", Icon: UploadImageIcon },
];

const featuredTints = [
  "#FFE2CF",
  "#E2EBFF",
  "#E6F7EA",
  "#F4E6FF",
  "#FFECC4",
  "#DFF4F3",
  "#FBE0E0",
  "#EBE5FF",
];
const labTints = [
  "#FFF0E7",
  "#EDF4FF",
  "#EEF9F0",
  "#F7ECFF",
  "#FFF7DE",
  "#E9F7F7",
  "#FBE8EF",
  "#EEF1FF",
  "#F2F7EA",
  "#F8EFEB",
];

export function DashboardOverviewContent() {
  const router = useRouter();
  const { language } = useLanguage();
  const [draft, setDraft] = useState("");

  const localizedHero = useMemo(() => {
    const map: Record<
      string,
      { title1: string; title2: string; subtitle: string; placeholder: string }
    > = {
      "ur-PK": {
        title1: "Apne liye behtareen",
        title2: "AI model muntakhib karein",
        subtitle:
          "Sirf aik box se aghaz karein. Hum baqi sab aap ke sath sambhalein ge.",
        placeholder: "Yahan kuch bhi likhein ya sirf boliye",
      },
      "ar-SA": {
        title1: "Iathur ala alnamudhaj",
        title2: "alansab lak",
        subtitle: "Ibda min hadha alsanduq wasanatawala baqiat alrihlat maeak.",
        placeholder: "Aktub ay shay huna aw faqat tahadath",
      },
      default: {
        title1: "Find your perfect",
        title2: "AI model with guided discovery",
        subtitle:
          "You don't need to know anything about AI to get started. Just click the box below and we'll do the rest together.",
        placeholder: "Click here and type anything or just say hi",
      },
    };

    return map[language.code] ?? map.default;
  }, [language.code]);

  const launchChat = (prompt?: string, mode?: string) => {
    const params = new URLSearchParams();
    if (prompt) params.set("prompt", prompt);
    if (mode) params.set("mode", mode);
    if (prompt) params.set("autoSend", "1");
    router.push(`/chat${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          pt: { xs: 5, md: 7 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Chip
          label={`Live model workspace - ${language.nativeLabel}`}
          sx={{
            bgcolor: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(0,0,0,0.08)",
            fontWeight: 700,
          }}
        />
        <Typography
          variant="h1"
          sx={{
            mt: 2,
            fontFamily: "var(--font-syne)",
            fontSize: { xs: "3rem", md: "4.8rem" },
            lineHeight: 0.96,
            letterSpacing: "-0.05em",
            color: "#171512",
          }}
        >
          {localizedHero.title1}
          <Box component="span" sx={{ display: "block", color: "#C8622A" }}>
            {localizedHero.title2}
          </Box>
        </Typography>
        <Typography
          sx={{
            mt: 2,
            color: "rgba(28,26,22,0.66)",
            fontSize: { xs: "1rem", md: "1.08rem" },
          }}
        >
          {localizedHero.subtitle}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            mx: "auto",
            maxWidth: 860,
            px: 1.1,
            py: 0.9,
            borderRadius: 99,
            bgcolor: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 10px 26px rgba(74,49,24,0.09)",
          }}
        >
          <Stack direction="row" spacing={0.35} alignItems="center">
            <InputBase
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={localizedHero.placeholder}
              sx={{
                flex: 1,
                px: 1.7,
                py: 0.55,
                "& .MuiInputBase-input": {
                  fontSize: "0.95rem",
                  color: "#1C1A16",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(28,26,22,0.52)",
                  opacity: 1,
                },
              }}
            />
            <Stack
              direction="row"
              spacing={0.05}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                pr: 0.4,
              }}
            >
              {inputModes.map((item) => (
                <IconButton
                  key={item.mode}
                  onClick={() => launchChat(undefined, item.mode)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    color: "rgba(28,26,22,0.42)",
                    bgcolor: "transparent",
                    transition: "all 0.14s ease",
                    "&:hover": {
                      bgcolor: "rgba(28,26,22,0.05)",
                      color: "rgba(28,26,22,0.82)",
                    },
                  }}
                >
                  <item.Icon sx={{ fontSize: "0.95rem" }} />
                </IconButton>
              ))}
            </Stack>
            <Button
              variant="contained"
              sx={{
                minWidth: "auto",
                borderRadius: 99,
                px: 2.25,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 700,
                boxShadow: "none",
              }}
              startIcon={<SearchRoundedIcon />}
              onClick={() =>
                launchChat(
                  draft || "Help me get started with the best AI workflow.",
                  "text",
                )
              }
            >
              Let&apos;s go
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={1.8} sx={{ mt: 4, justifyContent: "center" }}>
          {heroActions.map((action) => (
            <Grid key={action.title} size={{ xs: 6, md: 2.4 }}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  borderRadius: "28px",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(28,26,22,0.06)",
                  boxShadow: "0 20px 36px rgba(68,46,21,0.08)",
                  overflow: "hidden",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow:
                      "0 24px 48px rgba(200,98,42,0.16), 0 8px 20px rgba(0,0,0,0.08)",
                  },
                }}
                onClick={() =>
                  launchChat(
                    `Help me with ${action.title.toLowerCase()}.`,
                    action.title.toLowerCase(),
                  )
                }
              >
                <CardContent sx={{ textAlign: "center", py: 2.4, px: 1.75 }}>
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      mx: "auto",
                      mb: 1.4,
                      borderRadius: "18px",
                      bgcolor: action.color,
                      display: "grid",
                      placeItems: "center",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.8), 0 16px 24px rgba(89,63,34,0.08)",
                    }}
                  >
                    <action.Icon
                      sx={{ fontSize: "1.28rem", color: action.iconColor }}
                    />
                  </Box>
                  <Typography
                    sx={{ fontWeight: 700, lineHeight: 1.35, minHeight: 42 }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.6,
                      color: "rgba(28,26,22,0.54)",
                      fontSize: "0.76rem",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {action.hint}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: { xs: 5, md: 7 }, position: "relative", zIndex: 1 }}>
        <Stack spacing={3}>
          <Box>
            <SectionTitle
              title="Featured Models"
              eyebrow="Hand-picked leaderboards"
            />
            <Grid container spacing={2}>
              {homeSections.featuredModels.map((model, index) => {
                const actionMeta = heroActions[index % heroActions.length];
                const ActionIcon = actionMeta.Icon;

                return (
                <Grid key={model.id} size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(28,26,22,0.06)",
                      boxShadow: "0 20px 34px rgba(69,47,23,0.07)",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        px: 2.2,
                        py: 1.4,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: featuredTints[index % featuredTints.length],
                      }}
                    >
                      <Chip
                        label={model.provider}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: "rgba(255,255,255,0.72)",
                        }}
                      />
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 700 }}>
                        {model.priceDisplay}
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 2.25 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={2}
                      >
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1.2}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 42,
                                height: 42,
                                borderRadius: "14px",
                                display: "grid",
                                placeItems: "center",
                                bgcolor: "rgba(255,255,255,0.72)",
                                border: "1px solid rgba(28,26,22,0.06)",
                              }}
                            >
                              <ActionIcon
                                sx={{
                                  fontSize: "1.02rem",
                                  color: actionMeta.iconColor,
                                }}
                              />
                            </Box>
                            <Typography
                              sx={{
                                fontFamily: "var(--font-syne)",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                              }}
                            >
                              {model.name}
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{ color: "rgba(28,26,22,0.58)", mt: 0.6 }}
                          >
                            Context window {model.contextWindow}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${model.rating} \u2605`}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            color: "#C8622A",
                            bgcolor: "rgba(200,98,42,0.1)",
                          }}
                        />
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ mt: 1.5, rowGap: 1 }}
                      >
                        {model.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ bgcolor: "#F5EFE6" }}
                          />
                        ))}
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 2, color: "rgba(28,26,22,0.68)" }}
                      >
                        <Typography sx={{ fontSize: "0.92rem" }}>
                          {model.reviews} reviews
                        </Typography>
                        <Typography sx={{ fontSize: "0.92rem" }}>
                          Top tier fit
                        </Typography>
                      </Stack>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2.2, borderRadius: 99 }}
                        onClick={() =>
                          launchChat(
                            `Use ${model.name} for my workflow and help me get started.`,
                            model.name,
                          )
                        }
                      >
                        Use In Chat Hub
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                );
              })}
            </Grid>
          </Box>

          <Box>
            <SectionTitle
              title="Built for every builder"
              eyebrow="Workflows by persona"
            />
            <Grid container spacing={2}>
              {homeSections.builtForEveryBuilder.map((item, index) => {
                const actionMeta =
                  heroActions[(index + 3) % heroActions.length];
                const ActionIcon = actionMeta.Icon;

                return (
                <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.88)",
                      border: "1px solid rgba(28,26,22,0.06)",
                      boxShadow: "0 18px 30px rgba(69,47,23,0.06)",
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "16px",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: featuredTints[index % featuredTints.length],
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                          mb: 1.6,
                        }}
                      >
                        <ActionIcon
                          sx={{
                            fontSize: "1.15rem",
                            color: actionMeta.iconColor,
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 1,
                          color: "rgba(28,26,22,0.62)",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.body}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                );
              })}
            </Grid>
          </Box>

          <Box>
            <SectionTitle
              title="Browse by AI Lab"
              eyebrow="Provider directories"
            />
            <Grid container spacing={2}>
              {homeSections.browseByAiLab.map((lab, index) => {
                const actionMeta =
                  heroActions[(index + 5) % heroActions.length];
                const ActionIcon = actionMeta.Icon;

                return (
                <Grid key={lab.provider} size={{ xs: 6, md: 2.4 }}>
                  <Card
                    sx={{
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.88)",
                      border: "1px solid rgba(28,26,22,0.06)",
                      boxShadow: "0 16px 28px rgba(69,47,23,0.05)",
                    }}
                  >
                    <CardContent sx={{ p: 2.2 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1.3 }}
                      >
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: "14px",
                            bgcolor: labTints[index % labTints.length],
                            display: "grid",
                            placeItems: "center",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                          }}
                        >
                          <ActionIcon
                            sx={{
                              fontSize: "1.05rem",
                              color: actionMeta.iconColor,
                            }}
                          />
                        </Box>
                        <Chip
                          label={`${lab.count}`}
                          size="small"
                          sx={{ bgcolor: "#FFF9F3", fontWeight: 700 }}
                        />
                      </Stack>
                      <Typography sx={{ fontWeight: 700 }}>
                        {lab.provider}
                      </Typography>
                      <Typography
                        sx={{ color: "rgba(28,26,22,0.58)", mt: 0.5 }}
                      >
                        {lab.count} models
                      </Typography>
                      <Typography
                        sx={{
                          mt: 1.2,
                          fontSize: "0.82rem",
                          color: "#C8622A",
                          fontWeight: 700,
                        }}
                      >
                        Explore catalog
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                );
              })}
            </Grid>
          </Box>

          <Box>
            <SectionTitle
              title="Flagship Model Comparison"
              eyebrow="Side-by-side benchmark snapshot"
            />
            <Paper
              elevation={0}
              sx={{
                overflowX: "auto",
                borderRadius: 1,
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(28,26,22,0.06)",
                boxShadow: "0 22px 36px rgba(69,47,23,0.06)",
              }}
            >
              <Box sx={{ minWidth: 880, p: 2 }}>
                <Grid
                  container
                  sx={{
                    py: 1.2,
                    px: 1,
                    color: "rgba(28,26,22,0.48)",
                    fontWeight: 700,
                  }}
                >
                  <Grid size={3}>Model</Grid>
                  <Grid size={2}>Provider</Grid>
                  <Grid size={2}>Context</Grid>
                  <Grid size={2}>Price</Grid>
                  <Grid size={1.5}>Rating</Grid>
                  <Grid size={1.5}>Capabilities</Grid>
                </Grid>
                {homeSections.flagshipModelComparison.map((item, index) => (
                  <Grid
                    key={item.id}
                    container
                    sx={{
                      py: 1.4,
                      px: 1,
                      borderTop: "1px solid rgba(0,0,0,0.06)",
                      alignItems: "center",
                      bgcolor:
                        index % 2 === 0
                          ? "rgba(250,247,241,0.72)"
                          : "transparent",
                    }}
                  >
                    <Grid size={3}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {item.name}
                      </Typography>
                    </Grid>
                    <Grid size={2}>{item.provider}</Grid>
                    <Grid size={2}>{item.contextWindow}</Grid>
                    <Grid size={2}>{item.priceDisplay}</Grid>
                    <Grid size={1.5}>
                      <Chip
                        label={`${item.rating} \u2605`}
                        size="small"
                        sx={{
                          bgcolor: "#FFF0E7",
                          color: "#C8622A",
                          fontWeight: 700,
                        }}
                      />
                    </Grid>
                    <Grid size={1.5}>
                      {item.capabilities.slice(0, 2).join(", ")}
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Paper>
          </Box>

          <Box>
            <SectionTitle
              title="Trending This Week"
              eyebrow="Signals worth watching"
            />
            <Grid container spacing={2}>
              {homeSections.trendingThisWeek.map((item, index) => (
                <Grid key={item.id} size={{ xs: 12, md: 3 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.88)",
                      border: "1px solid rgba(28,26,22,0.06)",
                      boxShadow: "0 18px 30px rgba(69,47,23,0.06)",
                    }}
                  >
                    <CardContent sx={{ p: 2.4 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1.2 }}
                      >
                        <Chip
                          label={`0${index + 1}`}
                          size="small"
                          sx={{ bgcolor: "#F5EFE6", fontWeight: 800 }}
                        />
                        <Typography
                          sx={{
                            color: "#C8622A",
                            fontSize: "0.88rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.provider}
                        </Typography>
                      </Stack>
                      <Typography
                        sx={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 1.2,
                          color: "rgba(28,26,22,0.62)",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.body}
                      </Typography>
                      <Button
                        sx={{ mt: 1.6, px: 0 }}
                        onClick={() =>
                          launchChat(
                            `Explain this trend: ${item.title}`,
                            "trend-analysis",
                          )
                        }
                      >
                        Discuss this trend
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <SectionTitle
                  title="First Models by Budget"
                  eyebrow="Shortlist by spend"
                />
                <Grid container spacing={2}>
                  {homeSections.firstModelsByBudget.map((item, index) => {
                    const actionMeta =
                      heroActions[(index + 8) % heroActions.length];
                    const ActionIcon = actionMeta.Icon;

                    return (
                    <Grid key={item.label} size={{ xs: 12, md: 6 }}>
                      <Card
                        sx={{
                          borderRadius: 1,
                          bgcolor: "rgba(255,255,255,0.88)",
                          border: "1px solid rgba(28,26,22,0.06)",
                          boxShadow: "0 18px 28px rgba(69,47,23,0.05)",
                        }}
                      >
                        <CardContent sx={{ p: 2.2 }}>
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: "12px",
                              display: "grid",
                              placeItems: "center",
                              bgcolor:
                                featuredTints[
                                  (index + 2) % featuredTints.length
                                ],
                              mb: 1.2,
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                            }}
                          >
                            <ActionIcon
                              sx={{
                                fontSize: "0.95rem",
                                color: actionMeta.iconColor,
                              }}
                            />
                          </Box>
                          <Typography
                            sx={{ color: "#C8622A", fontWeight: 700 }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 1,
                              fontFamily: "var(--font-syne)",
                              fontWeight: 700,
                            }}
                          >
                            {item.detail.name}
                          </Typography>
                          <Typography sx={{ color: "rgba(28,26,22,0.58)" }}>
                            {item.detail.provider}
                          </Typography>
                          <Typography sx={{ mt: 1 }}>
                            {item.detail.priceDisplay}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <SectionTitle
                  title="Quick-Start by Use Case"
                  eyebrow="Guided launch paths"
                />
                <Grid container spacing={2}>
                  {homeSections.quickStartUseCases.map((item, index) => {
                    const actionMeta =
                      heroActions[(index + 10) % heroActions.length];
                    const ActionIcon = actionMeta.Icon;

                    return (
                    <Grid key={item.title} size={{ xs: 12, md: 6 }}>
                      <Card
                        sx={{
                          borderRadius: "28px",
                          bgcolor: "rgba(255,255,255,0.88)",
                          border: "1px solid rgba(28,26,22,0.06)",
                          boxShadow: "0 18px 28px rgba(69,47,23,0.05)",
                        }}
                      >
                        <CardContent sx={{ p: 2.2 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 1.2 }}
                          >
                            <Chip
                              label={`Track ${index + 1}`}
                              size="small"
                              sx={{ bgcolor: "#F5EFE6", fontWeight: 700 }}
                            />
                            <ActionIcon
                              sx={{
                                fontSize: "1rem",
                                color: actionMeta.iconColor,
                              }}
                            />
                          </Stack>
                          <Typography
                            sx={{
                              fontFamily: "var(--font-syne)",
                              fontWeight: 700,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 1,
                              color: "rgba(28,26,22,0.62)",
                              lineHeight: 1.7,
                            }}
                          >
                            {item.description}
                          </Typography>
                          <Button
                            sx={{ mt: 1.5, px: 0 }}
                            onClick={() =>
                              launchChat(
                                `Help me with this use case: ${item.title}`,
                                item.title.toLowerCase(),
                              )
                            }
                          >
                            Open workflow
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: "32px",
              textAlign: "center",
              bgcolor: "#181818",
              color: "#F7F3EC",
            }}
          >
            <Typography variant="h4" sx={{ fontFamily: "var(--font-syne)" }}>
              New models drop every day. Don&apos;t miss releases.
            </Typography>
            <Typography sx={{ mt: 1.5, color: "rgba(247,243,236,0.68)" }}>
              The dashboard overview now mirrors the landing page structure much
              more closely.
            </Typography>
            <Button
              sx={{ mt: 3 }}
              variant="contained"
              onClick={() => router.push("/chat")}
            >
              Start Exploring
            </Button>
          </Paper>
        </Stack>
      </Box>
    </>
  );
}

function SectionTitle({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 2.5 }}
    >
      <Box>
        {eyebrow ? (
          <Typography
            sx={{
              color: "#C8622A",
              fontSize: "0.82rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h4" sx={{ fontFamily: "var(--font-syne)" }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ flex: 1, ml: 2 }} />
    </Stack>
  );
}
