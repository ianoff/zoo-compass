import { BackToTopLink } from '@/components/back-to-top-link';
import { InstitutionsBrowser } from '@/components/institutions/institutions-browser';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <InstitutionsBrowser />
      </main>

      <SiteFooter />

      <BackToTopLink />
    </div>
  );
}
