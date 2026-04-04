import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthCredentials, LoginPayload, SignupPayload, ForgotPasswordPayload, User } from '@/interface';
import type { RootState } from '@/store/store';
import { config } from '@/config';

const AUTH_BASE_URL = `${config.apiBaseUrl}/auth`;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: AUTH_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthCredentials, LoginPayload>({
      query: (body) => ({ url: '/login', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    signup: builder.mutation<AuthCredentials, SignupPayload>({
      query: (body) => ({ url: '/signup', method: 'POST', body }),
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordPayload>({
      query: (body) => ({ url: '/forgot-password', method: 'POST', body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/logout', method: 'POST' }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query<User, string>({
      query: () => '/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useForgotPasswordMutation, useLogoutMutation, useGetProfileQuery } = authApi;
