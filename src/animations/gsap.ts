/**
 * Satu-satunya tempat plugin GSAP didaftarkan. Komponen mengimpor dari sini,
 * bukan langsung dari 'gsap', agar plugin pasti terdaftar sekali.
 */
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, CustomEase, Flip, ScrollTrigger, SplitText);

export { gsap, CustomEase, Flip, ScrollTrigger, SplitText, useGSAP };
