import { useEffect, useRef, type ReactNode } from 'react';
import { profile } from '../../data';
import { buildMailto } from '../../utils/email';

interface EmailLinkProps {
  className?: string | undefined;
  children: ReactNode;
}

/** Tautan email yang alamatnya baru dipasang setelah mount (tidak ada di HTML/JS utuh). */
export function EmailLink({ className, children }: EmailLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    ref.current?.setAttribute('href', buildMailto(profile));
  }, []);

  return (
    <a ref={ref} className={className} href="#contact">
      {children}
    </a>
  );
}
