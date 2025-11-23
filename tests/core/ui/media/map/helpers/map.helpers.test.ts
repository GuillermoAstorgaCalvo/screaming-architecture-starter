/**
 * map.helpers Tests
 *
 * Tests for map helper functions:
 * - createMapOptions
 * - setupMapEventListeners
 * - initializeGoogleMaps
 */

import { loadGoogleMaps } from '@core/lib/googleMapsLoader';
import {
	createMapOptions,
	initializeGoogleMaps,
	setupMapEventListeners,
} from '@core/ui/media/map/helpers/map.helpers';
import type { MapProps } from '@src-types/ui/maps';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/lib/googleMapsLoader', () => ({
	loadGoogleMaps: vi.fn(),
}));

vi.mock('@core/utils/debounce/debounce', () => ({
	debounce: vi.fn((fn: () => void) => fn),
}));

describe('createMapOptions', () => {
	let mockGoogleMaps: typeof google.maps;

	beforeEach(() => {
		vi.clearAllMocks();

		// Create mock Google Maps API with constructor
		const LatLngConstructor = vi.fn(function (this: google.maps.LatLng, lat: number, lng: number) {
			this.lat = vi.fn(() => lat);
			this.lng = vi.fn(() => lng);
		}) as unknown as new (lat: number, lng: number) => google.maps.LatLng;

		mockGoogleMaps = {
			LatLng: LatLngConstructor,
		} as unknown as typeof google.maps;
	});

	it('should create map options with default values', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		const result = createMapOptions(options, mockGoogleMaps);

		expect(result.zoom).toBe(10);
		expect(result.mapTypeId).toBe('roadmap');
		expect(result.disableDefaultUI).toBe(false);
		expect(result.zoomControl).toBe(true);
		expect(mockGoogleMaps.LatLng).toHaveBeenCalledWith(37.7749, -122.4194);
	});

	it('should override default zoom when provided', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
			zoom: 15,
		};

		const result = createMapOptions(options, mockGoogleMaps);

		expect(result.zoom).toBe(15);
	});

	it('should override default mapTypeId when provided', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
			mapTypeId: 'satellite',
		};

		const result = createMapOptions(options, mockGoogleMaps);

		expect(result.mapTypeId).toBe('satellite');
	});

	it('should include optional properties when provided', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
			minZoom: 5,
			maxZoom: 18,
			mapId: 'test-map-id',
			styles: [],
		};

		const result = createMapOptions(options, mockGoogleMaps);

		expect(result.minZoom).toBe(5);
		expect(result.maxZoom).toBe(18);
		expect(result.mapId).toBe('test-map-id');
		expect(result.styles).toEqual([]);
	});

	it('should handle control options', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
			zoomControl: false,
			streetViewControl: false,
			fullscreenControl: false,
		};

		const result = createMapOptions(options, mockGoogleMaps);

		expect(result.zoomControl).toBe(false);
		expect(result.streetViewControl).toBe(false);
		expect(result.fullscreenControl).toBe(false);
	});

	it('should handle gestureHandling option', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
			gestureHandling: 'cooperative',
		};

		const result = createMapOptions(options, mockGoogleMaps);

		expect(result.gestureHandling).toBe('cooperative');
	});
});

