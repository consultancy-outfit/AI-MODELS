'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import PersonOutline from '@mui/icons-material/PersonOutline';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthCard } from './AuthCard';
import { signupSchema } from '@/utils/validators';
import { useSignupMutation } from '@/services/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

type SignupFields = { name: string; email: string; password: string; confirmPassword: string };
type ApiErrorLike = { data?: { message?: string } };

export function SignupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFields>({ resolver: yupResolver(signupSchema) });

  const onSubmit = async (data: SignupFields) => {
    try {
      const result = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
      router.push('/chat');
    } catch (err) {
      const apiError = err as ApiErrorLike;
      setError('root', { message: apiError?.data?.message ?? 'Signup failed' });
    }
  };

  return (
    <AuthCard>
      <Box sx={{ mb: 4 }}>
        <Chip
          label="New workspace"
          sx={{ mb: 2, bgcolor: 'rgba(30,77,168,0.1)', color: '#1E4DA8', fontWeight: 700 }}
        />
        <Typography
          variant="h4"
          sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#231912', mb: 1 }}
        >
          Create account
        </Typography>
        <Typography sx={{ color: 'rgba(35,25,18,0.58)', fontSize: '0.95rem' }}>
          Join 50,000+ developers on NexusAI
        </Typography>
      </Box>

      {errors.root && (
        <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211,47,47,0.08)', color: '#B42318', border: '1px solid rgba(211,47,47,0.16)' }}>
          {errors.root.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          {...register('name')}
          label="Full Name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutline sx={{ color: 'rgba(35,25,18,0.36)', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(35,25,18,0.58)' },
            '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.72)' },
          }}
        />
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
                  {showPassword ? <VisibilityOff sx={{ color: 'rgba(35,25,18,0.36)', fontSize: 18 }} /> : <Visibility sx={{ color: 'rgba(35,25,18,0.36)', fontSize: 18 }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(35,25,18,0.58)' },
            '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.72)' },
          }}
        />
        <TextField
          {...register('confirmPassword')}
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined sx={{ color: 'rgba(35,25,18,0.36)', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(35,25,18,0.58)' },
            '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.72)' },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 1, py: 1.5, fontSize: '0.95rem', boxShadow: '0 18px 34px rgba(200,98,42,0.22)' }}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
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

        <Typography sx={{ textAlign: 'center', color: 'rgba(35,25,18,0.58)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Box component="span" sx={{ color: '#9A4C22', fontWeight: 700 }}>
              Sign in
            </Box>
          </Link>
        </Typography>
      </Box>
    </AuthCard>
  );
}
