import { useRef, type ReactNode } from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';

interface MagneticProps {
  children: ReactNode;
  max?: number;
}

/** Bungkus inline-block yang tertarik ke cursor. Isi (tautan/tombol) tetap elemen aslinya. */
export function Magnetic({ children, max }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useMagnetic(ref, max === undefined ? {} : { max });
  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {children}
    </span>
  );
}
