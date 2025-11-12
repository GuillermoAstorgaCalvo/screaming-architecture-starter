import type { MapProps } from '@src-types/ui/maps';
import type { HTMLAttributes, RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

import { MapLoadingOverlay } from './MapLoadingOverlay';

interface MapContainerProps extends HTMLAttributes<HTMLDivElement> {
	mapRef: RefObject<HTMLDivElement | null>;
	isLoading: boolean;
	loadingFallback?: MapProps['loadingFallback'];
	height: string;
	width: string;
}

/**
 * Container component for the map element
 */
export function MapContainer({
	mapRef,
	isLoading,
	loadingFallback,
	height,
	width,
	className,
	...props
}: Readonly<MapContainerProps>) {
	return (
		<div className={twMerge('relative', className)} style={{ height, width }} {...props}>
			<div ref={mapRef} className="h-full w-full" />
			<MapLoadingOverlay isLoading={isLoading} loadingFallback={loadingFallback} />
		</div>
	);
}
