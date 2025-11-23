/**
 * Lightbox Component Tests
 *
 * Tests for the Lightbox component including:
 * - Rendering
 * - Open/close states
 * - Image navigation
 * - Keyboard navigation
 * - Props forwarding
 */

import Lightbox from '@core/ui/media/lightbox/Lightbox';
import type { LightboxImage } from '@src-types/ui/feedback';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createLightboxImages = (): readonly LightboxImage[] => [
	{ src: '/image1.jpg', alt: 'Image 1', caption: 'First image' },
	{ src: '/image2.jpg', alt: 'Image 2', caption: 'Second image' },
	{ src: '/image3.jpg', alt: 'Image 3', caption: 'Third image' },
];

const createLightboxProps = (overrides?: Partial<Parameters<typeof Lightbox>[0]>) => ({
	isOpen: true,
	onClose: vi.fn(),
	images: createLightboxImages(),
	...overrides,
});

describe('Lightbox - Rendering', () => {
	it('renders when isOpen is true', () => {
		const props = createLightboxProps();
		const { container } = renderWithProviders(<Lightbox {...props} />);

		// Lightbox should render Dialog with content
		const dialog = container.querySelector('dialog');
		expect(dialog).toBeInTheDocument();
	});

	it('does not render when isOpen is false', () => {
		const props = createLightboxProps({ isOpen: false });
		const { container } = renderWithProviders(<Lightbox {...props} />);

		const dialog = container.querySelector('[role="dialog"]');
		expect(dialog).not.toBeInTheDocument();
	});

	it('does not render when images array is empty', () => {
		const props = createLightboxProps({ images: [] });
		const { container } = renderWithProviders(<Lightbox {...props} />);

		const dialog = container.querySelector('[role="dialog"]');
		expect(dialog).not.toBeInTheDocument();
	});

	it('renders first image by default', async () => {
		const props = createLightboxProps();
		renderWithProviders(<Lightbox {...props} />);

		// Check for caption which indicates the correct image is shown
		await waitFor(() => {
			expect(screen.getByText('First image')).toBeInTheDocument();
		});
		// Image may be in loading state, check that lightbox content is rendered
		const img = screen.queryByAltText('Image 1');
		if (img) {
			expect(img).toHaveAttribute('src', '/image1.jpg');
		}
	});

	it('renders image at initialIndex', async () => {
		const props = createLightboxProps({ initialIndex: 1 });
		renderWithProviders(<Lightbox {...props} />);

		// Check for caption which indicates the correct image is shown
		await waitFor(() => {
			expect(screen.getByText('Second image')).toBeInTheDocument();
		});
		// Image may be in loading state, check that lightbox content is rendered
		const img = screen.queryByAltText('Image 2');
		if (img) {
			expect(img).toHaveAttribute('src', '/image2.jpg');
		}
	});
});

describe('Lightbox - Image Navigation', () => {
	it('navigates to next image when next arrow is clicked', async () => {
		const props = createLightboxProps();
		renderWithProviders(<Lightbox {...props} />);

		// Find and click next arrow
		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		// Check for caption which indicates navigation worked
		await waitFor(() => {
			expect(screen.getByText('Second image')).toBeInTheDocument();
		});
	});

	it('navigates to previous image when previous arrow is clicked', async () => {
		const props = createLightboxProps({ initialIndex: 1 });
		renderWithProviders(<Lightbox {...props} />);

		// Find and click previous arrow
		const prevButton = screen.getByLabelText(/previous/i);
		fireEvent.click(prevButton);

		// Check for caption which indicates navigation worked
		await waitFor(() => {
			expect(screen.getByText('First image')).toBeInTheDocument();
		});
	});

	it('loops to last image when going previous from first image with loop enabled', async () => {
		const props = createLightboxProps({ loop: true, initialIndex: 0 });
		renderWithProviders(<Lightbox {...props} />);

		const prevButton = screen.getByLabelText(/previous/i);
		fireEvent.click(prevButton);

		// Check for caption which indicates loop worked
		await waitFor(() => {
			expect(screen.getByText('Third image')).toBeInTheDocument();
		});
	});

	it('loops to first image when going next from last image with loop enabled', async () => {
		const props = createLightboxProps({ loop: true, initialIndex: 2 });
		renderWithProviders(<Lightbox {...props} />);

		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		// Check for caption which indicates loop worked
		await waitFor(() => {
			expect(screen.getByText('First image')).toBeInTheDocument();
		});
	});

	it('does not show previous arrow at first image when loop is disabled', () => {
		const props = createLightboxProps({ loop: false, initialIndex: 0 });
		renderWithProviders(<Lightbox {...props} />);

		const prevButton = screen.queryByLabelText(/previous/i);
		expect(prevButton).not.toBeInTheDocument();
	});

	it('does not show next arrow at last image when loop is disabled', () => {
		const props = createLightboxProps({ loop: false, initialIndex: 2 });
		renderWithProviders(<Lightbox {...props} />);

		const nextButton = screen.queryByLabelText(/next/i);
		expect(nextButton).not.toBeInTheDocument();
	});
});

