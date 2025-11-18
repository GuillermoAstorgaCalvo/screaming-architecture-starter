import {
	handleExistingLoad,
	handleInitialLoad,
	isResourceLoadedInI18n,
	updateLoadingState,
} from '@core/i18n/hooks/useTranslationHelpers';
import {
	useResourceLoader,
	useResourceLoadingEffects,
} from '@core/i18n/hooks/useTranslationLoader';
import i18n from '@core/i18n/i18n';
import { isResourceCached, isResourceLoading } from '@core/i18n/resourceLoader/cache';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/i18n/i18n', () => ({
	default: {
		language: 'en',
		on: vi.fn(),
		off: vi.fn(),
	},
}));

vi.mock('@core/i18n/hooks/useTranslationHelpers', () => ({
	isResourceLoadedInI18n: vi.fn(),
	handleExistingLoad: vi.fn(),
	handleInitialLoad: vi.fn(),
	updateLoadingState: vi.fn(),
}));

vi.mock('@core/i18n/resourceLoader/cache', () => ({
	isResourceCached: vi.fn(),
	isResourceLoading: vi.fn(),
}));

const mockI18n = vi.mocked(i18n);
const mockIsResourceLoadedInI18n = vi.mocked(isResourceLoadedInI18n);
const mockIsResourceCached = vi.mocked(isResourceCached);
const mockIsResourceLoading = vi.mocked(isResourceLoading);
const mockHandleExistingLoad = vi.mocked(handleExistingLoad);
const mockHandleInitialLoad = vi.mocked(handleInitialLoad);
const mockUpdateLoadingState = vi.mocked(updateLoadingState);

// Helper functions
function createStateUpdaters() {
	return {
		setLoading: vi.fn(),
		setIsReady: vi.fn(),
	};
}

function createTestProps() {
	return {
		stateUpdaters: createStateUpdaters(),
		currentLanguageRef: { current: 'en' as string },
		setCurrentLanguage: vi.fn(),
	};
}

function renderResourceLoaderHook(namespace: string, props: ReturnType<typeof createTestProps>) {
	return renderHook(() =>
		useResourceLoader({
			namespace,
			...props,
		})
	);
}

function createEffectsProps() {
	return {
		loadResource: vi.fn().mockResolvedValue(undefined),
		currentLanguageRef: { current: 'en' as string },
		setCurrentLanguage: vi.fn(),
	};
}

function setupLanguageChangeHandler() {
	let languageChangeHandler: ((lng: string) => void) | undefined;

	mockI18n.on.mockImplementation((event, handler) => {
		if (event === 'languageChanged') {
			languageChangeHandler = handler as (lng: string) => void;
		}
	});

	return () => languageChangeHandler;
}

function setupBeforeEach() {
	vi.clearAllMocks();
	mockI18n.language = 'en';
	mockHandleExistingLoad.mockResolvedValue(undefined);
	mockHandleInitialLoad.mockResolvedValue(undefined);
}

describe('useResourceLoader - basic functionality and loading states', () => {
	beforeEach(setupBeforeEach);

	it('should return a function that loads resources', () => {
		const props = createTestProps();

		const { result } = renderResourceLoaderHook('common', props);

		expect(typeof result.current).toBe('function');
	});

	it('should update loading state to false and ready to true when resource is already loaded', async () => {
		mockIsResourceLoadedInI18n.mockReturnValue(true);
		const props = createTestProps();

		const { result } = renderResourceLoaderHook('common', props);

		await act(async () => {
			await result.current();
		});

		expect(mockUpdateLoadingState).toHaveBeenCalledWith(props.stateUpdaters, false, true);
		expect(mockHandleExistingLoad).not.toHaveBeenCalled();
		expect(mockHandleInitialLoad).not.toHaveBeenCalled();
	});

	it('should set loading state immediately on language change', async () => {
		mockIsResourceLoadedInI18n.mockReturnValue(false);
		const props = createTestProps();
		props.currentLanguageRef.current = 'es';

		const { result } = renderResourceLoaderHook('common', props);

		await act(async () => {
			await result.current();
		});

		expect(props.stateUpdaters.setLoading).toHaveBeenCalledWith(true);
		expect(props.stateUpdaters.setIsReady).toHaveBeenCalledWith(false);
	});
});

describe('useResourceLoader - load handling', () => {
	beforeEach(setupBeforeEach);

	it('should handle existing load when resource is cached', async () => {
		mockIsResourceLoadedInI18n.mockReturnValue(false);
		mockIsResourceCached.mockReturnValue(true);
		const props = createTestProps();

		const { result } = renderResourceLoaderHook('common', props);

		await act(async () => {
			await result.current();
		});

		expect(mockHandleExistingLoad).toHaveBeenCalledWith('common', 'en', props.stateUpdaters);
		expect(mockHandleInitialLoad).not.toHaveBeenCalled();
	});

	it('should handle existing load when resource is currently loading', async () => {
		mockIsResourceLoadedInI18n.mockReturnValue(false);
		mockIsResourceCached.mockReturnValue(false);
		mockIsResourceLoading.mockReturnValue(true);
		const props = createTestProps();

		const { result } = renderResourceLoaderHook('common', props);

		await act(async () => {
			await result.current();
		});

		expect(mockHandleExistingLoad).toHaveBeenCalledWith('common', 'en', props.stateUpdaters);
		expect(mockHandleInitialLoad).not.toHaveBeenCalled();
	});

	it('should handle initial load when resource is not loaded, cached, or loading', async () => {
		mockIsResourceLoadedInI18n.mockReturnValue(false);
		mockIsResourceCached.mockReturnValue(false);
		mockIsResourceLoading.mockReturnValue(false);
		const props = createTestProps();

		const { result } = renderResourceLoaderHook('common', props);

		await act(async () => {
			await result.current();
		});

		expect(mockHandleInitialLoad).toHaveBeenCalledWith('common', 'en', props.stateUpdaters);
		expect(mockHandleExistingLoad).not.toHaveBeenCalled();
	});
});

