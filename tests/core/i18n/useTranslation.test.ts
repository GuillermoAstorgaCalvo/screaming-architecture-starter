import { isResourceLoadedInI18n } from '@core/i18n/hooks/useTranslationHelpers';
import i18n from '@core/i18n/i18n';
import { isResourceLoading } from '@core/i18n/resourceLoader/cache';
import type { TranslationNamespaces } from '@core/i18n/types/types';
import { useTranslation } from '@core/i18n/useTranslation';
import { renderHook } from '@testing-library/react';
import type { Dispatch, SetStateAction } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('react-i18next', () => ({
	useTranslation: vi.fn(),
}));

vi.mock('@core/i18n/i18n', () => ({
	default: {
		language: 'en',
		getResourceBundle: vi.fn(),
	},
}));

vi.mock('@core/i18n/hooks/useTranslationHelpers', () => ({
	isResourceLoadedInI18n: vi.fn(),
}));

vi.mock('@core/i18n/hooks/useTranslationLoader', () => ({
	useResourceLoader: vi.fn(),
	useResourceLoadingEffects: vi.fn(),
}));

vi.mock('@core/i18n/hooks/useTranslationState', () => ({
	useResourceLoadingState: vi.fn(),
}));

vi.mock('@core/i18n/resourceLoader/cache', () => ({
	isResourceLoading: vi.fn(),
}));

const { useTranslation: useI18nextTranslation } = await import('react-i18next');
const mockUseI18nextTranslation = vi.mocked(useI18nextTranslation);
const mockIsResourceLoadedInI18n = vi.mocked(isResourceLoadedInI18n);
const mockIsResourceLoading = vi.mocked(isResourceLoading);
const mockI18n = vi.mocked(i18n);

// Import mocked hooks
const { useResourceLoader, useResourceLoadingEffects } = await import(
	'@core/i18n/hooks/useTranslationLoader'
);
const { useResourceLoadingState } = await import('@core/i18n/hooks/useTranslationState');

const mockUseResourceLoader = vi.mocked(useResourceLoader);
const mockUseResourceLoadingEffects = vi.mocked(useResourceLoadingEffects);
const mockUseResourceLoadingState = vi.mocked(useResourceLoadingState);

// Test helpers
const mockTFunction = vi.fn((key: string) => key);
const mockI18nextInstance = {
	isInitialized: true,
	language: 'en',
} as unknown as typeof i18n;

interface MockResourceLoadingStateOptions {
	isLoading?: boolean;
	isReady?: boolean;
	setLoading?: (loading: boolean) => void;
	setIsReady?: (ready: boolean) => void;
	setCurrentLanguage?: Dispatch<SetStateAction<string>>;
	currentLanguage?: string;
}

function createMockResourceLoadingState(options: MockResourceLoadingStateOptions = {}) {
	const {
		isLoading = false,
		isReady = true,
		setLoading = vi.fn(),
		setIsReady = vi.fn(),
		setCurrentLanguage = vi.fn(),
		currentLanguage = 'en',
	} = options;

	return {
		isLoading,
		isReady,
		setCurrentLanguage,
		currentLanguageRef: { current: currentLanguage },
		stateUpdaters: {
			setLoading,
			setIsReady,
		},
	};
}

function createMockI18nextTranslation(ready = true) {
	return {
		t: mockTFunction,
		i18n: mockI18nextInstance,
		ready,
	} as unknown as ReturnType<typeof useI18nextTranslation>;
}

function setupDefaultMocks() {
	vi.clearAllMocks();
	mockI18n.language = 'en';

	mockUseI18nextTranslation.mockReturnValue(createMockI18nextTranslation(true));

	mockUseResourceLoadingState.mockReturnValue(createMockResourceLoadingState());

	mockUseResourceLoader.mockReturnValue(vi.fn().mockResolvedValue(undefined));
	mockUseResourceLoadingEffects.mockReturnValue(undefined);
}

