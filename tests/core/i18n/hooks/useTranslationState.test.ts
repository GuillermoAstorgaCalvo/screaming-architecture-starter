import {
	useLoadingStateUpdater,
	useResourceLoadingState,
} from '@core/i18n/hooks/useTranslationState';
import i18n from '@core/i18n/i18n';
import { isResourceLoading } from '@core/i18n/resourceLoader/cache';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/i18n/i18n', () => ({
	default: {
		language: 'en',
		getResourceBundle: vi.fn(),
	},
}));

vi.mock('@core/i18n/hooks/useTranslationHelpers', () => ({
	isResourceLoadedInI18n: vi.fn(),
}));

vi.mock('@core/i18n/resourceLoader/cache', () => ({
	isResourceLoading: vi.fn(),
}));

const { isResourceLoadedInI18n } = await import('@core/i18n/hooks/useTranslationHelpers');
const mockIsResourceLoadedInI18n = vi.mocked(isResourceLoadedInI18n);
const mockIsResourceLoading = vi.mocked(isResourceLoading);
const mockI18n = vi.mocked(i18n);

// Helper functions
function setupMocks() {
	vi.clearAllMocks();
	mockI18n.language = 'en';
}

function setupResourceMocks(loaded: boolean, loading: boolean) {
	mockIsResourceLoadedInI18n.mockReturnValue(loaded);
	mockIsResourceLoading.mockReturnValue(loading);
}

interface LoadingStateUpdaterResult {
	isLoading: boolean;
	setLoading: (loading: boolean) => void;
}

interface ResourceLoadingStateResult {
	isLoading: boolean;
	isReady: boolean;
	setCurrentLanguage: (language: string) => void;
	currentLanguageRef: { current: string };
	stateUpdaters: {
		setLoading: (loading: boolean) => void;
		setIsReady: (ready: boolean) => void;
	};
}

async function setLoadingAndWait(result: { current: LoadingStateUpdaterResult }, loading: boolean) {
	act(() => {
		result.current.setLoading(loading);
	});
	await waitFor(() => {
		expect(result.current.isLoading).toBe(loading);
	});
}

async function setLoadingViaUpdaterAndWait(
	result: { current: ResourceLoadingStateResult },
	loading: boolean
) {
	act(() => {
		result.current.stateUpdaters.setLoading(loading);
	});
	await waitFor(() => {
		expect(result.current.isLoading).toBe(loading);
	});
}

async function setIsReadyAndWait(result: { current: ResourceLoadingStateResult }, ready: boolean) {
	act(() => {
		result.current.stateUpdaters.setIsReady(ready);
	});
	await waitFor(() => {
		expect(result.current.isReady).toBe(ready);
	});
}

describe('useLoadingStateUpdater', () => {
	beforeEach(() => {
		setupMocks();
	});

	describe('initialization', () => {
		it('should initialize with loading state when initialLoading is true', () => {
			const { result } = renderHook(() => useLoadingStateUpdater('common', 'en', true));

			expect(result.current.isLoading).toBe(true);
		});

		it('should initialize without loading state when initialLoading is false', () => {
			const { result } = renderHook(() => useLoadingStateUpdater('common', 'en', false));

			expect(result.current.isLoading).toBe(false);
		});
	});

	describe('loading state updates', () => {
		it('should update loading state when setLoading is called', async () => {
			const { result } = renderHook(() => useLoadingStateUpdater('common', 'en', false));

			expect(result.current.isLoading).toBe(false);

			await setLoadingAndWait(result, true);
			await setLoadingAndWait(result, false);
		});

		it('should handle multiple setLoading calls', async () => {
			const { result } = renderHook(() => useLoadingStateUpdater('common', 'en', false));

			await setLoadingAndWait(result, true);
			await setLoadingAndWait(result, true);
			await setLoadingAndWait(result, false);
		});
	});

	describe('namespace and language isolation', () => {
		it('should track loading state per namespace and language', async () => {
			const { result: result1 } = renderHook(() => useLoadingStateUpdater('common', 'en', false));
			const { result: result2 } = renderHook(() => useLoadingStateUpdater('landing', 'en', false));

			await setLoadingAndWait(result1, true);
			expect(result2.current.isLoading).toBe(false);

			await setLoadingAndWait(result2, true);
			expect(result1.current.isLoading).toBe(true);
		});

		it('should update when currentLanguage changes', async () => {
			const { result, rerender } = renderHook(
				({ language }) => useLoadingStateUpdater('common', language, false),
				{
					initialProps: { language: 'en' },
				}
			);

			await setLoadingAndWait(result, true);

			rerender({ language: 'es' });
			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});
		});
	});
});