describe('useResourceLoader - language updates and function stability', () => {
	beforeEach(setupBeforeEach);

	it('should update current language and ref', async () => {
		mockIsResourceLoadedInI18n.mockReturnValue(true);
		const props = createTestProps();
		mockI18n.language = 'es';

		const { result } = renderResourceLoaderHook('common', props);

		await act(async () => {
			await result.current();
		});

		expect(props.setCurrentLanguage).toHaveBeenCalledWith('es');
		expect(props.currentLanguageRef.current).toBe('es');
	});

	it('should maintain stable function reference', () => {
		const props = createTestProps();

		const { result, rerender } = renderResourceLoaderHook('common', props);

		const firstLoadResource = result.current;

		rerender();

		expect(result.current).toBe(firstLoadResource);
	});

	it('should create new function when dependencies change', () => {
		const props = createTestProps();

		const { result, rerender } = renderHook(
			({ namespace }) =>
				useResourceLoader({
					namespace,
					...props,
				}),
			{
				initialProps: { namespace: 'common' },
			}
		);

		const firstLoadResource = result.current;

		rerender({ namespace: 'landing' });

		expect(result.current).not.toBe(firstLoadResource);
	});
});

describe('useResourceLoadingEffects - mount behavior', () => {
	beforeEach(setupBeforeEach);

	it('should call loadResource on mount', async () => {
		const props = createEffectsProps();

		renderHook(() => useResourceLoadingEffects(props));

		await waitFor(() => {
			expect(props.loadResource).toHaveBeenCalled();
		});
	});

	it('should call loadResource when loadResource function changes', async () => {
		const loadResource1 = vi.fn().mockResolvedValue(undefined);
		const loadResource2 = vi.fn().mockResolvedValue(undefined);
		const props = createEffectsProps();
		props.loadResource = loadResource1;

		const { rerender } = renderHook(
			({ loadResource }) =>
				useResourceLoadingEffects({
					...props,
					loadResource,
				}),
			{
				initialProps: { loadResource: loadResource1 },
			}
		);

		await waitFor(() => {
			expect(loadResource1).toHaveBeenCalled();
		});

		rerender({ loadResource: loadResource2 });

		await waitFor(() => {
			expect(loadResource2).toHaveBeenCalled();
		});
	});
});

describe('useResourceLoadingEffects - language change handling', () => {
	beforeEach(setupBeforeEach);

	it('should handle language change events', async () => {
		const props = createEffectsProps();
		const getLanguageChangeHandler = setupLanguageChangeHandler();

		renderHook(() => useResourceLoadingEffects(props));

		await waitFor(() => {
			expect(mockI18n.on).toHaveBeenCalledWith('languageChanged', expect.any(Function));
		});

		const languageChangeHandler = getLanguageChangeHandler();
		expect(languageChangeHandler).toBeDefined();

		await act(async () => {
			if (languageChangeHandler) {
				languageChangeHandler('es');
			}
		});

		expect(props.setCurrentLanguage).toHaveBeenCalledWith('es');
		expect(props.currentLanguageRef.current).toBe('es');
		await waitFor(() => {
			expect(props.loadResource).toHaveBeenCalledTimes(2);
		});
	});

	it('should update currentLanguageRef when language changes', async () => {
		const props = createEffectsProps();
		const getLanguageChangeHandler = setupLanguageChangeHandler();

		renderHook(() => useResourceLoadingEffects(props));

		await waitFor(() => {
			const handler = getLanguageChangeHandler();
			expect(handler).toBeDefined();
		});

		const languageChangeHandler = getLanguageChangeHandler();
		await act(async () => {
			if (languageChangeHandler) {
				languageChangeHandler('fr');
			}
		});

		expect(props.currentLanguageRef.current).toBe('fr');
		expect(props.setCurrentLanguage).toHaveBeenCalledWith('fr');
	});
});

describe('useResourceLoadingEffects - cleanup and errors', () => {
	beforeEach(setupBeforeEach);

	it('should clean up language change listener on unmount', () => {
		const props = createEffectsProps();

		mockI18n.on.mockImplementation(() => {
			// Mock implementation
		});

		const { unmount } = renderHook(() => useResourceLoadingEffects(props));

		unmount();

		expect(mockI18n.off).toHaveBeenCalledWith('languageChanged', expect.any(Function));
	});

	it('should handle loadResource errors gracefully', async () => {
		const props = createEffectsProps();
		props.loadResource = vi.fn().mockRejectedValue(new Error('Load failed'));

		renderHook(() => useResourceLoadingEffects(props));

		await waitFor(() => {
			expect(props.loadResource).toHaveBeenCalled();
		});

		expect(props.loadResource).toHaveBeenCalled();
	});
});
