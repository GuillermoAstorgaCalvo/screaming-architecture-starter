/**
 * Lightbox Helpers Tests
 *
 * Tests for Lightbox helper functions including:
 * - extractLightboxProps
 * - buildLightboxContent
 * - buildLightboxNavigation
 * - buildDialogProps
 */

import {
	buildDialogProps,
	buildLightboxContent,
	buildLightboxNavigation,
	extractLightboxProps,
} from '@core/ui/media/lightbox/helpers/Lightbox.helpers';
import type { LightboxProps } from '@src-types/ui/feedback';
import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('extractLightboxProps', () => {
	it('extracts base props correctly', () => {
		const props: LightboxProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
		};

		const extracted = extractLightboxProps(props);

		expect(extracted.isOpen).toBe(true);
		expect(extracted.onClose).toBe(props.onClose);
		expect(extracted.images).toEqual(props.images);
	});

	it('uses default values for optional props', () => {
		const props: LightboxProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
		};

		const extracted = extractLightboxProps(props);

		expect(extracted.initialIndex).toBe(0);
		expect(extracted.loop).toBe(false);
		expect(extracted.showArrows).toBe(true);
		expect(extracted.showCounter).toBe(true);
		expect(extracted.showCaption).toBe(true);
		expect(extracted.closeOnOverlayClick).toBe(true);
		expect(extracted.closeOnEscape).toBe(true);
	});

	it('uses provided values for optional props', () => {
		const props: LightboxProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			initialIndex: 2,
			loop: true,
			showArrows: false,
			showCounter: false,
			showCaption: false,
			closeOnOverlayClick: false,
			closeOnEscape: false,
		};

		const extracted = extractLightboxProps(props);

		expect(extracted.initialIndex).toBe(2);
		expect(extracted.loop).toBe(true);
		expect(extracted.showArrows).toBe(false);
		expect(extracted.showCounter).toBe(false);
		expect(extracted.showCaption).toBe(false);
		expect(extracted.closeOnOverlayClick).toBe(false);
		expect(extracted.closeOnEscape).toBe(false);
	});

	it('extracts controlledIndex when currentIndex is provided', () => {
		const props: LightboxProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			currentIndex: 1,
		};

		const extracted = extractLightboxProps(props);

		expect(extracted.controlledIndex).toBe(1);
	});

	it('extracts undefined controlledIndex when currentIndex is not provided', () => {
		const props: LightboxProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
		};

		const extracted = extractLightboxProps(props);

		expect(extracted.controlledIndex).toBeUndefined();
	});

	it('extracts custom arrows', () => {
		const prevArrow = <div data-testid="prev">Prev</div>;
		const nextArrow = <div data-testid="next">Next</div>;
		const props: LightboxProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			prevArrow,
			nextArrow,
		};

		const extracted = extractLightboxProps(props);

		expect(extracted.prevArrow).toBe(prevArrow);
		expect(extracted.nextArrow).toBe(nextArrow);
	});

	it('extracts className and lightboxId', () => {
		const props: LightboxProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			className: 'custom-class',
			lightboxId: 'custom-id',
		};

		const extracted = extractLightboxProps(props);

		expect(extracted.className).toBe('custom-class');
		expect(extracted.lightboxId).toBe('custom-id');
	});
});

describe('buildLightboxNavigation', () => {
	it('renders navigation arrows when conditions are met', () => {
		const extractedProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			controlledIndex: undefined,
			initialIndex: 0,
			loop: false,
			onIndexChange: undefined,
			showArrows: true,
			showCounter: true,
			showCaption: true,
			closeOnOverlayClick: true,
			closeOnEscape: true,
			prevArrow: undefined,
			nextArrow: undefined,
			className: undefined,
			lightboxId: undefined,
		};

		const navigation = buildLightboxNavigation({
			extractedProps,
			hasMultipleImages: true,
			canGoPrevious: true,
			canGoNext: true,
			goToPrevious: vi.fn(),
			goToNext: vi.fn(),
		});

		const { container } = renderWithProviders(<>{navigation}</>);
		expect(container.querySelector('button[aria-label*="previous" i]')).toBeInTheDocument();
		expect(container.querySelector('button[aria-label*="next" i]')).toBeInTheDocument();
	});
});

