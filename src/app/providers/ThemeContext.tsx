import type { ThemeContextValue } from '@src-types/layout';
import { createContext } from 'react';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