function testLoadingState(isLoading: boolean, isReady: boolean) {
	mockUseResourceLoadingState.mockReturnValue(
		createMockResourceLoadingState({ isLoading, isReady })
	);
	const { result } = renderHook(() => useTranslation('common'));
	return { result, isLoading, isReady };
}

function testReadyFlag(ready: boolean) {
	mockUseI18nextTranslation.mockReturnValue(createMockI18nextTranslation(ready));
	const { result } = renderHook(() => useTranslation('common'));
	return { result, ready };
}

function testLoadingStateSetup(
	isResourceLoaded: boolean,
	isCurrentlyLoading: boolean,
	isLoading: boolean,
	isReady: boolean
) {
	mockIsResourceLoadedInI18n.mockReturnValue(isResourceLoaded);
	mockIsResourceLoading.mockReturnValue(isCurrentlyLoading);
	const setLoading = vi.fn();
	mockUseResourceLoadingState.mockReturnValue(
		createMockResourceLoadingState({ isLoading, isReady, setLoading })
	);
	renderHook(() => useTranslation('common'));
	return setLoading;
}

function setupResourceLoaderTest() {
	const setCurrentLanguage = vi.fn();
	const setLoading = vi.fn();
	const setIsReady = vi.fn();
	const mockState = createMockResourceLoadingState({
		isLoading: false,
		isReady: true,
		setLoading,
		setIsReady,
		setCurrentLanguage,
	});
	mockUseResourceLoadingState.mockReturnValue(mockState);
	renderHook(() => useTranslation('common'));
	return { mockState, setCurrentLanguage };
}

function setupResourceLoadingEffectsTest() {
	const loadResource = vi.fn().mockResolvedValue(undefined);
	const setCurrentLanguage = vi.fn();
	const mockState = createMockResourceLoadingState({
		isLoading: false,
		isReady: true,
		setCurrentLanguage,
	});
	mockUseResourceLoader.mockReturnValue(loadResource);
	mockUseResourceLoadingState.mockReturnValue(mockState);
	renderHook(() => useTranslation('common'));
	return { loadResource, mockState, setCurrentLanguage };
}

function testTranslationCall(
	key: string,
	namespace: keyof TranslationNamespaces,
	options?: Record<string, unknown>
) {
	const { result } = renderHook(() => useTranslation(namespace));
	result.current.t(key as never, options as never);
	return { key, namespace, options };
}

function testNamespaceIndependence() {
	const { result: result1 } = renderHook(() => useTranslation('common'));
	const { result: result2 } = renderHook(() => useTranslation('landing'));
	return { result1, result2 };
}

describe('useTranslation', () => {
	beforeEach(() => {
		setupDefaultMocks();
	});

	describe('basic functionality', () => {
		it('should return translation function and i18n instance', () => {
			const { result } = renderHook(() => useTranslation('common'));
			expect(result.current.t).toBeDefined();
			expect(typeof result.current.t).toBe('function');
			expect(result.current.i18n).toBe(mockI18nextInstance);
		});

		it('should use common namespace by default', () => {
			renderHook(() => useTranslation());
			expect(mockUseI18nextTranslation).toHaveBeenCalledWith('common');
		});

		it('should use specified namespace', () => {
			renderHook(() => useTranslation('landing'));
			expect(mockUseI18nextTranslation).toHaveBeenCalledWith('landing');
		});

		it('should return loading and ready states', () => {
			const { result, isLoading, isReady } = testLoadingState(true, false);
			expect(result.current.isLoading).toBe(isLoading);
			expect(result.current.isReady).toBe(isReady);
		});

		it('should return ready flag from i18next', () => {
			const { result, ready } = testReadyFlag(false);
			expect(result.current.ready).toBe(ready);
		});
	});

	describe('type-safe translation function', () => {
		it('should call translation function with namespace', () => {
			testTranslationCall('retry', 'common');
			expect(mockTFunction).toHaveBeenCalledWith('retry', { ns: 'common' });
		});

		it('should pass options to translation function', () => {
			testTranslationCall('greeting', 'common', { name: 'John' });
			expect(mockTFunction).toHaveBeenCalledWith('greeting', {
				ns: 'common',
				name: 'John',
			});
		});

		it('should maintain stable translation function reference', () => {
			const { result, rerender } = renderHook(() => useTranslation('common'));
			const firstT = result.current.t;
			rerender();
			expect(result.current.t).toBe(firstT);
		});

		it('should create new translation function when namespace changes', () => {
			const { result, rerender } = renderHook(
				({ namespace }: { namespace: keyof TranslationNamespaces }) => useTranslation(namespace),
				{ initialProps: { namespace: 'common' } }
			);
			const firstT = result.current.t;
			rerender({ namespace: 'landing' });
			expect(result.current.t).not.toBe(firstT);
		});
	});
});

