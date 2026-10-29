import { useEffect, useState } from 'react';

/**
 * Section yang sedang berada di tengah viewport — untuk terrace ruler & aria-current.
 * Satu IntersectionObserver, diputus saat unmount atau daftar id berubah.
 */
export function useActiveSection<T extends string>(ids: readonly T[]): T | undefined {
  const [active, setActive] = useState<T | undefined>(ids[0]);
  const key = ids.join('|');

  useEffect(() => {
    const list = key.split('|') as T[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as T);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const id of list) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}
