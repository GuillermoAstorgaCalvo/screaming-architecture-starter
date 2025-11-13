import type { ImageClassParams, ImageStyleParams } from '@core/ui/media/image/types/image.types';
import type { CSSProperties } from 'react';

export function createImageClasses({ isLoading, className }: ImageClassParams): string {
	return ['transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100', className]
		.filter(Boolean)
		.join(' ');
}

export function createImageStyle({
	width,
	height,
	objectFit,
	style,
}: ImageStyleParams): CSSProperties {
	return {
		width,
		height,
		objectFit,
		...style,
	};
}
