import type { MapProps } from '@src-types/ui/maps';
import { type RefObject, useRef } from 'react';

import { useMapInitialization } from './useMapInitialization';
import { useMapMarkers } from './useMapMarkers';
import { useMapOptionsUpdate } from './useMapOptionsUpdate';
import { useResolvedApiKey } from './useResolvedApiKey';

interface UseMapStateParams {
	options: MapProps['options'];
	markers: MapProps['markers'];
	apiKey?: MapProps['apiKey'];
	libraries: MapProps['libraries'];
	onMapReady?: MapProps['onMapReady'];
	onBoundsChanged?: MapProps['onBoundsChanged'];
	onCenterChanged?: MapProps['onCenterChanged'];
	onZoomChanged?: MapProps['onZoomChanged'];
	onMapClick?: MapProps['onMapClick'];
}

interface UseMapStateReturn {
	mapRef: RefObject<HTMLDivElement | null>;
	mapInstance: google.maps.Map | null;
	googleMaps: typeof google.maps | null;
	isLoading: boolean;
	error: string | null;
}

/**
 * Hook to manage all map state and side effects
 */
export function useMapState({
	options,
	markers = [],
	apiKey,
	libraries = [],
	onMapReady,
	onBoundsChanged,
	onCenterChanged,
	onZoomChanged,
	onMapClick,
}: UseMapStateParams): UseMapStateReturn {
	const mapRef = useRef<HTMLDivElement>(null);
	const resolvedApiKey = useResolvedApiKey(apiKey);

	const { mapInstance, googleMaps, isLoading, error } = useMapInitialization({
		resolvedApiKey,
		libraries,
		options,
		mapRef,
		onMapReady,
		onBoundsChanged,
		onCenterChanged,
		onZoomChanged,
		onMapClick,
	});

	useMapMarkers(mapInstance, markers, googleMaps);
	useMapOptionsUpdate({ mapInstance, googleMaps, options });

	return {
		mapRef,
		mapInstance,
		googleMaps,
		isLoading,
		error,
	};
}
