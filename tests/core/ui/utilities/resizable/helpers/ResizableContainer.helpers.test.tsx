/**
 * Tests for ResizableContainer helper functions
 *
 * Tests helper functions:
 * - getResizeHandleClasses
 * - getContainerClasses
 * - getSizeStyles
 * - getAriaLabel
 * - getContainerStyles
 * - prepareContainerData
 * - prepareAllData
 */

import {
	getAriaLabel,
	getContainerClasses,
	getContainerStyles,
	getResizeHandleClasses,
	getSizeStyles,
	prepareAllData,
	prepareContainerData,
} from '@core/ui/utilities/resizable/helpers/ResizableContainer.helpers';
import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const HOVER_BG_MUTED_CLASS = 'hover:bg-muted';
const OVERFLOW_HIDDEN_CLASS = 'overflow-hidden';
const SELECT_NONE_CLASS = 'select-none';
const OPACITY_DISABLED_CLASS = 'opacity-disabled';
const CUSTOM_CLASS = 'custom-class';
const RESIZE_HANDLE_VERTICAL_LABEL = 'Resize handle (vertical direction)';

describe('ResizableContainer.helpers - getResizeHandleClasses', () => {
	it('returns correct classes for enabled horizontal handle', () => {
		const result = getResizeHandleClasses('horizontal', false);
		expect(result).toContain('absolute');
		expect(result).toContain('bg-border');
		expect(result).toContain(HOVER_BG_MUTED_CLASS);
		expect(result).toContain('right-0');
		expect(result).toContain('top-0');
		expect(result).toContain('bottom-0');
		expect(result).toContain('w-1');
		expect(result).toContain('cursor-ew-resize');
	});

	it('returns correct classes for disabled horizontal handle', () => {
		const result = getResizeHandleClasses('horizontal', true);
		expect(result).toContain('absolute');
		expect(result).toContain('bg-border');
		expect(result).not.toContain(HOVER_BG_MUTED_CLASS);
		expect(result).toContain('right-0');
		expect(result).toContain('top-0');
		expect(result).toContain('bottom-0');
		expect(result).toContain('w-1');
		expect(result).toContain('cursor-ew-resize');
	});

	it('returns correct classes for enabled vertical handle', () => {
		const result = getResizeHandleClasses('vertical', false);
		expect(result).toContain('absolute');
		expect(result).toContain('bg-border');
		expect(result).toContain(HOVER_BG_MUTED_CLASS);
		expect(result).toContain('bottom-0');
		expect(result).toContain('left-0');
		expect(result).toContain('right-0');
		expect(result).toContain('h-1');
		expect(result).toContain('cursor-ns-resize');
	});

	it('returns correct classes for disabled vertical handle', () => {
		const result = getResizeHandleClasses('vertical', true);
		expect(result).toContain('absolute');
		expect(result).toContain('bg-border');
		expect(result).not.toContain(HOVER_BG_MUTED_CLASS);
		expect(result).toContain('bottom-0');
		expect(result).toContain('left-0');
		expect(result).toContain('right-0');
		expect(result).toContain('h-1');
		expect(result).toContain('cursor-ns-resize');
	});
});

describe('ResizableContainer.helpers - getResizeHandleClasses - both', () => {
	it('returns correct classes for enabled both direction handle', () => {
		const result = getResizeHandleClasses('both', false);
		expect(result).toContain('absolute');
		expect(result).toContain('bg-border');
		expect(result).toContain(HOVER_BG_MUTED_CLASS);
		expect(result).toContain('right-0');
		expect(result).toContain('bottom-0');
		expect(result).toContain('w-1');
		expect(result).toContain('h-1');
		expect(result).toContain('cursor-nwse-resize');
	});

	it('returns correct classes for disabled both direction handle', () => {
		const result = getResizeHandleClasses('both', true);
		expect(result).toContain('absolute');
		expect(result).toContain('bg-border');
		expect(result).not.toContain(HOVER_BG_MUTED_CLASS);
		expect(result).toContain('right-0');
		expect(result).toContain('bottom-0');
		expect(result).toContain('w-1');
		expect(result).toContain('h-1');
		expect(result).toContain('cursor-nwse-resize');
	});
});

describe('ResizableContainer.helpers - getContainerClasses', () => {
	it('returns base classes when no additional props', () => {
		const result = getContainerClasses({
			isResizing: false,
			disabled: false,
			className: undefined,
		});
		expect(result).toContain('relative');
		expect(result).toContain(OVERFLOW_HIDDEN_CLASS);
		expect(result).not.toContain(SELECT_NONE_CLASS);
		expect(result).not.toContain(OPACITY_DISABLED_CLASS);
	});

	it('includes select-none when resizing', () => {
		const result = getContainerClasses({
			isResizing: true,
			disabled: false,
			className: undefined,
		});
		expect(result).toContain(SELECT_NONE_CLASS);
		expect(result).toContain('relative');
		expect(result).toContain(OVERFLOW_HIDDEN_CLASS);
	});

	it('includes opacity-disabled when disabled', () => {
		const result = getContainerClasses({
			isResizing: false,
			disabled: true,
			className: undefined,
		});
		expect(result).toContain(OPACITY_DISABLED_CLASS);
		expect(result).toContain('relative');
		expect(result).toContain(OVERFLOW_HIDDEN_CLASS);
	});

	it('includes both resizing and disabled classes', () => {
		const result = getContainerClasses({
			isResizing: true,
			disabled: true,
			className: undefined,
		});
		expect(result).toContain(SELECT_NONE_CLASS);
		expect(result).toContain(OPACITY_DISABLED_CLASS);
		expect(result).toContain('relative');
		expect(result).toContain(OVERFLOW_HIDDEN_CLASS);
	});
});

