/**
 * useMapInitialization Tests
 *
 * Tests for the useMapInitialization hook:
 * - Initial state
 * - Successful initialization
 * - Error handling
 * - Loading state
 */

import { useMapInitialization } from '@core/ui/media/map/hooks/useMapInitialization';
import { useMapInitializationEffect } from '@core/ui/media/map/hooks/useMapInitializationEffect';
import type { MapProps } from '@src-types/ui/maps';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/media/map/hooks/useMapInitializationEffect', () => ({
	useMapInitializationEffect: vi.fn(),
}));

describe('useMapInitialization', () => {
	let mockMap: google.maps.Map;
	let mockGoogleMaps: typeof google.maps;
	let mockMapRef: React.RefObject<HTMLDivElement>;
	let onSuccess: (result: { mapInstance: google.maps.Map; googleMaps: typeof google.maps }) => void;
	let onError: (error: string) => void;
	let onLoadingChange: (isLoading: boolean) => void;

	beforeEach(() => {
		vi.clearAllMocks();

		// Create mock map element
		const mapElement = document.createElement('div');
		mockMapRef = { current: mapElement };

		// Create mock Google Maps API
		mockGoogleMaps = {} as typeof google.maps;

		// Create mock map instance
		mockMap = {} as google.maps.Map;

		// Setup effect mock
		vi.mocked(useMapInitializationEffect).mockImplementation(params => {
			onSuccess = params.onSuccess;
			onError = params.onError;
			onLoadingChange = params.onLoadingChange;
		});
	});

	it('should return initial state', () => {
		const { result } = renderHook(() =>
			useMapInitialization({
				resolvedApiKey: 'test-api-key',
				libraries: [],
				options: { center: { lat: 37.7749, lng: -122.4194 } },
				mapRef: mockMapRef,
			})
		);

		expect(result.current.mapInstance).toBeNull();
		expect(result.current.googleMaps).toBeNull();
		expect(result.current.isLoading).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it('should update state on successful initialization', async () => {
		const { result } = renderHook(() =>
			useMapInitialization({
				resolvedApiKey: 'test-api-key',
				libraries: [],
				options: { center: { lat: 37.7749, lng: -122.4194 } },
				mapRef: mockMapRef,
			})
		);

		// Simulate successful initialization - call both callbacks
		onLoadingChange(false);
		onSuccess({
			mapInstance: mockMap,
			googleMaps: mockGoogleMaps,
		});

		await waitFor(() => {
			expect(result.current.mapInstance).toBe(mockMap);
			expect(result.current.googleMaps).toBe(mockGoogleMaps);
			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	it('should update state on error', async () => {
		const { result } = renderHook(() =>
			useMapInitialization({
				resolvedApiKey: 'test-api-key',
				libraries: [],
				options: { center: { lat: 37.7749, lng: -122.4194 } },
				mapRef: mockMapRef,
			})
		);

		// Simulate error - call both callbacks
		onLoadingChange(false);
		onError('Failed to load map');

		await waitFor(() => {
			expect(result.current.error).toBe('Failed to load map');
			expect(result.current.isLoading).toBe(false);
			expect(result.current.mapInstance).toBeNull();
			expect(result.current.googleMaps).toBeNull();
		});
	});

	it('should pass correct parameters to useMapInitializationEffect', () => {
		const options: MapProps['options'] = {
			center: { lat: 37.7749, lng: -122.4194 },
		};
		const onMapReady = vi.fn();
		const onBoundsChanged = vi.fn();
		const onCenterChanged = vi.fn();
		const onZoomChanged = vi.fn();
		const onMapClick = vi.fn();

		renderHook(() =>
			useMapInitialization({
				resolvedApiKey: 'test-api-key',
				libraries: ['places'],
				options,
				mapRef: mockMapRef,
				onMapReady,
				onBoundsChanged,
				onCenterChanged,
				onZoomChanged,
				onMapClick,
			})
		);

		expect(useMapInitializationEffect).toHaveBeenCalledWith(
			expect.objectContaining({
				resolvedApiKey: 'test-api-key',
				libraries: ['places'],
				options,
				onMapReady,
				onBoundsChanged,
				onCenterChanged,
				onZoomChanged,
				onMapClick,
			})
		);
	});

	it('should handle null resolvedApiKey', () => {
		const { result } = renderHook(() =>
			useMapInitialization({
				resolvedApiKey: null,
				libraries: [],
				options: { center: { lat: 37.7749, lng: -122.4194 } },
				mapRef: mockMapRef,
			})
		);

		expect(result.current.isLoading).toBe(true);
	});

	it('should update loading state', async () => {
		const { result } = renderHook(() =>
			useMapInitialization({
				resolvedApiKey: 'test-api-key',
				libraries: [],
				options: { center: { lat: 37.7749, lng: -122.4194 } },
				mapRef: mockMapRef,
			})
		);

		expect(result.current.isLoading).toBe(true);

		onLoadingChange(false);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});
	});
});
