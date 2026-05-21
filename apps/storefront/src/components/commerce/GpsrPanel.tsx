import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hurc/ui';
import { getTranslations } from 'next-intl/server';

type ResponsiblePerson = {
  name: string;
  email?: string | null;
  address?: string | null;
};

type Props = {
  customFields: {
    materialComposition?: string | null;
    careInstructions?: string | null;
    sustainabilityNotes?: string | null;
    manufacturerInfo?: string | null;
    warnings?: string | null;
    traceabilityCode?: string | null;
    responsiblePerson?: ResponsiblePerson | null;
  };
};

/**
 * GPSR / EU compliance disclosure panel. Required for the EU launch
 * blocker checklist (see ADR-0003 D5/D6). Accordion-collapsed but
 * never lazy-loaded — content must be in the page on first render.
 */
export async function GpsrPanel({ customFields }: Props) {
  const t = await getTranslations('commerce.gpsr');
  const cf = customFields;

  const sections: { key: string; label: string; body: string | null | undefined }[] = [
    { key: 'material', label: t('material'), body: cf.materialComposition },
    { key: 'care', label: t('care'), body: cf.careInstructions },
    { key: 'sustainability', label: t('sustainability'), body: cf.sustainabilityNotes },
    { key: 'manufacturer', label: t('manufacturer'), body: cf.manufacturerInfo },
    { key: 'warnings', label: t('warnings'), body: cf.warnings },
    {
      key: 'traceability',
      label: t('traceability'),
      body: cf.traceabilityCode ?? null,
    },
  ];

  const visible = sections.filter((s) => s.body !== null && s.body !== undefined && s.body !== '');
  const hasResponsiblePerson = cf.responsiblePerson !== null && cf.responsiblePerson !== undefined;

  // Empty state: a visible "Information pending" panel rather than null. The
  // absence of disclosure is itself disclosed — GPSR Art. 9 §1 says the
  // information must be available "before the product is placed on the
  // market," so an enabled product with no GPSR data is non-compliant
  // regardless of whether we render. Surfacing the empty state makes the
  // gap auditable rather than invisible.
  if (visible.length === 0 && !hasResponsiblePerson) {
    return (
      <section
        aria-labelledby="gpsr-title"
        className="mt-12 border-t border-[var(--color-line)] pt-8"
      >
        <h2
          id="gpsr-title"
          className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]"
        >
          {t('title')}
        </h2>
        <p className="mt-4 text-sm text-[var(--color-muted)]">{t('emptyState')}</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="gpsr-title"
      className="mt-12 border-t border-[var(--color-line)] pt-8"
    >
      <h2 id="gpsr-title" className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
        {t('title')}
      </h2>

      <Accordion type="multiple" className="mt-4">
        {visible.map((section) => (
          <AccordionItem key={section.key} value={section.key}>
            <AccordionTrigger>{section.label}</AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-line">{section.body}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
        {cf.responsiblePerson !== null && cf.responsiblePerson !== undefined ? (
          <AccordionItem value="responsiblePerson">
            <AccordionTrigger>{t('responsiblePerson')}</AccordionTrigger>
            <AccordionContent>
              <p className="font-medium">{cf.responsiblePerson.name}</p>
              {cf.responsiblePerson.address !== null &&
              cf.responsiblePerson.address !== undefined ? (
                <p className="mt-2 whitespace-pre-line text-[var(--color-muted)]">
                  {cf.responsiblePerson.address}
                </p>
              ) : null}
              {cf.responsiblePerson.email !== null && cf.responsiblePerson.email !== undefined ? (
                <p className="mt-2 text-[var(--color-muted)]">
                  <a
                    href={`mailto:${cf.responsiblePerson.email}`}
                    className="underline underline-offset-4 hover:text-[var(--color-fg)]"
                  >
                    {cf.responsiblePerson.email}
                  </a>
                </p>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>
    </section>
  );
}
