import type { Metadata } from 'next';
import Script from 'next/script';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { MuiProvider } from '@/components/providers/MuiProvider';

export const metadata: Metadata = {
  title: 'NexusAI - AI Model Marketplace',
  description: 'Discover, test, and deploy cutting-edge AI models',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
        <ReduxProvider>
          <MuiProvider>{children}</MuiProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
