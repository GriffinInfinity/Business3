import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WealthOS',
  description: 'The operating system for building a better financial life.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
