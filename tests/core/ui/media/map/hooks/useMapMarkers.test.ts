/**
 * useMapMarkers Tests
 *
 * Tests for the useMapMarkers hook:
 * - Creating markers
 * - Updating markers
 * - Removing markers
 * - Marker click handlers
 * - Info windows
 */

/// <reference types="@types/google.maps" />

import { useMapMarkers } from '@core/ui/media/map/hooks/useMapMarkers';
import type { MapMarker } from '@src-types/ui/maps';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/hooks/debounce/useDebounce', () => ({
	useDebounce: vi.fn(value => value),
}));

vi.mock('@core/security/sanitize/sanitizeHtml', () => ({
	sanitizeHtml: vi.fn((html: string) => html),
}));

describe('useMapMarkers', () => {
	let mockMap: google.maps.Map;
	let mockGoogleMaps: typeof google.maps;
	let mockMarker: google.maps.marker.AdvancedMarkerElement;
	let mockInfoWindow: google.maps.InfoWindow;
	let mockLatLng: google.maps.LatLng;
	let mockPinElement: google.maps.marker.PinElement;

	beforeEach(() => {
		vi.clearAllMocks();

		// Create mock LatLng
		mockLatLng = {
			lat: vi.fn(() => 37.7749),
			lng: vi.fn(() => -122.4194),
		} as unknown as google.maps.LatLng;

		// Create LatLng constructor
		const LatLngConstructor = vi.fn(function (this: google.maps.LatLng, lat: number, lng: number) {
			this.lat = vi.fn(() => lat);
			this.lng = vi.fn(() => lng);
			return mockLatLng;
		}) as unknown as new (lat: number, lng: number) => google.maps.LatLng;

		// Create mock PinElement
		mockPinElement = {} as google.maps.marker.PinElement;

		// Create mock InfoWindow
		mockInfoWindow = {
			open: vi.fn(),
			close: vi.fn(),
		} as unknown as google.maps.InfoWindow;

		// Create mock Marker
		mockMarker = {
			map: mockMap,
			position: mockLatLng,
			addListener: vi.fn(() => ({ remove: vi.fn() })),
		} as unknown as google.maps.marker.AdvancedMarkerElement;

		// Create constructors for marker classes
		const AdvancedMarkerElementConstructor = vi.fn(function (
			this: google.maps.marker.AdvancedMarkerElement,
			_options: google.maps.marker.AdvancedMarkerElementOptions
		) {
			return mockMarker;
		}) as unknown as new (
			options: google.maps.marker.AdvancedMarkerElementOptions
		) => google.maps.marker.AdvancedMarkerElement;

		const PinElementConstructor = vi.fn(function (
			this: google.maps.marker.PinElement,
			_options: google.maps.marker.PinElementOptions
		) {
			return mockPinElement;
		}) as unknown as new (
			options: google.maps.marker.PinElementOptions
		) => google.maps.marker.PinElement;

		const InfoWindowConstructor = vi.fn(function (
			this: google.maps.InfoWindow,
			_options: google.maps.InfoWindowOptions
		) {
			return mockInfoWindow;
		}) as unknown as new (options: google.maps.InfoWindowOptions) => google.maps.InfoWindow;

		// Create mock Google Maps API
		mockGoogleMaps = {
			LatLng: LatLngConstructor,
			marker: {
				AdvancedMarkerElement: AdvancedMarkerElementConstructor,
				PinElement: PinElementConstructor,
			},
			InfoWindow: InfoWindowConstructor,
		} as unknown as typeof google.maps;

		// Create mock map instance
		mockMap = {} as google.maps.Map;
	});

	it('should not create markers when map is null', () => {
		const markers: MapMarker[] = [{ id: '1', lat: 37.7749, lng: -122.4194 }];

		renderHook(() => useMapMarkers(null, markers, null));

		expect(mockGoogleMaps.marker.AdvancedMarkerElement).not.toHaveBeenCalled();
	});

	it('should not create markers when googleMaps is null', () => {
		const markers: MapMarker[] = [{ id: '1', lat: 37.7749, lng: -122.4194 }];

		renderHook(() => useMapMarkers(mockMap, markers, null));

		expect(mockGoogleMaps.marker.AdvancedMarkerElement).not.toHaveBeenCalled();
	});

	it('should create markers when map and googleMaps are available', async () => {
		const markers: MapMarker[] = [{ id: '1', lat: 37.7749, lng: -122.4194 }];

		renderHook(() => useMapMarkers(mockMap, markers, mockGoogleMaps));

		await waitFor(() => {
			expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalled();
		});
	});

	it('should remove markers that are no longer in the array', async () => {
		const markers1: MapMarker[] = [
			{ id: '1', lat: 37.7749, lng: -122.4194 },
			{ id: '2', lat: 40.7128, lng: -74 },
		];

		const { rerender } = renderHook(
			({ markers }: { markers: MapMarker[] }) => useMapMarkers(mockMap, markers, mockGoogleMaps),
			{ initialProps: { markers: markers1 } }
		);

		await waitFor(() => {
			expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalledTimes(2);
		});

		vi.clearAllMocks();

		const markers2: MapMarker[] = [{ id: '1', lat: 37.7749, lng: -122.4194 }];

		rerender({ markers: markers2 });

		await waitFor(() => {
			// Marker 2 should be removed
			expect(mockMarker.map).toBeNull();
		});
	});

	it('should update marker position when coordinates change', async () => {
		const markers1: MapMarker[] = [{ id: '1', lat: 37.7749, lng: -122.4194 }];

		const { rerender } = renderHook(
			({ markers }: { markers: MapMarker[] }) => useMapMarkers(mockMap, markers, mockGoogleMaps),
			{ initialProps: { markers: markers1 } }
		);

		await waitFor(() => {
			expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalled();
		});

		const markers2: MapMarker[] = [{ id: '1', lat: 40.7128, lng: -74 }];

		rerender({ markers: markers2 });

		await waitFor(() => {
			expect(mockGoogleMaps.LatLng).toHaveBeenCalledWith(40.7128, -74);
		});
	});

	it('should create marker with custom icon', async () => {
		const markers: MapMarker[] = [{ id: '1', lat: 37.7749, lng: -122.4194, icon: 'icon-url' }];

		renderHook(() => useMapMarkers(mockMap, markers, mockGoogleMaps));

		await waitFor(() => {
			expect(mockGoogleMaps.marker.PinElement).toHaveBeenCalledWith(
				expect.objectContaining({
					background: 'icon-url',
				})
			);
		});
	});

	it('should create marker with label', async () => {
		const markers: MapMarker[] = [{ id: '1', lat: 37.7749, lng: -122.4194, label: 'A' }];

		renderHook(() => useMapMarkers(mockMap, markers, mockGoogleMaps));

		await waitFor(() => {
			expect(mockGoogleMaps.marker.PinElement).toHaveBeenCalledWith(
				expect.objectContaining({
					glyph: 'A',
				})
			);
		});
	});

	it('should call onClick handler when marker is clicked', async () => {
		const onClick = vi.fn();
		const markers: MapMarker[] = [{ id: '1', lat: 37.7749, lng: -122.4194, onClick }];

		renderHook(() => useMapMarkers(mockMap, markers, mockGoogleMaps));

		await waitFor(() => {
			expect(mockMarker.addListener).toHaveBeenCalledWith('click', expect.any(Function));
		});

		// Simulate click
		const clickHandler = vi.mocked(mockMarker.addListener).mock.calls[0]?.[1];
		if (clickHandler && typeof clickHandler === 'function') {
			clickHandler();
			expect(onClick).toHaveBeenCalled();
		}
	});

	it('should open info window when marker with infoWindow is clicked', async () => {
		const markers: MapMarker[] = [
			{ id: '1', lat: 37.7749, lng: -122.4194, infoWindow: 'Info content' },
		];

		renderHook(() => useMapMarkers(mockMap, markers, mockGoogleMaps));

		await waitFor(() => {
			expect(mockMarker.addListener).toHaveBeenCalledWith('click', expect.any(Function));
		});

		// Simulate click
		const clickHandler = vi.mocked(mockMarker.addListener).mock.calls[0]?.[1];
		if (clickHandler && typeof clickHandler === 'function') {
			clickHandler();
			await waitFor(() => {
				expect(mockGoogleMaps.InfoWindow).toHaveBeenCalled();
				expect(mockInfoWindow.open).toHaveBeenCalled();
			});
		}
	});

	it('should close existing info window before opening new one', async () => {
		const markers: MapMarker[] = [
			{ id: '1', lat: 37.7749, lng: -122.4194, infoWindow: 'Info content' },
		];

		renderHook(() => useMapMarkers(mockMap, markers, mockGoogleMaps));

		await waitFor(() => {
			expect(mockMarker.addListener).toHaveBeenCalledWith('click', expect.any(Function));
		});

		// Simulate first click to create an info window
		const clickHandler = vi.mocked(mockMarker.addListener).mock.calls[0]?.[1];
		if (clickHandler && typeof clickHandler === 'function') {
			clickHandler();
			await waitFor(() => {
				expect(mockGoogleMaps.InfoWindow).toHaveBeenCalled();
			});
		}

		// Clear mocks and simulate second click - this should close the existing window
		vi.clearAllMocks();

		if (clickHandler && typeof clickHandler === 'function') {
			clickHandler();
			await waitFor(() => {
				// On second click, close should be called before opening new one
				expect(mockInfoWindow.close).toHaveBeenCalled();
			});
		}
	});
});