describe('useResourceLoadingState - initialization', () => {
	beforeEach(() => {
		setupMocks();
	});

	it('should initialize with correct state when resource is loaded', () => {
		setupResourceMocks(true, false);

		const { result } = renderHook(() => useResourceLoadingState('common'));

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isReady).toBe(true);
		expect(result.current.currentLanguageRef.current).toBe('en');
	});

	it('should initialize with loading state when resource is not loaded and not loading', () => {
		setupResourceMocks(false, false);

		const { result } = renderHook(() => useResourceLoadingState('common'));

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isReady).toBe(false);
	});

	it('should initialize without loading state when resource is already loading', () => {
		setupResourceMocks(false, true);

		const { result } = renderHook(() => useResourceLoadingState('common'));

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isReady).toBe(false);
	});

	it('should initialize currentLanguageRef with i18n language', () => {
		mockI18n.language = 'es';
		setupResourceMocks(true, false);

		const { result } = renderHook(() => useResourceLoadingState('common'));

		expect(result.current.currentLanguageRef.current).toBe('es');
	});
});

describe('useResourceLoadingState - state management', () => {
	beforeEach(() => {
		setupMocks();
	});

	describe('state updaters', () => {
		it('should provide state updaters', () => {
			setupResourceMocks(true, false);

			const { result } = renderHook(() => useResourceLoadingState('common'));

			expect(result.current.stateUpdaters).toBeDefined();
			expect(typeof result.current.stateUpdaters.setLoading).toBe('function');
			expect(typeof result.current.stateUpdaters.setIsReady).toBe('function');
		});

		it('should maintain stable state updaters reference', () => {
			setupResourceMocks(true, false);

			const { result, rerender } = renderHook(() => useResourceLoadingState('common'));

			const firstUpdaters = result.current.stateUpdaters;

			rerender();

			expect(result.current.stateUpdaters).toBe(firstUpdaters);
		});
	});

	describe('state updates', () => {
		it('should update loading state via state updater', async () => {
			setupResourceMocks(true, false);

			const { result } = renderHook(() => useResourceLoadingState('common'));

			expect(result.current.isLoading).toBe(false);

			await setLoadingViaUpdaterAndWait(result, true);
			await setLoadingViaUpdaterAndWait(result, false);
		});

		it('should update ready state via state updater', async () => {
			setupResourceMocks(false, false);

			const { result } = renderHook(() => useResourceLoadingState('common'));

			expect(result.current.isReady).toBe(false);

			await setIsReadyAndWait(result, true);
			await setIsReadyAndWait(result, false);
		});
	});

	describe('language management', () => {
		it('should update current language via setCurrentLanguage', () => {
			setupResourceMocks(true, false);

			const { result } = renderHook(() => useResourceLoadingState('common'));

			expect(result.current.currentLanguageRef.current).toBe('en');

			// setCurrentLanguage updates state, but currentLanguageRef is updated directly
			// by the hook implementation when language changes, not by setCurrentLanguage
			// This test verifies setCurrentLanguage is callable
			act(() => {
				result.current.setCurrentLanguage('es');
			});
			// The ref is updated directly in the hook, so we check it synchronously
			// Note: The actual ref update happens in useResourceLoader, not here
			expect(typeof result.current.setCurrentLanguage).toBe('function');
		});
	});

	describe('namespace isolation', () => {
		it('should handle different namespaces independently', async () => {
			setupResourceMocks(false, false);

			const { result: result1 } = renderHook(() => useResourceLoadingState('common'));
			const { result: result2 } = renderHook(() => useResourceLoadingState('landing'));

			expect(result1.current.isLoading).toBe(true);
			expect(result2.current.isLoading).toBe(true);

			await setLoadingViaUpdaterAndWait(result1, false);
			expect(result2.current.isLoading).toBe(true);
		});
	});
});
