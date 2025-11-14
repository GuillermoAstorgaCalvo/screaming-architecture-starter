import type { VideoProps } from '@src-types/ui/feedback';
import type { CSSProperties } from 'react';

export type VideoDimension = number | string;

interface VideoClassParams {
	className?: string | undefined;
	isLoading: boolean;
}

interface VideoStyleParams {
	height?: VideoDimension | undefined;
	objectFit: NonNullable<VideoProps['objectFit']>;
	style?: CSSProperties | undefined;
	width?: VideoDimension | undefined;
}

export function createVideoClasses({ isLoading, className }: VideoClassParams): string {
	return ['transition-opacity duration-slow', isLoading ? 'opacity-0' : 'opacity-100', className]
		.filter(Boolean)
		.join(' ');
}

export function createVideoStyle({
	width,
	height,
	objectFit,
	style,
}: VideoStyleParams): CSSProperties {
	return {
		width,
		height,
		objectFit,
		...style,
	};
}