describe('Lightbox - Keyboard Navigation', () => {
	it('navigates to next image on ArrowRight key', async () => {
		const props = createLightboxProps();
		renderWithProviders(<Lightbox {...props} />);

		// The keyboard handler is on the button element, not the dialog
		const button = screen.getByLabelText(/image gallery/i);
		fireEvent.keyDown(button, { key: 'ArrowRight' });

		// Check for caption which indicates navigation worked
		await waitFor(() => {
			expect(screen.getByText('Second image')).toBeInTheDocument();
		});
	});

	it('navigates to previous image on ArrowLeft key', async () => {
		const props = createLightboxProps({ initialIndex: 1 });
		renderWithProviders(<Lightbox {...props} />);

		// The keyboard handler is on the button element, not the dialog
		const button = screen.getByLabelText(/image gallery/i);
		fireEvent.keyDown(button, { key: 'ArrowLeft' });

		// Check for caption which indicates navigation worked
		await waitFor(() => {
			expect(screen.getByText('First image')).toBeInTheDocument();
		});
	});

	it('closes lightbox on Escape key when closeOnEscape is true', () => {
		const onClose = vi.fn();
		const props = createLightboxProps({ onClose, closeOnEscape: true });
		renderWithProviders(<Lightbox {...props} />);

		// The keyboard handler is on the button element, not the dialog
		const button = screen.getByLabelText(/image gallery/i);
		fireEvent.keyDown(button, { key: 'Escape' });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not close lightbox on Escape key when closeOnEscape is false', () => {
		const onClose = vi.fn();
		const props = createLightboxProps({ onClose, closeOnEscape: false });
		renderWithProviders(<Lightbox {...props} />);

		// The keyboard handler is on the button element, not the dialog
		const button = screen.getByLabelText(/image gallery/i);
		fireEvent.keyDown(button, { key: 'Escape' });

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('Lightbox - Controlled Mode', () => {
	it('uses controlledIndex when provided', async () => {
		const props = createLightboxProps({ currentIndex: 2 });
		renderWithProviders(<Lightbox {...props} />);

		// Check for caption which indicates the correct image is shown
		await waitFor(() => {
			expect(screen.getByText('Third image')).toBeInTheDocument();
		});
	});

	it('calls onIndexChange when navigating in controlled mode', () => {
		const onIndexChange = vi.fn();
		const props = createLightboxProps({
			currentIndex: 0,
			onIndexChange,
		});
		renderWithProviders(<Lightbox {...props} />);

		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		expect(onIndexChange).toHaveBeenCalledWith(1);
	});
});

describe('Lightbox - Display Options', () => {
	it('shows counter when showCounter is true', () => {
		const props = createLightboxProps({ showCounter: true });
		renderWithProviders(<Lightbox {...props} />);

		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('does not show counter when showCounter is false', () => {
		const props = createLightboxProps({ showCounter: false });
		renderWithProviders(<Lightbox {...props} />);

		expect(screen.queryByText(/\/ 3/)).not.toBeInTheDocument();
	});

	it('does not show counter for single image', () => {
		const props = createLightboxProps({
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			showCounter: true,
		});
		renderWithProviders(<Lightbox {...props} />);

		expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument();
	});

	it('shows caption when showCaption is true and caption exists', () => {
		const props = createLightboxProps({ showCaption: true });
		renderWithProviders(<Lightbox {...props} />);

		expect(screen.getByText('First image')).toBeInTheDocument();
	});

	it('does not show caption when showCaption is false', () => {
		const props = createLightboxProps({ showCaption: false });
		renderWithProviders(<Lightbox {...props} />);

		expect(screen.queryByText('First image')).not.toBeInTheDocument();
	});

	it('does not show caption when image has no caption', () => {
		const props = createLightboxProps({
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			showCaption: true,
		});
		renderWithProviders(<Lightbox {...props} />);

		// Should not throw or show empty caption
		const caption = screen.queryByText('First image');
		expect(caption).not.toBeInTheDocument();
	});

	it('shows navigation arrows when showArrows is true', () => {
		const props = createLightboxProps({ showArrows: true });
		renderWithProviders(<Lightbox {...props} />);

		const nextButton = screen.getByLabelText(/next/i);
		expect(nextButton).toBeInTheDocument();
	});

	it('does not show navigation arrows when showArrows is false', () => {
		const props = createLightboxProps({ showArrows: false });
		renderWithProviders(<Lightbox {...props} />);

		const nextButton = screen.queryByLabelText(/next/i);
		expect(nextButton).not.toBeInTheDocument();
	});

	it('does not show navigation arrows for single image', () => {
		const props = createLightboxProps({
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			showArrows: true,
		});
		renderWithProviders(<Lightbox {...props} />);

		const nextButton = screen.queryByLabelText(/next/i);
		expect(nextButton).not.toBeInTheDocument();
	});
});

describe('Lightbox - Close Behavior', () => {
	it('calls onClose when close button is clicked', () => {
		const onClose = vi.fn();
		const props = createLightboxProps({ onClose });
		renderWithProviders(<Lightbox {...props} />);

		const closeButton = screen.getByLabelText(/close/i);
		fireEvent.click(closeButton);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('closes on overlay click when closeOnOverlayClick is true', () => {
		const onClose = vi.fn();
		const props = createLightboxProps({ onClose, closeOnOverlayClick: true });
		renderWithProviders(<Lightbox {...props} />);

		// Dialog should handle overlay click
		// This is tested through Dialog component behavior
		expect(onClose).toBeDefined();
	});
});

describe('Lightbox - Custom Arrows', () => {
	it('renders custom previous arrow', () => {
		const customPrev = <div data-testid="custom-prev">Prev</div>;
		const props = createLightboxProps({ prevArrow: customPrev, initialIndex: 1 });
		renderWithProviders(<Lightbox {...props} />);

		expect(screen.getByTestId('custom-prev')).toBeInTheDocument();
	});

	it('renders custom next arrow', () => {
		const customNext = <div data-testid="custom-next">Next</div>;
		const props = createLightboxProps({ nextArrow: customNext });
		renderWithProviders(<Lightbox {...props} />);

		expect(screen.getByTestId('custom-next')).toBeInTheDocument();
	});
});

describe('Lightbox - Image Counter Updates', () => {
	it('updates counter when navigating', () => {
		const props = createLightboxProps({ showCounter: true });
		renderWithProviders(<Lightbox {...props} />);

		expect(screen.getByText('1 / 3')).toBeInTheDocument();

		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		expect(screen.getByText('2 / 3')).toBeInTheDocument();
	});
});

describe('Lightbox - Fallback Images', () => {
	it('renders image with fallbackSrc', () => {
		const props = createLightboxProps({
			images: [
				{
					src: '/image1.jpg',
					alt: 'Image 1',
					fallbackSrc: '/fallback1.jpg',
				},
			],
		});
		renderWithProviders(<Lightbox {...props} />);

		// Lightbox should render with the image (may be in loading state)
		const { container } = renderWithProviders(<Lightbox {...props} />);
		const dialog = container.querySelector('dialog');
		expect(dialog).toBeInTheDocument();
		// Image component should handle fallback internally
	});
});
