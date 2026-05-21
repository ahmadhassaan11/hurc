import { Skeleton } from '@hurc/ui';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <Skeleton radius="none" className="aspect-[3/4] w-full" />
      <div className="flex items-baseline justify-between gap-2">
        <Skeleton radius="sm" className="h-4 w-24" />
        <Skeleton radius="sm" className="h-4 w-12" />
      </div>
    </div>
  );
}
