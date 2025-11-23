/**
 * useMapState Tests
 *
 * Tests for the useMapState hook:
 * - Initialization
 * - Marker management
 * - Options updates
 * - API key resolution
 */

import { useMapInitialization } from '@core/ui/media/map/hooks/useMapInitialization';
import { useMapMarkers } from '@core/ui/media/map/hooks/useMapMarkers';
import { useMapOptionsUpdate } from '@core/ui/media/map/hooks/useMapOptionsUpdate';
import { useMapState } from '@core/ui/media/map/hooks/useMapState';
import { useResolvedApiKey } from '@core/ui/media/map/hooks/useResolvedApiKey';
import type { MapProps } from '@src-types/ui/maps';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/media/map/hooks/useResolvedApiKey', () => ({
	useResolvedApiKey: vi.fn(() => 'resolved-api-key'),
}));

vi.mock('@core/ui/media/map/hooks/useMapInitialization', () => ({
	useMapInitialization: vi.fn(() => ({
		mapInstance: null,
		googleMaps: null,
		isLoading: true,
		error: null,
	})),
}));

vi.mock('@core/ui/media/map/hooks/useMapMarkers', () => ({
	useMapMarkers: vi.fn(),
}));

vi.mock('@core/ui/media/map/hooks/useMapOptionsUpdate', () => ({
	useMapOptionsUpdate: vi.fn(),
}));

describe('useMapState', () => {
	let mockMap: google.maps.Map;
	let mockGoogleMaps: typeof google.maps;

	beforeEach(() => {
		vi.clearAllMocks();

		// Create mock Google Maps API
		mockGoogleMaps = {} as typeof google.maps;

		// Create mock map instance
		mockMap = {} as google.maps.Map;
	});

	it('should return initial state', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		const { result } = renderHook(() =>
			useMapState({
				options,
				markers: [],
				libraries: [],
			})
		);

		expect(result.current.mapRef).toBeDefined();
		expect(result.current.mapInstance).toBeNull();
		expect(result.current.googleMaps).toBeNull();
		expect(result.current.isLoading).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it('should resolve API key', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		renderHook(() =>
			useMapState({
				options,
				apiKey: 'test-api-key',
				markers: [],
				libraries: [],
			})
		);

		expect(useResolvedApiKey).toHaveBeenCalledWith('test-api-key');
	});

	it('should initialize map with resolved API key', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		renderHook(() =>
			useMapState({
				options,
				markers: [],
				libraries: ['places'],
			})
		);

		expect(useMapInitialization).toHaveBeenCalledWith(
			expect.objectContaining({
				resolvedApiKey: 'resolved-api-key',
				libraries: ['places'],
				options,
			})
		);
	});

	it('should manage markers', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};
		const markers = [{ id: '1', lat: 37.7749, lng: -122.4194 }];

		renderHook(() =>
			useMapState({
				options,
				markers,
				libraries: [],
			})
		);

		// useMapMarkers should be called, but we need to wait for mapInstance
		// This is a simplified test - in practice, markers are managed after map is initialized
		expect(useMapMarkers).toHaveBeenCalled();
	});

	it('should update map options', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
			zoom: 15,
		};

		renderHook(() =>
			useMapState({
				options,
				markers: [],
				libraries: [],
			})
		);

		expect(useMapOptionsUpdate).toHaveBeenCalledWith(
			expect.objectContaining({
				options,
			})
		);
	});

	it('should pass callbacks to initialization', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};
		const onMapReady = vi.fn();
		const onBoundsChanged = vi.fn();
		const onCenterChanged = vi.fn();
		const onZoomChanged = vi.fn();
		const onMapClick = vi.fn();

		renderHook(() =>
			useMapState({
				options,
				markers: [],
				libraries: [],
				onMapReady,
				onBoundsChanged,
				onCenterChanged,
				onZoomChanged,
				onMapClick,
			})
		);

		expect(useMapInitialization).toHaveBeenCalledWith(
			expect.objectContaining({
				onMapReady,
				onBoundsChanged,
				onCenterChanged,
				onZoomChanged,
				onMapClick,
			})
		);
	});

	it('should return map instance and googleMaps when initialized', () => {
		vi.mocked(useMapInitialization).mockReturnValue({
			mapInstance: mockMap,
			googleMaps: mockGoogleMaps,
			isLoading: false,
			error: null,
		});

		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		const { result } = renderHook(() =>
			useMapState({
				options,
				markers: [],
				libraries: [],
			})
		);

		expect(result.current.mapInstance).toBe(mockMap);
		expect(result.current.googleMaps).toBe(mockGoogleMaps);
		expect(result.current.isLoading).toBe(false);
	});

	it('should return error when initialization fails', () => {
		vi.mocked(useMapInitialization).mockReturnValue({
			mapInstance: null,
			googleMaps: null,
			isLoading: false,
			error: 'Failed to load map',
		});

		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};

		const { result } = renderHook(() =>
			useMapState({
				options,
				markers: [],
				libraries: [],
			})
		);

		expect(result.current.error).toBe('Failed to load map');
		expect(result.current.isLoading).toBe(false);
	});
});
