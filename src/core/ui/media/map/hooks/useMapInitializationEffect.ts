import { initializeMapInstance } from '@core/ui/media/map/helpers/mapInitialization.helpers';
import type { MapProps } from '@src-types/ui/maps';
import { type RefObject, useEffect, useMemo } from 'react';

interface UseMapInitializationEffectParams {
	resolvedApiKey: string;
	libraries: string[];
	options: MapProps['options'];
	mapElementRef: RefObject<HTMLDivElement | null>;
	onMapReady?: MapProps['onMapReady'];
	onBoundsChanged?: MapProps['onBoundsChanged'];
	onCenterChanged?: MapProps['onCenterChanged'];
	onZoomChanged?: MapProps['onZoomChanged'];
	onMapClick?: MapProps['onMapClick'];
	onSuccess: (result: { mapInstance: google.maps.Map; googleMaps: typeof google.maps }) => void;
	onError: (error: string) => void;
	onLoadingChange: (isLoading: boolean) => void;
}

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

interface MapInitializationCallbacks {
	onSuccess: (result: { mapInstance: google.maps.Map; googleMaps: typeof google.maps }) => void;
	onError: (error: string) => void;
	onLoadingChange: (isLoading: boolean) => void;
}

/**
 * Checks if map initialization should proceed
 */
function shouldInitializeMap(
	resolvedApiKey: string,
	mapElementRef: RefObject<HTMLDivElement | null>
): boolean {
	return Boolean(resolvedApiKey && mapElementRef.current);
}

/**
 * Handles successful map initialization
 */
function handleMapInitializationSuccess(
	result: { mapInstance: google.maps.Map; googleMaps: typeof google.maps },
	callbacks: MapInitializationCallbacks
): void {
	callbacks.onSuccess(result);
	callbacks.onLoadingChange(false);
}

/**
 * Handles errors during map initialization
 */
function handleMapInitializationError(error: unknown, callbacks: MapInitializationCallbacks): void {
	const errorMessage = error instanceof Error ? error.message : 'Failed to load Google Maps';
	callbacks.onError(errorMessage);
	callbacks.onLoadingChange(false);
}

/**
 * Initializes the map instance asynchronously
 */
async function initializeMapAsync(
	params: InitializeMapParams,
	callbacks: MapInitializationCallbacks,
	isMountedRef: { current: boolean }
): Promise<void> {
	try {
		callbacks.onLoadingChange(true);

		const result = await initializeMapInstance(params);

		if (!isMountedRef.current) {
			return;
		}

		handleMapInitializationSuccess(result, callbacks);
	} catch (error) {
		if (isMountedRef.current) {
			handleMapInitializationError(error, callbacks);
		}
	}
}

/**
 * Builds initialization parameters from effect params
 */
function buildInitializationParams(
	params: UseMapInitializationEffectParams,
	mapElement: HTMLDivElement
): InitializeMapParams {
	return {
		resolvedApiKey: params.resolvedApiKey,
		libraries: params.libraries,
		options: params.options,
		mapElement,
		onMapReady: params.onMapReady,
		onBoundsChanged: params.onBoundsChanged,
		onCenterChanged: params.onCenterChanged,
		onZoomChanged: params.onZoomChanged,
		onMapClick: params.onMapClick,
	};
}

/**
 * Sets up the map initialization effect
 */
function setupMapInitializationEffect(params: UseMapInitializationEffectParams): () => void {
	if (!shouldInitializeMap(params.resolvedApiKey, params.mapElementRef)) {
		return () => {
			// No cleanup needed
		};
	}

	const isMountedRef = { current: true };
	const mapElement = params.mapElementRef.current;

	if (!mapElement) {
		return () => {
			// No cleanup needed
		};
	}

	const callbacks: MapInitializationCallbacks = {
		onSuccess: params.onSuccess,
		onError: params.onError,
		onLoadingChange: params.onLoadingChange,
	};

	const initializationParams = buildInitializationParams(params, mapElement);

	initializeMapAsync(initializationParams, callbacks, isMountedRef).catch(() => {
		// Error handling is done in initializeMapAsync
	});

	return () => {
		isMountedRef.current = false;
	};
}

/**
 * Effect hook to handle map initialization
 */
export function useMapInitializationEffect(params: UseMapInitializationEffectParams): void {
	const memoizedParams = useMemo(
		() => ({
			resolvedApiKey: params.resolvedApiKey,
			libraries: params.libraries,
			options: params.options,
			mapElementRef: params.mapElementRef,
			onMapReady: params.onMapReady,
			onBoundsChanged: params.onBoundsChanged,
			onCenterChanged: params.onCenterChanged,
			onZoomChanged: params.onZoomChanged,
			onMapClick: params.onMapClick,
			onSuccess: params.onSuccess,
			onError: params.onError,
			onLoadingChange: params.onLoadingChange,
		}),
		[
			params.resolvedApiKey,
			params.libraries,
			params.options,
			params.mapElementRef,
			params.onMapReady,
			params.onBoundsChanged,
			params.onCenterChanged,
			params.onZoomChanged,
			params.onMapClick,
			params.onSuccess,
			params.onError,
			params.onLoadingChange,
		]
	);

	useEffect(() => {
		return setupMapInitializationEffect(memoizedParams);
	}, [memoizedParams]);
}
