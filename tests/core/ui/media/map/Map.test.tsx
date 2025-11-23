/**
 * Map Component Tests
 *
 * Tests for the Map component:
 * - Rendering
 * - Props forwarding
 * - Loading state
 * - Error state
 */

import { renderMap } from '@core/ui/media/map/helpers/useMapRender';
import { useMapState } from '@core/ui/media/map/hooks/useMapState';
import GoogleMap from '@core/ui/media/map/Map';
import type { MapProps } from '@src-types/ui/maps';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/media/map/hooks/useMapState', () => ({
	useMapState: vi.fn(() => ({
		mapRef: { current: null },
		mapInstance: null,
		googleMaps: null,
		isLoading: true,
		error: null,
	})),
}));

vi.mock('@core/ui/media/map/helpers/useMapRender', () => ({
	renderMap: vi.fn(({ error, isLoading }) => {
		if (error) {
			return <div data-testid="map-error">{error}</div>;
		}
		return <div data-testid="map-container" data-is-loading={isLoading} />;
	}),
}));

describe('GoogleMap', () => {
	const defaultOptions: MapProps['options'] = {
		center: { lat: 37.7749, lng: -122.4194 },
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render map component', () => {
		renderWithProviders(<GoogleMap options={defaultOptions} />);

		expect(screen.getByTestId('map-container')).toBeInTheDocument();
	});

	it('should pass options to useMapState', () => {
		const options: MapProps['options'] = {
			center: { lat: 40.7128, lng: -74 },
			zoom: 15,
		};

		renderWithProviders(<GoogleMap options={options} />);

		expect(useMapState).toHaveBeenCalledWith(
			expect.objectContaining({
				options,
			})
		);
	});

	it('should pass markers to useMapState', () => {
		const markers = [{ id: '1', lat: 37.7749, lng: -122.4194 }];

		renderWithProviders(<GoogleMap options={defaultOptions} markers={markers} />);

		expect(useMapState).toHaveBeenCalledWith(
			expect.objectContaining({
				markers,
			})
		);
	});

	it('should pass apiKey to useMapState', () => {
		renderWithProviders(<GoogleMap options={defaultOptions} apiKey="test-api-key" />);

		expect(useMapState).toHaveBeenCalledWith(
			expect.objectContaining({
				apiKey: 'test-api-key',
			})
		);
	});

	it('should pass libraries to useMapState', () => {
		renderWithProviders(<GoogleMap options={defaultOptions} libraries={['places']} />);

		expect(useMapState).toHaveBeenCalledWith(
			expect.objectContaining({
				libraries: ['places'],
			})
		);
	});

	it('should pass callbacks to useMapState', () => {
		const onMapReady = vi.fn();
		const onBoundsChanged = vi.fn();
		const onCenterChanged = vi.fn();
		const onZoomChanged = vi.fn();
		const onMapClick = vi.fn();

		renderWithProviders(
			<GoogleMap
				options={defaultOptions}
				onMapReady={onMapReady}
				onBoundsChanged={onBoundsChanged}
				onCenterChanged={onCenterChanged}
				onZoomChanged={onZoomChanged}
				onMapClick={onMapClick}
			/>
		);

		expect(useMapState).toHaveBeenCalledWith(
			expect.objectContaining({
				onMapReady,
				onBoundsChanged,
				onCenterChanged,
				onZoomChanged,
				onMapClick,
			})
		);
	});

	it('should render error state when error occurs', () => {
		vi.mocked(useMapState).mockReturnValue({
			mapRef: { current: null },
			mapInstance: null,
			googleMaps: null,
			isLoading: false,
			error: 'Failed to load map',
		});

		renderWithProviders(<GoogleMap options={defaultOptions} />);

		expect(screen.getByTestId('map-error')).toBeInTheDocument();
		expect(screen.getByTestId('map-error')).toHaveTextContent('Failed to load map');
	});

	it('should render loading state', () => {
		vi.mocked(useMapState).mockReturnValue({
			mapRef: { current: null },
			mapInstance: null,
			googleMaps: null,
			isLoading: true,
			error: null,
		});

		renderWithProviders(<GoogleMap options={defaultOptions} />);

		const container = screen.getByTestId('map-container');
		expect(container).toHaveAttribute('data-is-loading', 'true');
	});

	it('should pass loadingFallback to renderMap', () => {
		const loadingFallback = <div data-testid="custom-loading">Loading...</div>;

		renderWithProviders(<GoogleMap options={defaultOptions} loadingFallback={loadingFallback} />);

		expect(renderMap).toHaveBeenCalledWith(
			expect.objectContaining({
				loadingFallback,
			})
		);
	});

	it('should pass errorFallback to renderMap', () => {
		vi.mocked(useMapState).mockReturnValue({
			mapRef: { current: null },
			mapInstance: null,
			googleMaps: null,
			isLoading: false,
			error: 'Test error',
		});

		const errorFallback = <div data-testid="custom-error">Custom Error</div>;

		renderWithProviders(<GoogleMap options={defaultOptions} errorFallback={errorFallback} />);

		expect(renderMap).toHaveBeenCalledWith(
			expect.objectContaining({
				errorFallback,
			})
		);
	});

	it('should pass height and width to renderMap', () => {
		renderWithProviders(<GoogleMap options={defaultOptions} height="500px" width="80%" />);

		expect(renderMap).toHaveBeenCalledWith(
			expect.objectContaining({
				height: '500px',
				width: '80%',
			})
		);
	});

	it('should use default height and width when not provided', () => {
		renderWithProviders(<GoogleMap options={defaultOptions} />);

		expect(renderMap).toHaveBeenCalledWith(
			expect.objectContaining({
				height: 'var(--spacing-4xl)',
				width: '100%',
			})
		);
	});

	it('should pass className to renderMap', () => {
		renderWithProviders(<GoogleMap options={defaultOptions} className="custom-class" />);

		expect(renderMap).toHaveBeenCalledWith(
			expect.objectContaining({
				className: 'custom-class',
			})
		);
	});

	it('should pass additional props to renderMap', () => {
		renderWithProviders(<GoogleMap options={defaultOptions} data-testid="map-component" />);

		expect(renderMap).toHaveBeenCalledWith(
			expect.objectContaining({
				props: expect.objectContaining({
					'data-testid': 'map-component',
				}),
			})
		);
	});
});
