import { isGoogleMapsAvailable, loadGoogleMaps } from '@core/lib/googleMapsLoader';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Constants
const TEST_API_KEY = 'test-api-key';

// Interface for mock Google Maps API
interface MockGoogleMaps {
	Map: ReturnType<typeof vi.fn>;
	Marker: ReturnType<typeof vi.fn>;
	places?: {
		PlacesService: ReturnType<typeof vi.fn>;
	};
}

// Interface for mock adapter
interface MockAdapter {
	initialize: ReturnType<typeof vi.fn>;
	isGoogleMapsAvailable: ReturnType<typeof vi.fn>;
	getGoogleMaps: ReturnType<typeof vi.fn>;
}

// Mock the dynamic import
vi.mock('@infra/maps/googleMapsAdapter', () => {
	const mockGoogleMaps: MockGoogleMaps = {
		Map: vi.fn(),
		Marker: vi.fn(),
		places: {
			PlacesService: vi.fn(),
		},
	};

	const createMockAdapter = (): MockAdapter => ({
		initialize: vi.fn().mockResolvedValue(undefined),
		isGoogleMapsAvailable: vi.fn().mockReturnValue(true),
		getGoogleMaps: vi.fn().mockReturnValue(mockGoogleMaps),
	});

	return {
		googleMapsAdapter: createMockAdapter(),
	};
});

// Helper functions
function createMockGoogleMaps(): MockGoogleMaps {
	return {
		Map: vi.fn(),
		Marker: vi.fn(),
	};
}

function setupMockAdapterForSuccess(mockAdapter: MockAdapter) {
	mockAdapter.initialize.mockResolvedValue(undefined);
	mockAdapter.isGoogleMapsAvailable.mockReturnValue(true);
	mockAdapter.getGoogleMaps.mockReturnValue(createMockGoogleMaps());
}

function setupMockAdapterForFailure(mockAdapter: MockAdapter) {
	mockAdapter.isGoogleMapsAvailable.mockReturnValue(false);
}

function resetMocksAndSetupForSuccess(mockAdapter: MockAdapter) {
	vi.clearAllMocks();
	setupMockAdapterForSuccess(mockAdapter);
}

// Test suites
function describeLoadGoogleMapsSuccess() {
	describe('loadGoogleMaps - success cases', () => {
		it('should load Google Maps successfully when available', async () => {
			const mockAdapter = await getMockAdapter();
			setupMockAdapterForSuccess(mockAdapter);

			const result = await loadGoogleMaps(TEST_API_KEY);

			expect(mockAdapter.initialize).toHaveBeenCalledWith(TEST_API_KEY, []);
			expect(mockAdapter.isGoogleMapsAvailable).toHaveBeenCalled();
			expect(mockAdapter.getGoogleMaps).toHaveBeenCalled();
			expect(result).not.toBeNull();
			expect(result).toHaveProperty('Map');
			expect(result).toHaveProperty('Marker');
		});

		it('should pass libraries parameter to adapter', async () => {
			const mockAdapter = await getMockAdapter();
			const libraries = ['places', 'geometry'];
			mockAdapter.isGoogleMapsAvailable.mockReturnValue(true);

			await loadGoogleMaps(TEST_API_KEY, libraries);

			expect(mockAdapter.initialize).toHaveBeenCalledWith(TEST_API_KEY, libraries);
		});

		it('should dynamically import the adapter (lazy loading)', async () => {
			const mockAdapter = await getMockAdapter();
			resetMocksAndSetupForSuccess(mockAdapter);

			const result = await loadGoogleMaps(TEST_API_KEY);

			expect(mockAdapter.initialize).toHaveBeenCalled();
			expect(mockAdapter.isGoogleMapsAvailable).toHaveBeenCalled();
			expect(result).not.toBeNull();
		});
	});
}

function describeLoadGoogleMapsLibraries() {
	describe('loadGoogleMaps - libraries handling', () => {
		it('should handle empty libraries array', async () => {
			const mockAdapter = await getMockAdapter();
			resetMocksAndSetupForSuccess(mockAdapter);

			await loadGoogleMaps(TEST_API_KEY, []);

			expect(mockAdapter.initialize).toHaveBeenCalledWith(TEST_API_KEY, []);
		});

		it('should handle multiple libraries', async () => {
			const mockAdapter = await getMockAdapter();
			const libraries = ['places', 'geometry', 'drawing'];
			resetMocksAndSetupForSuccess(mockAdapter);

			await loadGoogleMaps(TEST_API_KEY, libraries);

			expect(mockAdapter.initialize).toHaveBeenCalledWith(TEST_API_KEY, libraries);
		});
	});
}

