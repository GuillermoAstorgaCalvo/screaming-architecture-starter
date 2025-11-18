import { ThemeProvider } from '@app/providers/ThemeProvider';
import { useTheme } from '@app/providers/useTheme';
import type { Theme } from '@core/constants/theme';
import type { LoggerPort } from '@core/ports/LoggerPort';
import type { StoragePort } from '@core/ports/StoragePort';
import { useLogger } from '@core/providers/logger/useLogger';
import { useStorage } from '@core/providers/storage/useStorage';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@core/providers/storage/useStorage', () => ({
	useStorage: vi.fn(),
}));

vi.mock('@core/providers/logger/useLogger', () => ({
	useLogger: vi.fn(),
}));

const mockedUseStorage = vi.mocked(useStorage);
const mockedUseLogger = vi.mocked(useLogger);

const createStorageMock = () => ({
	getItem: vi.fn<StoragePort['getItem']>(),
	setItem: vi.fn<StoragePort['setItem']>(),
	removeItem: vi.fn<StoragePort['removeItem']>(),
	clear: vi.fn<StoragePort['clear']>(),
	getLength: vi.fn<StoragePort['getLength']>(),
	key: vi.fn<StoragePort['key']>(),
});

interface StoragePortMock extends ReturnType<typeof createStorageMock> {}

const createLoggerMock = () => ({
	debug: vi.fn<LoggerPort['debug']>(),
	info: vi.fn<LoggerPort['info']>(),
	warn: vi.fn<LoggerPort['warn']>(),
	error: vi.fn<LoggerPort['error']>(),
});

interface LoggerPortMock extends ReturnType<typeof createLoggerMock> {}

const createWrapper = (defaultTheme: Theme = 'system') => {
	const ThemeTestWrapper = ({ children }: { children: ReactNode }) => (
		<ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
	);
	ThemeTestWrapper.displayName = 'ThemeTestWrapper';
	return ThemeTestWrapper;
};

type MatchMediaFn = (query: string) => MediaQueryList;

interface ThemeProviderSuiteState {
	readonly storage: StoragePortMock;
	readonly logger: LoggerPortMock;
}

function setupThemeProviderSuite(): ThemeProviderSuiteState {
	const state: { storage: StoragePortMock; logger: LoggerPortMock } = {
		storage: createStorageMock(),
		logger: createLoggerMock(),
	};
	let fallbackMatchMedia: MatchMediaFn | null = null;
	const originalMatchMedia: MatchMediaFn | null =
		typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia : null;

	beforeEach(() => {
		state.storage = createStorageMock();
		state.logger = createLoggerMock();
		mockedUseStorage.mockReturnValue(state.storage);
		mockedUseLogger.mockReturnValue(state.logger);
		state.storage.setItem.mockReturnValue(true);
		document.documentElement.className = '';
		fallbackMatchMedia = vi.fn<MatchMediaFn>(
			() =>
				({
					matches: false,
					media: '(prefers-color-scheme: light)',
					onchange: null,
					addEventListener: vi.fn(),
					removeEventListener: vi.fn(),
					addListener: vi.fn(),
					removeListener: vi.fn(),
					dispatchEvent: vi.fn(),
				}) as MediaQueryList
		);
		(globalThis as { matchMedia: MatchMediaFn }).matchMedia =
			originalMatchMedia ?? fallbackMatchMedia;
	});

	afterEach(() => {
		document.documentElement.className = '';
		if (originalMatchMedia) {
			(globalThis as { matchMedia: MatchMediaFn }).matchMedia = originalMatchMedia;
		} else {
			delete (globalThis as { matchMedia?: MatchMediaFn }).matchMedia;
		}
		vi.clearAllMocks();
	});

	return {
		get storage() {
			return state.storage;
		},
		get logger() {
			return state.logger;
		},
	};
}

describe('ThemeProvider context safety', () => {
	setupThemeProviderSuite();

	it('throws when useTheme is called outside of ThemeProvider', () => {
		expect(() => renderHook(() => useTheme())).toThrowError(
			'useTheme must be used within a ThemeProvider'
		);
	});
});

