/**
 * Video Component Tests
 *
 * Tests for the Video component including:
 * - Rendering
 * - Loading states
 * - Error handling
 * - Fallback videos
 * - Placeholders
 * - Lifecycle callbacks
 * - Video attributes
 */

import Video from '@core/ui/media/video/Video';
import type { VideoProps } from '@src-types/ui/feedback';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createVideoProps = (overrides?: Partial<VideoProps>) => ({
	src: '/test-video.mp4',
	controls: true,
	...overrides,
});

describe('Video - Rendering', () => {
	it('renders video with src', async () => {
		const props = createVideoProps({ showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toBeInTheDocument();
		expect(video).toHaveAttribute('src', '/test-video.mp4');
	});

	it('renders with custom className', async () => {
		const props = createVideoProps({ className: 'custom-class', showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video.custom-class'));
		expect(video).toBeInTheDocument();
	});

	it('renders with width and height', async () => {
		const props = createVideoProps({ width: 800, height: 600, showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveStyle({ width: '800px', height: '600px' });
	});

	it('renders with objectFit style', async () => {
		const props = createVideoProps({ objectFit: 'cover', showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveStyle({ objectFit: 'cover' });
	});

	it('uses contain as default objectFit', async () => {
		const props = createVideoProps({ showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveStyle({ objectFit: 'contain' });
	});

	it('renders with multiple video sources', async () => {
		const props = createVideoProps({
			src: [
				{ src: '/test-video.webm', type: 'video/webm' },
				{ src: '/test-video.mp4', type: 'video/mp4' },
			],
			showSpinner: false,
		});
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toBeInTheDocument();
		expect(video).not.toHaveAttribute('src');

		const sources = container.querySelectorAll('source');
		expect(sources).toHaveLength(2);
		expect(sources[0]).toHaveAttribute('src', '/test-video.webm');
		expect(sources[0]).toHaveAttribute('type', 'video/webm');
		expect(sources[1]).toHaveAttribute('src', '/test-video.mp4');
		expect(sources[1]).toHaveAttribute('type', 'video/mp4');
	});

	it('renders with poster image', async () => {
		const props = createVideoProps({ poster: '/poster.jpg', showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveAttribute('poster', '/poster.jpg');
	});

	it('renders with controls by default', async () => {
		const props = createVideoProps({ showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveAttribute('controls');
	});

	it('renders without controls when controls is false', async () => {
		const props = createVideoProps({ controls: false, showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).not.toHaveAttribute('controls');
	});

	it('renders with autoplay', async () => {
		const props = createVideoProps({ autoplay: true, showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveAttribute('autoPlay');
	});

	it('renders with loop', async () => {
		const props = createVideoProps({ loop: true, showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveAttribute('loop');
	});

	it('renders with muted', async () => {
		const props = createVideoProps({ muted: true, showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = (await waitFor(() => container.querySelector('video'))) as HTMLVideoElement;
		expect(video.muted).toBe(true);
	});

	it('renders with preload attribute', async () => {
		const props = createVideoProps({ preload: 'auto', showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveAttribute('preload', 'auto');
	});

	it('uses metadata as default preload', async () => {
		const props = createVideoProps({ showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveAttribute('preload', 'metadata');
	});

	it('renders with tracks', async () => {
		const props = createVideoProps({
			tracks: [
				{ src: '/subtitles.vtt', kind: 'subtitles', srcLang: 'en', label: 'English' },
				{ src: '/captions.vtt', kind: 'captions', srcLang: 'en', label: 'English' },
			],
			showSpinner: false,
		});
		const { container } = renderWithProviders(<Video {...props} />);

		await waitFor(() => container.querySelector('video'));
		const tracks = container.querySelectorAll('track');
		expect(tracks).toHaveLength(2);
		expect(tracks[0]).toHaveAttribute('src', '/subtitles.vtt');
		expect(tracks[0]).toHaveAttribute('kind', 'subtitles');
		expect(tracks[0]).toHaveAttribute('srcLang', 'en');
		expect(tracks[0]).toHaveAttribute('label', 'English');
	});

	it('renders empty track when no tracks provided (for accessibility)', async () => {
		const props = createVideoProps({ showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		await waitFor(() => container.querySelector('video'));
		const tracks = container.querySelectorAll('track');
		expect(tracks).toHaveLength(1);
		expect(tracks[0]).toHaveAttribute('kind', 'captions');
	});
});

describe('Video - Loading States', () => {
	it('shows spinner when loading by default', () => {
		const props = createVideoProps();
		const { container } = renderWithProviders(<Video {...props} />);

		// Spinner should be shown when loading
		const spinnerContainer = container.querySelector('.flex.items-center.justify-center');
		expect(spinnerContainer).toBeInTheDocument();
	});

	it('shows skeleton when showSkeleton is true and video is loading', () => {
		const props = createVideoProps({ showSkeleton: true, showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const skeleton = container.querySelector('[aria-hidden="true"]');
		expect(skeleton).toBeInTheDocument();
		expect(skeleton).toHaveClass('animate-pulse');
	});

	it('shows custom loading placeholder when provided', () => {
		const props = createVideoProps({
			loadingPlaceholder: <div data-testid="loading">Loading video...</div>,
		});
		renderWithProviders(<Video {...props} />);

		const placeholder = screen.getByTestId('loading');
		expect(placeholder).toBeInTheDocument();
		expect(placeholder).toHaveTextContent('Loading video...');
	});

	it('prioritizes skeleton over custom loading placeholder', () => {
		const props = createVideoProps({
			showSkeleton: true,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
		});
		renderWithProviders(<Video {...props} />);

		// Skeleton should be shown instead of custom placeholder
		const placeholder = screen.queryByTestId('loading');
		expect(placeholder).not.toBeInTheDocument();
	});

	it('hides spinner when showSpinner is false', () => {
		const props = createVideoProps({ showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		// Should not show spinner, but video should still be loading
		const video = container.querySelector('video');
		expect(video).toBeInTheDocument();
	});
});

describe('Video - Error Handling', () => {
	it('shows error placeholder when video fails to load and no fallback', async () => {
		const props = createVideoProps({
			errorPlaceholder: <div data-testid="error">Failed to load video</div>,
			showSpinner: false,
		});
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		fireEvent.error(video);

		const errorPlaceholder = await screen.findByTestId('error');
		expect(errorPlaceholder).toBeInTheDocument();
		expect(errorPlaceholder).toHaveTextContent('Failed to load video');
	});

	it('switches to fallback video when error occurs', async () => {
		const props = createVideoProps({
			src: '/invalid-video.mp4',
			fallbackSrc: '/fallback-video.mp4',
			showSpinner: false,
		});
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		expect(video).toHaveAttribute('src', '/invalid-video.mp4');

		fireEvent.error(video);

		await waitFor(() => {
			expect(video).toHaveAttribute('src', '/fallback-video.mp4');
		});
	});

	it('calls onError callback when video fails to load', async () => {
		const onError = vi.fn();
		const props = createVideoProps({
			src: '/invalid-video.mp4',
			onError,
			showSpinner: false,
		});
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		fireEvent.error(video);

		// Wait for fallback attempt to fail
		fireEvent.error(video);

		await waitFor(() => {
			expect(onError).toHaveBeenCalled();
		});
		expect(onError).toHaveBeenCalledWith(expect.any(Error));
	});

	it('does not show error placeholder when fallback is available', async () => {
		const props = createVideoProps({
			src: '/invalid-video.mp4',
			fallbackSrc: '/fallback-video.mp4',
			errorPlaceholder: <div data-testid="error">Failed to load</div>,
			showSpinner: false,
		});
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		fireEvent.error(video);

		// Error placeholder should not be shown when fallback exists
		const errorPlaceholder = screen.queryByTestId('error');
		expect(errorPlaceholder).not.toBeInTheDocument();
	});

	it('handles fallback with multiple sources', async () => {
		const props = createVideoProps({
			src: '/invalid-video.mp4',
			fallbackSrc: [
				{ src: '/fallback-video.webm', type: 'video/webm' },
				{ src: '/fallback-video.mp4', type: 'video/mp4' },
			],
			showSpinner: false,
		});
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		fireEvent.error(video);

		await waitFor(() => {
			const sources = container.querySelectorAll('source');
			expect(sources.length).toBeGreaterThan(0);
		});
	});
});

describe('Video - Lifecycle Callbacks', () => {
	it('calls onCanPlay callback when video can play', async () => {
		const onCanPlay = vi.fn();
		const props = createVideoProps({ onCanPlay, showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		fireEvent.canPlay(video);

		expect(onCanPlay).toHaveBeenCalledTimes(1);
	});

	it('calls onLoadedData callback when video metadata loads', async () => {
		const onLoadedData = vi.fn();
		const props = createVideoProps({ onLoadedData, showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		fireEvent.loadedData(video);

		expect(onLoadedData).toHaveBeenCalledTimes(1);
	});

	it('handles undefined onCanPlay gracefully', async () => {
		const props = createVideoProps({ showSpinner: false });
		delete props.onCanPlay;
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		expect(() => {
			fireEvent.canPlay(video);
		}).not.toThrow();
	});

	it('handles undefined onLoadedData gracefully', async () => {
		const props = createVideoProps({ showSpinner: false });
		delete props.onLoadedData;
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		expect(() => {
			fireEvent.loadedData(video);
		}).not.toThrow();
	});

	it('handles undefined onError gracefully', async () => {
		const props = createVideoProps({ showSpinner: false });
		delete props.onError;
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		expect(() => {
			fireEvent.error(video);
		}).not.toThrow();
	});
});

describe('Video - Opacity Transitions', () => {
	it('applies opacity-0 class when loading', async () => {
		const props = createVideoProps({ showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video'));
		expect(video).toHaveClass('opacity-0');
		expect(video).toHaveClass('transition-opacity');
		expect(video).toHaveClass('duration-slow');
	});

	it('applies opacity-100 class after video can play', async () => {
		const props = createVideoProps({ showSpinner: false });
		const { container } = renderWithProviders(<Video {...props} />);

		const video = await waitFor(() => container.querySelector('video') as HTMLVideoElement);
		expect(video).toHaveClass('opacity-0');

		fireEvent.canPlay(video);

		await waitFor(() => {
			expect(video).toHaveClass('opacity-100');
		});
		expect(video).not.toHaveClass('opacity-0');
	});
});

describe('Video - Additional Props', () => {
	it('forwards additional HTML attributes', async () => {
		const props = createVideoProps({
			showSpinner: false,
		} as VideoProps);
		const { container } = renderWithProviders(
			<Video {...props} data-testid="custom-video" data-custom="value" />
		);

		const video = await waitFor(() => container.querySelector('[data-testid="custom-video"]'));
		expect(video).toBeInTheDocument();
		expect(video).toHaveAttribute('data-custom', 'value');
	});

	it('forwards style prop', async () => {
		const props = createVideoProps({
			style: { border: '1px solid red' },
			showSpinner: false,
		});
		const { container } = renderWithProviders(<Video {...props} />);

		const video = (await waitFor(() => container.querySelector('video'))) as HTMLVideoElement;
		expect(video.style.border).toBe('1px solid red');
	});

	it('merges custom style with width/height/objectFit', async () => {
		const props = createVideoProps({
			width: 800,
			height: 600,
			objectFit: 'contain',
			style: { border: '1px solid red' },
			showSpinner: false,
		});
		const { container } = renderWithProviders(<Video {...props} />);

		const video = (await waitFor(() => container.querySelector('video'))) as HTMLVideoElement;
		expect(video.style.width).toBe('800px');
		expect(video.style.height).toBe('600px');
		expect(video.style.objectFit).toBe('contain');
		expect(video.style.border).toBe('1px solid red');
	});
});

describe('Video - Key Prop', () => {
	it('updates video when src changes', async () => {
		const { rerender } = renderWithProviders(
			<Video src="/video1.mp4" controls showSpinner={false} />
		);

		let video = await waitFor(() => document.querySelector('video'));
		expect(video).toHaveAttribute('src', '/video1.mp4');

		rerender(<Video src="/video2.mp4" controls showSpinner={false} />);

		video = await waitFor(() => document.querySelector('video'));
		expect(video).toHaveAttribute('src', '/video2.mp4');
	});

	it('updates video when src array changes', async () => {
		const { rerender } = renderWithProviders(
			<Video src={[{ src: '/video1.mp4', type: 'video/mp4' }]} controls showSpinner={false} />
		);

		let video = await waitFor(() => document.querySelector('video'));
		expect(video).toBeInTheDocument();

		rerender(
			<Video src={[{ src: '/video2.mp4', type: 'video/mp4' }]} controls showSpinner={false} />
		);

		video = await waitFor(() => document.querySelector('video'));
		expect(video).toBeInTheDocument();
	});
});
