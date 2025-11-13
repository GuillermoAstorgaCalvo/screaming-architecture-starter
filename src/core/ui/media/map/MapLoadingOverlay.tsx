import Spinner from '@core/ui/spinner/Spinner';
import type { ReactNode } from 'react';

interface MapLoadingOverlayProps {
	isLoading: boolean;
	loadingFallback?: ReactNode;
}

/**
 * Loading overlay component for map
 */
export function MapLoadingOverlay({
	isLoading,
	loadingFallback,
}: Readonly<MapLoadingOverlayProps>) {
	if (!isLoading) {
		return null;
	}

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-75">
			{loadingFallback ?? <Spinner size="lg" />}
		</div>
	);
}
