'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { SiteShell } from '@/components/layout/SiteShell';
import { LordIcon } from '@/components/ui/LordIcon';
import { agents, models } from '@/lib/mock/platformData';

const MotionCard = motion(Card);

const agentIcons = [
  'https://cdn.lordicon.com/hqymfzvj.json', // Support
  'https://cdn.lordicon.com/qhviklyi.json', // Research
  'https://cdn.lordicon.com/lbjtvqiv.json', // Writer
  'https://cdn.lordicon.com/rmkpgtpt.json', // Analytics
  'https://cdn.lordicon.com/yqzmiobz.json', // Document
  'https://cdn.lordicon.com/lewtedlh.json', // Learning
];

const agentColors = ['#FFE2CF', '#E2EBFF', '#E6F7EA', '#F4E6FF', '#FFECC4', '#DFF4F3'];

const newAgentsSuggested = [
  { title: 'Email Drafter', description: 'Write professional emails tailored to any context', icon: 0 },
  { title: 'Code Reviewer', description: 'Analyze code for bugs, style, and optimization', icon: 1 },
  { title: 'Content Strategist', description: 'Plan content calendars and briefs for campaigns', icon: 2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function AgentsPage() {
  return (
    <SiteShell>
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Hero Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h1" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '3rem', mb: 2 }}>
            AI Agents
          </Typography>
          <Typography sx={{ color: 'rgba(28,26,22,0.64)', fontSize: '1.1rem', mb: 4, maxWidth: '600px' }}>
            Launch purpose-built agents powered by the best models
          </Typography>
          <Button
            component={Link}
            href="/chat?mode=agent-builder"
            variant="contained"
            sx={{ bgcolor: '#C8622A', '&:hover': { bgcolor: '#A85222' }, fontWeight: 600, px: 3, py: 1.2 }}
          >
            Create Custom Agent
          </Button>
        </Box>

        {/* Agents Grid */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 4, fontSize: '1.75rem' }}>
            Featured Agents
          </Typography>
          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }}>
            <Grid container spacing={2.5}>
              {agents.map((agent, idx) => {
                const model = models.find((item) => item.id === agent.baseModelId);
                const rating = Math.min(4.0 + (agent.usageCount % 1000) / 1000, 5.0).toFixed(1);
                const href = `/chat?agent=${agent.id}&model=${agent.baseModelId}&title=${encodeURIComponent(agent.name)}&prompt=${encodeURIComponent(agent.systemPrompt)}`;
                const bgColor = agentColors[idx % agentColors.length];
                const iconUrl = agentIcons[idx % agentIcons.length];

                return (
                  <Grid key={agent.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <MotionCard
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      variants={itemVariants}
                      sx={{
                        height: '100%',
                        bgcolor: 'rgba(255,255,255,0.88)',
                        borderRadius: 2,
                        border: '1px solid rgba(28,26,22,0.06)',
                        overflow: 'visible',
                      }}
                    >
                      <CardContent>
                        {/* Icon */}
                        <Box
                          sx={{
                            width: 58,
                            height: 58,
                            borderRadius: 1.5,
                            bgcolor: bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                          }}
                        >
                          <LordIcon src={iconUrl} size={32} colors={`primary:#C8622A`} />
                        </Box>

                        {/* Name */}
                        <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.15rem', mb: 1 }}>
                          {agent.name}
                        </Typography>

                        {/* Description */}
                        <Typography
                          sx={{
                            color: 'rgba(28,26,22,0.68)',
                            fontSize: '0.9rem',
                            lineHeight: 1.5,
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {agent.description}
                        </Typography>

                        {/* Tools Chips */}
                        {agent.tools && agent.tools.length > 0 && (
                          <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                            {agent.tools.slice(0, 3).map((tool) => (
                              <Chip key={tool} label={tool} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                            ))}
                            {agent.tools.length > 3 && <Chip label={`+${agent.tools.length - 3}`} size="small" variant="outlined" />}
                          </Stack>
                        )}

                        {/* Base Model */}
                        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(28,26,22,0.54)', mb: 2 }}>
                          Base Model: <span style={{ fontWeight: 600, color: 'rgba(28,26,22,0.72)' }}>{model?.name || 'Unknown'}</span>
                        </Typography>

                        {/* Rating & Usage */}
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                          <Rating value={parseFloat(rating)} readOnly size="small" max={5} />
                          <Typography sx={{ fontSize: '0.85rem', color: 'rgba(28,26,22,0.54)' }}>
                            {(agent.usageCount / 1000).toFixed(1)}k uses
                          </Typography>
                        </Stack>

                        {/* Launch Button */}
                        <Button
                          component={Link}
                          href={href}
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: '#C8622A',
                            '&:hover': { bgcolor: '#A85222' },
                            fontWeight: 600,
                            py: 1,
                          }}
                        >
                          Launch Agent
                        </Button>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        </Box>

        {/* How to Use Info Box */}
        <Card
          sx={{
            bgcolor: 'linear-gradient(135deg, rgba(200,98,42,0.05) 0%, rgba(200,98,42,0.02) 100%)',
            borderRadius: 2,
            border: '1px solid rgba(200,98,42,0.12)',
            mb: 8,
          }}
        >
          <CardContent sx={{ py: 4 }}>
            <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.3rem', mb: 3 }}>
              How to Use an Agent
            </Typography>
            <Grid container spacing={3}>
              {[
                { step: '1', title: 'Select Agent', desc: 'Choose from featured agents or create a custom one' },
                { step: '2', title: 'Agent Configures Model', desc: 'Pre-configured with optimal settings and system prompt' },
                { step: '3', title: 'Chat With Purpose', desc: 'Chat with purpose-built context and specialized tools' },
              ].map((item) => (
                <Grid key={item.step} size={{ xs: 12, md: 4 }}>
                  <Stack spacing={1}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: '#C8622A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ color: '#FFF', fontWeight: 700, fontSize: '1.2rem' }}>{item.step}</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700 }}>{item.title}</Typography>
                    <Typography sx={{ color: 'rgba(28,26,22,0.64)', fontSize: '0.9rem' }}>{item.desc}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Suggested New Agents */}
        <Box>
          <Typography variant="h3" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 4, fontSize: '1.75rem' }}>
            Suggested Agents to Build
          </Typography>
          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }}>
            <Grid container spacing={2.5}>
              {newAgentsSuggested.map((suggested, idx) => (
                <Grid key={suggested.title} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <MotionCard
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    variants={itemVariants}
                    sx={{
                      height: '100%',
                      bgcolor: agentColors[suggested.icon % agentColors.length],
                      borderRadius: 2,
                      border: '1px solid rgba(28,26,22,0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <LordIcon src={agentIcons[suggested.icon]} size={40} colors={`primary:#C8622A`} />
                      </Box>
                      <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>
                        {suggested.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(28,26,22,0.68)', fontSize: '0.9rem', lineHeight: 1.5, mb: 3 }}>
                        {suggested.description}
                      </Typography>
                      <Button
                        component={Link}
                        href="/chat?mode=agent-builder"
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: '#C8622A',
                          '&:hover': { bgcolor: '#A85222' },
                        }}
                      >
                        Build This
                      </Button>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      </Container>
    </SiteShell>
  );
}
