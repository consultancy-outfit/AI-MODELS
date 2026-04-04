import Box from '@mui/material/Box';
import { Footer } from './Footer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F4F2EE',
        backgroundImage: `
          radial-gradient(circle at 10% 8%, rgba(200,98,42,0.14), transparent 20%),
          radial-gradient(circle at 92% 12%, rgba(30,77,168,0.14), transparent 20%),
          linear-gradient(180deg, #FBF8F2 0%, #F4F2EE 48%, #EEE8DE 100%)
        `,
      }}
    >
      <Box component="main" sx={{ pt: { xs: 4, md: 6 } }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
