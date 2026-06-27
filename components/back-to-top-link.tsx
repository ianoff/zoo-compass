'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 400;
const FOOTER_CLEARANCE = 140;

export function BackToTopLink() {
  const [visible, setVisible] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      setVisible(window.scrollY > SCROLL_THRESHOLD);
      setNearFooter(docHeight - scrollBottom < FOOTER_CLEARANCE);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        'border-neon-teal/40 text-neon-teal hover:bg-neon-teal/10 focus-visible:ring-neon-teal/40 fixed right-4 z-50 flex items-center gap-1.5 rounded-full border bg-white/95 px-3 py-2 text-sm font-medium shadow-md backdrop-blur-sm transition-all focus-visible:ring-2 focus-visible:outline-none sm:right-6',
        nearFooter ? 'bottom-36 sm:bottom-32' : 'bottom-4 sm:bottom-6',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      )}
    >
      <ArrowUp className="size-4" aria-hidden />
      <span className="hidden sm:inline">Back to top</span>
    </button>
  );
}
