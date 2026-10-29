import type { Profile } from '../data/types';

/**
 * Alamat dirakit saat runtime agar tidak tertulis utuh di HTML/JS hasil build
 * (mengurangi scraping bot). Panggil hanya di event handler atau efek.
 */
export function buildMailto({ email }: Pick<Profile, 'email'>, subject?: string): string {
  const address = [email.user, email.domain].join(String.fromCharCode(64));
  return `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}
