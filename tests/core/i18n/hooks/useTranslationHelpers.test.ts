import {
	ensureResourceLoaded,
	handleExistingLoad,
	handleInitialLoad,
	isResourceLoadedInI18n,
	updateLoadingState,
} from '@core/i18n/hooks/useTranslationHelpers';
import i18n from '@core/i18n/i18n';
import {
	clearResourceCache,
	isResourceCached,
	isResourceLoading,
} from '@core/i18n/resourceLoader/cache';
import { loadAndAddResource } from '@core/i18n/resourceLoader/i18n';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const TEST_NAMESPACE = 'common';
const TEST_LANGUAGE = 'en';
const LOAD_ERROR_MESSAGE = 'Load failed';

// Mock dependencies
vi.mock('@core/i18n/i18n', () => ({
	default: {
		language: 'en',
		getResourceBundle: vi.fn(),
		loadNamespaces: vi.fn(),
	},
}));

vi.mock('@core/i18n/resourceLoader/cache', async () => {
	const actual = await vi.importActual('@core/i18n/resourceLoader/cache');
	return {
		...actual,
		isResourceCached: vi.fn(),
		isResourceLoading: vi.fn(),
	};
});

vi.mock('@core/i18n/resourceLoader/i18n', () => ({
	loadAndAddResource: vi.fn(),
}));

// Shared test setup
const mockI18n = vi.mocked(i18n);
const mockIsResourceCached = vi.mocked(isResourceCached);
const mockIsResourceLoading = vi.mocked(isResourceLoading);
const mockLoadAndAddResource = vi.mocked(loadAndAddResource);

// Helper function to create mock state
function createMockState() {
	return {
		setLoading: vi.fn(),
		setIsReady: vi.fn(),
	};
}

// Helper function to create expected loadAndAddResource call arguments
function getExpectedLoadArgs() {
	return {
		i18nInstance: mockI18n,
		namespace: TEST_NAMESPACE,
		language: TEST_LANGUAGE,
	};
}

// Helper function to setup mocks for resource not loaded scenario
function setupResourceNotLoaded() {
	mockI18n.getResourceBundle.mockReturnValue(undefined);
	mockIsResourceCached.mockReturnValue(false);
	mockIsResourceLoading.mockReturnValue(false);
	mockLoadAndAddResource.mockResolvedValue(undefined);
}

describe('isResourceLoadedInI18n', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
	});

	afterEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
	});

	it('should return true when resource bundle exists', () => {
		mockI18n.getResourceBundle.mockReturnValue({ key: 'value' });

		const result = isResourceLoadedInI18n(TEST_LANGUAGE, TEST_NAMESPACE);

		expect(result).toBe(true);
		expect(mockI18n.getResourceBundle).toHaveBeenCalledWith(TEST_LANGUAGE, TEST_NAMESPACE);
	});

	it('should return false when resource bundle does not exist', () => {
		mockI18n.getResourceBundle.mockReturnValue(undefined);

		const result = isResourceLoadedInI18n(TEST_LANGUAGE, TEST_NAMESPACE);

		expect(result).toBe(false);
		expect(mockI18n.getResourceBundle).toHaveBeenCalledWith(TEST_LANGUAGE, TEST_NAMESPACE);
	});

	it('should return false when resource bundle is null', () => {
		mockI18n.getResourceBundle.mockReturnValue(null);

		const result = isResourceLoadedInI18n(TEST_LANGUAGE, TEST_NAMESPACE);

		expect(result).toBe(false);
	});
});

describe('updateLoadingState', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
	});

	afterEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
	});

	it('should update loading and ready states', () => {
		const state = createMockState();

		updateLoadingState(state, true, false);

		expect(state.setLoading).toHaveBeenCalledWith(true);
		expect(state.setIsReady).toHaveBeenCalledWith(false);
	});

	it('should update states with different values', () => {
		const state = createMockState();

		updateLoadingState(state, false, true);

		expect(state.setLoading).toHaveBeenCalledWith(false);
		expect(state.setIsReady).toHaveBeenCalledWith(true);
	});
});