describe('setupMapEventListeners', () => {
	let mockMap: google.maps.Map;
	let mockListeners: Map<
		string,
		((e?: google.maps.MapMouseEvent) => void) | (() => void) | undefined
	>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockListeners = new Map();

		mockMap = {
			addListener: vi.fn(
				(event: string, callback: ((e?: google.maps.MapMouseEvent) => void) | (() => void)) => {
					mockListeners.set(
						event,
						callback as ((e?: google.maps.MapMouseEvent) => void) | (() => void)
					);
					return { remove: vi.fn() };
				}
			),
			getBounds: vi.fn(() => null),
			getCenter: vi.fn(() => null),
			getZoom: vi.fn(() => null),
		} as unknown as google.maps.Map;
	});

	it('should set up bounds_changed listener when callback provided', () => {
		const onBoundsChanged = vi.fn();

		setupMapEventListeners(mockMap, { onBoundsChanged });

		expect(mockMap.addListener).toHaveBeenCalledWith('bounds_changed', expect.any(Function));
	});

	it('should set up center_changed listener when callback provided', () => {
		const onCenterChanged = vi.fn();

		setupMapEventListeners(mockMap, { onCenterChanged });

		expect(mockMap.addListener).toHaveBeenCalledWith('center_changed', expect.any(Function));
	});

	it('should set up zoom_changed listener when callback provided', () => {
		const onZoomChanged = vi.fn();

		setupMapEventListeners(mockMap, { onZoomChanged });

		expect(mockMap.addListener).toHaveBeenCalledWith('zoom_changed', expect.any(Function));
	});

	it('should set up click listener when callback provided', () => {
		const onMapClick = vi.fn();

		setupMapEventListeners(mockMap, { onMapClick });

		expect(mockMap.addListener).toHaveBeenCalledWith('click', expect.any(Function));
	});

	it('should not set up listeners when callbacks not provided', () => {
		setupMapEventListeners(mockMap, {});

		expect(mockMap.addListener).not.toHaveBeenCalled();
	});

	it('should call onBoundsChanged with map bounds', () => {
		const onBoundsChanged = vi.fn();
		const mockBounds = {} as google.maps.LatLngBounds;
		(mockMap.getBounds as ReturnType<typeof vi.fn>).mockReturnValue(mockBounds);

		setupMapEventListeners(mockMap, { onBoundsChanged });

		const listener = mockListeners.get('bounds_changed');
		expect(listener).toBeDefined();
		if (listener) {
			listener();
			expect(onBoundsChanged).toHaveBeenCalledWith(mockBounds);
		}
	});

	it('should call onCenterChanged with map center', () => {
		const onCenterChanged = vi.fn();
		const mockCenter = {} as google.maps.LatLng;
		(mockMap.getCenter as ReturnType<typeof vi.fn>).mockReturnValue(mockCenter);

		setupMapEventListeners(mockMap, { onCenterChanged });

		const listener = mockListeners.get('center_changed');
		expect(listener).toBeDefined();
		if (listener) {
			listener();
			expect(onCenterChanged).toHaveBeenCalledWith(mockCenter);
		}
	});

	it('should call onZoomChanged with map zoom', () => {
		const onZoomChanged = vi.fn();
		(mockMap.getZoom as ReturnType<typeof vi.fn>).mockReturnValue(15);

		setupMapEventListeners(mockMap, { onZoomChanged });

		const listener = mockListeners.get('zoom_changed');
		expect(listener).toBeDefined();
		if (listener) {
			listener();
			expect(onZoomChanged).toHaveBeenCalledWith(15);
		}
	});

	it('should call onMapClick with click event', () => {
		const onMapClick = vi.fn();
		const mockEvent = {} as google.maps.MapMouseEvent;

		setupMapEventListeners(mockMap, { onMapClick });

		const listener = mockListeners.get('click');
		expect(listener).toBeDefined();
		if (listener && typeof listener === 'function') {
			listener(mockEvent);
			expect(onMapClick).toHaveBeenCalledWith(mockEvent);
		}
	});

	it('should handle null bounds in onBoundsChanged', () => {
		const onBoundsChanged = vi.fn();
		(mockMap.getBounds as ReturnType<typeof vi.fn>).mockReturnValue(null);

		setupMapEventListeners(mockMap, { onBoundsChanged });

		const listener = mockListeners.get('bounds_changed');
		expect(listener).toBeDefined();
		if (listener) {
			listener();
			expect(onBoundsChanged).toHaveBeenCalledWith(null);
		}
	});
});

describe('initializeGoogleMaps', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should call loadGoogleMaps with apiKey and libraries', async () => {
		const mockMaps = {} as typeof google.maps;
		vi.mocked(loadGoogleMaps).mockResolvedValue(mockMaps);

		const result = await initializeGoogleMaps('test-api-key', ['places']);

		expect(loadGoogleMaps).toHaveBeenCalledWith('test-api-key', ['places']);
		expect(result).toBe(mockMaps);
	});

	it('should handle empty libraries array', async () => {
		const mockMaps = {} as typeof google.maps;
		vi.mocked(loadGoogleMaps).mockResolvedValue(mockMaps);

		const result = await initializeGoogleMaps('test-api-key', []);

		expect(loadGoogleMaps).toHaveBeenCalledWith('test-api-key', []);
		expect(result).toBe(mockMaps);
	});

	it('should return null when loadGoogleMaps returns null', async () => {
		vi.mocked(loadGoogleMaps).mockResolvedValue(null);

		const result = await initializeGoogleMaps('test-api-key', []);

		expect(result).toBeNull();
	});
});
