/**
 * mapInitialization.helpers Tests
 *
 * Tests for map initialization helper functions:
 * - initializeMapInstance
 */

import { initializeMapInstance } from '@core/ui/media/map/helpers/mapInitialization.helpers';
import type { MapProps } from '@src-types/ui/maps';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/media/map/helpers/map.helpers', () => ({
	initializeGoogleMaps: vi.fn(),
	createMapOptions: vi.fn(),
	setupMapEventListeners: vi.fn(),
}));

vi.mock('@core/i18n/i18n', () => ({
	default: {
		t: vi.fn((key: string) => key),
	},
}));

describe('initializeMapInstance', () => {
	let mockGoogleMaps: typeof google.maps;
	let mockMap: google.maps.Map;
	let mockMapElement: HTMLDivElement;

	beforeEach(async () => {
		vi.clearAllMocks();

		// Create mock map element
		mockMapElement = document.createElement('div');

		// Create mock map instance
		mockMap = {} as google.maps.Map;

		// Create mock Google Maps API with Map constructor
		const MapConstructor = vi.fn(function (
			this: google.maps.Map,
			_element: HTMLElement,
			_options: google.maps.MapOptions
		) {
			return mockMap;
		}) as unknown as new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;

		mockGoogleMaps = {
			Map: MapConstructor,
		} as unknown as typeof google.maps;

		// Setup mocks
		const { initializeGoogleMaps, createMapOptions, setupMapEventListeners } = await import(
			'@core/ui/media/map/helpers/map.helpers'
		);
		vi.mocked(initializeGoogleMaps).mockResolvedValue(mockGoogleMaps);
		vi.mocked(createMapOptions).mockReturnValue({} as google.maps.MapOptions);
		vi.mocked(setupMapEventListeners).mockImplementation(() => {});
	});

	it('should initialize map instance successfully', async () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		const result = await initializeMapInstance({
			resolvedApiKey: 'test-api-key',
			libraries: [],
			options,
			mapElement: mockMapElement,
		});

		expect(result.mapInstance).toBe(mockMap);
		expect(result.googleMaps).toBe(mockGoogleMaps);
	});

	it('should call initializeGoogleMaps with correct parameters', async () => {
		const { initializeGoogleMaps } = await import('@core/ui/media/map/helpers/map.helpers');
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		await initializeMapInstance({
			resolvedApiKey: 'test-api-key',
			libraries: ['places'],
			options,
			mapElement: mockMapElement,
		});

		expect(initializeGoogleMaps).toHaveBeenCalledWith('test-api-key', ['places']);
	});

	it('should create map with correct options', async () => {
		const { createMapOptions } = await import('@core/ui/media/map/helpers/map.helpers');
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
			zoom: 15,
		};

		await initializeMapInstance({
			resolvedApiKey: 'test-api-key',
			libraries: [],
			options,
			mapElement: mockMapElement,
		});

		expect(createMapOptions).toHaveBeenCalledWith(options, mockGoogleMaps);
	});

	it('should set up event listeners', async () => {
		const { setupMapEventListeners } = await import('@core/ui/media/map/helpers/map.helpers');
		const onMapReady = vi.fn();
		const onBoundsChanged = vi.fn();
		const onCenterChanged = vi.fn();
		const onZoomChanged = vi.fn();
		const onMapClick = vi.fn();

		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		await initializeMapInstance({
			resolvedApiKey: 'test-api-key',
			libraries: [],
			options,
			mapElement: mockMapElement,
			onMapReady,
			onBoundsChanged,
			onCenterChanged,
			onZoomChanged,
			onMapClick,
		});

		expect(setupMapEventListeners).toHaveBeenCalledWith(mockMap, {
			onBoundsChanged,
			onCenterChanged,
			onZoomChanged,
			onMapClick,
		});
	});

	it('should call onMapReady callback', async () => {
		const onMapReady = vi.fn();
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		await initializeMapInstance({
			resolvedApiKey: 'test-api-key',
			libraries: [],
			options,
			mapElement: mockMapElement,
			onMapReady,
		});

		expect(onMapReady).toHaveBeenCalledWith(mockMap);
	});

	it('should not call onMapReady when not provided', async () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		await expect(
			initializeMapInstance({
				resolvedApiKey: 'test-api-key',
				libraries: [],
				options,
				mapElement: mockMapElement,
			})
		).resolves.toBeDefined();
	});

	it('should throw error when Google Maps fails to load', async () => {
		const { initializeGoogleMaps } = await import('@core/ui/media/map/helpers/map.helpers');
		vi.mocked(initializeGoogleMaps).mockResolvedValue(null);

		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		await expect(
			initializeMapInstance({
				resolvedApiKey: 'test-api-key',
				libraries: [],
				options,
				mapElement: mockMapElement,
			})
		).rejects.toThrow();
	});
});
