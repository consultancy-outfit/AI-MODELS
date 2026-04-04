'use client';
import { Provider } from 'react-redux';
import { AuthBootstrap } from '@/providers/auth-bootstrap';
import { LanguageProvider } from '@/providers/language-provider';
import { store } from '@/store/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <AuthBootstrap>{children}</AuthBootstrap>
      </LanguageProvider>
    </Provider>
  );
}
