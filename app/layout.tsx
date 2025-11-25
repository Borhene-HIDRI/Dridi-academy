import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-heading' })

export const metadata: Metadata = {
  title: 'Abderahmen Dridi MMA',
  description: 'Mixed Martial Arts School - Train with Champions',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
        {children}
        <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
