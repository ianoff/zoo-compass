import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="border-t bg-white/80 px-6 py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-xs leading-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <p className="text-muted-foreground max-w-2xl">
          ZooCompass is an unofficial reference tool and is not affiliated with,
          endorsed by, or sponsored by the Association of Zoos and Aquariums
          (AZA). Information is compiled from publicly available sources and may
          be incomplete or outdated. This app makes no warranties about accuracy
          — always verify membership benefits, hours, and policies directly with
          each institution before visiting.
        </p>

        <div className="text-muted-foreground flex shrink-0 flex-col gap-1.5 sm:items-end">
          <p className="sm:text-right">
            Whimsically brought to you by{' '}
            <a
              href="https://ianoff.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
            >
              ianoff
            </a>{' '}
            @
          </p>
          <a
            href="https://rootwork.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex no-underline transition-opacity hover:opacity-80"
            aria-label="Rootwork Labs"
          >
            <Image
              src="/rootwork-labs-green.svg"
              alt=""
              width={1200}
              height={400}
              className="h-11 w-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
