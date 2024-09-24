import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../app/contexts/AuthContext';
import { CmsNavigation } from '@/components/ui/CmsNavigation';
import { NavigationProvider } from '@/app/contexts/NavigationContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMS Dashboard",
  description: "A simple CMS dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NavigationProvider>
            <CmsNavigation>
              {children}
            </CmsNavigation>
          </NavigationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
