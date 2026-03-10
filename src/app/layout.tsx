import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dots & Boxes – Neon Edition',
  description:
    'A neon-themed Dots and Boxes game vs AI. Easy, Medium, and Hard difficulty.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
