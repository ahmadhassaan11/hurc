'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  toast,
} from '@hurc/ui';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { breadcrumb } from '@/lib/logger/client';

function trigger(action: string): void {
  breadcrumb({ category: 'gdpr', tag: 'gdpr.action' }, `gdpr.${action}.invoked`);
}

export function GdprPanel() {
  const t = useTranslations('account.gdpr');
  const tErrors = useTranslations('errors');
  const [pending, startTransition] = useTransition();

  const [exportOpen, setExportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [challenge, setChallenge] = useState('');

  const challengePhrase = t('delete.challengePhrase');
  const challengeMatches = challenge.trim() === challengePhrase;

  function startExport() {
    startTransition(async () => {
      trigger('export');
      try {
        const res = await fetch('/api/gdpr/export', {
          method: 'POST',
          headers: { 'cache-control': 'no-store' },
        });
        if (res.status === 429) {
          toast.error(t('export.rateLimited'));
          return;
        }
        if (!res.ok) {
          toast.error(t('export.failed'));
          return;
        }
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = 'hurc-data.zip';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
        setExportOpen(false);
        breadcrumb({ category: 'gdpr', tag: 'gdpr.export.success' }, 'gdpr.export.success');
      } catch {
        toast.error(t('export.failed'));
      }
    });
  }

  function deleteAccount() {
    if (!challengeMatches) {
      toast.error(t('delete.challengeMismatch'));
      return;
    }
    startTransition(async () => {
      trigger('delete');
      try {
        const res = await fetch('/api/gdpr/delete', {
          method: 'POST',
          headers: { 'cache-control': 'no-store' },
        });
        if (res.status === 429) {
          toast.error(t('delete.rateLimited'));
          return;
        }
        if (!res.ok) {
          toast.error(t('delete.failed'));
          return;
        }
        breadcrumb({ category: 'gdpr', tag: 'gdpr.delete.success' }, 'gdpr.delete.success');
        toast.success(t('delete.success'));
        // Hard redirect to bypass the RSC cache — a soft router.push could
        // briefly render account data scrubbed in the same tick (ADR R10).
        window.location.assign('/?account=deleted');
      } catch {
        toast.error(tErrors('generic'));
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="border border-[var(--color-line)] p-6">
        <h2 className="text-sm font-medium uppercase tracking-[0.2em]">{t('export.title')}</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t('export.description')}</p>

        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogTrigger asChild>
            <Button type="button" intent="secondary" size="md" className="mt-4">
              {t('export.cta')}
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>{t('export.confirmTitle')}</DialogTitle>
              <DialogDescription>{t('export.confirmBody')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                intent="ghost"
                size="md"
                onClick={() => {
                  setExportOpen(false);
                }}
              >
                {t('delete.cancel')}
              </Button>
              <Button
                type="button"
                intent="primary"
                size="md"
                disabled={pending}
                onClick={startExport}
              >
                {pending ? t('export.preparing') : t('export.confirmCta')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="border border-[var(--color-accent)] bg-[color:rgba(230,57,70,0.06)] p-6">
        <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {t('delete.title')}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t('delete.description')}</p>

        <Dialog
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open);
            if (!open) setChallenge('');
          }}
        >
          <DialogTrigger asChild>
            <Button type="button" intent="destructive" size="md" className="mt-4">
              {t('delete.cta')}
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>{t('delete.confirmTitle')}</DialogTitle>
              <DialogDescription>{t('delete.confirmBody')}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gdpr-challenge">
                {t('delete.challengeLabel', { phrase: challengePhrase })}
              </Label>
              <Input
                id="gdpr-challenge"
                value={challenge}
                onChange={(e) => {
                  setChallenge(e.target.value);
                }}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                intent="ghost"
                size="md"
                onClick={() => {
                  setDeleteOpen(false);
                  setChallenge('');
                }}
              >
                {t('delete.cancel')}
              </Button>
              <Button
                type="button"
                intent="destructive"
                size="md"
                disabled={pending || !challengeMatches}
                onClick={deleteAccount}
              >
                {pending ? t('delete.deleting') : t('delete.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
