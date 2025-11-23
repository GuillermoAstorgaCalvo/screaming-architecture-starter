/**
 * Video Render Tests
 *
 * Tests for the video render helper functions including:
 * - renderReadyVideo
 * - parseVideoSource
 * - parseVideoTracks
 * - createVideoElementProps
 */

import { renderReadyVideo } from '@core/ui/media/video/helpers/video.render';
import type { RenderReadyVideoParams } from '@core/ui/media/video/types/video.types';
import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('renderReadyVideo', () => {
	it('renders video element with string src', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toBeInTheDocument();
		expect(video).toHaveAttribute('src', '/test-video.mp4');
	});

	it('renders video element with multiple sources', () => {
		const params: RenderReadyVideoParams = {
			src: [
				{ src: '/test-video.webm', type: 'video/webm' },
				{ src: '/test-video.mp4', type: 'video/mp4' },
			],
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toBeInTheDocument();
		expect(video).not.toHaveAttribute('src');

		const sources = container.querySelectorAll('source');
		expect(sources).toHaveLength(2);
		expect(sources[0]).toHaveAttribute('src', '/test-video.webm');
		expect(sources[0]).toHaveAttribute('type', 'video/webm');
		expect(sources[1]).toHaveAttribute('src', '/test-video.mp4');
		expect(sources[1]).toHaveAttribute('type', 'video/mp4');
	});

	it('renders video with poster', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			poster: '/poster.jpg',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toHaveAttribute('poster', '/poster.jpg');
	});

	it('renders video with controls', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toHaveAttribute('controls');
	});

	it('renders video without controls', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: false,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).not.toHaveAttribute('controls');
	});

	it('renders video with autoplay', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			autoplay: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toHaveAttribute('autoPlay');
	});

	it('renders video with loop', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			loop: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toHaveAttribute('loop');
	});

	it('renders video with muted', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			muted: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video') as HTMLVideoElement;
		expect(video.muted).toBe(true);
	});

	it('renders video with preload attribute', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'auto',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toHaveAttribute('preload', 'auto');
	});

	it('renders video with tracks', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			tracks: [
				{ src: '/subtitles.vtt', kind: 'subtitles', srcLang: 'en', label: 'English' },
				{ src: '/captions.vtt', kind: 'captions', srcLang: 'en', label: 'English' },
			],
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const tracks = container.querySelectorAll('track');
		expect(tracks).toHaveLength(2);
		expect(tracks[0]).toHaveAttribute('src', '/subtitles.vtt');
		expect(tracks[0]).toHaveAttribute('kind', 'subtitles');
		expect(tracks[0]).toHaveAttribute('srcLang', 'en');
		expect(tracks[0]).toHaveAttribute('label', 'English');
		expect(tracks[1]).toHaveAttribute('src', '/captions.vtt');
		expect(tracks[1]).toHaveAttribute('kind', 'captions');
	});

	it('renders empty track when no tracks provided', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const tracks = container.querySelectorAll('track');
		expect(tracks).toHaveLength(1);
		expect(tracks[0]).toHaveAttribute('kind', 'captions');
	});

	it('renders video with className including loading state', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: true,
			className: 'custom-class',
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toHaveClass('custom-class');
		expect(video).toHaveClass('opacity-0');
	});

	it('renders video with style including width, height, and objectFit', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'cover',
			width: 800,
			height: 600,
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toHaveStyle({
			width: '800px',
			height: '600px',
			objectFit: 'cover',
		});
	});

	it('renders video with custom style merged', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			style: { border: '1px solid red' },
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video') as HTMLVideoElement;
		expect(video.style.objectFit).toBe('contain');
		expect(video.style.border).toBe('1px solid red');
	});

	it('calls handleCanPlay when video can play', () => {
		const handleCanPlay = vi.fn();
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay,
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video') as HTMLVideoElement;
		fireEvent.canPlay(video);

		expect(handleCanPlay).toHaveBeenCalledTimes(1);
	});

	it('calls handleLoadedData when video metadata loads', () => {
		const handleLoadedData = vi.fn();
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData,
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video') as HTMLVideoElement;
		fireEvent.loadedData(video);

		expect(handleLoadedData).toHaveBeenCalledTimes(1);
	});

	it('calls handleError when video fails to load', () => {
		const handleError = vi.fn();
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError,
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video') as HTMLVideoElement;
		fireEvent.error(video);

		expect(handleError).toHaveBeenCalledTimes(1);
	});

	it('forwards additional props from rest', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {
				'data-testid': 'custom-video',
				'data-custom': 'value',
			} as Record<string, unknown>,
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toHaveAttribute('data-testid', 'custom-video');
		expect(video).toHaveAttribute('data-custom', 'value');
	});

	it('renders fallback text for unsupported browsers', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toHaveTextContent('Your browser does not support the video tag.');
	});

	it('handles sources without type attribute', () => {
		const params: RenderReadyVideoParams = {
			src: [{ src: '/test-video.webm' }, { src: '/test-video.mp4', type: 'video/mp4' }],
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const sources = container.querySelectorAll('source');
		expect(sources).toHaveLength(2);
		expect(sources[0]).toHaveAttribute('src', '/test-video.webm');
		expect(sources[0]).not.toHaveAttribute('type');
		expect(sources[1]).toHaveAttribute('src', '/test-video.mp4');
		expect(sources[1]).toHaveAttribute('type', 'video/mp4');
	});

	it('handles tracks with default kind', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			tracks: [{ src: '/subtitles.vtt', srcLang: 'en' }],
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const tracks = container.querySelectorAll('track');
		expect(tracks).toHaveLength(1);
		expect(tracks[0]).toHaveAttribute('kind', 'subtitles');
	});

	it('handles tracks with default attribute', () => {
		const params: RenderReadyVideoParams = {
			src: '/test-video.mp4',
			controls: true,
			preload: 'metadata',
			objectFit: 'contain',
			showSkeleton: false,
			showSpinner: false,
			isLoading: false,
			tracks: [{ src: '/subtitles.vtt', kind: 'subtitles', default: true }],
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderReadyVideo(params)}</>);
		const tracks = container.querySelectorAll('track');
		expect(tracks).toHaveLength(1);
		expect(tracks[0]).toHaveAttribute('default');
	});
});
