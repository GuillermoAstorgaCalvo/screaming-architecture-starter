/**
 * Tests for SheetHelpers
 *
 * Tests the helper functions used by Sheet:
 * - getTransformClass: transform classes based on position and open state
 * - getSheetClasses: combines base, position, size, and transform classes
 * - getOverlayClasses: overlay classes with visibility state
 * - buildSheetPortalProps: builds props for SheetPortalContent
 */

import {
	buildSheetPortalProps,
	getOverlayClasses,
	getSheetClasses,
	getTransformClass,
} from '@core/ui/overlays/sheet/helpers/SheetHelpers';
import type { SheetPosition, SheetProps, SheetSize } from '@src-types/ui/overlays/panels';
import type { MouseEvent, RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('SheetHelpers - getTransformClass', () => {
	it('returns translate-x-0 translate-y-0 when sheet is open', () => {
		const positions: SheetPosition[] = ['left', 'right', 'top', 'bottom'];
		for (const position of positions) {
			const result = getTransformClass(position, true);
			expect(result).toBe('translate-x-0 translate-y-0');
		}
	});

	it('returns -translate-x-full for left position when closed', () => {
		const result = getTransformClass('left', false);
		expect(result).toBe('-translate-x-full');
	});

	it('returns translate-x-full for right position when closed', () => {
		const result = getTransformClass('right', false);
		expect(result).toBe('translate-x-full');
	});

	it('returns -translate-y-full for top position when closed', () => {
		const result = getTransformClass('top', false);
		expect(result).toBe('-translate-y-full');
	});

	it('returns translate-y-full for bottom position when closed', () => {
		const result = getTransformClass('bottom', false);
		expect(result).toBe('translate-y-full');
	});
});

describe('SheetHelpers - getSheetClasses', () => {
	const positions: SheetPosition[] = ['left', 'right', 'top', 'bottom'];
	const sizes: SheetSize[] = ['sm', 'md', 'lg', 'xl', 'full'];

	it('combines base, position, size, and transform classes when open', () => {
		for (const position of positions) {
			for (const size of sizes) {
				const result = getSheetClasses(position, size, true);
				expect(result).toContain('translate-x-0 translate-y-0');
				expect(result).toBeTruthy();
			}
		}
	});

	it('combines base, position, size, and transform classes when closed', () => {
		const result = getSheetClasses('left', 'md', false);
		expect(result).toContain('-translate-x-full');
		expect(result).toBeTruthy();
	});

	it('includes correct transform for right position when closed', () => {
		const result = getSheetClasses('right', 'md', false);
		expect(result).toContain('translate-x-full');
	});

	it('includes correct transform for top position when closed', () => {
		const result = getSheetClasses('top', 'md', false);
		expect(result).toContain('-translate-y-full');
	});

	it('includes correct transform for bottom position when closed', () => {
		const result = getSheetClasses('bottom', 'md', false);
		expect(result).toContain('translate-y-full');
	});

	it('handles all size variants', () => {
		for (const size of sizes) {
			const result = getSheetClasses('left', size, true);
			expect(result).toBeTruthy();
		}
	});

	it('handles all position variants', () => {
		for (const position of positions) {
			const result = getSheetClasses(position, 'md', true);
			expect(result).toBeTruthy();
		}
	});
});

describe('SheetHelpers - getOverlayClasses', () => {
	it('returns opacity-100 when sheet is open', () => {
		const result = getOverlayClasses(true);
		expect(result).toContain('opacity-100');
		expect(result).not.toContain('opacity-0');
		expect(result).not.toContain('pointer-events-none');
	});

	it('returns opacity-0 pointer-events-none when sheet is closed', () => {
		const result = getOverlayClasses(false);
		expect(result).toContain('opacity-0');
		expect(result).toContain('pointer-events-none');
		expect(result).not.toContain('opacity-100');
	});

	it('includes custom className when provided', () => {
		const result = getOverlayClasses(true, 'custom-overlay');
		expect(result).toContain('custom-overlay');
		expect(result).toContain('opacity-100');
	});

	it('handles undefined className', () => {
		const result = getOverlayClasses(true, undefined);
		expect(result).toContain('opacity-100');
		expect(result).not.toContain('undefined');
	});

	it('handles empty string className', () => {
		const result = getOverlayClasses(false, '');
		expect(result).toContain('opacity-0');
		expect(result).toContain('pointer-events-none');
	});

	it('combines multiple class sources correctly', () => {
		const result = getOverlayClasses(true, 'custom-class another-class');
		expect(result).toContain('opacity-100');
		expect(result).toContain('custom-class');
		expect(result).toContain('another-class');
	});

	it('handles overlay classes with closed state and custom className', () => {
		const result = getOverlayClasses(false, 'my-custom-overlay');
		expect(result).toContain('opacity-0');
		expect(result).toContain('pointer-events-none');
		expect(result).toContain('my-custom-overlay');
	});
});

describe('SheetHelpers - buildSheetPortalProps', () => {
	const createMockSheetRef = (): RefObject<HTMLDivElement | null> => ({
		current: null,
	});

	const createMockHandleOverlayClick = () => {
		return vi.fn((e: MouseEvent<HTMLDivElement>, closeOnOverlayClick: boolean) => {
			if (closeOnOverlayClick && e.target === e.currentTarget) {
				// Mock implementation
			}
		});
	};

	it('should be a function', () => {
		expect(typeof buildSheetPortalProps).toBe('function');
	});

	it('builds props with all required fields', () => {
		const props: SheetProps = {
			isOpen: true,
			onClose: vi.fn(),
			children: <div>Content</div>,
		};

		const result = buildSheetPortalProps({
			props,
			id: 'test-sheet',
			sheetRef: createMockSheetRef(),
			handleOverlayClick: createMockHandleOverlayClick(),
		});

		expect(result.id).toBe('test-sheet');
		expect(result.isOpen).toBe(true);
		expect(result.onClose).toBe(props.onClose);
		expect(result.children).toBe(props.children);
	});

	it('applies default values for optional props', () => {
		const props: SheetProps = {
			isOpen: true,
			onClose: vi.fn(),
			children: <div>Content</div>,
		};

		const result = buildSheetPortalProps({
			props,
			id: 'test-sheet',
			sheetRef: createMockSheetRef(),
			handleOverlayClick: createMockHandleOverlayClick(),
		});

		expect(result.position).toBe('right');
		expect(result.size).toBe('md');
		expect(result.showCloseButton).toBe(true);
		expect(result.closeOnOverlayClick).toBe(true);
	});

	it('preserves provided optional props', () => {
		const props: SheetProps = {
			isOpen: true,
			onClose: vi.fn(),
			children: <div>Content</div>,
			position: 'left',
			size: 'lg',
			showCloseButton: false,
			closeOnOverlayClick: false,
			title: 'Test Title',
			footer: <div>Footer</div>,
			className: 'custom-class',
			overlayClassName: 'overlay-class',
		};

		const result = buildSheetPortalProps({
			props,
			id: 'test-sheet',
			sheetRef: createMockSheetRef(),
			handleOverlayClick: createMockHandleOverlayClick(),
		});

		expect(result.position).toBe('left');
		expect(result.size).toBe('lg');
		expect(result.showCloseButton).toBe(false);
		expect(result.closeOnOverlayClick).toBe(false);
		expect(result.title).toBe('Test Title');
		expect(result.footer).toBe(props.footer);
		expect(result.className).toBe('custom-class');
		expect(result.overlayClassName).toBe('overlay-class');
	});

	it('includes handleOverlayClick in result', () => {
		const handleOverlayClick = createMockHandleOverlayClick();
		const props: SheetProps = {
			isOpen: true,
			onClose: vi.fn(),
			children: <div>Content</div>,
		};

		const result = buildSheetPortalProps({
			props,
			id: 'test-sheet',
			sheetRef: createMockSheetRef(),
			handleOverlayClick,
		});

		expect(result.handleOverlayClick).toBe(handleOverlayClick);
	});

	it('handles all position variants', () => {
		const positions: SheetPosition[] = ['left', 'right', 'top', 'bottom'];

		for (const position of positions) {
			const props: SheetProps = {
				isOpen: true,
				onClose: vi.fn(),
				children: <div>Content</div>,
				position,
			};

			const result = buildSheetPortalProps({
				props,
				id: 'test-sheet',
				sheetRef: createMockSheetRef(),
				handleOverlayClick: createMockHandleOverlayClick(),
			});

			expect(result.position).toBe(position);
		}
	});

	it('handles all size variants', () => {
		const sizes: SheetSize[] = ['sm', 'md', 'lg', 'xl', 'full'];

		for (const size of sizes) {
			const props: SheetProps = {
				isOpen: true,
				onClose: vi.fn(),
				children: <div>Content</div>,
				size,
			};

			const result = buildSheetPortalProps({
				props,
				id: 'test-sheet',
				sheetRef: createMockSheetRef(),
				handleOverlayClick: createMockHandleOverlayClick(),
			});

			expect(result.size).toBe(size);
		}
	});

	it('omits optional props when undefined', () => {
		const props: SheetProps = {
			isOpen: true,
			onClose: vi.fn(),
			children: <div>Content</div>,
		};

		const result = buildSheetPortalProps({
			props,
			id: 'test-sheet',
			sheetRef: createMockSheetRef(),
			handleOverlayClick: createMockHandleOverlayClick(),
		});

		expect(result.title).toBeUndefined();
		expect(result.footer).toBeUndefined();
		expect(result.className).toBeUndefined();
		expect(result.overlayClassName).toBeUndefined();
	});
});
