import './globals.css';

export const metadata = {
  title: 'Florian TC',
  description: 'Assistant pronostics sportifs — Code promo FTC17',
  icons: { icon: '/apple.jpeg' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
