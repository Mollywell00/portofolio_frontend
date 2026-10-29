import { createContext } from 'react';
import type { Locale } from '../data/types';

export const LocaleContext = createContext<Locale>('en');
