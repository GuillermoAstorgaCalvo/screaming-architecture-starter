/**
 * useMapOptionsUpdate Tests
 *
 * Tests for the useMapOptionsUpdate hook:
 * - Updating center
 * - Updating zoom
 * - Updating mapTypeId
 * - Handling null map instance
 */

import { useMapOptionsUpdate } from '@core/ui/media/map/hooks/useMapOptionsUpdate';
import type { MapOptions } from '@src-types/ui/maps';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useMapOptionsUpdate', () => {
	let mockMap: google.maps.Map;
	let mockGoogleMaps: typeof google.maps;
	let mockLatLng: google.maps.LatLng;

	beforeEach(() => {
		vi.clearAllMocks();

		// Create mock LatLng instance
		mockLatLng = {
			lat: vi.fn(() => 37.7749),
			lng: vi.fn(() => -122.4194),
		} as unknown as google.maps.LatLng;

		// Create mock Google Maps API with LatLng constructor
		const LatLngConstructor = vi.fn(function (this: google.maps.LatLng, lat: number, lng: number) {
			return {
				lat: vi.fn(() => lat),
				lng: vi.fn(() => lng),
			} as unknown as google.maps.LatLng;
		}) as unknown as new (lat: number, lng: number) => google.maps.LatLng;

		mockGoogleMaps = {
			LatLng: LatLngConstructor,
		} as unknown as typeof google.maps;

		// Create mock map instance
		mockMap = {
			getCenter: vi.fn(() => mockLatLng),
			getZoom: vi.fn(() => 10),
			setCenter: vi.fn(),
			setZoom: vi.fn(),
			setMapTypeId: vi.fn(),
		} as unknown as google.maps.Map;
	});

	it('should update center when it changes', () => {
		const options: MapOptions = {
			center: { lat: 40.7128, lng: -74 },
		};

		renderHook(() =>
			useMapOptionsUpdate({
				mapInstance: mockMap,
				googleMaps: mockGoogleMaps,
				options,
			})
		);

		expect(mockGoogleMaps.LatLng).toHaveBeenCalledWith(40.7128, -74);
		expect(mockMap.setCenter).toHaveBeenCalled();
	});

	it('should not update center when it has not changed', () => {
		// Set up mock to return the same lat/lng values
		(mockMap.getCenter as ReturnType<typeof vi.fn>).mockReturnValue(mockLatLng);

		const options: MapOptions = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		renderHook(() =>
			useMapOptionsUpdate({
				mapInstance: mockMap,
				googleMaps: mockGoogleMaps,
				options,
			})
		);

		// setCenter should not be called because lat/lng values match
		expect(mockMap.setCenter).not.toHaveBeenCalled();
	});

	it('should update zoom when it changes', () => {
		const options: MapOptions = {
			center: { lat: 37.7749, lng: -122.4194 },
			zoom: 15,
		};

		renderHook(() =>
			useMapOptionsUpdate({
				mapInstance: mockMap,
				googleMaps: mockGoogleMaps,
				options,
			})
		);

		expect(mockMap.setZoom).toHaveBeenCalledWith(15);
	});

	it('should not update zoom when it has not changed', () => {
		const options: MapOptions = {
			center: { lat: 37.7749, lng: -122.4194 },
			zoom: 10,
		};

		renderHook(() =>
			useMapOptionsUpdate({
				mapInstance: mockMap,
				googleMaps: mockGoogleMaps,
				options,
			})
		);

		expect(mockMap.setZoom).not.toHaveBeenCalled();
	});

	it('should update mapTypeId when provided', () => {
		const options: MapOptions = {
			center: { lat: 37.7749, lng: -122.4194 },
			mapTypeId: 'satellite',
		};

		renderHook(() =>
			useMapOptionsUpdate({
				mapInstance: mockMap,
				googleMaps: mockGoogleMaps,
				options,
			})
		);

		expect(mockMap.setMapTypeId).toHaveBeenCalledWith('satellite');
	});

	it('should not update when mapInstance is null', () => {
		const options: MapOptions = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		renderHook(() =>
			useMapOptionsUpdate({
				mapInstance: null,
				googleMaps: mockGoogleMaps,
				options,
			})
		);

		expect(mockMap.setCenter).not.toHaveBeenCalled();
		expect(mockMap.setZoom).not.toHaveBeenCalled();
	});

	it('should not update when googleMaps is null', () => {
		const options: MapOptions = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		renderHook(() =>
			useMapOptionsUpdate({
				mapInstance: mockMap,
				googleMaps: null,
				options,
			})
		);

		expect(mockMap.setCenter).not.toHaveBeenCalled();
		expect(mockMap.setZoom).not.toHaveBeenCalled();
	});

	it('should handle null center from map', () => {
		(mockMap.getCenter as ReturnType<typeof vi.fn>).mockReturnValue(null);

		const options: MapOptions = {
			center: { lat: 40.7128, lng: -74 },
		};

		renderHook(() =>
			useMapOptionsUpdate({
				mapInstance: mockMap,
				googleMaps: mockGoogleMaps,
				options,
			})
		);

		expect(mockMap.setCenter).toHaveBeenCalled();
	});

	it('should update when options change', () => {
		const { rerender } = renderHook(
			({ options }: { options: MapOptions }) =>
				useMapOptionsUpdate({
					mapInstance: mockMap,
					googleMaps: mockGoogleMaps,
					options,
				}),
			{
				initialProps: {
					options: {
						center: { lat: 37.7749, lng: -122.4194 },
						zoom: 10,
					},
				},
			}
		);

		vi.clearAllMocks();

		rerender({
			options: {
				center: { lat: 40.7128, lng: -74 },
				zoom: 15,
			},
		});

		expect(mockMap.setCenter).toHaveBeenCalled();
		expect(mockMap.setZoom).toHaveBeenCalledWith(15);
	});
});
