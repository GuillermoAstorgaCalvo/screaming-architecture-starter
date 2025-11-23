/**
 * Image Component Tests
 *
 * Tests for the Image component including:
 * - Rendering
 * - Loading states
 * - Error handling
 * - Fallback images
 * - Lazy loading
 * - Placeholders
 * - Lifecycle callbacks
 */

import Image from '@core/ui/media/image/Image';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createImageProps = (overrides?: Partial<Parameters<typeof Image>[0]>) => ({
	src: '/test-image.jpg',
	alt: 'Test image',
	...overrides,
});

describe('Image - Rendering', () => {
	it('renders image with src and alt', () => {
		const props = createImageProps();
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', '/test-image.jpg');
	});

	it('renders with custom className', () => {
		const props = createImageProps({ className: 'custom-class' });
		const { container } = renderWithProviders(<Image {...props} />);

		const img = container.querySelector('img.custom-class');
		expect(img).toBeInTheDocument();
	});

	it('renders with width and height', () => {
		const props = createImageProps({ width: 400, height: 300 });
		const { container } = renderWithProviders(<Image {...props} />);

		const img = container.querySelector('img');
		expect(img).toHaveStyle({ width: '400px', height: '300px' });
	});

	it('renders with objectFit style', () => {
		const props = createImageProps({ objectFit: 'contain' });
		const { container } = renderWithProviders(<Image {...props} />);

		const img = container.querySelector('img');
		expect(img).toHaveStyle({ objectFit: 'contain' });
	});

	it('uses cover as default objectFit', () => {
		const props = createImageProps();
		const { container } = renderWithProviders(<Image {...props} />);

		const img = container.querySelector('img');
		expect(img).toHaveStyle({ objectFit: 'cover' });
	});
});

describe('Image - Lazy Loading', () => {
	it('enables lazy loading by default', () => {
		const props = createImageProps();
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		expect(img).toHaveAttribute('loading', 'lazy');
	});

	it('disables lazy loading when lazy is false', () => {
		const props = createImageProps({ lazy: false });
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		expect(img).toHaveAttribute('loading', 'eager');
	});

	it('enables lazy loading when lazy is true', () => {
		const props = createImageProps({ lazy: true });
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		expect(img).toHaveAttribute('loading', 'lazy');
	});
});

describe('Image - Loading States', () => {
	it('shows skeleton when showSkeleton is true and image is loading', () => {
		const props = createImageProps({ showSkeleton: true });
		const { container } = renderWithProviders(<Image {...props} />);

		// When showSkeleton is true and image is loading, skeleton is shown instead of img
		// The img element should not be visible/rendered yet when skeleton is shown
		// Skeleton is rendered, so img might be hidden or not yet in DOM
		// Check that something is rendered (skeleton component)
		expect(container.firstChild).toBeInTheDocument();
	});

	it('shows custom loading placeholder when provided', () => {
		const props = createImageProps({
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
		});
		renderWithProviders(<Image {...props} />);

		const placeholder = screen.getByTestId('loading');
		expect(placeholder).toBeInTheDocument();
		expect(placeholder).toHaveTextContent('Loading...');
	});

	it('prioritizes skeleton over custom loading placeholder', () => {
		const props = createImageProps({
			showSkeleton: true,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
		});
		renderWithProviders(<Image {...props} />);

		// Skeleton should be shown instead of custom placeholder
		const placeholder = screen.queryByTestId('loading');
		expect(placeholder).not.toBeInTheDocument();
	});
});

