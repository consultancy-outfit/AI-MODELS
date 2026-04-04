import { Navbar } from '@/components/layout/Navbar';
import Box from '@mui/material/Box';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F2EE' }}>
      <Navbar />
      <Box component="main">{children}</Box>
    </Box>
  );
}
