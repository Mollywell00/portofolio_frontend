import { CustomEase } from './gsap';

/** Padanan token CSS --ease-* dan --dur-* (src/styles/tokens.css). Detik, untuk GSAP. */
export const ease = {
  terrace: CustomEase.create('terrace', '0.22, 1, 0.36, 1'),
  inOut: CustomEase.create('terraceInOut', '0.65, 0, 0.35, 1'),
  magnet: 'elastic.out(1, 0.4)',
} as const;

export const duration = {
  micro: 0.2,
  reveal: 0.7,
  page: 0.9,
  heroMax: 1.2,
} as const;

export const stagger = {
  char: 0.04,
  line: 0.08,
} as const;
