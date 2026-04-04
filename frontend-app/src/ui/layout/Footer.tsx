'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LordIcon } from '@/components/LordIcon';

const footerGroups = [
  {
    title: 'Platform',
    links: [
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Chat Hub', href: '/chat' },
      { label: 'Agents', href: '/agents' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Research', href: '/research' },
      { label: 'Login', href: '/login' },
      { label: 'Sign Up', href: '/signup' },
    ],
  },
];

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        bgcolor: '#151515',
        color: '#F8F3EC',
        borderTopLeftRadius: { xs: 18, md: 20 },
        borderTopRightRadius: { xs: 18, md: 20 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={5} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #C8622A, #1E4DA8)',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 14px 28px rgba(200,98,42,0.28)',
                  }}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 800, fontFamily: 'var(--font-syne)' }}>
                    N
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem' }}>
                    NexusAI
                  </Typography>
                  <Typography sx={{ color: 'rgba(248,243,236,0.6)', fontSize: '0.85rem' }}>
                    AI model control center
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ maxWidth: 420, color: 'rgba(248,243,236,0.7)', lineHeight: 1.8 }}>
                Find the right model, compare labs faster, and move from experiments to
                production with a friendlier AI dashboard.
              </Typography>
              <Button
                component={Link}
                href="/signup"
                variant="contained"
                sx={{ alignSelf: 'flex-start', px: 2.5, py: 1.1 }}
                startIcon={
                  <LordIcon
                    src="https://cdn.lordicon.com/hqymfzvj.json"
                    trigger="loop"
                    size={20}
                    colors="primary:#ffffff,secondary:#ffd6b2"
                  />
                }
              >
                Start Free Workspace
              </Button>
            </Stack>
          </Grid>

          {footerGroups.map((group) => (
            <Grid key={group.title} size={{ xs: 6, md: 2 }}>
              <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 2 }}>
                {group.title}
              </Typography>
              <Stack spacing={1.4}>
                {group.links.map((link) => (
                  <Typography
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: 'rgba(248,243,236,0.68)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease, transform 0.2s ease',
                      '&:hover': { color: '#fff', transform: 'translateX(3px)' },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}

          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, mb: 1 }}>
                Weekly Signal
              </Typography>
              <Typography sx={{ color: 'rgba(248,243,236,0.68)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                New benchmarks, top models, and agent setup patterns delivered in one short brief.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Typography sx={{ color: 'rgba(248,243,236,0.5)', fontSize: '0.86rem' }}>
            2026 NexusAI. Built for teams shipping real AI products.
          </Typography>
          <Typography sx={{ color: 'rgba(248,243,236,0.5)', fontSize: '0.86rem' }}>
            Faster discovery. Smarter model choices. Friendlier workflows.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