describe('useTranslation - loading state management', () => {
	beforeEach(() => {
		setupDefaultMocks();
	});

	it('should initialize loading state when resource is not loaded and not loading', () => {
		const setLoading = testLoadingStateSetup(false, false, false, false);
		expect(setLoading).toHaveBeenCalledWith(true);
	});

	it('should not set loading state when resource is already loaded', () => {
		const setLoading = testLoadingStateSetup(true, false, false, true);
		expect(setLoading).not.toHaveBeenCalled();
	});

	it('should not set loading state when resource is already loading', () => {
		const setLoading = testLoadingStateSetup(false, true, true, false);
		expect(setLoading).not.toHaveBeenCalled();
	});
});

describe('useTranslation - resource loading integration', () => {
	beforeEach(() => {
		setupDefaultMocks();
	});

	it('should call useResourceLoader with correct parameters', () => {
		const { mockState, setCurrentLanguage } = setupResourceLoaderTest();
		expect(mockUseResourceLoader).toHaveBeenCalledWith({
			namespace: 'common',
			stateUpdaters: mockState.stateUpdaters,
			setCurrentLanguage,
			currentLanguageRef: mockState.currentLanguageRef,
		});
	});

	it('should call useResourceLoadingEffects with loadResource function', () => {
		const { loadResource, mockState, setCurrentLanguage } = setupResourceLoadingEffectsTest();
		expect(mockUseResourceLoadingEffects).toHaveBeenCalledWith({
			loadResource,
			currentLanguageRef: mockState.currentLanguageRef,
			setCurrentLanguage,
		});
	});

	it('should handle different namespaces independently', () => {
		const { result1, result2 } = testNamespaceIndependence();
		expect(mockUseI18nextTranslation).toHaveBeenCalledWith('common');
		expect(mockUseI18nextTranslation).toHaveBeenCalledWith('landing');
		expect(result1.current.t).toBeDefined();
		expect(result2.current.t).toBeDefined();
	});
});

describe('useTranslation - state updates', () => {
	beforeEach(() => {
		setupDefaultMocks();
	});

	it('should reflect loading state from useResourceLoadingState', () => {
		const { result, isLoading, isReady } = testLoadingState(true, false);
		expect(result.current.isLoading).toBe(isLoading);
		expect(result.current.isReady).toBe(isReady);
	});

	it('should reflect ready state from useResourceLoadingState', () => {
		const { result, isLoading, isReady } = testLoadingState(false, true);
		expect(result.current.isLoading).toBe(isLoading);
		expect(result.current.isReady).toBe(isReady);
	});
});

describe('useTranslation - integration with i18next', () => {
	beforeEach(() => {
		setupDefaultMocks();
	});

	it('should pass namespace to react-i18next useTranslation', () => {
		renderHook(() => useTranslation('landing'));
		expect(mockUseI18nextTranslation).toHaveBeenCalledWith('landing');
	});

	it('should return i18n instance from react-i18next', () => {
		const { result } = renderHook(() => useTranslation('common'));
		expect(result.current.i18n).toBe(mockI18nextInstance);
	});

	it('should return ready flag from react-i18next', () => {
		const { result, ready } = testReadyFlag(false);
		expect(result.current.ready).toBe(ready);
	});
});
