'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Input, toast } from '@hurc/ui';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { subscribeNewsletterAction } from '@/lib/actions/newsletter';

const formSchema = z.object({
  email: z.string().email(),
  /**
   * Honeypot detector. Form defaults to ''; bots that fill it still pass
   * validation (intentional — the Server Action silently short-circuits
   * on a non-empty value).
   */
  website: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterForm() {
  const t = useTranslations('home.newsletter');
  const tErrors = useTranslations('errors');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', website: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await subscribeNewsletterAction(values);
    if (result?.data?.ok === true) {
      const status = result.data.status;
      toast.success(t(`success.${status}`));
      reset();
    } else if (result?.data?.ok === false) {
      toast.error(tErrors(`newsletter.${result.data.error}`));
    } else {
      toast.error(tErrors('generic'));
    }
  });

  return (
    <section
      aria-labelledby="newsletter-title"
      className="border-t border-[var(--color-line)] bg-[var(--color-surface-800)]"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            {t('eyebrow')}
          </p>
          <h2 id="newsletter-title" className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 max-w-md text-sm text-[var(--color-muted)]">{t('description')}</p>
        </div>

        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4 self-end">
          <Field
            label={t('emailLabel')}
            error={errors.email !== undefined ? t('emailError') : undefined}
            required
          >
            <Input
              type="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              {...register('email')}
            />
          </Field>

          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            {...register('website')}
          />

          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>

          <p className="text-xs text-[var(--color-muted)]">{t('consent')}</p>
        </form>
      </div>
    </section>
  );
}