describe('ThemeProvider initialization', () => {
	const suite = setupThemeProviderSuite();

	it('initializes theme from storage when a valid value exists and persists it', async () => {
		suite.storage.getItem.mockReturnValue('dark');

		const { result } = renderHook(() => useTheme(), {
			wrapper: createWrapper('light'),
		});

		expect(result.current.theme).toBe('dark');
		expect(result.current.resolvedTheme).toBe('dark');

		await waitFor(() => {
			expect(suite.storage.setItem).toHaveBeenCalledWith('theme', 'dark');
		});

		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	it('falls back to the default theme when storage contains an invalid value', async () => {
		suite.storage.getItem.mockReturnValue('neon');

		const { result } = renderHook(() => useTheme(), {
			wrapper: createWrapper('light'),
		});

		expect(result.current.theme).toBe('light');
		expect(result.current.resolvedTheme).toBe('light');

		await waitFor(() => {
			expect(suite.storage.setItem).toHaveBeenCalledWith('theme', 'light');
		});
	});
});

describe('ThemeProvider interactions', () => {
	const suite = setupThemeProviderSuite();

	it('updates theme, resolved value, and html class when setTheme is called', async () => {
		suite.storage.getItem.mockReturnValue(null);

		const { result } = renderHook(() => useTheme(), {
			wrapper: createWrapper('light'),
		});

		expect(result.current.theme).toBe('light');
		expect(document.documentElement.classList.contains('dark')).toBe(false);

		await act(async () => {
			result.current.setTheme('dark');
		});

		await waitFor(() => {
			expect(suite.storage.setItem).toHaveBeenLastCalledWith('theme', 'dark');
		});
		expect(result.current.theme).toBe('dark');
		expect(result.current.resolvedTheme).toBe('dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);

		await act(async () => {
			result.current.setTheme('light');
		});

		await waitFor(() => {
			expect(suite.storage.setItem).toHaveBeenLastCalledWith('theme', 'light');
		});
		expect(result.current.theme).toBe('light');
		expect(result.current.resolvedTheme).toBe('light');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	it('logs a warning when persisting the theme fails', async () => {
		suite.storage.getItem.mockReturnValue(null);
		suite.storage.setItem.mockReturnValueOnce(true).mockReturnValue(false);

		const { result } = renderHook(() => useTheme(), {
			wrapper: createWrapper('light'),
		});

		await act(async () => {
			result.current.setTheme('dark');
		});

		await waitFor(() => {
			expect(suite.logger.warn).toHaveBeenCalledWith(
				'Failed to persist theme preference to storage'
			);
		});
	});
});

interface MediaQueryChangeEvent {
	readonly matches: boolean;
}

type MediaQueryChangeHandler = (event: MediaQueryChangeEvent) => void;

describe('ThemeProvider system preference handling', () => {
	const suite = setupThemeProviderSuite();

	it('resolves system preference and reacts to media query changes', () => {
		suite.storage.getItem.mockReturnValue(null);
		const changeHandlers: MediaQueryChangeHandler[] = [];
		const addEventListenerSpy = vi.fn((event: string, handler: MediaQueryChangeHandler) => {
			if (event === 'change') {
				changeHandlers.push(handler);
			}
		});
		const removeEventListenerSpy = vi.fn((event: string, handler: MediaQueryChangeHandler) => {
			if (event === 'change') {
				const index = changeHandlers.indexOf(handler);
				if (index !== -1) {
					changeHandlers.splice(index, 1);
				}
			}
		});
		const mediaQueryList = {
			matches: true,
			media: '(prefers-color-scheme: dark)',
			onchange: null,
			addEventListener: addEventListenerSpy,
			removeEventListener: removeEventListenerSpy,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn(),
		} as unknown as MediaQueryList;

		const matchMediaMock = vi.fn<MatchMediaFn>(() => mediaQueryList);
		globalThis.matchMedia = matchMediaMock;

		const { result, unmount } = renderHook(() => useTheme(), {
			wrapper: createWrapper('system'),
		});

		expect(result.current.theme).toBe('system');
		expect(result.current.resolvedTheme).toBe('dark');
		expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
		expect(document.documentElement.classList.contains('dark')).toBe(true);

		expect(changeHandlers).toHaveLength(1);
		const [changeHandler] = changeHandlers;
		if (!changeHandler) {
			throw new Error('media query change handler not registered');
		}
		changeHandler({ matches: false });
		expect(document.documentElement.classList.contains('dark')).toBe(false);

		unmount();
		expect(removeEventListenerSpy).toHaveBeenCalledWith('change', changeHandler);
	});
});
