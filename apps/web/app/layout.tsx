import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ASTRA-LOOP',
  description: 'Closed-Loop Astronaut Health Twin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
