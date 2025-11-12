import type { CSSProperties } from 'react';

import type { ImageClassParams, ImageStyleParams } from './image.types';

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
