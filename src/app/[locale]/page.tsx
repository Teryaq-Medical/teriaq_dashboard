// app/[locale]/page.tsx
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { ArrowRight, Shield, Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {ModeToggle} from "@/components/ModeToggle";


export default async function HomePage() {
  const t = await getTranslations("landing");
  const tc = await getTranslations("common");
  const year = new Date().getFullYear().toString();

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-orange-600" />,
      title: t("features.secureManagement.title"),
      description: t("features.secureManagement.description"),
    },
    {
      icon: <Calendar className="h-6 w-6 text-orange-600" />,
      title: t("features.smartScheduling.title"),
      description: t("features.smartScheduling.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/teriaq.svg"
              alt="Teriaq Management"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <Link
            href="/login"
            className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            {tc("signIn")}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-black dark:to-slate-950 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-blue-400 dark:text-white sm:text-5xl md:text-6xl">
              {t("hero.title")}
              <span className="text-orange-600">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              {t("hero.description")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center rounded-full bg-blue-400 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                {t("hero.getStarted")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-transparent dark:text-white dark:hover:bg-slate-900"
              >
                {t("hero.learnMore")}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-full -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              {t("features.description")}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="inline-flex rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-50 dark:bg-slate-950 py-16">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
            {t("cta.description")}
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            {t("cta.startJourney")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {t("footer.copyright", { year })}
        </div>
      </footer>
    </div>
  );
}