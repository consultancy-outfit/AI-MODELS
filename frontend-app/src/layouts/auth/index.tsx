import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const signals = [
  { label: 'Model workspaces', value: '500+' },
  { label: 'Teams onboarded', value: '50K+' },
  { label: 'Fastest setup', value: '12 min' },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1.05fr 0.95fr' },
        bgcolor: '#F6F0E7',
        backgroundImage: `
          radial-gradient(circle at 12% 18%, rgba(200,98,42,0.18), transparent 24%),
          radial-gradient(circle at 88% 14%, rgba(30,77,168,0.14), transparent 22%),
          linear-gradient(180deg, #FBF8F2 0%, #F6F0E7 54%, #EFE6DA 100%)
        `,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, sm: 4, lg: 8 },
          py: { xs: 6, md: 8 },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 720,
            position: 'relative',
            zIndex: 1,
            animation: 'auth-fade-up 700ms ease-out',
            '@keyframes auth-fade-up': {
              from: { opacity: 0, transform: 'translateY(18px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Chip
            label="NexusAI access portal"
            sx={{
              mb: 3,
              bgcolor: 'rgba(255,255,255,0.72)',
              border: '1px solid rgba(0,0,0,0.08)',
              fontWeight: 700,
              color: '#6C4D2D',
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-syne)',
              fontSize: { xs: '2.8rem', md: '4.8rem' },
              lineHeight: 1,
              mb: 2,
              maxWidth: 620,
              color: '#231912',
            }}
          >
            Build with AI tools that feel curated, not chaotic.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 520,
              color: 'rgba(35,25,18,0.68)',
              fontSize: { xs: '1rem', md: '1.08rem' },
              lineHeight: 1.8,
            }}
          >
            Sign in to compare models, ship agents faster, and keep your team&apos;s AI stack
            organized in one light, focused workspace.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 5, flexWrap: 'wrap' }}
          >
            {signals.map((signal, index) => (
              <Box
                key={signal.label}
                sx={{
                  minWidth: 170,
                  px: 2.5,
                  py: 2,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.62)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 18px 50px rgba(93,64,35,0.08)',
                  animation: `auth-fade-up 700ms ease-out ${120 + index * 120}ms both`,
                }}
              >
                <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.6rem', color: '#1F2A44' }}>
                  {signal.value}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'rgba(35,25,18,0.62)' }}>
                  {signal.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            position: 'absolute',
            right: 48,
            top: 72,
            width: 220,
            height: 220,
            borderRadius: '32px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.7), rgba(255,255,255,0.28))',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 24px 80px rgba(30,77,168,0.12)',
            transform: 'rotate(10deg)',
            animation: 'float-soft 8s ease-in-out infinite',
            '@keyframes float-soft': {
              '0%, 100%': { transform: 'rotate(10deg) translateY(0px)' },
              '50%': { transform: 'rotate(7deg) translateY(-14px)' },
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 4, md: 8 },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 240, md: 320 },
            height: { xs: 240, md: 320 },
            right: { xs: -80, md: -40 },
            bottom: { xs: -80, md: 0 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(10,94,73,0.16) 0%, transparent 68%)',
            animation: 'pulse-soft 6s ease-in-out infinite',
            '@keyframes pulse-soft': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
              '50%': { transform: 'scale(1.08)', opacity: 1 },
            },
          }}
        />
        {children}
      </Box>
    </Box>
  );
}