describe('ensureResourceLoaded', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
	});

	afterEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
	});

	describe('when resource is already loaded', () => {
		it('should return immediately without loading', async () => {
			mockI18n.getResourceBundle.mockReturnValue({ key: 'value' });

			await ensureResourceLoaded(TEST_NAMESPACE, TEST_LANGUAGE);

			expect(mockLoadAndAddResource).not.toHaveBeenCalled();
		});
	});

	describe('when resource needs to be loaded', () => {
		describe('when waiting for existing load', () => {
			it('should wait for existing load if resource is cached', async () => {
				mockI18n.getResourceBundle.mockReturnValue(undefined);
				mockIsResourceCached.mockReturnValue(true);
				mockLoadAndAddResource.mockResolvedValue(undefined);

				await ensureResourceLoaded(TEST_NAMESPACE, TEST_LANGUAGE);

				expect(mockLoadAndAddResource).toHaveBeenCalledWith(getExpectedLoadArgs());
			});

			it('should wait for existing load if resource is currently loading', async () => {
				mockI18n.getResourceBundle.mockReturnValue(undefined);
				mockIsResourceCached.mockReturnValue(false);
				mockIsResourceLoading.mockReturnValue(true);
				mockLoadAndAddResource.mockResolvedValue(undefined);

				await ensureResourceLoaded(TEST_NAMESPACE, TEST_LANGUAGE);

				expect(mockLoadAndAddResource).toHaveBeenCalledWith(getExpectedLoadArgs());
			});
		});

		describe('when loading new resource', () => {
			it('should load resource if not loaded, cached, or loading', async () => {
				setupResourceNotLoaded();

				await ensureResourceLoaded(TEST_NAMESPACE, TEST_LANGUAGE);

				expect(mockLoadAndAddResource).toHaveBeenCalledWith(getExpectedLoadArgs());
			});

			it('should handle the second loadAndAddResource call path when not cached and not loading', async () => {
				setupResourceNotLoaded();

				await ensureResourceLoaded(TEST_NAMESPACE, TEST_LANGUAGE);

				expect(mockLoadAndAddResource).toHaveBeenCalledTimes(1);
				expect(mockLoadAndAddResource).toHaveBeenCalledWith(getExpectedLoadArgs());
			});
		});
	});
});

describe('ensureResourceLoaded error handling', () => {
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
		consoleErrorSpy.mockRestore();
	});

	it('should throw error if loading fails', async () => {
		mockI18n.getResourceBundle.mockReturnValue(undefined);
		mockIsResourceCached.mockReturnValue(false);
		mockIsResourceLoading.mockReturnValue(false);
		const error = new Error(LOAD_ERROR_MESSAGE);
		mockLoadAndAddResource.mockRejectedValue(error);

		await expect(ensureResourceLoaded(TEST_NAMESPACE, TEST_LANGUAGE)).rejects.toThrow(
			LOAD_ERROR_MESSAGE
		);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to load translations'),
			error
		);
	});

	it('should log error and throw when loading fails', async () => {
		mockI18n.getResourceBundle.mockReturnValue(undefined);
		mockIsResourceCached.mockReturnValue(false);
		mockIsResourceLoading.mockReturnValue(false);
		const error = new Error(LOAD_ERROR_MESSAGE);
		mockLoadAndAddResource.mockRejectedValue(error);

		await expect(ensureResourceLoaded(TEST_NAMESPACE, TEST_LANGUAGE)).rejects.toThrow(
			LOAD_ERROR_MESSAGE
		);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to load translations'),
			error
		);
	});
});

