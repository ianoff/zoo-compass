import type { ReactNode } from 'react';
import { Mail, Phone } from 'lucide-react';

import type { Institution } from '@/lib/types/institution';
import { formatAddress, hasContactInfo } from '@/lib/types/institution';
import { cn } from '@/lib/utils';

type InstitutionRowDetailProps = {
  institution: Institution;
};

type DetailFieldProps = {
  label: string;
  children: ReactNode;
  contentClassName?: string;
};

function DetailField({ label, children, contentClassName }: DetailFieldProps) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
        {label}
      </p>
      <div
        className={cn(
          'text-foreground min-w-0 text-sm leading-6 break-words',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function InstitutionRowDetail({
  institution,
}: InstitutionRowDetailProps) {
  const showContact = hasContactInfo(institution.contact);
  const formattedAddress = institution.address
    ? formatAddress(institution.address)
    : null;

  return (
    <div className="institution-row-detail bg-muted/30 grid w-full min-w-0 grid-cols-1 gap-6 px-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
      {institution.website ? (
        <DetailField label="Website">
          <a
            href={institution.website}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all"
          >
            {institution.website}
          </a>
        </DetailField>
      ) : null}
      {formattedAddress ? (
        <DetailField label="Address">
          <p className="break-words">{formattedAddress}</p>
        </DetailField>
      ) : null}
      {institution.accreditedThrough ? (
        <DetailField label="Accreditation">
          <p>Accredited through {institution.accreditedThrough}</p>
        </DetailField>
      ) : null}
      {showContact ? (
        <DetailField label="Guest services" contentClassName="leading-snug">
          <div className="space-y-1 leading-snug">
            {institution.contact?.name ? (
              <p>{institution.contact.name}</p>
            ) : null}
            {institution.contact?.email ? (
              <a
                href={`mailto:${institution.contact.email}`}
                className="inline-flex max-w-full items-start gap-1.5 break-all"
              >
                <Mail
                  className="mt-0.5 size-3.5 shrink-0 opacity-70"
                  aria-hidden
                />
                <span className="min-w-0">{institution.contact.email}</span>
              </a>
            ) : null}
            {institution.contact?.phone ? (
              <a
                href={`tel:${institution.contact.phone.replace(/\s*x\s*/i, ',')}`}
                className="inline-flex max-w-full items-start gap-1.5 break-words"
              >
                <Phone
                  className="mt-0.5 size-3.5 shrink-0 opacity-70"
                  aria-hidden
                />
                <span className="min-w-0">{institution.contact.phone}</span>
              </a>
            ) : null}
          </div>
        </DetailField>
      ) : null}
      <DetailField label="Source">
        <p>{institution.source}</p>
      </DetailField>
    </div>
  );
}
