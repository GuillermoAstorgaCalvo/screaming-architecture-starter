import i18n from '@core/i18n/i18n';
import type { MapProps } from '@src-types/ui/maps';

interface InitializeMapParams {
	resolvedApiKey: string;
	libraries: string[];
	options: MapProps['options'];
	mapElement: HTMLDivElement;
	onMapReady?: MapProps['onMapReady'];
	onBoundsChanged?: MapProps['onBoundsChanged'];
	onCenterChanged?: MapProps['onCenterChanged'];
	onZoomChanged?: MapProps['onZoomChanged'];
	onMapClick?: MapProps['onMapClick'];
}

interface InitializeMapResult {
	mapInstance: google.maps.Map;
	googleMaps: typeof google.maps;
}

/**
 * Initialize Google Maps instance
 */
export async function initializeMapInstance({
	resolvedApiKey,
	libraries,
	options,
	mapElement,
	onMapReady,
	onBoundsChanged,
	onCenterChanged,
	onZoomChanged,
	onMapClick,
}: InitializeMapParams): Promise<InitializeMapResult> {
	const { initializeGoogleMaps } = await import('./map.helpers');
	const googleMapsApi = await initializeGoogleMaps(resolvedApiKey, libraries);

	if (!googleMapsApi) {
		throw new Error(i18n.t('errors.failedToLoadGoogleMaps', { ns: 'common' }));
	}

	// Import helpers dynamically to avoid circular dependencies
	const { createMapOptions, setupMapEventListeners } = await import('./map.helpers');

	const mapOptions = createMapOptions(options, googleMapsApi);
	const map = new googleMapsApi.Map(mapElement, mapOptions);

	setupMapEventListeners(map, {
		onBoundsChanged,
		onCenterChanged,
		onZoomChanged,
		onMapClick,
	});

	onMapReady?.(map);

	return {
		mapInstance: map,
		googleMaps: googleMapsApi,
	};
}