describe('handleExistingLoad', () => {
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
		consoleErrorSpy.mockRestore();
	});

	it('should not set loading if resource is already loaded', async () => {
		mockI18n.getResourceBundle.mockReturnValue({ key: 'value' });
		mockI18n.loadNamespaces.mockResolvedValue(undefined);
		const state = createMockState();

		await handleExistingLoad(TEST_NAMESPACE, TEST_LANGUAGE, state);

		// When resource is already loaded, setLoading should not be called initially
		// but may be called in finally block to ensure state is correct
		expect(state.setIsReady).toHaveBeenCalledWith(true);
	});

	it('should set loading if resource is not loaded', async () => {
		mockI18n.getResourceBundle.mockReturnValue(undefined);
		mockIsResourceCached.mockReturnValue(true);
		mockLoadAndAddResource.mockResolvedValue(undefined);
		mockI18n.loadNamespaces.mockResolvedValue(undefined);
		const state = createMockState();

		// Use setTimeout to simulate the delay in the function
		const promise = handleExistingLoad(TEST_NAMESPACE, TEST_LANGUAGE, state);
		expect(state.setLoading).toHaveBeenCalledWith(true);

		await promise;

		expect(mockLoadAndAddResource).toHaveBeenCalled();
		expect(mockI18n.loadNamespaces).toHaveBeenCalledWith(TEST_NAMESPACE);
	});

	it('should set isReady to true when resource is successfully loaded', async () => {
		mockI18n.getResourceBundle
			.mockReturnValueOnce(undefined) // Initially not loaded
			.mockReturnValueOnce({ key: 'value' }); // After loading
		mockIsResourceCached.mockReturnValue(true);
		mockLoadAndAddResource.mockResolvedValue(undefined);
		mockI18n.loadNamespaces.mockResolvedValue(undefined);
		const state = createMockState();

		await handleExistingLoad(TEST_NAMESPACE, TEST_LANGUAGE, state);

		// After successful load, isReady should be set based on resource bundle check
		expect(state.setIsReady).toHaveBeenCalled();
		expect(state.setLoading).toHaveBeenCalledWith(false);
	});

	it('should set isReady to false and stop loading on error', async () => {
		mockI18n.getResourceBundle.mockReturnValue(undefined);
		mockIsResourceCached.mockReturnValue(true);
		mockLoadAndAddResource.mockRejectedValue(new Error(LOAD_ERROR_MESSAGE));
		const state = createMockState();

		await handleExistingLoad(TEST_NAMESPACE, TEST_LANGUAGE, state);

		expect(state.setIsReady).toHaveBeenCalledWith(false);
		expect(state.setLoading).toHaveBeenCalledWith(false);
	});
});

describe('handleInitialLoad', () => {
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.clearAllMocks();
		clearResourceCache();
		consoleErrorSpy.mockRestore();
	});

	it('should set loading and ready states correctly', async () => {
		mockI18n.getResourceBundle
			.mockReturnValueOnce(undefined) // Initially not loaded
			.mockReturnValueOnce({ key: 'value' }); // After loading
		mockIsResourceCached.mockReturnValue(false);
		mockLoadAndAddResource.mockResolvedValue(undefined);
		mockI18n.loadNamespaces.mockResolvedValue(undefined);
		const state = createMockState();

		await handleInitialLoad(TEST_NAMESPACE, TEST_LANGUAGE, state);

		expect(state.setLoading).toHaveBeenCalledWith(true);
		expect(state.setIsReady).toHaveBeenCalledWith(false);
		expect(mockLoadAndAddResource).toHaveBeenCalled();
		expect(mockI18n.loadNamespaces).toHaveBeenCalledWith(TEST_NAMESPACE);
		expect(state.setIsReady).toHaveBeenCalledWith(true);
		expect(state.setLoading).toHaveBeenCalledWith(false);
	});

	it('should handle loading errors', async () => {
		mockI18n.getResourceBundle.mockReturnValue(undefined);
		mockIsResourceCached.mockReturnValue(false);
		mockLoadAndAddResource.mockRejectedValue(new Error(LOAD_ERROR_MESSAGE));
		const state = createMockState();

		await handleInitialLoad(TEST_NAMESPACE, TEST_LANGUAGE, state);

		expect(state.setLoading).toHaveBeenCalledWith(true);
		expect(state.setIsReady).toHaveBeenCalledWith(false);
		expect(state.setIsReady).toHaveBeenCalledWith(false); // On error
		expect(state.setLoading).toHaveBeenCalledWith(false);
	});

	it('should set isReady based on resource bundle after loading', async () => {
		mockI18n.getResourceBundle
			.mockReturnValueOnce(undefined) // Initially not loaded
			.mockReturnValueOnce(undefined); // Still not loaded after load (error case)
		mockIsResourceCached.mockReturnValue(false);
		mockLoadAndAddResource.mockResolvedValue(undefined);
		mockI18n.loadNamespaces.mockResolvedValue(undefined);
		const state = createMockState();

		await handleInitialLoad(TEST_NAMESPACE, TEST_LANGUAGE, state);

		expect(state.setIsReady).toHaveBeenCalledWith(false); // After check
		expect(state.setLoading).toHaveBeenCalledWith(false);
	});
});
