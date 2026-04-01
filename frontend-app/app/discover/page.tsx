'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { SiteShell } from '@/components/layout/SiteShell';
import { featuredProviders, models, newReleases, recommendedPrompts, trendingModels } from '@/lib/mock/platformData';

const MotionCard = motion(Card);

const trendCards = [
  {
    title: 'Reasoning Models Are Winning',
    body: 'o3, R1, and Gemini 2.0 Flash are dominating complex task benchmarks.',
    tag: 'Reasoning',
    color: '#FFE2CF',
  },
  {
    title: 'Vision Pricing Drop',
    body: 'GPT-4o Vision now costs less than Claude Haiku for image tasks.',
    tag: 'Pricing',
    color: '#E2EBFF',
  },
  {
    title: 'Open-Weight Surge',
    body: 'Llama 3.3, Mistral Small, and Qwen 2.5 closing the gap with closed models.',
    tag: 'Open Source',
    color: '#E6F7EA',
  },
  {
    title: 'Coding Agents Go Mainstream',
    body: 'Claude and Gemini now support native tool-use for automated coding workflows.',
    tag: 'Agents',
    color: '#F4E6FF',
  },
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

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const q = deferred.toLowerCase().trim();

  const trending = useMemo(
    () => trendingModels.filter((model) => !q || [model.name, model.lab, model.description].some((value) => value.toLowerCase().includes(q))),
    [q]
  );
  const releases = useMemo(
    () => newReleases.filter((model) => !q || [model.name, model.lab, model.description].some((value) => value.toLowerCase().includes(q))),
    [q]
  );
  const providers = useMemo(() => featuredProviders.filter((provider) => !q || provider.name.toLowerCase().includes(q)), [q]);
  const prompts = useMemo(() => recommendedPrompts.filter((prompt) => !q || prompt.toLowerCase().includes(q)), [q]);

  return (
    <SiteShell>
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Hero Header */}
        <Box sx={{ mb: 6 }}>
          <Typography sx={{ color: '#C8622A', fontWeight: 600, fontSize: '0.875rem', mb: 1, letterSpacing: 0.5 }}>AI landscape, curated daily</Typography>
          <Typography variant="h1" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '3rem', mb: 3 }}>
            Discover New
          </Typography>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.88)', border: '1px solid rgba(28,26,22,0.06)' }}>
            <InputBase
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trends, providers, or prompts"
              sx={{ width: '100%', fontSize: '1rem' }}
            />
          </Paper>
        </Box>

        {/* Section 1: Trending This Week */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 4, fontSize: '1.75rem' }}>
            Trending This Week
          </Typography>
          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }}>
            <Grid container spacing={2}>
              {trendCards.map((card, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <MotionCard
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    variants={itemVariants}
                    sx={{
                      height: '100%',
                      bgcolor: card.color,
                      borderRadius: 2,
                      border: '1px solid rgba(28,26,22,0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    <CardContent>
                      <Chip label={card.tag} size="small" sx={{ mb: 2, bgcolor: 'rgba(200,98,42,0.12)', color: '#C8622A' }} />
                      <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>{card.title}</Typography>
                      <Typography sx={{ color: 'rgba(28,26,22,0.72)', lineHeight: 1.6 }}>{card.body}</Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* Section 2: New Releases */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 4, fontSize: '1.75rem' }}>
            New Releases
          </Typography>
          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }}>
            <Grid container spacing={2}>
              {releases.slice(0, 6).map((model, index) => (
                <Grid key={model.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <MotionCard
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    variants={itemVariants}
                    sx={{
                      height: '100%',
                      bgcolor: 'rgba(255,255,255,0.88)',
                      borderRadius: 2,
                      border: '1px solid rgba(28,26,22,0.06)',
                    }}
                  >
                    <CardContent>
                      <Chip label={model.lab} size="small" sx={{ mb: 2 }} />
                      <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 1, fontSize: '1rem' }}>{model.name}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                        {model.tags?.slice(0, 2).map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      <Typography sx={{ color: 'rgba(28,26,22,0.54)', fontSize: '0.85rem', mb: 2 }}>{model.updatedAt}</Typography>
                      <Button variant="contained" size="small" sx={{ bgcolor: '#C8622A', '&:hover': { bgcolor: '#A85222' } }}>
                        Use in Chat
                      </Button>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* Section 3: Featured Providers */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 4, fontSize: '1.75rem' }}>
            Featured Providers
          </Typography>
          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }}>
            <Grid container spacing={2}>
              {providers.map((provider, index) => {
                const providerModels = models.filter((m) => m.lab === provider.name);
                return (
                  <Grid key={provider.name} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <MotionCard
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      variants={itemVariants}
                      sx={{
                        height: '100%',
                        bgcolor: 'rgba(255,255,255,0.88)',
                        borderRadius: 2,
                        border: '1px solid rgba(28,26,22,0.06)',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: provider.color, mb: 2, opacity: 0.15 }} />
                        <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>{provider.name}</Typography>
                        <Typography sx={{ color: 'rgba(28,26,22,0.58)', fontSize: '0.9rem', mb: 2 }}>
                          {providerModels.length} model{providerModels.length !== 1 ? 's' : ''}
                        </Typography>
                        <Button
                          component={Link}
                          href={`/marketplace?provider=${encodeURIComponent(provider.name)}`}
                          variant="outlined"
                          size="small"
                          sx={{ color: '#C8622A', borderColor: '#C8622A', '&:hover': { bgcolor: 'rgba(200,98,42,0.04)' } }}
                        >
                          Browse
                        </Button>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        </Box>

        {/* Section 4: Recommended Prompts */}
        <Box>
          <Typography variant="h3" sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 4, fontSize: '1.75rem' }}>
            Recommended Prompts
          </Typography>
          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }}>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
              {prompts.map((prompt, index) => (
                <motion.div key={prompt} variants={itemVariants}>
                  <Button
                    component={Link}
                    href={`/chat?prompt=${encodeURIComponent(prompt)}`}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.88)',
                      color: '#1C1A16',
                      border: '1px solid rgba(28,26,22,0.06)',
                      borderRadius: 2,
                      px: 2.5,
                      py: 1.2,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: '#C8622A',
                        color: '#FFF',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(200,98,42,0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {prompt}
                  </Button>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </SiteShell>
  );
}