describe('ResizableContainer.helpers - getContainerClasses - className', () => {
	it('merges custom className', () => {
		const result = getContainerClasses({
			isResizing: false,
			disabled: false,
			className: CUSTOM_CLASS,
		});
		expect(result).toContain(CUSTOM_CLASS);
		expect(result).toContain('relative');
		expect(result).toContain(OVERFLOW_HIDDEN_CLASS);
	});

	it('merges custom className with resizing and disabled', () => {
		const result = getContainerClasses({
			isResizing: true,
			disabled: true,
			className: CUSTOM_CLASS,
		});
		expect(result).toContain(CUSTOM_CLASS);
		expect(result).toContain(SELECT_NONE_CLASS);
		expect(result).toContain(OPACITY_DISABLED_CLASS);
	});
});

describe('ResizableContainer.helpers - getSizeStyles', () => {
	it('returns empty object when size is undefined', () => {
		expect(getSizeStyles('horizontal', undefined)).toEqual({});
		expect(getSizeStyles('vertical', undefined)).toEqual({});
		expect(getSizeStyles('both', undefined)).toEqual({});
	});

	it('sets width for horizontal direction', () => {
		expect(getSizeStyles('horizontal', 200)).toEqual({ width: '200px' });
	});

	it('sets height for vertical direction', () => {
		expect(getSizeStyles('vertical', 300)).toEqual({ height: '300px' });
	});

	it('sets both width and height for both direction', () => {
		expect(getSizeStyles('both', 250)).toEqual({ width: '250px', height: '250px' });
	});

	it('handles zero size', () => {
		expect(getSizeStyles('horizontal', 0)).toEqual({ width: '0px' });
		expect(getSizeStyles('vertical', 0)).toEqual({ height: '0px' });
		expect(getSizeStyles('both', 0)).toEqual({ width: '0px', height: '0px' });
	});
});

describe('ResizableContainer.helpers - getAriaLabel', () => {
	it('returns correct label for horizontal direction', () => {
		const result = getAriaLabel('horizontal');
		expect(result).toBe('Resize handle (horizontal direction)');
	});

	it('returns correct label for vertical direction', () => {
		const result = getAriaLabel('vertical');
		expect(result).toBe(RESIZE_HANDLE_VERTICAL_LABEL);
	});

	it('returns correct label for both direction', () => {
		const result = getAriaLabel('both');
		expect(result).toBe(RESIZE_HANDLE_VERTICAL_LABEL);
	});
});

describe('ResizableContainer.helpers - getContainerStyles', () => {
	it('returns size styles when no custom style', () => {
		expect(getContainerStyles({ direction: 'horizontal', size: 200, style: undefined })).toEqual({
			width: '200px',
		});
		expect(getContainerStyles({ direction: 'vertical', size: 150, style: undefined })).toEqual({
			height: '150px',
		});
		expect(getContainerStyles({ direction: 'both', size: 250, style: undefined })).toEqual({
			width: '250px',
			height: '250px',
		});
	});

	it('merges size styles with custom style', () => {
		const customStyle = { backgroundColor: 'red', padding: '10px' };
		const result = getContainerStyles({
			direction: 'horizontal',
			size: 200,
			style: customStyle,
		});
		expect(result).toEqual({
			width: '200px',
			backgroundColor: 'red',
			padding: '10px',
		});
	});

	it('custom style overrides size styles when both set width/height', () => {
		const customStyle = { width: '300px', height: '400px' };
		const result = getContainerStyles({
			direction: 'both',
			size: 200,
			style: customStyle,
		});
		expect(result.width).toBe('300px');
		expect(result.height).toBe('400px');
	});

	it('handles empty size styles with custom style', () => {
		const customStyle = { backgroundColor: 'blue' };
		const result = getContainerStyles({
			direction: 'horizontal',
			size: undefined,
			style: customStyle,
		});
		expect(result).toEqual({ backgroundColor: 'blue' });
	});
});

