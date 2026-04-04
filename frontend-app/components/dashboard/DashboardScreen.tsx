'use client';

import { Fragment } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BarChartRounded from '@mui/icons-material/BarChartRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import ExtensionRounded from '@mui/icons-material/ExtensionRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import WorkspacePremiumRounded from '@mui/icons-material/WorkspacePremiumRounded';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardOverviewContent } from '@/components/dashboard/DashboardOverviewContent';
import { SiteShell } from '@/components/layout/SiteShell';
import {
  useGetDashboardBillingQuery,
  useGetDashboardHistoryQuery,
  useGetDashboardSettingsQuery,
} from '@/lib/services/dashboardApi';

const titleCopy = {
  overview: {
    pill: '',
    eyebrow: '',
    titleStart: '',
    titleAccent: '',
    titleEnd: '',
    description: '',
  },
  history: {
    pill: 'Saved runs - recent activity',
    eyebrow: 'Session history',
    titleStart: 'Review the',
    titleAccent: 'conversations',
    titleEnd: 'that moved work forward',
    description:
      'Track the prompts, models, and message counts behind each saved session with the same polished card language as the landing page.',
  },
  settings: {
    pill: 'Preferences - account controls',
    eyebrow: 'Workspace settings',
    titleStart: 'Keep your',
    titleAccent: 'workspace tuned',
    titleEnd: 'for the way you build',
    description:
      'Profile details and preferences are grouped into lighter, easier-to-scan cards so account setup feels like part of the product experience.',
  },
  billing: {
    pill: 'Plan - spend - limits',
    eyebrow: 'Billing overview',
    titleStart: 'Understand your',
    titleAccent: 'usage and plan',
    titleEnd: 'at a glance',
    description:
      'Your billing area keeps the same soft visual system as the landing page while showing plan status, request volume, and monthly limits.',
  },
} as const;

const billingCardConfig = [
  {
    heading: 'Plan',
    dataKey: 'plan',
    prefix: '',
    suffix: '',
    Icon: WorkspacePremiumRounded,
    accent: '#C8622A',
  },
  {
    heading: 'This month',
    dataKey: 'monthRequests',
    prefix: '',
    suffix: ' requests',
    Icon: BarChartRounded,
    accent: '#1E4DA8',
  },
  {
    heading: 'Estimated cost',
    dataKey: 'cost',
    prefix: '$',
    suffix: '',
    Icon: ReceiptLongRounded,
    accent: '#2E9E5B',
  },
  {
    heading: 'Model access',
    dataKey: 'modelAccess',
    prefix: '',
    suffix: '',
    Icon: ExtensionRounded,
    accent: '#8A5A00',
  },
] as const;

const shellCardSx = {
  borderRadius: 6,
  bgcolor: 'rgba(255,255,255,0.82)',
  border: '1px solid rgba(206,195,178,0.45)',
  boxShadow: '0 18px 40px rgba(92,67,41,0.08)',
  backdropFilter: 'blur(14px)',
};

