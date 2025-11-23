import { useTranslation } from '@core/i18n/useTranslation';
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
	const { t } = useTranslation('common');
	return (
		<div
			className={twMerge('flex items-center justify-center bg-surface dark:bg-surface', className)}
			style={{ height, width }}
			{...props}
		>
			{errorFallback ?? (
				<div className="text-center p-4">
					<p className="text-destructive">{t('errors.failedToLoadMap')}</p>
					<p className="text-sm text-text-secondary mt-2">{error}</p>
				</div>
			)}
		</div>
	);
}
