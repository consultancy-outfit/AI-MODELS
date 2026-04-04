'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIosRounded from '@mui/icons-material/ArrowForwardIosRounded';
import FilterListRounded from '@mui/icons-material/FilterListRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import StarHalf from '@mui/icons-material/StarHalf';
import { motion } from 'framer-motion';
import { SiteShell } from '@/components/layout/SiteShell';
import { featuredProviders, models } from '@/lib/mock/platformData';

/* ─── constants ──────────────────────────────────────────────── */

const CATEGORY_CHIPS = ['All', 'Language', 'Vision', 'Code', 'Image Gen', 'Audio', 'Open Source'];
const PRICING_TIERS = ['All', 'Free', 'Pay-as-you-go', 'Pro'];
const SAVE_GUIDES = ['Commercial use', 'Research work', 'Production', 'Prototyping', 'Edge deployment'];

const ALL_PROVIDERS = featuredProviders.map((p) => p.name);

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: '#10A37F',
  Anthropic: '#C8622A',
  'Google DeepMind': '#4285F4',
  Meta: '#0866FF',
  Mistral: '#5A5750',
  xAI: '#111111',
  DeepSeek: '#2E9E5B',
  Qwen: '#FF6A00',
  Cohere: '#7A5AF8',
  Stability: '#6D28D9',
};

const BADGE_STYLE: Record<string, { bg: string; text: string }> = {
  hot:            { bg: '#FEF3C7', text: '#92400E' },
  new:            { bg: '#DCFCE7', text: '#166534' },
  pro:            { bg: '#DBEAFE', text: '#1E40AF' },
  open:           { bg: '#CCFBF1', text: '#134E4A' },
  beta:           { bg: '#EDE9FE', text: '#5B21B6' },
  'pay-as-you-go':{ bg: '#FCE7F3', text: '#9D174D' },
  free:           { bg: '#F3F4F6', text: '#374151' },
};

const TAG_BG = [
  'rgba(200,98,42,0.09)',
  'rgba(30,77,168,0.09)',
  'rgba(10,94,73,0.09)',
  'rgba(138,90,0,0.09)',
  'rgba(155,32,66,0.09)',
];

const tokenNum = (v: string) => {
  const n = Number.parseInt(v.replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
};

/* ─── sub-components ────────────────────────────────────────── */

function ProviderSquare({ name, color }: { name: string; color: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '8px',
        bgcolor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.78rem',
        flexShrink: 0,
        letterSpacing: 0,
      }}
    >
      {initials}
    </Box>
  );
}