export function DashboardScreen({
  section,
}: {
  section: 'overview' | 'history' | 'settings' | 'billing';
}) {
  const { data: history } = useGetDashboardHistoryQuery(undefined, {
    skip: section !== 'history',
  });
  const { data: settings } = useGetDashboardSettingsQuery(undefined, {
    skip: section !== 'settings',
  });
  const { data: billing } = useGetDashboardBillingQuery(undefined, {
    skip: section !== 'billing',
  });

  const hero = titleCopy[section];
  const Wrapper = section === 'overview' ? Fragment : ProtectedRoute;

  return (
    <Wrapper>
      <SiteShell>
        <Container
          maxWidth="lg"
          sx={{
            pb: 8,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '0 12px auto',
              height: 540,
              borderRadius: 10,
              background:
                'radial-gradient(circle at center, rgba(200,98,42,0.08) 0, transparent 60%), radial-gradient(rgba(201,181,157,0.4) 0.8px, transparent 0.8px)',
              backgroundSize: '100% 100%, 18px 18px',
              opacity: 0.55,
              pointerEvents: 'none',
            },
          }}
        >
          {section === 'overview' ? (
            <DashboardOverviewContent />
          ) : (
            <Stack
              spacing={3}
              alignItems="center"
              sx={{ textAlign: 'center', pt: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}
            >
              <Chip
                label={hero.pill}
                sx={{
                  px: 1,
                  borderRadius: 99,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(216,205,189,0.95)',
                  boxShadow: '0 12px 28px rgba(92,67,41,0.08)',
                  fontWeight: 600,
                  color: 'rgba(28,26,22,0.72)',
                }}
              />
              <Stack spacing={1.5} alignItems="center">
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(28,26,22,0.54)',
                    fontWeight: 700,
                  }}
                >
                  {hero.eyebrow}
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    maxWidth: 860,
                    fontFamily: 'var(--font-syne)',
                    fontSize: { xs: '2.8rem', md: '5.2rem' },
                    lineHeight: { xs: 1.06, md: 0.98 },
                    letterSpacing: '-0.05em',
                    color: '#171512',
                  }}
                >
                  {hero.titleStart} <Box component="span" sx={{ color: '#C8622A' }}>{hero.titleAccent}</Box>{' '}
                  {hero.titleEnd}
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 720,
                    fontSize: { xs: '1rem', md: '1.08rem' },
                    lineHeight: 1.8,
                    color: 'rgba(28,26,22,0.65)',
                  }}
                >
                  {hero.description}
                </Typography>
              </Stack>
            </Stack>
          )}

          <Box sx={{ mt: { xs: 5, md: 7 }, position: 'relative', zIndex: 1 }}>
            {section === 'history' && (
              <Stack spacing={2}>
                {(history?.items ?? []).map((item) => (
                  <Card key={item.id} sx={shellCardSx}>
                    <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
                      <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        spacing={2}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                      >
                        <Stack direction="row" spacing={1.7} alignItems="flex-start" sx={{ minWidth: 0 }}>
                          <Box
                            sx={{
                              width: 52,
                              height: 52,
                              borderRadius: 4,
                              bgcolor: 'rgba(200,98,42,0.1)',
                              color: '#C8622A',
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <ChatBubbleOutlineRounded sx={{ fontSize: '1.5rem' }} />
                          </Box>
                          <Stack spacing={0.8} sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontFamily: 'var(--font-syne)', fontSize: '1.25rem', fontWeight: 700 }}>
                              {item.title}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              <Chip label={item.modelName} sx={{ bgcolor: 'rgba(30,77,168,0.08)', color: '#1E4DA8' }} />
                              <Chip label={item.provider} sx={{ bgcolor: 'rgba(46,158,91,0.08)', color: '#206C3E' }} />
                              <Chip
                                label={`${item.messageCount} messages`}
                                sx={{ bgcolor: 'rgba(200,98,42,0.08)', color: '#9A4C22' }}
                              />
                            </Stack>
                            <Typography sx={{ color: 'rgba(28,26,22,0.56)' }}>
                              {item.usage.totalTokens.toLocaleString()} tokens - ${item.usage.estimatedCost} estimated cost
                            </Typography>
                          </Stack>
                        </Stack>

                        <Stack spacing={0.7} sx={{ minWidth: { md: 220 } }}>
                          <Typography sx={{ color: 'rgba(28,26,22,0.42)', fontSize: '0.84rem' }}>
                            Updated
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {new Date(item.updatedAt).toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: 'rgba(28,26,22,0.5)', fontSize: '0.88rem' }}>
                            Avg latency {item.usage.avgLatencyMs} ms
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
            {section === 'settings' && (
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ ...shellCardSx, height: '100%' }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Stack spacing={2.2}>
                        <Stack direction="row" spacing={1.4} alignItems="center">
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 4,
                              bgcolor: 'rgba(30,77,168,0.1)',
                              color: '#1E4DA8',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <ShieldRounded />
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: 'var(--font-syne)', fontSize: '1.4rem', fontWeight: 700 }}>
                              Profile
                            </Typography>
                            <Typography sx={{ color: 'rgba(28,26,22,0.56)' }}>
                              Core account details for your workspace.
                            </Typography>
                          </Box>
                        </Stack>
                        <Divider />
                        {[
                          ['Name', settings?.profile.name ?? 'User'],
                          ['Email', settings?.profile.email ?? 'email@example.com'],
                          ['Plan', settings?.profile.plan ?? 'free'],
                        ].map(([label, value]) => (
                          <Stack key={label} direction="row" justifyContent="space-between" spacing={2}>
                            <Typography sx={{ color: 'rgba(28,26,22,0.56)' }}>{label}</Typography>
                            <Typography sx={{ fontWeight: 700, textAlign: 'right' }}>{value}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ ...shellCardSx, height: '100%' }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Stack spacing={2.2}>
                        <Stack direction="row" spacing={1.4} alignItems="center">
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 4,
                              bgcolor: 'rgba(200,98,42,0.1)',
                              color: '#C8622A',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <TuneRounded />
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: 'var(--font-syne)', fontSize: '1.4rem', fontWeight: 700 }}>
                              Preferences
                            </Typography>
                            <Typography sx={{ color: 'rgba(28,26,22,0.56)' }}>
                              Lightweight controls for language and notifications.
                            </Typography>
                          </Box>
                        </Stack>
                        <Divider />
                        {[
                          ['Language', settings?.preferences.language ?? 'English'],
                          ['Theme', settings?.preferences.theme ?? 'light'],
                          ['Email notifications', settings?.preferences.notifications ? 'Enabled' : 'Disabled'],
                          ['Guest mode', settings?.preferences.guestMode ? 'Enabled' : 'Disabled'],
                        ].map(([label, value]) => (
                          <Box
                            key={label}
                            sx={{
                              p: 1.7,
                              borderRadius: 4,
                              bgcolor: 'rgba(251,248,242,0.95)',
                              border: '1px solid rgba(216,205,189,0.9)',
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                              <Typography sx={{ color: 'rgba(28,26,22,0.66)', fontWeight: 500 }}>{label}</Typography>
                              <Chip
                                label={value}
                                sx={{
                                  bgcolor: 'rgba(200,98,42,0.08)',
                                  color: '#9A4C22',
                                  fontWeight: 700,
                                }}
                              />
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
            {section === 'billing' && (
              <Stack spacing={2.5}>
                <Grid container spacing={2.5}>
                  {billingCardConfig.map((config) => {
                    let value = '';
                    if (config.dataKey === 'plan') value = billing?.plan ?? 'free';
                    else if (config.dataKey === 'monthRequests') value = String(billing?.usage.requests ?? 0);
                    else if (config.dataKey === 'cost') value = String(billing?.usage.estimatedCost ?? 0);
                    else if (config.dataKey === 'modelAccess') value = billing?.limits.modelAccess ?? 'N/A';

                    return (
                      <Grid key={config.heading} size={{ xs: 12, md: 6 }}>
                        <Card sx={{ ...shellCardSx, height: '100%' }}>
                          <CardContent sx={{ p: { xs: 2.4, md: 2.8 } }}>
                            <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                              <Stack spacing={0.7}>
                                <Typography sx={{ color: 'rgba(28,26,22,0.56)' }}>{config.heading}</Typography>
                                <Typography
                                  sx={{
                                    fontFamily: 'var(--font-syne)',
                                    fontSize: '2rem',
                                    lineHeight: 1,
                                    fontWeight: 700,
                                  }}
                                >
                                  {config.prefix || ''}{value}{config.suffix || ''}
                                </Typography>
                              </Stack>
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 4,
                                  bgcolor: `${config.accent}18`,
                                  color: config.accent,
                                  display: 'grid',
                                  placeItems: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <config.Icon />
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ ...shellCardSx, height: '100%' }}>
                      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Stack spacing={2}>
                          <Typography sx={{ fontFamily: 'var(--font-syne)', fontSize: '1.4rem', fontWeight: 700 }}>
                            Invoices
                          </Typography>
                          {(billing?.invoices ?? []).map((invoice) => (
                            <Box
                              key={invoice.id}
                              sx={{
                                p: 2,
                                borderRadius: 4,
                                bgcolor: 'rgba(251,248,242,0.95)',
                                border: '1px solid rgba(216,205,189,0.9)',
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                                <Stack spacing={0.5}>
                                  <Typography sx={{ fontWeight: 700 }}>{invoice.period}</Typography>
                                  <Typography sx={{ color: 'rgba(28,26,22,0.52)', fontSize: '0.9rem' }}>
                                    Invoice {invoice.id}
                                  </Typography>
                                </Stack>
                                <Stack spacing={0.5} alignItems="flex-end">
                                  <Chip
                                    label={invoice.status}
                                    sx={{
                                      bgcolor: 'rgba(46,158,91,0.08)',
                                      color: '#206C3E',
                                      textTransform: 'capitalize',
                                      fontWeight: 700,
                                    }}
                                  />
                                  <Typography sx={{ fontWeight: 700 }}>${invoice.amount}</Typography>
                                </Stack>
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ ...shellCardSx, height: '100%' }}>
                      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Stack spacing={2}>
                          <Typography sx={{ fontFamily: 'var(--font-syne)', fontSize: '1.4rem', fontWeight: 700 }}>
                            Limits
                          </Typography>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 4,
                              bgcolor: 'rgba(251,248,242,0.95)',
                              border: '1px solid rgba(216,205,189,0.9)',
                            }}
                          >
                            <Stack spacing={1.4}>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ color: 'rgba(28,26,22,0.56)' }}>Monthly request cap</Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {billing?.limits.monthlyRequests ?? 0}
                                </Typography>
                              </Stack>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ color: 'rgba(28,26,22,0.56)' }}>Model access</Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {billing?.limits.modelAccess ?? 'N/A'}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>
                          <Box
                            sx={{
                              p: 2.1,
                              borderRadius: 4,
                              bgcolor: 'rgba(23,21,18,0.96)',
                              color: '#FFF6EE',
                            }}
                          >
                            <Stack direction="row" spacing={1.3} alignItems="flex-start">
                              <CalendarMonthRounded sx={{ color: '#F6B17C', mt: 0.2 }} />
                              <Box>
                                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                                  Usage refreshes each billing cycle
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,246,238,0.72)' }}>
                                  Keep an eye on requests and spend here before you approach your plan limit.
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Stack>
            )}
          </Box>
        </Container>
      </SiteShell>
    </Wrapper>
  );
}
