import Box from '@mui/material/Box';
import { Navbar } from '@/ui/layout/Navbar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F2EE' }}>
      <Navbar />
      <Box component="main">{children}</Box>
    </Box>
  );
}
