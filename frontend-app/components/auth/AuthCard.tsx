'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export function AuthCard({ children, maxWidth = 440 }: AuthCardProps) {
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      elevation={0}
      sx={{
        width: '100%',
        maxWidth,
        p: { xs: 3, sm: 5 },
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 5,
        boxShadow: '0 30px 90px rgba(79,56,29,0.14)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.48), rgba(255,255,255,0.2))',
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
    </Paper>
  );
}
