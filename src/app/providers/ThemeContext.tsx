import type { Theme } from '@core/constants/theme';
import { createContext } from 'react';

export interface ThemeContextValue {
	readonly theme: Theme;
	readonly resolvedTheme: 'light' | 'dark';
	/**
	 * Function to set the theme preference
	 * @param theme - The new theme value ('light' | 'dark' | 'system')
	 */
	setTheme: (_theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
