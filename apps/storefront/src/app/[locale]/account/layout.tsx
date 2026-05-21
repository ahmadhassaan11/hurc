import { type ReactNode } from 'react';

import { AccountSidebar } from '@/components/account/AccountSidebar';

type Props = {
  children: ReactNode;
};

export default function AccountLayout({ children }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <AccountSidebar />
        <div>{children}</div>
      </div>
    </section>
  );
}
