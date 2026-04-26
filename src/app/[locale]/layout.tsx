import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

// ✅ ADD THIS
import { UserProvider } from "@/components/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const locales = ["en", "ar"] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "Teriaq Management | The Smart Healthcare Solution - ترياق",
    template: "%s | Teriaq Management",
  },
  description:
    "Streamline your healthcare operations with Teriaq Management.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  const cookieStore = await cookies();
  const activeThemeValue =
    cookieStore.get("active_theme")?.value || "brand";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={`theme-${activeThemeValue}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* ✅ RESTORED USER PROVIDER */}
            <UserProvider>
              {children}
            </UserProvider>

            <Toaster
              position={locale === "ar" ? "top-left" : "top-right"}
              richColors
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}