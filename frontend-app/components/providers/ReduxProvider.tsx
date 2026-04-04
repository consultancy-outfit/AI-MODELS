'use client';
import { Provider } from 'react-redux';
import { AuthBootstrap } from '@/components/providers/AuthBootstrap';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { store } from '@/lib/store/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <AuthBootstrap>{children}</AuthBootstrap>
      </LanguageProvider>
    </Provider>
  );
}
