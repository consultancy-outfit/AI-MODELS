'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLogoutMutation } from '@/services/authApi';
import { clearCredentials } from '@/store/slices/authSlice';
import { useLanguage } from '@/providers/language-provider';
import { LordIcon } from '@/components/LordIcon';

const NAV_LINKS = [
  { label: 'Chat Hub', href: '/chat' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Discover New', href: '/discover' },
  { label: 'Agents', href: '/agents' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { language, languages, setLanguage } = useLanguage();
  const [logout] = useLogoutMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(clearCredentials());
    router.push('/login');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 14,
          width: 'min(1200px, calc(100% - 20px))',
          mx: 'auto',
          borderRadius: 99,
          bgcolor: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.86)',
          boxShadow: '0 20px 40px rgba(60,39,18,0.08)',
          color: '#1C1A16',
        }}
      >
        <Toolbar sx={{ minHeight: 78, px: { xs: 2, md: 2.5 }, gap: 2 }}>
          <Link
            href="/"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #C8622A, #1E4DA8)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 14px 26px rgba(200,98,42,0.22)',
              }}
            >
              <Typography
                sx={{ color: '#fff', fontWeight: 800, fontFamily: 'var(--font-syne)', fontSize: '1rem' }}
              >
                N
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, lineHeight: 1 }}>
                NexusAI
              </Typography>
              <Typography sx={{ fontSize: '0.76rem', color: 'rgba(28,26,22,0.54)' }}>
                Model command center
              </Typography>
            </Box>
          </Link>

          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              gap: 1,
              flex: 1,
              ml: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: 99,
              bgcolor: 'rgba(246,240,231,0.92)',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <LordIcon src="https://cdn.lordicon.com/wjyqkiew.json" trigger="loop" size={20} />
            <InputBase
              placeholder="Search models, labs, prompts, or use cases"
              sx={{ flex: 1, fontSize: '0.92rem' }}
            />
            <Chip label="Cmd + K" size="small" sx={{ bgcolor: '#fff', fontWeight: 700 }} />
          </Paper>

          <Stack direction="row" spacing={0.75} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    position: 'relative',
                    px: 1.7,
                    py: 1,
                    borderRadius: 99,
                    color: active ? '#1C1A16' : 'rgba(28,26,22,0.62)',
                    fontWeight: active ? 700 : 500,
                    textTransform: 'none',
                    overflow: 'hidden',
                  }}
                >
                  {active && (
                    <Box
                      component={motion.span}
                      layoutId="nav-pill"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 9,
                        bgcolor: 'rgba(255,255,255,0.96)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 10px 20px rgba(60,39,18,0.06)',
                      }}
                    />
                  )}
                  <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
                    {link.label}
                  </Box>
                </Button>
              );
            })}
          </Stack>

          <Box sx={{ flex: { xs: 1, md: 0 } }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Paper
              elevation={0}
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                px: 0.6,
                py: 0.35,
                borderRadius: 99,
                bgcolor: '#fff',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <Button
                onClick={(event) => setLanguageAnchor(event.currentTarget)}
                sx={{
                  minWidth: 0,
                  px: 1.1,
                  color: '#1C1A16',
                  textTransform: 'none',
                  borderRadius: 99,
                }}
                startIcon={<LordIcon src="https://cdn.lordicon.com/yqzmiobz.json" trigger="hover" size={18} />}
                endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
              >
                {language.shortLabel} {language.nativeLabel}
              </Button>
            </Paper>

            <Menu
              anchorEl={languageAnchor}
              open={Boolean(languageAnchor)}
              onClose={() => setLanguageAnchor(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 230,
                  maxHeight: 560,
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,0.97)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 28px 50px rgba(60,39,18,0.14)',
                },
              }}
            >
              <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(28,26,22,0.42)' }}>
                  APP LANGUAGE
                </Typography>
              </Box>
              {languages.map((item) => (
                <MenuItem
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setLanguageAnchor(null);
                  }}
                  sx={{
                    color: item.code === language.code ? '#C8622A' : '#1C1A16',
                    bgcolor: item.code === language.code ? 'rgba(200,98,42,0.08)' : 'transparent',
                    py: 1.1,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography sx={{ width: 28, color: 'rgba(28,26,22,0.48)', fontSize: '0.82rem' }}>
                      {item.shortLabel}
                    </Typography>
                    <Typography>{item.nativeLabel}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>

            <IconButton
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                bgcolor: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <NotificationsOutlinedIcon sx={{ color: '#5A5750' }} />
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: '#C8622A',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 700,
                      boxShadow: '0 12px 24px rgba(200,98,42,0.2)',
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 190,
                      borderRadius: 1,
                      bgcolor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 24px 44px rgba(60,39,18,0.12)',
                    },
                  }}
                >
                  <MenuItem component={Link} href="/dashboard" onClick={() => setAnchorEl(null)}>
                    Dashboard
                  </MenuItem>
                  <MenuItem component={Link} href="/dashboard/settings" onClick={() => setAnchorEl(null)}>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: '#B42318' }}>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button component={Link} href="/login" sx={{ color: '#5A5750', textTransform: 'none' }}>
                  Sign In
                </Button>
                <Button component={Link} href="/signup" variant="contained" sx={{ textTransform: 'none' }}>
                  Sign Up
                </Button>
              </Stack>
            )}

            <IconButton
              sx={{ display: { md: 'none' }, bgcolor: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.06)' }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            p: 2,
            bgcolor: '#F8F3EC',
            borderTopLeftRadius: 28,
            borderBottomLeftRadius: 28,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700 }}>Navigate</Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 1,
            borderRadius: 99,
            bgcolor: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <LordIcon src="https://cdn.lordicon.com/wjyqkiew.json" trigger="loop" size={20} />
          <InputBase placeholder="Search NexusAI" sx={{ flex: 1, fontSize: '0.92rem' }} />
        </Paper>
        <List sx={{ mt: 2 }}>
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <ListItem key={link.href} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 4,
                    bgcolor: active ? 'rgba(200,98,42,0.1)' : 'transparent',
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: active ? 700 : 500,
                        color: active ? '#9A4C22' : '#1C1A16',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ my: 2 }} />
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            px: 1.2,
            py: 1,
            borderRadius: 1,
            bgcolor: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Typography sx={{ fontSize: '0.76rem', fontWeight: 800, color: 'rgba(28,26,22,0.42)' }}>
            APP LANGUAGE
          </Typography>
          {languages.map((item) => (
            <Button
              key={item.code}
              onClick={() => setLanguage(item.code)}
              sx={{
                justifyContent: 'flex-start',
                color: item.code === language.code ? '#C8622A' : '#1C1A16',
                bgcolor: item.code === language.code ? 'rgba(200,98,42,0.08)' : 'transparent',
                borderRadius: 3,
                textTransform: 'none',
              }}
            >
              {item.shortLabel} {item.nativeLabel}
            </Button>
          ))}
        </Paper>
        <Divider sx={{ my: 2 }} />
        {!isAuthenticated && (
          <Stack spacing={1.2}>
            <Button component={Link} href="/login" variant="outlined" fullWidth sx={{ textTransform: 'none' }}>
              Sign In
            </Button>
            <Button component={Link} href="/signup" variant="contained" fullWidth sx={{ textTransform: 'none' }}>
              Sign Up
            </Button>
          </Stack>
        )}
      </Drawer>
    </>
  );
}