describe('ResizableContainer.helpers - prepareContainerData', () => {
	it('prepares container data with minimal props', () => {
		const result = prepareContainerData({
			direction: 'horizontal',
			size: undefined,
			style: undefined,
			isResizing: false,
			disabled: false,
			className: undefined,
		});

		expect(result).toHaveProperty('containerStyle');
		expect(result).toHaveProperty('containerClasses');
		expect(result.containerStyle).toEqual({});
		expect(result.containerClasses).toContain('relative');
		expect(result.containerClasses).toContain(OVERFLOW_HIDDEN_CLASS);
	});

	it('prepares container data with all props', () => {
		const customStyle = { backgroundColor: 'red' };
		const result = prepareContainerData({
			direction: 'vertical',
			size: 300,
			style: customStyle,
			isResizing: true,
			disabled: true,
			className: CUSTOM_CLASS,
		});

		expect(result.containerStyle).toEqual({
			height: '300px',
			backgroundColor: 'red',
		});
		expect(result.containerClasses).toContain(CUSTOM_CLASS);
		expect(result.containerClasses).toContain(SELECT_NONE_CLASS);
		expect(result.containerClasses).toContain(OPACITY_DISABLED_CLASS);
	});

	it('prepares container data for both direction', () => {
		const result = prepareContainerData({
			direction: 'both',
			size: 200,
			style: undefined,
			isResizing: false,
			disabled: false,
			className: undefined,
		});

		expect(result.containerStyle).toEqual({
			width: '200px',
			height: '200px',
		});
	});
});

describe('ResizableContainer.helpers - prepareContainerData - states', () => {
	it('prepares container data with resizing and disabled states', () => {
		const resizingResult = prepareContainerData({
			direction: 'horizontal',
			size: 150,
			style: undefined,
			isResizing: true,
			disabled: false,
			className: undefined,
		});
		expect(resizingResult.containerStyle).toEqual({ width: '150px' });
		expect(resizingResult.containerClasses).toContain(SELECT_NONE_CLASS);

		const disabledResult = prepareContainerData({
			direction: 'vertical',
			size: 250,
			style: undefined,
			isResizing: false,
			disabled: true,
			className: undefined,
		});
		expect(disabledResult.containerStyle).toEqual({ height: '250px' });
		expect(disabledResult.containerClasses).toContain(OPACITY_DISABLED_CLASS);
	});
});

const mockOnMouseDown = vi.fn();

describe('ResizableContainer.helpers - prepareAllData', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('prepares all data with minimal props', () => {
		const result = prepareAllData({
			direction: 'horizontal',
			size: undefined,
			style: undefined,
			isResizing: false,
			disabled: false,
			className: undefined,
			handleClassName: undefined,
			onMouseDown: mockOnMouseDown,
		});

		expect(result).toHaveProperty('containerStyle');
		expect(result).toHaveProperty('containerClasses');
		expect(result).toHaveProperty('handle');
		expect(result.containerStyle).toEqual({});
		expect(result.containerClasses).toContain('relative');
		expect(result.containerClasses).toContain(OVERFLOW_HIDDEN_CLASS);
	});

	it('prepares all data with all props', () => {
		const customStyle = { backgroundColor: 'blue' };
		const result = prepareAllData({
			direction: 'vertical',
			size: 400,
			style: customStyle,
			isResizing: true,
			disabled: false,
			className: 'container-class',
			handleClassName: 'handle-class',
			onMouseDown: mockOnMouseDown,
		});

		expect(result.containerStyle).toEqual({
			height: '400px',
			backgroundColor: 'blue',
		});
		expect(result.containerClasses).toContain('container-class');
		expect(result.containerClasses).toContain(SELECT_NONE_CLASS);
		expect(result).toHaveProperty('handle');
	});
});

describe('ResizableContainer.helpers - prepareAllData - directions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('prepares all data for both direction', () => {
		const result = prepareAllData({
			direction: 'both',
			size: 300,
			style: undefined,
			isResizing: false,
			disabled: false,
			className: undefined,
			handleClassName: undefined,
			onMouseDown: mockOnMouseDown,
		});

		expect(result.containerStyle).toEqual({
			width: '300px',
			height: '300px',
		});
		expect(result).toHaveProperty('handle');
	});

	it('prepares all data with disabled state', () => {
		const result = prepareAllData({
			direction: 'horizontal',
			size: 200,
			style: undefined,
			isResizing: false,
			disabled: true,
			className: undefined,
			handleClassName: undefined,
			onMouseDown: mockOnMouseDown,
		});

		expect(result.containerStyle).toEqual({ width: '200px' });
		expect(result.containerClasses).toContain(OPACITY_DISABLED_CLASS);
		expect(result).toHaveProperty('handle');
	});
});

describe('ResizableContainer.helpers - prepareAllData - handle rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders handle component correctly', () => {
		const result = prepareAllData({
			direction: 'horizontal',
			size: undefined,
			style: undefined,
			isResizing: false,
			disabled: false,
			className: undefined,
			handleClassName: 'custom-handle',
			onMouseDown: mockOnMouseDown,
		});

		render(result.handle as ReactElement);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('renders handle with correct props', () => {
		const result = prepareAllData({
			direction: 'vertical',
			size: undefined,
			style: undefined,
			isResizing: false,
			disabled: false,
			className: undefined,
			handleClassName: 'test-handle',
			onMouseDown: mockOnMouseDown,
		});

		render(result.handle as ReactElement);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-label', RESIZE_HANDLE_VERTICAL_LABEL);
	});
});
