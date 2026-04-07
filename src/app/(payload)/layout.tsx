import React from 'react';

import './globals.css'; // Optional, but usually Payload styles its own pages. 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
