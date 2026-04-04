'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import { useState } from 'react';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthCard } from './AuthCard';
import { loginSchema } from '@/utils/validators';
import { useLoginMutation } from '@/services/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

type LoginFields = { email: string; password: string };
type ApiErrorLike = { data?: { message?: string } };

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFields>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: LoginFields) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
      router.push('/chat');
    } catch (err) {
      const apiError = err as ApiErrorLike;
      setError('root', { message: apiError?.data?.message ?? 'Login failed' });
    }
  };

  return (
    <AuthCard>
      <Box sx={{ mb: 4 }}>
        <Chip
          label="Secure sign in"
          sx={{ mb: 2, bgcolor: 'rgba(200,98,42,0.1)', color: '#9A4C22', fontWeight: 700 }}
        />
        <Typography
          variant="h4"
          sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#231912', mb: 1 }}
        >
          Welcome back
        </Typography>
        <Typography sx={{ color: 'rgba(35,25,18,0.58)', fontSize: '0.95rem' }}>
          Sign in to your NexusAI account
        </Typography>
      </Box>

      {errors.root && (
        <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211,47,47,0.08)', color: '#B42318', border: '1px solid rgba(211,47,47,0.16)' }}>
          {errors.root.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          {...register('email')}
          label="Email"
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined sx={{ color: 'rgba(35,25,18,0.36)', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(35,25,18,0.58)' },
            '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.72)' },
          }}
        />
        <TextField
          {...register('password')}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined sx={{ color: 'rgba(35,25,18,0.36)', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small">
                  {showPassword ? (
                    <VisibilityOff sx={{ color: 'rgba(35,25,18,0.36)', fontSize: 18 }} />
                  ) : (
                    <Visibility sx={{ color: 'rgba(35,25,18,0.36)', fontSize: 18 }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(35,25,18,0.58)' },
            '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.72)' },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
          <Link href="/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography sx={{ fontSize: '0.82rem', color: '#9A4C22', '&:hover': { textDecoration: 'underline' } }}>
              Forgot password?
            </Typography>
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 1, py: 1.5, fontSize: '0.95rem', boxShadow: '0 18px 34px rgba(200,98,42,0.22)' }}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
        </Button>

        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={() => router.push('/chat')}
          sx={{ py: 1.35, fontSize: '0.92rem', textTransform: 'none' }}
        >
          Continue as Guest
        </Button>

        <Divider sx={{ borderColor: 'rgba(35,25,18,0.12)', my: 1 }}>
          <Typography sx={{ color: 'rgba(35,25,18,0.35)', fontSize: '0.75rem' }}>OR</Typography>
        </Divider>

        <Typography sx={{ textAlign: 'center', color: 'rgba(35,25,18,0.58)', fontSize: '0.875rem' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <Box component="span" sx={{ color: '#9A4C22', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}>
              Create one
            </Box>
          </Link>
        </Typography>
      </Box>
    </AuthCard>
  );
}
