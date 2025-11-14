import type { VideoProps } from '@src-types/ui/feedback';

/**
 * Converts a video source (string or array) to a string representation
 * for error messages and logging
 */
export function getVideoSrcString(src: VideoProps['src']): string {
	return typeof src === 'string' ? src : (src[0]?.src ?? 'unknown');
}
