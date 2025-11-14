import { ThemeContext } from '@app/providers/ThemeContext';
import { type Theme, THEMES } from '@core/constants/theme';
import { useLogger } from '@core/providers/logger/useLogger';
import { useStorage } from '@core/providers/storage/useStorage';
import type { ThemeContextValue, ThemeProviderProps } from '@src-types/layout';
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';

/**
 * Theme Provider
 * Manages theme state (light/dark/system) and applies dark mode via class on html element
 * Persists user preference to localStorage
 *
 * Uses StoragePort via useStorage hook to respect hexagonal architecture boundaries
 */
const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)';

function getStoredTheme(storage: ReturnType<typeof useStorage>, defaultTheme: Theme): Theme {
	// Use storage port for SSR-safe access
	const stored = storage.getItem('theme');
	// Validate that stored value is a valid theme (type-safe, no unsafe cast)
	if (stored && (THEMES as readonly string[]).includes(stored)) {
		return stored as Theme;
	}
	return defaultTheme;
}

function getResolvedTheme(theme: Theme): 'light' | 'dark' {
	if (theme === 'system') {
		// Client-side only - guard for SSR
		if (globalThis.window !== undefined) {
			const mediaQuery = globalThis.window.matchMedia(DARK_MODE_MEDIA_QUERY);
			return mediaQuery.matches ? 'dark' : 'light';
		}
		return 'light';
	}
	return theme === 'dark' ? 'dark' : 'light';
}

function applyThemeClass(resolvedTheme: 'light' | 'dark'): void {
	// SSR guard - document may not be available during server-side rendering
	if (typeof document === 'undefined') {
		return;
	}
	const root = document.documentElement;
	if (resolvedTheme === 'dark') {
		root.classList.add('dark');
	} else {
		root.classList.remove('dark');
	}
}

function useThemeState(
	storage: ReturnType<typeof useStorage>,
	defaultTheme: Theme
): readonly [Theme, Dispatch<SetStateAction<Theme>>] {
	const [theme, setTheme] = useState<Theme>(() => getStoredTheme(storage, defaultTheme));
	return [theme, setTheme];
}

function useSystemThemeListener(theme: Theme): void {
	const handleChange = useCallback((e: MediaQueryListEvent) => {
		const newResolved = e.matches ? 'dark' : 'light';
		applyThemeClass(newResolved);
	}, []);

	useEffect(() => {
		if (theme !== 'system') {
			return;
		}

		// Client-side only - guard for SSR
		if (globalThis.window === undefined) {
			return;
		}

		const mediaQuery = globalThis.window.matchMedia(DARK_MODE_MEDIA_QUERY);
		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, [theme, handleChange]);
}

export function ThemeProvider({ children, defaultTheme = 'system' }: Readonly<ThemeProviderProps>) {
	const storage = useStorage();
	const logger = useLogger();
	const [theme, setThemeState] = useThemeState(storage, defaultTheme);
	const resolvedTheme = getResolvedTheme(theme);

	useEffect(() => {
		const resolved = getResolvedTheme(theme);
		applyThemeClass(resolved);

		// Persist to localStorage using storage port
		// Check return value to ensure storage operation succeeded
		const success = storage.setItem('theme', theme);
		if (!success) {
			logger.warn('Failed to persist theme preference to storage');
		}
	}, [theme, storage, logger]);

	useSystemThemeListener(theme);

	const setTheme = useCallback(
		(newTheme: Theme): void => {
			setThemeState(newTheme);
		},
		[setThemeState]
	);

	const value: ThemeContextValue = useMemo(
		() => ({
			theme,
			resolvedTheme,
			setTheme,
		}),
		[theme, resolvedTheme, setTheme]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

ThemeProvider.displayName = 'ThemeProvider';
