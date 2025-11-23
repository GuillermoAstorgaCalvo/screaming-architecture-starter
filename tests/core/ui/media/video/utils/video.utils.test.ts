/**
 * Video Utils Tests
 *
 * Tests for the video utility functions including:
 * - getVideoSrcString
 */

import { getVideoSrcString } from '@core/ui/media/video/utils/video.utils';
import { describe, expect, it } from 'vitest';

describe('getVideoSrcString', () => {
	it('returns string src as-is', () => {
		const src = '/test-video.mp4';
		expect(getVideoSrcString(src)).toBe('/test-video.mp4');
	});

	it('returns first source src from array', () => {
		const src = [
			{ src: '/test-video.webm', type: 'video/webm' },
			{ src: '/test-video.mp4', type: 'video/mp4' },
		];
		expect(getVideoSrcString(src)).toBe('/test-video.webm');
	});

	it('returns "unknown" when array is empty', () => {
		const src: Array<{ src: string; type?: string }> = [];
		expect(getVideoSrcString(src)).toBe('unknown');
	});

	it('returns "unknown" when first source has no src', () => {
		const src = [
			{ src: '', type: 'video/webm' },
			{ src: '/test-video.mp4', type: 'video/mp4' },
		];
		expect(getVideoSrcString(src)).toBe('');
	});

	it('handles array with single source', () => {
		const src = [{ src: '/test-video.mp4', type: 'video/mp4' }];
		expect(getVideoSrcString(src)).toBe('/test-video.mp4');
	});

	it('handles array with sources without type', () => {
		const src = [{ src: '/test-video.webm' }, { src: '/test-video.mp4' }];
		expect(getVideoSrcString(src)).toBe('/test-video.webm');
	});
});
