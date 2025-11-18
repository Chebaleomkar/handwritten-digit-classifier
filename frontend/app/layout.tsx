import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://handwritten-digit-classifier.vercel.app'), // Replace with actual domain
  title: {
    default: "Handwritten Digit Classifier | AI Powered - Omkar Chebale",
    template: "%s | Handwritten Digit Classifier"
  },
  description: "Experience real-time handwritten digit recognition powered by advanced CNN and MLP deep learning models. Draw a digit and get instant AI predictions.",
  keywords: [
    "AI", "Deep Learning", "MNIST", "Digit Classifier", "CNN", "MLP", "TensorFlow", "React", "Next.js",
    "Omkar Chebale", "Omkar Chebale Projects", "Omkar Chebale Portfolio", "Omkar Chebale AI",
    "Omkar Chebale Developer", "Omkar Chebale Software Engineer", "Omkar Chebale Full Stack",
    "Handwritten Digit Classifier"
  ],
  authors: [{ name: "Omkar Chebale", url: "https://www.google.com/search?q=Omkar+Chebale" }],
  creator: "Omkar Chebale",
  publisher: "Omkar Chebale",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://handwritten-digit-classifier.vercel.app',
    title: 'Handwritten Digit Classifier | AI Powered',
    description: 'Draw a digit and let our advanced AI models predict it with high precision. Compare CNN vs MLP performance in real-time.',
    siteName: 'Handwritten Digit Classifier',
    images: [
      {
        url: '/og-image.png', // You should add an OG image to your public folder
        width: 1200,
        height: 630,
        alt: 'Handwritten Digit Classifier Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Handwritten Digit Classifier | AI Powered',
    description: 'Real-time handwritten digit recognition using Deep Learning.',
    creator: '@omkar_chebale', // specific twitter handle if available
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
