'use client';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#90cdf4" />
      </head>
      <body>
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SpeedInsights />
            <Analytics />
            {children}
          </ThemeProvider>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
