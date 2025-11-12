import type { VideoProps } from '@src-types/ui/feedback';
import type { CSSProperties, ReactNode, SyntheticEvent } from 'react';

import type { VideoDimension } from './video.styles';

export interface UseVideoLifecycleParams {
	src: VideoProps['src'];
	fallbackSrc?: VideoProps['fallbackSrc'] | undefined;
	onCanPlay?: VideoProps['onCanPlay'] | undefined;
	onLoadedData?: VideoProps['onLoadedData'] | undefined;
	onError?: VideoProps['onError'] | undefined;
}

export interface VideoLifecycleState {
	isLoading: boolean;
	hasError: boolean;
	src: VideoProps['src'];
	handleCanPlay: () => void;
	handleLoadedData: () => void;
	handleError: (event: SyntheticEvent<HTMLVideoElement>) => void;
}

export interface VideoConfig {
	lifecycle: UseVideoLifecycleParams;
	render: RenderVideoProps;
}

export type ForwardedVideoProps = Omit<
	Readonly<VideoProps>,
	| 'src'
	| 'poster'
	| 'controls'
	| 'autoplay'
	| 'loop'
	| 'muted'
	| 'preload'
	| 'fallbackSrc'
	| 'loadingPlaceholder'
	| 'errorPlaceholder'
	| 'onError'
	| 'onCanPlay'
	| 'onLoadedData'
	| 'width'
	| 'height'
	| 'objectFit'
	| 'showSkeleton'
	| 'showSpinner'
	| 'className'
	| 'style'
	| 'tracks'
>;

export interface RenderVideoProps {
	autoplay?: boolean | undefined;
	className?: string | undefined;
	controls: boolean;
	errorPlaceholder?: ReactNode | undefined;
	fallbackSrc?: VideoProps['fallbackSrc'] | undefined;
	height?: VideoDimension | undefined;
	loadingPlaceholder?: ReactNode | undefined;
	loop?: boolean | undefined;
	muted?: boolean | undefined;
	objectFit: NonNullable<VideoProps['objectFit']>;
	poster?: string | undefined;
	preload: NonNullable<VideoProps['preload']>;
	showSkeleton: boolean;
	showSpinner: boolean;
	style?: CSSProperties | undefined;
	tracks?: VideoProps['tracks'];
	width?: VideoDimension | undefined;
	rest: ForwardedVideoProps;
}

export type RenderVideoParams = RenderVideoProps & VideoLifecycleState & { src: VideoProps['src'] };

export interface RenderReadyVideoParams extends RenderVideoProps {
	handleCanPlay: VideoLifecycleState['handleCanPlay'];
	handleError: VideoLifecycleState['handleError'];
	handleLoadedData: VideoLifecycleState['handleLoadedData'];
	isLoading: boolean;
	src: VideoProps['src'];
}
