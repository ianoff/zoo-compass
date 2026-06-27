import Image from 'next/image';

export function SiteHeader() {
  return (
    <header className="border-b bg-white/90 backdrop-blur-sm">
      <div className="neon-stripe-bar" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-6 py-6 sm:py-7">
        <div className="flex items-center gap-5 sm:gap-6">
          <Image
            src="/zoo-compass.svg"
            alt="ZooCompass logo"
            width={224}
            height={224}
            priority
            className="size-28 shrink-0 sm:size-48"
          />
          <div className="min-w-0">
            <p className="text-neon-pink text-sm font-semibold tracking-[0.2em] uppercase sm:text-base">
              Find your next zoo adventure
            </p>
            <h1 className="mt-2 text-3xl tracking-tight sm:text-5xl">
              ZooCompass
            </h1>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-[1.1fr_1fr] sm:items-start sm:gap-12">
          <p className="text-foreground/95 text-lg leading-7 font-medium sm:text-xl sm:leading-8">
            ZooCompass is an unofficial tool to help you find the perfect zoo or
            aquarium for your next adventure. Browse AZA-accredited zoos and
            aquariums, compare membership reciprocity tiers, and filter by
            location or institution type.
          </p>
          <div className="text-primary/80 text-md space-y-3 leading-6">
            <p>
              Set your home facility to see expected membership reciprocity
              benefits at each destination. Choose{' '}
              <strong className="text-foreground/80 font-semibold">
                Distance from
              </strong>{' '}
              your home zoo or a ZIP code — straight-line approximations, not
              driving distance. They&apos;re useful for a quick sense of
              what&apos;s nearby, but road miles and travel time may differ.
            </p>
            <p>
              Data is based on the{' '}
              <a
                href="https://www.aza.org/reciprocity"
                target="_blank"
                rel="noopener noreferrer"
              >
                official AZA membership reciprocity chart
              </a>{' '}
              as of June 18, 2026 — always verify benefits before visiting.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
