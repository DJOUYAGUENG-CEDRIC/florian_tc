import './globals.css';

export const metadata = {
  title: 'Bot Apple of Fortune',
  description: 'Assistant Apple of Fortune — Code promo 58NEX',
  icons: {
    icon: '/apple.jpeg',
  },
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
