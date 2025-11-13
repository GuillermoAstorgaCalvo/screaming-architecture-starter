import { UI_TIMEOUTS } from '@core/constants/timeouts';
import { loadGoogleMaps } from '@core/lib/googleMapsLoader';
import { debounce } from '@core/utils/debounce';
import type { MapProps } from '@src-types/ui/maps';

/**
 * Create Google Maps map options from component props
 */
const DEFAULT_ZOOM = 10;

const DEFAULT_MAP_OPTIONS: Partial<google.maps.MapOptions> = {
	zoom: DEFAULT_ZOOM,
	mapTypeId: 'roadmap',
	disableDefaultUI: false,
	zoomControl: true,
	streetViewControl: true,
	fullscreenControl: true,
	mapTypeControl: true,
	scaleControl: false,
	rotateControl: true,
	gestureHandling: 'auto',
};

function getOptionalProperties(options: MapProps['options']): Partial<google.maps.MapOptions> {
	const optional: Partial<google.maps.MapOptions> = {};
	if (options.minZoom !== undefined) optional.minZoom = options.minZoom;
	if (options.maxZoom !== undefined) optional.maxZoom = options.maxZoom;
	if (options.styles) optional.styles = options.styles;
	if (options.mapId) optional.mapId = options.mapId;
	return optional;
}

function getBasicOptions(options: MapProps['options']): Partial<google.maps.MapOptions> {
	const basic: Partial<google.maps.MapOptions> = {};
	if (options.zoom !== undefined) basic.zoom = options.zoom;
	if (options.mapTypeId !== undefined) basic.mapTypeId = options.mapTypeId;
	if (options.gestureHandling !== undefined) basic.gestureHandling = options.gestureHandling;
	return basic;
}

function getControlOptions(options: MapProps['options']): Partial<google.maps.MapOptions> {
	const controls: Partial<google.maps.MapOptions> = {};
	const controlKeys: Array<keyof MapProps['options']> = [
		'disableDefaultUI',
		'zoomControl',
		'streetViewControl',
		'fullscreenControl',
		'mapTypeControl',
		'scaleControl',
		'rotateControl',
	];

	for (const key of controlKeys) {
		if (options[key] !== undefined) {
			controls[key as keyof google.maps.MapOptions] = options[key] as never;
		}
	}

	return controls;
}

export function createMapOptions(
	options: MapProps['options'],
	googleMaps: typeof google.maps
): google.maps.MapOptions {
	return {
		...DEFAULT_MAP_OPTIONS,
		...getBasicOptions(options),
		...getControlOptions(options),
		center: new googleMaps.LatLng(options.center.lat, options.center.lng),
		...getOptionalProperties(options),
	};
}

/**
 * Set up map event listeners
 * Debounces frequent events (bounds_changed, center_changed, zoom_changed) to improve performance
 */
export function setupMapEventListeners(
	map: google.maps.Map,
	callbacks: {
		onBoundsChanged?: MapProps['onBoundsChanged'];
		onCenterChanged?: MapProps['onCenterChanged'];
		onZoomChanged?: MapProps['onZoomChanged'];
		onMapClick?: MapProps['onMapClick'];
	}
): void {
	if (callbacks.onBoundsChanged) {
		const debouncedBoundsChanged = debounce(() => {
			callbacks.onBoundsChanged?.(map.getBounds() ?? null);
		}, UI_TIMEOUTS.DEBOUNCE_SHORT);
		map.addListener('bounds_changed', debouncedBoundsChanged);
	}

	if (callbacks.onCenterChanged) {
		const debouncedCenterChanged = debounce(() => {
			callbacks.onCenterChanged?.(map.getCenter() ?? null);
		}, UI_TIMEOUTS.DEBOUNCE_SHORT);
		map.addListener('center_changed', debouncedCenterChanged);
	}

	if (callbacks.onZoomChanged) {
		const debouncedZoomChanged = debounce(() => {
			callbacks.onZoomChanged?.(map.getZoom() ?? null);
		}, UI_TIMEOUTS.DEBOUNCE_SHORT);
		map.addListener('zoom_changed', debouncedZoomChanged);
	}

	if (callbacks.onMapClick) {
		// Click events don't need debouncing as they're discrete user actions
		map.addListener('click', (event: google.maps.MapMouseEvent) => {
			callbacks.onMapClick?.(event);
		});
	}
}

/**
 * Initialize Google Maps
 */
export async function initializeGoogleMaps(
	apiKey: string,
	libraries: string[]
): Promise<typeof google.maps | null> {
	return loadGoogleMaps(apiKey, libraries);
}
