import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/components/context/UserContext"; // <-- import your UserProvider
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Teriaq Management | The Smart Healthcare Solution - ترياق",
    template: "%s | Teriaq Management",
  },
  description: "Streamline your healthcare operations with Teriaq Management. The all-in-one dashboard for advanced patient tracking, analytics, and medical resource management.",
  keywords: ["Healthcare Management", "Medical Dashboard", "Teriaq", "ترياق", "Health Tech", "Clinic Management System"],
  authors: [{ name: "Teriaq Team" }],
  creator: "Teriaq Management",
  
  // Icons configuration
  icons: {
    icon: [
      { url: '/teriaq.svg', type: 'image/svg+xml' },
      // Fallback for older browsers
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },

  // OpenGraph (How it looks when shared on WhatsApp/LinkedIn/Twitter)
  openGraph: {
    title: "Teriaq Management - ترياق",
    description: "The ultimate dashboard for modern healthcare management.",
    url: "https://your-domain.com", // Replace with your actual URL
    siteName: "Teriaq",
    images: [
      {
        url: "/og-image.png", // Recommended: 1200x630px image
        width: 1200,
        height: 630,
        alt: "Teriaq Management Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter/X Card
  twitter: {
    card: "summary_large_image",
    title: "Teriaq Management | Healthcare Dashboard",
    description: "Empowering healthcare providers with data-driven insights.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // 🔥 DEFAULT BRAND THEME
  const activeThemeValue =
    cookieStore.get("active_theme")?.value || "brand";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "bg-background font-sans antialiased",
          `theme-${activeThemeValue}`
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Wrap your app in UserProvider so useUser() works everywhere */}
          <UserProvider>
            {children}
            <Toaster position="top-right" richColors />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}