describe('buildLightboxContent', () => {
	it('returns null when currentImage is undefined', () => {
		const extractedProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			controlledIndex: undefined,
			initialIndex: 0,
			loop: false,
			onIndexChange: undefined,
			showArrows: true,
			showCounter: true,
			showCaption: true,
			closeOnOverlayClick: true,
			closeOnEscape: true,
			prevArrow: undefined,
			nextArrow: undefined,
			className: undefined,
			lightboxId: undefined,
		};

		const content = buildLightboxContent({
			extractedProps,
			currentIndex: 10, // Invalid index
			totalImages: 1,
			goToPrevious: vi.fn(),
			goToNext: vi.fn(),
			handleKeyDown: vi.fn(),
		});

		expect(content).toBeNull();
	});

	it('renders lightbox content with image', () => {
		const extractedProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1', caption: 'First' }],
			controlledIndex: undefined,
			initialIndex: 0,
			loop: false,
			onIndexChange: undefined,
			showArrows: true,
			showCounter: true,
			showCaption: true,
			closeOnOverlayClick: true,
			closeOnEscape: true,
			prevArrow: undefined,
			nextArrow: undefined,
			className: undefined,
			lightboxId: undefined,
		};

		const content = buildLightboxContent({
			extractedProps,
			currentIndex: 0,
			totalImages: 1,
			goToPrevious: vi.fn(),
			goToNext: vi.fn(),
			handleKeyDown: vi.fn(),
		});

		const { container } = renderWithProviders(<>{content}</>);
		// Image may be in loading state, check that content is rendered
		expect(container.firstChild).toBeInTheDocument();
		// Check for caption which indicates correct image
		expect(container.textContent).toContain('First');
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		const extractedProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			controlledIndex: undefined,
			initialIndex: 0,
			loop: false,
			onIndexChange: undefined,
			showArrows: true,
			showCounter: true,
			showCaption: true,
			closeOnOverlayClick: true,
			closeOnEscape: true,
			prevArrow: undefined,
			nextArrow: undefined,
			className: undefined,
			lightboxId: undefined,
		};

		const content = buildLightboxContent({
			extractedProps,
			currentIndex: 0,
			totalImages: 1,
			goToPrevious: vi.fn(),
			goToNext: vi.fn(),
			handleKeyDown,
		});

		const { container } = renderWithProviders(<>{content}</>);
		const button = container.querySelector('button');
		expect(button).toBeInTheDocument();

		if (button) {
			fireEvent.keyDown(button, { key: 'ArrowRight' });
			expect(handleKeyDown).toHaveBeenCalled();
		}
	});

	it('calculates canGoPrevious and canGoNext correctly with loop', () => {
		const extractedProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [
				{ src: '/image1.jpg', alt: 'Image 1' },
				{ src: '/image2.jpg', alt: 'Image 2' },
			],
			controlledIndex: undefined,
			initialIndex: 0,
			loop: true,
			onIndexChange: undefined,
			showArrows: true,
			showCounter: true,
			showCaption: true,
			closeOnOverlayClick: true,
			closeOnEscape: true,
			prevArrow: undefined,
			nextArrow: undefined,
			className: undefined,
			lightboxId: undefined,
		};

		const content = buildLightboxContent({
			extractedProps,
			currentIndex: 0,
			totalImages: 2,
			goToPrevious: vi.fn(),
			goToNext: vi.fn(),
			handleKeyDown: vi.fn(),
		});

		const { container } = renderWithProviders(<>{content}</>);
		// With loop, both arrows should be visible
		expect(container.querySelector('button[aria-label*="previous" i]')).toBeInTheDocument();
		expect(container.querySelector('button[aria-label*="next" i]')).toBeInTheDocument();
	});
});

describe('buildDialogProps', () => {
	it('builds dialog props with correct defaults', () => {
		const extractedProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			controlledIndex: undefined,
			initialIndex: 0,
			loop: false,
			onIndexChange: undefined,
			showArrows: true,
			showCounter: true,
			showCaption: true,
			closeOnOverlayClick: true,
			closeOnEscape: true,
			prevArrow: undefined,
			nextArrow: undefined,
			className: undefined,
			lightboxId: undefined,
		};

		const dialogProps = buildDialogProps(extractedProps, 'lightbox-1', <div>Content</div>);

		expect(dialogProps.isOpen).toBe(true);
		expect(dialogProps.onClose).toBe(extractedProps.onClose);
		expect(dialogProps.title).toBe('');
		expect(dialogProps.variant).toBe('fullscreen');
		expect(dialogProps.size).toBe('full');
		expect(dialogProps.showCloseButton).toBe(false);
		expect(dialogProps.closeOnOverlayClick).toBe(true);
		expect(dialogProps.closeOnEscape).toBe(true);
		expect(dialogProps.dialogId).toBe('lightbox-1');
		expect(dialogProps.children).toBeDefined();
	});

	it('includes className when provided', () => {
		const extractedProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			controlledIndex: undefined,
			initialIndex: 0,
			loop: false,
			onIndexChange: undefined,
			showArrows: true,
			showCounter: true,
			showCaption: true,
			closeOnOverlayClick: true,
			closeOnEscape: true,
			prevArrow: undefined,
			nextArrow: undefined,
			className: 'custom-class',
			lightboxId: undefined,
		};

		const dialogProps = buildDialogProps(extractedProps, 'lightbox-1', <div>Content</div>);

		expect(dialogProps.className).toBe('custom-class');
	});

	it('does not include className when undefined', () => {
		const extractedProps = {
			isOpen: true,
			onClose: vi.fn(),
			images: [{ src: '/image1.jpg', alt: 'Image 1' }],
			controlledIndex: undefined,
			initialIndex: 0,
			loop: false,
			onIndexChange: undefined,
			showArrows: true,
			showCounter: true,
			showCaption: true,
			closeOnOverlayClick: true,
			closeOnEscape: true,
			prevArrow: undefined,
			nextArrow: undefined,
			className: undefined,
			lightboxId: undefined,
		};

		const dialogProps = buildDialogProps(extractedProps, 'lightbox-1', <div>Content</div>);

		expect(dialogProps.className).toBeUndefined();
	});
});