function describeLoadGoogleMapsErrors() {
	describe('loadGoogleMaps - error cases', () => {
		it('should return null when Google Maps is not available after initialization', async () => {
			const mockAdapter = await getMockAdapter();
			setupMockAdapterForFailure(mockAdapter);

			const result = await loadGoogleMaps(TEST_API_KEY);

			expect(mockAdapter.initialize).toHaveBeenCalledWith(TEST_API_KEY, []);
			expect(mockAdapter.isGoogleMapsAvailable).toHaveBeenCalled();
			expect(mockAdapter.getGoogleMaps).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('should handle initialization errors gracefully', async () => {
			const mockAdapter = await getMockAdapter();
			const error = new Error('Failed to initialize Google Maps');
			mockAdapter.initialize.mockRejectedValue(error);

			await expect(loadGoogleMaps(TEST_API_KEY)).rejects.toThrow(
				'Failed to initialize Google Maps'
			);

			expect(mockAdapter.initialize).toHaveBeenCalledWith(TEST_API_KEY, []);
		});
	});
}

function describeIsGoogleMapsAvailable() {
	describe('isGoogleMapsAvailable', () => {
		it('should return true when Google Maps is available', async () => {
			const mockAdapter = await getMockAdapter();
			mockAdapter.isGoogleMapsAvailable.mockReturnValue(true);

			const result = await isGoogleMapsAvailable();

			expect(mockAdapter.isGoogleMapsAvailable).toHaveBeenCalled();
			expect(result).toBe(true);
		});

		it('should return false when Google Maps is not available', async () => {
			const mockAdapter = await getMockAdapter();
			mockAdapter.isGoogleMapsAvailable.mockReturnValue(false);

			const result = await isGoogleMapsAvailable();

			expect(mockAdapter.isGoogleMapsAvailable).toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it('should dynamically import the adapter (lazy loading)', async () => {
			const mockAdapter = await getMockAdapter();
			vi.clearAllMocks();
			mockAdapter.isGoogleMapsAvailable.mockReturnValue(true);

			const result = await isGoogleMapsAvailable();

			expect(mockAdapter.isGoogleMapsAvailable).toHaveBeenCalled();
			expect(result).toBe(true);
		});

		it('should handle adapter errors gracefully', async () => {
			const mockAdapter = await getMockAdapter();
			const error = new Error('Adapter error');
			mockAdapter.isGoogleMapsAvailable.mockImplementation(() => {
				throw error;
			});

			await expect(isGoogleMapsAvailable()).rejects.toThrow('Adapter error');
		});
	});
}

function describeDynamicImportBehavior() {
	describe('dynamic import behavior', () => {
		it('should import adapter separately for each function call', async () => {
			const mockAdapter = await getMockAdapter();
			resetMocksAndSetupForSuccess(mockAdapter);

			await loadGoogleMaps(TEST_API_KEY);
			await isGoogleMapsAvailable();

			expect(mockAdapter.initialize).toHaveBeenCalled();
			expect(mockAdapter.isGoogleMapsAvailable).toHaveBeenCalledTimes(2);
		});

		it('should handle sequential calls to loadGoogleMaps with different libraries', async () => {
			const mockAdapter = await getMockAdapter();
			setupMockAdapterForSuccess(mockAdapter);
			const mockMaps = createMockGoogleMaps();
			mockAdapter.getGoogleMaps.mockReturnValue(mockMaps);

			const result1 = await loadGoogleMaps(TEST_API_KEY, ['places']);
			const result2 = await loadGoogleMaps(TEST_API_KEY, ['geometry']);

			expect(result1).not.toBeNull();
			expect(result2).not.toBeNull();
			expect(result1).toBe(mockMaps);
			expect(result2).toBe(mockMaps);
			expect(mockAdapter.initialize).toHaveBeenCalledTimes(2);
			expect(mockAdapter.initialize).toHaveBeenNthCalledWith(1, TEST_API_KEY, ['places']);
			expect(mockAdapter.initialize).toHaveBeenNthCalledWith(2, TEST_API_KEY, ['geometry']);
		});
	});
}

async function getMockAdapter(): Promise<MockAdapter> {
	const module = await import('@infra/maps/googleMapsAdapter');
	return module.googleMapsAdapter as unknown as MockAdapter;
}

describe('googleMapsLoader', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describeLoadGoogleMapsSuccess();
	describeLoadGoogleMapsLibraries();
	describeLoadGoogleMapsErrors();
	describeIsGoogleMapsAvailable();
	describeDynamicImportBehavior();
});
