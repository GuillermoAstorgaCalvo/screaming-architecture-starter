import type { MapProps } from '@src-types/ui/maps';
import type { HTMLAttributes, ReactElement, RefObject } from 'react';

import { MapContainer } from './MapContainer';
import { MapError } from './MapError';

interface MapRenderParams {
	error: string | null;
	errorFallback?: MapProps['errorFallback'];
	isLoading: boolean;
	loadingFallback?: MapProps['loadingFallback'];
	mapRef: RefObject<HTMLDivElement | null>;
	height: string;
	width: string;
	className?: string | undefined;
	props: HTMLAttributes<HTMLDivElement>;
}

/**
 * Function to determine what to render based on map state
 */
export function renderMap({
	error,
	errorFallback,
	isLoading,
	loadingFallback,
	mapRef,
	height,
	width,
	className,
	props,
}: MapRenderParams): ReactElement {
	if (error) {
		return (
			<MapError
				error={error}
				errorFallback={errorFallback}
				height={height}
				width={width}
				className={className}
				{...props}
			/>
		);
	}

	return (
		<MapContainer
			mapRef={mapRef}
			isLoading={isLoading}
			loadingFallback={loadingFallback}
			height={height}
			width={width}
			className={className}
			{...props}
		/>
	);
}
