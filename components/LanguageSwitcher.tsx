'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = locale === 'en' ? 'ar' : 'en';

  const handleSwitch = () => {
    // Replace the current locale in the pathname
    const newPath = pathname.replace(`/${locale}`, `/${switchTo}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-black dark:text-white"
    >
      <Globe className="h-4 w-4" />
      {switchTo === 'ar' ? 'العربية' : 'English'}
    </button>
  );
}