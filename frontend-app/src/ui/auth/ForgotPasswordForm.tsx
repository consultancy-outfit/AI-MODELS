'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { AuthCard } from './AuthCard';
import { forgotPasswordSchema } from '@/utils/validators';
import { useForgotPasswordMutation } from '@/services/authApi';

type ForgotFields = { email: string };

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotFields>({ resolver: yupResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotFields) => {
    try {
      await forgotPassword(data).unwrap();
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      setError('root', { message: apiError?.data?.message ?? 'Request failed' });
    }
  };

  return (
    <AuthCard>
      <Box sx={{ mb: 4 }}>
        <Chip
          label="Account recovery"
          sx={{ mb: 2, bgcolor: 'rgba(10,94,73,0.1)', color: '#0A5E49', fontWeight: 700 }}
        />
        <Typography
          variant="h4"
          sx={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#231912', mb: 1 }}
        >
          Reset password
        </Typography>
        <Typography sx={{ color: 'rgba(35,25,18,0.58)', fontSize: '0.95rem' }}>
          Enter your email and we&apos;ll send a reset link
        </Typography>
      </Box>

      {errors.root && (
        <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211,47,47,0.08)', color: '#B42318', border: '1px solid rgba(211,47,47,0.16)' }}>
          {errors.root.message}
        </Alert>
      )}

      {isSuccess ? (
        <Alert severity="success" sx={{ bgcolor: 'rgba(10,94,73,0.08)', color: '#0A5E49', border: '1px solid rgba(10,94,73,0.18)' }}>
          Check your inbox! A reset link has been sent to your email.
        </Alert>
      ) : (
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 1, py: 1.5, fontSize: '0.95rem', boxShadow: '0 18px 34px rgba(200,98,42,0.22)' }}
          >
            {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Send Reset Link'}
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Link href="/login" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(35,25,18,0.5)', fontSize: '0.875rem', '&:hover': { color: '#9A4C22' } }}>
            <ArrowBack sx={{ fontSize: 16 }} />
            Back to Sign In
          </Box>
        </Link>
      </Box>
    </AuthCard>
  );
}
