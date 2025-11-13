import { useMapInitializationEffect } from '@core/ui/media/map/hooks/useMapInitializationEffect';
import type { MapProps } from '@src-types/ui/maps';
import { type RefObject, useEffect, useRef, useState } from 'react';

interface UseMapInitializationParams {
	resolvedApiKey: string | null;
	libraries: string[];
	options: MapProps['options'];
	mapRef: RefObject<HTMLDivElement | null>;
	onMapReady?: MapProps['onMapReady'];
	onBoundsChanged?: MapProps['onBoundsChanged'];
	onCenterChanged?: MapProps['onCenterChanged'];
	onZoomChanged?: MapProps['onZoomChanged'];
	onMapClick?: MapProps['onMapClick'];
}

interface UseMapInitializationReturn {
	mapInstance: google.maps.Map | null;
	googleMaps: typeof google.maps | null;
	isLoading: boolean;
	error: string | null;
}

/**
 * Hook to initialize Google Maps instance
 */
export function useMapInitialization({
	resolvedApiKey,
	libraries,
	options,
	mapRef,
	onMapReady,
	onBoundsChanged,
	onCenterChanged,
	onZoomChanged,
	onMapClick,
}: UseMapInitializationParams): UseMapInitializationReturn {
	const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
	const [googleMaps, setGoogleMaps] = useState<typeof google.maps | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const mapElementRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		mapElementRef.current = mapRef.current;
	}, [mapRef]);

	const handleSuccess = (r: { mapInstance: google.maps.Map; googleMaps: typeof google.maps }) => {
		setGoogleMaps(r.googleMaps);
		setMapInstance(r.mapInstance);
	};
	const handleError = (msg: string) => setError(msg);

	useMapInitializationEffect({
		resolvedApiKey: resolvedApiKey ?? '',
		libraries,
		options,
		mapElementRef,
		onMapReady,
		onBoundsChanged,
		onCenterChanged,
		onZoomChanged,
		onMapClick,
		onSuccess: handleSuccess,
		onError: handleError,
		onLoadingChange: setIsLoading,
	});

	return { mapInstance, googleMaps, isLoading, error };
}
