import type { SanityImageSource } from '@sanity/image-url';
import Image from 'next/image';

import { urlFor } from '@/lib/sanity/image';

type Props = {
  source: (SanityImageSource & { alt?: string }) | null | undefined;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  fill?: boolean;
};

export function EditorialImage({
  source,
  width,
  height,
  sizes,
  priority,
  quality = 85,
  className,
  fill,
}: Props) {
  const builder = urlFor(source);
  if (!builder) return null;
  const src = builder.width(width).height(height).quality(quality).url();
  const alt = (source as { alt?: string } | null | undefined)?.alt ?? '';
  const optional = {
    ...(sizes !== undefined && { sizes }),
    ...(priority !== undefined && { priority }),
    ...(className !== undefined && { className }),
  };
  return fill ? (
    <Image src={src} alt={alt} fill quality={quality} {...optional} />
  ) : (
    <Image src={src} alt={alt} width={width} height={height} quality={quality} {...optional} />
  );
}
