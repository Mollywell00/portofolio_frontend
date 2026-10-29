import type * as MotionModule from './motion';

export type Motion = typeof MotionModule;

let pending: Promise<Motion> | undefined;

/** Muat GSAP sekali, setelah halaman tampil — tidak masuk bundle awal. */
export const loadMotion = () => (pending ??= import('./motion'));
