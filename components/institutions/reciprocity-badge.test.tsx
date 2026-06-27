import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ReciprocityBadge } from '@/components/institutions/reciprocity-badge';

describe('ReciprocityBadge', () => {
  it('renders non-participating badge', () => {
    render(
      <ReciprocityBadge
        reciprocity={{
          participates: false,
          label: 'Not participating',
        }}
      />,
    );

    expect(screen.getByText('No reciprocity')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('renders participating tier badges', () => {
    const { rerender } = render(
      <ReciprocityBadge
        reciprocity={{
          participates: true,
          tier: '50',
          label: '50%',
          freeToPublic: false,
        }}
      />,
    );

    expect(screen.getByText('50% off')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();

    rerender(
      <ReciprocityBadge
        reciprocity={{
          participates: true,
          tier: '100-or-50',
          label: '100% OR 50%',
          freeToPublic: false,
        }}
      />,
    );
    expect(screen.getByText('100% or 50%')).toBeInTheDocument();
    expect(screen.getByText('100/50')).toBeInTheDocument();

    rerender(
      <ReciprocityBadge
        reciprocity={{
          participates: true,
          tier: 'free',
          label: 'FREE TO PUBLIC',
          freeToPublic: true,
        }}
      />,
    );
    expect(screen.getByText('Free admission')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });
});
