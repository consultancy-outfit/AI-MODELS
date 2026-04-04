import type { Metadata } from 'next';
import Script from 'next/script';
import { StoreProvider } from '@/providers/store-provider';
import { SettingsProvider } from '@/providers/settings-provider';
import { MuiThemeProvider } from '@/providers/theme-provider';

export const metadata: Metadata = {
  title: 'NexusAI - AI Model Marketplace',
  description: 'Discover, test, and deploy cutting-edge AI models',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
        <SettingsProvider>
          <StoreProvider>
            <MuiThemeProvider>{children}</MuiThemeProvider>
          </StoreProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
