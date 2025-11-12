import type { MapProps } from '@src-types/ui/maps';
import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface MapErrorProps extends HTMLAttributes<HTMLDivElement> {
	error: string;
	errorFallback?: MapProps['errorFallback'];
	height: string;
	width: string;
}

/**
 * Error state component for map
 */
export function MapError({
	error,
	errorFallback,
	height,
	width,
	className,
	...props
}: Readonly<MapErrorProps>) {
	return (
		<div
			className={twMerge(
				'flex items-center justify-center bg-gray-100 dark:bg-gray-800',
				className
			)}
			style={{ height, width }}
			{...props}
		>
			{errorFallback ?? (
				<div className="text-center p-4">
					<p className="text-red-600 dark:text-red-400">Error loading map</p>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{error}</p>
				</div>
			)}
		</div>
	);
}