function StarsRow({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= Math.floor(rating)) return 'full';
    if (i < rating) return 'half';
    return 'empty';
  });
  return (
    <Stack direction="row" alignItems="center" spacing={0.25}>
      {stars.map((type, i) =>
        type === 'full'  ? <Star     key={i} sx={{ fontSize: '0.85rem', color: '#F59E0B' }} />
        : type === 'half' ? <StarHalf key={i} sx={{ fontSize: '0.85rem', color: '#F59E0B' }} />
        :                   <StarBorder key={i} sx={{ fontSize: '0.85rem', color: '#F59E0B' }} />,
      )}
      <Typography sx={{ fontSize: '0.78rem', color: 'rgba(28,26,22,0.6)', ml: 0.5 }}>
        {rating}/5 ({reviewCount})
      </Typography>
    </Stack>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(28,26,22,0.45)',
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function MarketplacePage() {
  const [category, setCategory]                     = useState('All');
  const [search, setSearch]                         = useState('');
  const [selectedProviders, setSelectedProviders]   = useState<string[]>([]);
  const [pricingModel, setPricingModel]             = useState('All');
  const [priceRange, setPriceRange]                 = useState<number[]>([0, 2]);
  const [tokenRange, setTokenRange]                 = useState<number[]>([32, 256]);
  const [page, setPage]                             = useState(1);
  const deferredSearch = useDeferredValue(search);

  const filtered = useMemo(() => {
    const q = deferredSearch.toLowerCase().trim();
    return models.filter((model) => {
      const categoryOk =
        category === 'All'
          ? true
          : category === 'Open Source'
          ? model.badge === 'open'
          : category === 'Image Gen'
          ? model.categories.includes('image')
          : model.categories.includes(category.toLowerCase().split(' ')[0] as never);

      const providerOk  = selectedProviders.length === 0 || selectedProviders.includes(model.lab);
      const pricingOk   = pricingModel === 'All' || model.pricingTier === pricingModel.toLowerCase().replace('-', '-');
      const priceOk     = model.pricePerMToken >= priceRange[0] && model.pricePerMToken <= priceRange[1];
      const token       = tokenNum(model.contextWindow);
      const tokenOk     = token >= tokenRange[0] && token <= tokenRange[1];
      const searchOk    =
        !q ||
        model.name.toLowerCase().includes(q) ||
        model.lab.toLowerCase().includes(q) ||
        model.description.toLowerCase().includes(q) ||
        model.tags.some((t) => t.toLowerCase().includes(q));

      return categoryOk && providerOk && pricingOk && priceOk && tokenOk && searchOk;
    });
  }, [category, deferredSearch, priceRange, pricingModel, selectedProviders, tokenRange]);

  const pageSize   = 20;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const items      = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetPage = () => setPage(1);

  return (
    <SiteShell>
      <Container maxWidth="xl" sx={{ pb: 10 }}>

        {/* ── Title + Search row ── */}
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 2.5 }}>
          <Box>
            <Typography variant="h2" sx={{ fontFamily: 'var(--font-syne)', lineHeight: 1.15 }}>
              Model Marketplace
            </Typography>
            <Typography sx={{ color: 'rgba(28,26,22,0.55)', fontSize: '0.9rem', mt: 0.5 }}>
              Filter 420+ models by provider, price, context window, and quality.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.88)',
              border: '1px solid rgba(28,26,22,0.08)',
              width: { xs: '100%', md: 340 },
            }}
          >
            <SearchRounded sx={{ color: 'rgba(28,26,22,0.4)', fontSize: '1.1rem' }} />
            <InputBase
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              placeholder="Search models, providers, capabilities…"
              sx={{ flex: 1, fontSize: '0.88rem' }}
            />
            <FilterListRounded sx={{ color: 'rgba(28,26,22,0.35)', fontSize: '1.1rem' }} />
          </Paper>
        </Stack>

        {/* ── Category chips ── */}
        <Paper elevation={0} sx={{ p: 1.25, mb: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.84)', border: '1px solid rgba(28,26,22,0.05)' }}>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ rowGap: 0.75 }}>
            {CATEGORY_CHIPS.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                onClick={() => { setCategory(chip); resetPage(); }}
                sx={{
                  bgcolor:    category === chip ? '#C8622A' : 'transparent',
                  color:      category === chip ? '#fff' : 'rgba(28,26,22,0.75)',
                  fontWeight: category === chip ? 600 : 500,
                  fontSize:   '0.82rem',
                  height:     30,
                  border:     category === chip ? 'none' : '1px solid rgba(28,26,22,0.12)',
                  transition: 'all 0.18s ease',
                  '&:hover':  { bgcolor: category === chip ? '#A34D1E' : 'rgba(28,26,22,0.05)' },
                }}
              />
            ))}
          </Stack>
        </Paper>

        {/* ── Provider scroll strip ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3,
            overflowX: 'auto',
            pb: 0.5,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(28,26,22,0.15)', borderRadius: 2 },
          }}
        >
          {featuredProviders.map((p) => (
            <Paper
              key={p.name}
              elevation={0}
              onClick={() => {
                setSelectedProviders((prev) =>
                  prev.includes(p.name) ? prev.filter((x) => x !== p.name) : [...prev, p.name],
                );
                resetPage();
              }}
              sx={{
                display:    'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.75,
                borderRadius: 3,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                bgcolor: selectedProviders.includes(p.name) ? `${PROVIDER_COLORS[p.name] || '#999'}18` : 'rgba(255,255,255,0.85)',
                border: selectedProviders.includes(p.name)
                  ? `1.5px solid ${PROVIDER_COLORS[p.name] || '#999'}55`
                  : '1px solid rgba(28,26,22,0.08)',
                transition: 'all 0.18s ease',
                '&:hover': { bgcolor: `${PROVIDER_COLORS[p.name] || '#999'}14` },
              }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '4px',
                  bgcolor: PROVIDER_COLORS[p.name] || '#999',
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: 'rgba(28,26,22,0.8)' }}>
                {p.name}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* ── Main layout ── */}
        <Grid container spacing={2.5}>

          {/* ── Left sidebar ── */}
          <Grid size={{ xs: 12, lg: 2.5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 5,
                bgcolor: 'rgba(255,255,255,0.84)',
                border: '1px solid rgba(28,26,22,0.06)',
                position: { lg: 'sticky' },
                top: { lg: 90 },
              }}
            >
              {/* Need help choosing? */}
              <Box sx={{ mb: 2, p: 1.5, borderRadius: 3, bgcolor: 'rgba(200,98,42,0.06)', border: '1px solid rgba(200,98,42,0.12)' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#C8622A', mb: 0.75 }}>
                  Need help choosing?
                </Typography>
                {['Best for reasoning', 'Fastest response', 'Lowest cost', 'Largest context'].map((tip) => (
                  <Stack key={tip} direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(200,98,42,0.5)', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.78rem', color: 'rgba(28,26,22,0.65)' }}>{tip}</Typography>
                  </Stack>
                ))}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Providers */}
              <SidebarLabel>Providers</SidebarLabel>
              <Stack spacing={0.25} sx={{ mb: 2 }}>
                {ALL_PROVIDERS.map((provider) => (
                  <FormControlLabel
                    key={provider}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedProviders.includes(provider)}
                        onChange={() => {
                          setSelectedProviders((prev) =>
                            prev.includes(provider)
                              ? prev.filter((x) => x !== provider)
                              : [...prev, provider],
                          );
                          resetPage();
                        }}
                        sx={{ p: 0.5, color: 'rgba(28,26,22,0.35)', '&.Mui-checked': { color: '#C8622A' } }}
                      />
                    }
                    label={
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: PROVIDER_COLORS[provider] || '#999', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.82rem' }}>{provider}</Typography>
                      </Stack>
                    }
                    sx={{ m: 0, alignItems: 'center' }}
                  />
                ))}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Pricing model */}
              <SidebarLabel>Pricing Model</SidebarLabel>
              <RadioGroup
                value={pricingModel}
                onChange={(e) => { setPricingModel(e.target.value); resetPage(); }}
                sx={{ mb: 2 }}
              >
                {PRICING_TIERS.map((tier) => (
                  <FormControlLabel
                    key={tier}
                    value={tier}
                    control={<Radio size="small" sx={{ p: 0.5, color: 'rgba(28,26,22,0.35)', '&.Mui-checked': { color: '#C8622A' } }} />}
                    label={<Typography sx={{ fontSize: '0.82rem' }}>{tier}</Typography>}
                    sx={{ m: 0 }}
                  />
                ))}
              </RadioGroup>

              <Divider sx={{ mb: 2 }} />

              {/* Price / 1M tokens */}
              <SidebarLabel>Price / 1M Tokens</SidebarLabel>
              <Slider
                value={priceRange}
                min={0} max={2} step={0.1}
                size="small"
                onChange={(_, v) => { setPriceRange(v as number[]); resetPage(); }}
                sx={{ color: '#C8622A', mb: 0.5 }}
              />
              <Typography sx={{ color: 'rgba(28,26,22,0.5)', fontSize: '0.78rem', mb: 2 }}>
                ${priceRange[0].toFixed(1)} – ${priceRange[1].toFixed(1)}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* Usage / 1K tokens */}
              <SidebarLabel>Usage / 1K Tokens</SidebarLabel>
              <Slider
                value={tokenRange}
                min={32} max={256} step={32}
                size="small"
                onChange={(_, v) => { setTokenRange(v as number[]); resetPage(); }}
                sx={{ color: '#C8622A', mb: 0.5 }}
              />
              <Typography sx={{ color: 'rgba(28,26,22,0.5)', fontSize: '0.78rem', mb: 2 }}>
                {tokenRange[0]}K – {tokenRange[1]}K
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* Save guides */}
              <SidebarLabel>Save Guides</SidebarLabel>
              <Stack spacing={0.5}>
                {SAVE_GUIDES.map((g) => (
                  <Stack key={g} direction="row" alignItems="center" justifyContent="space-between"
                    sx={{ px: 1, py: 0.5, borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(28,26,22,0.04)' } }}
                  >
                    <Typography sx={{ fontSize: '0.8rem', color: 'rgba(28,26,22,0.7)' }}>{g}</Typography>
                    <ArrowForwardIosRounded sx={{ fontSize: '0.65rem', color: 'rgba(28,26,22,0.3)' }} />
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* ── Card grid ── */}
          <Grid size={{ xs: 12, lg: 9.5 }}>
            <Grid
              container
              spacing={1.5}
              columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 10 }}
            >
              {items.map((model, index) => {
                const badgeKey   = model.badge || model.pricingTier || 'free';
                const badgeStyle = BADGE_STYLE[badgeKey] ?? BADGE_STYLE['free'];
                const provColor  = PROVIDER_COLORS[model.lab] || model.bgColor || '#999';

                return (
                  <Grid key={model.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
                    <Card
                      component={motion.div}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: (index % 20) * 0.03 }}
                      whileHover={{ y: -4 }}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        border: '1px solid rgba(28,26,22,0.07)',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.22s ease',
                        '&:hover': { boxShadow: '0 12px 32px rgba(28,26,22,0.1)' },
                      }}
                    >
                      <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 }, display: 'flex', flexDirection: 'column', flex: 1, gap: 1 }}>

                        {/* Header: icon + name + badge */}
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                          <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                            <ProviderSquare name={model.lab} color={provColor} />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontFamily: 'var(--font-syne)',
                                  fontWeight: 700,
                                  fontSize: '0.88rem',
                                  lineHeight: 1.3,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {model.name}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(28,26,22,0.5)' }}>
                                {model.lab}
                              </Typography>
                            </Box>
                          </Stack>
                          {badgeKey && badgeKey !== 'free' && (
                            <Chip
                              label={badgeKey}
                              size="small"
                              sx={{
                                bgcolor:    badgeStyle.bg,
                                color:      badgeStyle.text,
                                fontWeight: 600,
                                fontSize:   '0.68rem',
                                height:     20,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Stack>

                        {/* Description */}
                        <Typography
                          sx={{
                            fontSize: '0.78rem',
                            color: 'rgba(28,26,22,0.6)',
                            lineHeight: 1.45,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {model.description}
                        </Typography>

                        {/* Tags */}
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ rowGap: 0.5 }}>
                          {model.tags.slice(0, 3).map((tag, ti) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                bgcolor:    TAG_BG[ti % TAG_BG.length],
                                border:     'none',
                                fontSize:   '0.7rem',
                                fontWeight: 500,
                                height:     20,
                                color:      '#1C1A16',
                              }}
                            />
                          ))}
                        </Stack>

                        {/* Stars */}
                        <StarsRow rating={model.rating} reviewCount={model.reviewCount} />

                        {/* Price + context */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1C1A16' }}>
                            {model.priceDisplay}
                          </Typography>
                          <Typography sx={{ fontSize: '0.73rem', color: 'rgba(28,26,22,0.5)' }}>
                            {model.contextWindow} ctx
                          </Typography>
                        </Stack>

                        {/* How to Use */}
                        <Box sx={{ mt: 'auto', pt: 0.5, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            component={Link}
                            href={`/chat?model=${model.id}`}
                            size="small"
                            endIcon={<ArrowForwardIosRounded sx={{ fontSize: '0.65rem !important' }} />}
                            sx={{
                              color:      '#C8622A',
                              fontWeight: 600,
                              fontSize:   '0.78rem',
                              p:          0,
                              minWidth:   0,
                              '&:hover':  { bgcolor: 'transparent', color: '#A34D1E' },
                              textTransform: 'none',
                            }}
                          >
                            How to Use
                          </Button>
                        </Box>

                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Pagination */}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                size="small"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                sx={{ borderRadius: 3, textTransform: 'none', fontSize: '0.82rem', borderColor: 'rgba(28,26,22,0.15)', color: '#1C1A16', '&:hover': { borderColor: '#C8622A', color: '#C8622A', bgcolor: 'transparent' } }}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page + i - 2;
                if (p < 1 || p > totalPages) return null;
                return (
                  <Button
                    key={p}
                    size="small"
                    onClick={() => setPage(p)}
                    sx={{
                      minWidth: 36,
                      height: 36,
                      borderRadius: 2,
                      fontSize: '0.82rem',
                      fontWeight: p === page ? 700 : 500,
                      bgcolor:    p === page ? '#C8622A' : 'transparent',
                      color:      p === page ? '#fff' : 'rgba(28,26,22,0.7)',
                      border:     p === page ? 'none' : '1px solid rgba(28,26,22,0.12)',
                      '&:hover':  { bgcolor: p === page ? '#A34D1E' : 'rgba(28,26,22,0.05)' },
                    }}
                  >
                    {p}
                  </Button>
                );
              })}
              <Button
                variant="outlined"
                size="small"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                sx={{ borderRadius: 3, textTransform: 'none', fontSize: '0.82rem', borderColor: 'rgba(28,26,22,0.15)', color: '#1C1A16', '&:hover': { borderColor: '#C8622A', color: '#C8622A', bgcolor: 'transparent' } }}
              >
                Next
              </Button>
            </Stack>
          </Grid>

        </Grid>
      </Container>
    </SiteShell>
  );
}
