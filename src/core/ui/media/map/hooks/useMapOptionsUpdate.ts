import type { MapOptions } from '@src-types/ui/maps';
import { useEffect } from 'react';

interface UseMapOptionsUpdateParams {
	mapInstance: google.maps.Map | null;
	googleMaps: typeof google.maps | null;
	options: MapOptions;
}

/**
 * Hook to update map options when they change
 */
export function useMapOptionsUpdate({
	mapInstance,
	googleMaps,
	options,
}: UseMapOptionsUpdateParams): void {
	useEffect(() => {
		if (!mapInstance || !googleMaps) {
			return;
		}

		const newCenter = new googleMaps.LatLng(options.center.lat, options.center.lng);
		const currentCenter = mapInstance.getCenter();
		if (
			!currentCenter ||
			currentCenter.lat() !== newCenter.lat() ||
			currentCenter.lng() !== newCenter.lng()
		) {
			mapInstance.setCenter(newCenter);
		}

		const currentZoom = mapInstance.getZoom();
		if (options.zoom !== undefined && currentZoom !== options.zoom) {
			mapInstance.setZoom(options.zoom);
		}

		if (options.mapTypeId) {
			mapInstance.setMapTypeId(options.mapTypeId);
		}
	}, [mapInstance, googleMaps, options]);
}
