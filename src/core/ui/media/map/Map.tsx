import { renderMap } from '@core/ui/media/map/helpers/useMapRender';
import { useMapState } from '@core/ui/media/map/hooks/useMapState';
import type { MapProps } from '@src-types/ui/maps';

/**
 * Map - Google Maps component with React integration
 *
 * Features:
 * - Dynamic Google Maps script loading
 * - Marker support with custom icons and info windows
 * - Event handlers for map interactions
 * - Loading and error states
 * - Configurable map options (zoom, center, controls, etc.)
 * - Support for Google Maps libraries (places, geometry, etc.)
 *
 * @example
 * ```tsx
 * <Map
 *   options={{
 *     center: { lat: 37.7749, lng: -122.4194 },
 *     zoom: 13,
 *   }}
 *   markers={[
 *     {
 *       id: '1',
 *       lat: 37.7749,
 *       lng: -122.4194,
 *       title: 'San Francisco',
 *     },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Map
 *   options={{
 *     center: { lat: 40.7128, lng: -74.0060 },
 *     zoom: 10,
 *     mapTypeId: 'satellite',
 *   }}
 *   libraries={['places']}
 *   onMapReady={(map) => console.log('Map ready', map)}
 * />
 * ```
 */

export default function GoogleMap({
	options,
	markers = [],
	apiKey,
	libraries = [],
	onMapReady,
	onBoundsChanged,
	onCenterChanged,
	onZoomChanged,
	onMapClick,
	loadingFallback,
	errorFallback,
	height = '400px',
	width = '100%',
	className,
	...props
}: Readonly<MapProps>) {
	const { mapRef, isLoading, error } = useMapState({
		options,
		markers,
		apiKey,
		libraries,
		onMapReady,
		onBoundsChanged,
		onCenterChanged,
		onZoomChanged,
		onMapClick,
	});

	return renderMap({
		error,
		errorFallback,
		isLoading,
		loadingFallback,
		mapRef,
		height,
		width,
		className,
		props,
	});
}