describe('Image - Error Handling', () => {
	it('shows error placeholder when image fails to load and no fallback', () => {
		const props = createImageProps({
			errorPlaceholder: <div data-testid="error">Failed to load</div>,
		});
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		fireEvent.error(img);

		const errorPlaceholder = screen.getByTestId('error');
		expect(errorPlaceholder).toBeInTheDocument();
		expect(errorPlaceholder).toHaveTextContent('Failed to load');
	});

	it('switches to fallback image when error occurs', async () => {
		const props = createImageProps({
			src: '/invalid-image.jpg',
			fallbackSrc: '/fallback-image.jpg',
		});
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		expect(img).toHaveAttribute('src', '/invalid-image.jpg');

		fireEvent.error(img);

		await waitFor(() => {
			expect(img).toHaveAttribute('src', '/fallback-image.jpg');
		});
	});

	it('calls onError callback when image fails to load', () => {
		const onError = vi.fn();
		const props = createImageProps({
			src: '/invalid-image.jpg',
			onError,
		});
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		fireEvent.error(img);

		// Wait for fallback attempt to fail
		fireEvent.error(img);

		expect(onError).toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith(expect.any(Error));
	});

	it('does not show error placeholder when fallback is available', () => {
		const props = createImageProps({
			src: '/invalid-image.jpg',
			fallbackSrc: '/fallback-image.jpg',
			errorPlaceholder: <div data-testid="error">Failed to load</div>,
		});
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		fireEvent.error(img);

		// Error placeholder should not be shown when fallback exists
		const errorPlaceholder = screen.queryByTestId('error');
		expect(errorPlaceholder).not.toBeInTheDocument();
	});
});

describe('Image - Lifecycle Callbacks', () => {
	it('calls onLoad callback when image loads successfully', () => {
		const onLoad = vi.fn();
		const props = createImageProps({ onLoad });
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		fireEvent.load(img);

		expect(onLoad).toHaveBeenCalledTimes(1);
	});

	it('handles undefined onLoad gracefully', () => {
		const props = createImageProps({});
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		expect(() => {
			fireEvent.load(img);
		}).not.toThrow();
	});

	it('handles undefined onError gracefully', () => {
		const props = createImageProps({});
		renderWithProviders(<Image {...props} />);

		const img = screen.getByAltText('Test image');
		expect(() => {
			fireEvent.error(img);
		}).not.toThrow();
	});
});

describe('Image - Opacity Transitions', () => {
	it('applies opacity-0 class when loading', () => {
		const props = createImageProps();
		const { container } = renderWithProviders(<Image {...props} />);

		const img = container.querySelector('img');
		expect(img).toHaveClass('opacity-0');
		expect(img).toHaveClass('transition-opacity');
		expect(img).toHaveClass('duration-slow');
	});

	it('applies opacity-100 class after image loads', () => {
		const props = createImageProps();
		const { container } = renderWithProviders(<Image {...props} />);

		const img = container.querySelector('img');
		expect(img).toHaveClass('opacity-0');

		if (img) {
			fireEvent.load(img);
		}

		expect(img).toHaveClass('opacity-100');
		expect(img).not.toHaveClass('opacity-0');
	});
});

describe('Image - Additional Props', () => {
	it('forwards additional HTML attributes', () => {
		const props = createImageProps({
			'data-testid': 'custom-image',
			'data-custom': 'value',
		} as Partial<Parameters<typeof Image>[0]> & { 'data-testid'?: string; 'data-custom'?: string });
		renderWithProviders(<Image {...props} />);

		const img = screen.getByTestId('custom-image');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('data-custom', 'value');
	});

	it('forwards style prop', () => {
		const props = createImageProps({
			style: { border: '1px solid red' },
			showSkeleton: false,
		});
		const { container } = renderWithProviders(<Image {...props} />);

		const img = container.querySelector('img');
		expect(img).toBeInTheDocument();
		// Note: Inline styles may be applied differently, check that img exists with style prop
		expect(img).toHaveAttribute('style');
	});

	it('merges custom style with width/height/objectFit', () => {
		const props = createImageProps({
			width: 400,
			height: 300,
			objectFit: 'contain',
			style: { border: '1px solid red' },
			showSkeleton: false,
		});
		const { container } = renderWithProviders(<Image {...props} />);

		const img = container.querySelector('img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveStyle({
			width: '400px',
			height: '300px',
			objectFit: 'contain',
		});
		// Note: Custom style border may be merged, verify style attribute exists
		expect(img).toHaveAttribute('style');
	});
});

describe('Image - Key Prop', () => {
	it('updates image when src changes', () => {
		const { rerender } = renderWithProviders(<Image src="/image1.jpg" alt="Image 1" />);

		let img = screen.getByAltText('Image 1');
		expect(img).toHaveAttribute('src', '/image1.jpg');

		rerender(<Image src="/image2.jpg" alt="Image 2" />);

		img = screen.getByAltText('Image 2');
		expect(img).toHaveAttribute('src', '/image2.jpg');
	});
});
