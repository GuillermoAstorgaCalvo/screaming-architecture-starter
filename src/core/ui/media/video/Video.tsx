import { getVideoConfig } from '@core/ui/media/video/helpers/video.config';
import { renderVideo } from '@core/ui/media/video/helpers/video.helpers';
import { useVideoLifecycle } from '@core/ui/media/video/hooks/useVideoLifecycle';
import type { VideoProps } from '@src-types/ui/feedback';
import type { ReactElement } from 'react';

/**
 * Video - Video player component with controls, loading states, and error handling
 *
 * Features:
 * - Loading states with spinner or skeleton
 * - Error handling with custom error placeholders
 * - Support for single or multiple video sources
 * - Poster image support
 * - Full control over video attributes (autoplay, loop, muted, etc.)
 * - Accessible video player
 *
 * @example
 * ```tsx
 * <Video
 *   src="/video.mp4"
 *   poster="/poster.jpg"
 *   controls
 *   showSpinner
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Video
 *   src={[
 *     { src: "/video.webm", type: "video/webm" },
 *     { src: "/video.mp4", type: "video/mp4" }
 *   ]}
 *   controls
 *   autoplay
 *   muted
 *   loop
 * />
 * ```
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <Video
 *     src="/video.mp4"
 *     controls
 *     className="h-full w-full"
 *   />
 * </AspectRatio>
 * ```
 */
export default function Video(props: Readonly<VideoProps>) {
	return (
		<VideoView key={typeof props.src === 'string' ? props.src : props.src[0]?.src} {...props} />
	);
}

function VideoView(props: Readonly<VideoProps>): ReactElement {
	const { lifecycle, render } = getVideoConfig(props);
	const lifecycleState = useVideoLifecycle(lifecycle);
	return renderVideo({ ...render, ...lifecycleState });
}
