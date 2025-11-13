import type { ImageProps } from '@src-types/ui/feedback';
import type { CSSProperties, ReactNode, SyntheticEvent } from 'react';

export interface UseImageLifecycleParams {
	src: string;
	fallbackSrc?: ImageProps['fallbackSrc'] | undefined;
	onLoad?: ImageProps['onLoad'] | undefined;
	onError?: ImageProps['onError'] | undefined;
}

export interface ImageLifecycleState {
	isLoading: boolean;
	hasError: boolean;
	src: string;
	handleLoad: () => void;
	handleError: (event: SyntheticEvent<HTMLImageElement>) => void;
}

export interface ImageConfig {
	lifecycle: UseImageLifecycleParams;
	render: RenderImageProps;
}

export type ImageDimension = number | string;

export type ForwardedImageProps = Omit<
	Readonly<ImageProps>,
	| 'src'
	| 'alt'
	| 'fallbackSrc'
	| 'lazy'
	| 'loadingPlaceholder'
	| 'errorPlaceholder'
	| 'onError'
	| 'onLoad'
	| 'width'
	| 'height'
	| 'objectFit'
	| 'showSkeleton'
	| 'className'
	| 'style'
>;

export interface RenderImageProps {
	alt: string;
	className?: string | undefined;
	errorPlaceholder?: ReactNode | undefined;
	fallbackSrc?: string | undefined;
	height?: ImageDimension | undefined;
	lazy: boolean;
	loadingPlaceholder?: ReactNode | undefined;
	objectFit: NonNullable<ImageProps['objectFit']>;
	showSkeleton: boolean;
	style?: CSSProperties | undefined;
	width?: ImageDimension | undefined;
	rest: ForwardedImageProps;
}

export type RenderImageParams = RenderImageProps & ImageLifecycleState;

export interface RenderReadyImageParams {
	alt: string;
	className?: string | undefined;
	handleError: ImageLifecycleState['handleError'];
	handleLoad: ImageLifecycleState['handleLoad'];
	isLoading: boolean;
	lazy: boolean;
	objectFit: NonNullable<ImageProps['objectFit']>;
	src: string;
	style?: CSSProperties | undefined;
	width?: ImageDimension | undefined;
	height?: ImageDimension | undefined;
	rest: ForwardedImageProps;
}

export interface LoadingPlaceholderParams {
	isLoading: boolean;
	showSkeleton: boolean;
	className?: string | undefined;
	width?: ImageDimension | undefined;
	height?: ImageDimension | undefined;
	loadingPlaceholder?: ReactNode | undefined;
}

export interface ImageClassParams {
	isLoading: boolean;
	className?: string | undefined;
}

export interface ImageStyleParams {
	width?: ImageDimension | undefined;
	height?: ImageDimension | undefined;
	objectFit: NonNullable<ImageProps['objectFit']>;
	style?: CSSProperties | undefined;
}
