/**
 * Video Helpers Tests
 *
 * Tests for the video helper functions including:
 * - renderVideo function
 * - Error placeholder rendering
 * - Loading placeholder rendering
 * - Ready video rendering
 */

import { renderVideo } from '@core/ui/media/video/helpers/video.helpers';
import type { RenderVideoParams } from '@core/ui/media/video/types/video.types';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('renderVideo', () => {
	it('renders error placeholder when hasError is true and no fallback', () => {
		const params: RenderVideoParams = {
			hasError: true,
			isLoading: false,
			src: '/test.mp4',
			errorPlaceholder: <div data-testid="error">Error</div>,
			fallbackSrc: undefined,
			controls: true,
			objectFit: 'contain',
			preload: 'metadata',
			showSkeleton: false,
			showSpinner: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderVideo(params)}</>);
		expect(container.querySelector('[data-testid="error"]')).toBeInTheDocument();
	});

	it('does not render error placeholder when fallbackSrc is provided', () => {
		const params: RenderVideoParams = {
			hasError: true,
			isLoading: false,
			src: '/test.mp4',
			errorPlaceholder: <div data-testid="error">Error</div>,
			fallbackSrc: '/fallback.mp4',
			controls: true,
			objectFit: 'contain',
			preload: 'metadata',
			showSkeleton: false,
			showSpinner: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderVideo(params)}</>);
		expect(container.querySelector('[data-testid="error"]')).not.toBeInTheDocument();
	});

	it('renders skeleton when isLoading is true and showSkeleton is true', () => {
		const params: RenderVideoParams = {
			hasError: false,
			isLoading: true,
			src: '/test.mp4',
			showSkeleton: true,
			controls: true,
			objectFit: 'contain',
			preload: 'metadata',
			showSpinner: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderVideo(params)}</>);
		expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
	});

	it('renders custom loading placeholder when isLoading is true and loadingPlaceholder is provided', () => {
		const params: RenderVideoParams = {
			hasError: false,
			isLoading: true,
			src: '/test.mp4',
			showSkeleton: false,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
			controls: true,
			objectFit: 'contain',
			preload: 'metadata',
			showSpinner: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderVideo(params)}</>);
		expect(container.querySelector('[data-testid="loading"]')).toBeInTheDocument();
	});

	it('prioritizes skeleton over custom loading placeholder', () => {
		const params: RenderVideoParams = {
			hasError: false,
			isLoading: true,
			src: '/test.mp4',
			showSkeleton: true,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
			controls: true,
			objectFit: 'contain',
			preload: 'metadata',
			showSpinner: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderVideo(params)}</>);
		expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
		expect(container.querySelector('[data-testid="loading"]')).not.toBeInTheDocument();
	});

	it('renders spinner when isLoading is true and showSpinner is true', () => {
		const params: RenderVideoParams = {
			hasError: false,
			isLoading: true,
			src: '/test.mp4',
			showSkeleton: false,
			controls: true,
			objectFit: 'contain',
			preload: 'metadata',
			showSpinner: true,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderVideo(params)}</>);
		// Spinner should be rendered
		const spinnerContainer = container.querySelector('.flex.items-center.justify-center');
		expect(spinnerContainer).toBeInTheDocument();
	});

	it('renders ready video when not loading and no error', () => {
		const params: RenderVideoParams = {
			hasError: false,
			isLoading: false,
			src: '/test.mp4',
			controls: true,
			objectFit: 'contain',
			preload: 'metadata',
			showSkeleton: false,
			showSpinner: false,
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderVideo(params)}</>);
		const video = container.querySelector('video');
		expect(video).toBeInTheDocument();
		expect(video).toHaveAttribute('src', '/test.mp4');
	});

	it('does not render placeholder when video is ready', () => {
		const params: RenderVideoParams = {
			hasError: false,
			isLoading: false,
			src: '/test.mp4',
			showSkeleton: true,
			showSpinner: true,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
			controls: true,
			objectFit: 'contain',
			preload: 'metadata',
			handleCanPlay: vi.fn(),
			handleLoadedData: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderVideo(params)}</>);
		expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
		expect(container.querySelector('[data-testid="loading"]')).not.toBeInTheDocument();
		const video = container.querySelector('video');
		expect(video).toBeInTheDocument();
	});
});
