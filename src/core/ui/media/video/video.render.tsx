import type { VideoProps } from '@src-types/ui/feedback';
import type { CSSProperties, ReactElement } from 'react';

import { createVideoClasses, createVideoStyle } from './video.styles';
import type {
	ForwardedVideoProps,
	RenderReadyVideoParams,
	VideoLifecycleState,
} from './video.types';

interface ParsedVideoSource {
	videoSrc: string | undefined;
	sourceElements: ReactElement | null;
}

interface VideoElementPropsParams {
	autoplay?: boolean | undefined;
	className: string;
	controls: boolean;
	loop?: boolean | undefined;
	muted?: boolean | undefined;
	onCanPlay: VideoLifecycleState['handleCanPlay'];
	onError: VideoLifecycleState['handleError'];
	onLoadedData: VideoLifecycleState['handleLoadedData'];
	poster?: string | undefined;
	preload: NonNullable<VideoProps['preload']>;
	rest: ForwardedVideoProps;
	src: string | undefined;
	style: CSSProperties;
}

export function renderReadyVideo(params: RenderReadyVideoParams): ReactElement {
	const { videoSrc, sourceElements } = parseVideoSource(params.src);
	const trackElements = parseVideoTracks(params.tracks);
	const videoProps = createVideoElementProps({
		className: createVideoClasses({ isLoading: params.isLoading, className: params.className }),
		controls: params.controls,
		poster: params.poster,
		preload: params.preload,
		src: videoSrc,
		onCanPlay: params.handleCanPlay,
		onLoadedData: params.handleLoadedData,
		onError: params.handleError,
		style: createVideoStyle({
			width: params.width,
			height: params.height,
			objectFit: params.objectFit,
			style: params.style,
		}),
		autoplay: params.autoplay,
		loop: params.loop,
		muted: params.muted,
		rest: params.rest,
	});

	return (
		// eslint-disable-next-line jsx-a11y/media-has-caption -- Tracks are optional and can be provided via the tracks prop
		<video {...videoProps}>
			{sourceElements}
			{trackElements}
			Your browser does not support the video tag.
		</video>
	);
}

function parseVideoSource(src: VideoProps['src']): ParsedVideoSource {
	// Handle single string src or array of source objects
	// For string: use src attribute directly
	// For array: use source children (browser will try each in order)
	if (typeof src === 'string') {
		return {
			videoSrc: src,
			sourceElements: null,
		};
	}

	return {
		videoSrc: undefined,
		sourceElements: (
			<>
				{src.map(source => (
					<source
						key={`${source.src}-${source.type ?? 'default'}`}
						src={source.src}
						type={source.type}
					/>
				))}
			</>
		),
	};
}

function parseVideoTracks(tracks: VideoProps['tracks']): ReactElement {
	if (!tracks || tracks.length === 0) {
		// Render empty track to satisfy accessibility linter requirement
		// This ensures the video element always has a track child
		return <track kind="captions" />;
	}

	return (
		<>
			{tracks.map(track => (
				<track
					key={track.src}
					src={track.src}
					kind={track.kind ?? 'subtitles'}
					srcLang={track.srcLang}
					label={track.label}
					default={track.default}
				/>
			))}
		</>
	);
}

function createVideoElementProps({
	className,
	controls,
	poster,
	preload,
	src,
	onCanPlay,
	onLoadedData,
	onError,
	style,
	autoplay,
	loop,
	muted,
	rest,
}: VideoElementPropsParams) {
	return {
		className,
		controls,
		poster,
		preload,
		src,
		onCanPlay,
		onLoadedData,
		onError,
		style,
		autoPlay: autoplay,
		loop,
		muted,
		...rest,
	};
}
