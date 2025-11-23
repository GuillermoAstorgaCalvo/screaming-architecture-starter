/**
 * Image Render Helper Tests
 *
 * Tests for the image render helper functions including:
 * - renderImage function
 * - Error placeholder rendering
 * - Loading placeholder rendering
 * - Ready image rendering
 */

import { renderImage } from '@core/ui/media/image/helpers/image.render';
import type { RenderImageParams } from '@core/ui/media/image/types/image.types';
import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('renderImage', () => {
	it('renders error placeholder when hasError is true and no fallback', () => {
		const params: RenderImageParams = {
			hasError: true,
			isLoading: false,
			src: '/test.jpg',
			alt: 'Test',
			errorPlaceholder: <div data-testid="error">Error</div>,
			fallbackSrc: undefined,
			lazy: true,
			objectFit: 'cover',
			showSkeleton: false,
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		expect(container.querySelector('[data-testid="error"]')).toBeInTheDocument();
	});

	it('does not render error placeholder when fallbackSrc is provided', () => {
		const params: RenderImageParams = {
			hasError: true,
			isLoading: false,
			src: '/test.jpg',
			alt: 'Test',
			errorPlaceholder: <div data-testid="error">Error</div>,
			fallbackSrc: '/fallback.jpg',
			lazy: true,
			objectFit: 'cover',
			showSkeleton: false,
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		expect(container.querySelector('[data-testid="error"]')).not.toBeInTheDocument();
	});

	it('renders skeleton when isLoading is true and showSkeleton is true', () => {
		const params: RenderImageParams = {
			hasError: false,
			isLoading: true,
			src: '/test.jpg',
			alt: 'Test',
			showSkeleton: true,
			lazy: true,
			objectFit: 'cover',
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		// Skeleton component is rendered, check that something is rendered
		expect(container.firstChild).toBeInTheDocument();
		// img should not be visible when skeleton is shown
		const img = container.querySelector('img');
		expect(img).not.toBeInTheDocument();
	});

	it('renders custom loading placeholder when isLoading is true and loadingPlaceholder is provided', () => {
		const params: RenderImageParams = {
			hasError: false,
			isLoading: true,
			src: '/test.jpg',
			alt: 'Test',
			showSkeleton: false,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
			lazy: true,
			objectFit: 'cover',
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		expect(container.querySelector('[data-testid="loading"]')).toBeInTheDocument();
	});

	it('prioritizes skeleton over custom loading placeholder', () => {
		const params: RenderImageParams = {
			hasError: false,
			isLoading: true,
			src: '/test.jpg',
			alt: 'Test',
			showSkeleton: true,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
			lazy: true,
			objectFit: 'cover',
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		// Skeleton component is rendered, check that something is rendered
		expect(container.firstChild).toBeInTheDocument();
		// Custom loading placeholder should not be shown when skeleton is prioritized
		expect(container.querySelector('[data-testid="loading"]')).not.toBeInTheDocument();
	});

	it('renders ready image when not loading and no error', () => {
		const params: RenderImageParams = {
			hasError: false,
			isLoading: false,
			src: '/test.jpg',
			alt: 'Test',
			lazy: true,
			objectFit: 'cover',
			showSkeleton: false,
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		const img = container.querySelector('img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', '/test.jpg');
		expect(img).toHaveAttribute('alt', 'Test');
	});

	it('renders img element with correct attributes', () => {
		const handleLoad = vi.fn();
		const handleError = vi.fn();
		const params: RenderImageParams = {
			hasError: false,
			isLoading: false,
			src: '/test.jpg',
			alt: 'Test image',
			lazy: true,
			objectFit: 'cover',
			showSkeleton: false,
			handleLoad,
			handleError,
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		const img = container.querySelector('img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', '/test.jpg');
		expect(img).toHaveAttribute('alt', 'Test image');
		expect(img).toHaveAttribute('loading', 'lazy');
	});

	it('renders with eager loading when lazy is false', () => {
		const params: RenderImageParams = {
			hasError: false,
			isLoading: false,
			src: '/test.jpg',
			alt: 'Test image',
			lazy: false,
			objectFit: 'cover',
			showSkeleton: false,
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		const img = container.querySelector('img');
		expect(img).toHaveAttribute('loading', 'eager');
	});

	it('calls handleLoad when image loads', () => {
		const handleLoad = vi.fn();
		const params: RenderImageParams = {
			hasError: false,
			isLoading: false,
			src: '/test.jpg',
			alt: 'Test image',
			lazy: true,
			objectFit: 'cover',
			showSkeleton: false,
			handleLoad,
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		const img = container.querySelector('img') as HTMLImageElement;
		fireEvent.load(img);

		expect(handleLoad).toHaveBeenCalledTimes(1);
	});

	it('calls handleError when image fails to load', () => {
		const handleError = vi.fn();
		const params: RenderImageParams = {
			hasError: false,
			isLoading: false,
			src: '/test.jpg',
			alt: 'Test image',
			lazy: true,
			objectFit: 'cover',
			showSkeleton: false,
			handleLoad: vi.fn(),
			handleError,
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		const img = container.querySelector('img') as HTMLImageElement;
		fireEvent.error(img);

		expect(handleError).toHaveBeenCalledTimes(1);
	});

	it('applies className with loading state', () => {
		const params: RenderImageParams = {
			hasError: false,
			isLoading: true,
			src: '/test.jpg',
			alt: 'Test image',
			lazy: true,
			objectFit: 'cover',
			showSkeleton: false,
			className: 'custom-class',
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		const img = container.querySelector('img');
		expect(img).toHaveClass('custom-class');
		expect(img).toHaveClass('opacity-0');
	});

	it('applies style with width, height, and objectFit', () => {
		const params: RenderImageParams = {
			hasError: false,
			isLoading: false,
			src: '/test.jpg',
			alt: 'Test image',
			lazy: true,
			objectFit: 'contain',
			width: 400,
			height: 300,
			showSkeleton: false,
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {},
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		const img = container.querySelector('img');
		expect(img).toHaveStyle({
			width: '400px',
			height: '300px',
			objectFit: 'contain',
		});
	});

	it('forwards additional props from rest', () => {
		const params: RenderImageParams = {
			hasError: false,
			isLoading: false,
			src: '/test.jpg',
			alt: 'Test image',
			lazy: true,
			objectFit: 'cover',
			showSkeleton: false,
			handleLoad: vi.fn(),
			handleError: vi.fn(),
			rest: {
				'data-testid': 'custom-image',
				'data-custom': 'value',
			} as Record<string, unknown>,
		};

		const { container } = renderWithProviders(<>{renderImage(params)}</>);
		const img = container.querySelector('img');
		expect(img).toHaveAttribute('data-testid', 'custom-image');
		expect(img).toHaveAttribute('data-custom', 'value');
	});
});
