import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MemberBenefitBadge } from '@/components/institutions/member-benefit-badge';

describe('MemberBenefitBadge', () => {
  it('renders benefit variants', () => {
    const { rerender } = render(
      <MemberBenefitBadge
        benefit={{ kind: '50-discount', label: '50% discount' }}
      />,
    );
    expect(screen.getByText('50% discount')).toBeInTheDocument();

    rerender(
      <MemberBenefitBadge
        benefit={{ kind: 'free-admission', label: 'Free admission' }}
      />,
    );
    expect(screen.getByText('Free admission')).toBeInTheDocument();

    rerender(
      <MemberBenefitBadge
        benefit={{
          kind: 'other-benefits',
          label: 'Other benefits',
          description: 'Other benefits, such as gift shop discounts',
        }}
      />,
    );
    expect(screen.getByText('Other benefits')).toBeInTheDocument();
  });
});
