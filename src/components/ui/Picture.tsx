import type { Media } from '../../data/types';
import { useLocale } from '../../hooks/useLocale';

interface PictureProps {
  media: Media;
  /** Petunjuk lebar tampil untuk memilih ukuran srcset. */
  sizes: string;
  className?: string | undefined;
  /** true untuk gambar di atas lipatan (tanpa lazy-load). */
  priority?: boolean;
}

export function Picture({ media, sizes, className, priority = false }: PictureProps) {
  const { t } = useLocale();
  return (
    <picture>
      <source type="image/avif" srcSet={media.srcset.avif} sizes={sizes} />
      <source type="image/webp" srcSet={media.srcset.webp} sizes={sizes} />
      <img
        className={className}
        src={media.src}
        alt={t(media.alt)}
        width={media.width}
        height={media.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}
