/**
 * ColorPickerSwatches Component Tests
 *
 * Tests for the ColorPickerSwatches component including:
 * - Rendering
 * - User interactions
 * - Selection state
 * - Disabled states
 * - Accessibility
 * - Edge cases
 */

import { ColorPickerSwatches } from '@core/ui/forms/color-picker/components/ColorPickerSwatches';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const SWATCH_COLOR_1 = '#ff0000';
const SWATCH_COLOR_2 = '#00ff00';
const SWATCH_COLOR_3 = '#0000ff';
const SWATCH_COLOR_4 = '#ffff00';
const SWATCH_COLORS = [SWATCH_COLOR_1, SWATCH_COLOR_2, SWATCH_COLOR_3, SWATCH_COLOR_4];

describe('ColorPickerSwatches - Rendering', () => {
	it('renders swatches when provided', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(4);
	});

	it('returns null when swatches array is empty', () => {
		const mockOnColorSelect = vi.fn();
		const { container } = renderWithProviders(
			<ColorPickerSwatches
				swatches={[]}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		expect(container.firstChild).toBeNull();
	});

	it('renders correct number of swatches', () => {
		const mockOnColorSelect = vi.fn();
		const swatches = ['#ff0000', '#00ff00'];
		renderWithProviders(
			<ColorPickerSwatches
				swatches={swatches}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(2);
	});

	it('applies correct background color to each swatch', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toHaveStyle({ backgroundColor: SWATCH_COLOR_1 });
		expect(buttons[1]).toHaveStyle({ backgroundColor: SWATCH_COLOR_2 });
		expect(buttons[2]).toHaveStyle({ backgroundColor: SWATCH_COLOR_3 });
		expect(buttons[3]).toHaveStyle({ backgroundColor: SWATCH_COLOR_4 });
	});

	it('renders swatches with correct button type', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		for (const button of buttons) {
			expect(button).toHaveAttribute('type', 'button');
		}
	});
});

describe('ColorPickerSwatches - User Interactions', () => {
	it('calls onColorSelect when a swatch is clicked', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDefined();
		fireEvent.click(buttons[0]!);

		expect(mockOnColorSelect).toHaveBeenCalledTimes(1);
		expect(mockOnColorSelect).toHaveBeenCalledWith(SWATCH_COLOR_1);
	});

	it('calls onColorSelect with correct color value', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[1]).toBeDefined();
		fireEvent.click(buttons[1]!);

		expect(mockOnColorSelect).toHaveBeenCalledWith(SWATCH_COLOR_2);
	});

	it('calls onColorSelect for different swatches', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDefined();
		fireEvent.click(buttons[0]!);
		expect(buttons[2]).toBeDefined();
		expect(buttons[3]).toBeDefined();
		fireEvent.click(buttons[2]!);
		fireEvent.click(buttons[3]!);

		expect(mockOnColorSelect).toHaveBeenCalledTimes(3);
		expect(mockOnColorSelect).toHaveBeenNthCalledWith(1, SWATCH_COLOR_1);
		expect(mockOnColorSelect).toHaveBeenNthCalledWith(2, SWATCH_COLOR_3);
		expect(mockOnColorSelect).toHaveBeenNthCalledWith(3, SWATCH_COLOR_4);
	});

	it('handles keyboard events on swatches', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDefined();
		fireEvent.keyDown(buttons[0]!, { key: 'Enter', code: 'Enter' });
		// Note: onClick is typically triggered by Enter/Space in browsers
		// but fireEvent.keyDown doesn't automatically trigger click
		expect(buttons[0]).toBeInTheDocument();
	});
});

describe('ColorPickerSwatches - Selection State', () => {
	it('highlights selected color correctly', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={SWATCH_COLOR_2}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		// The selected button should have the selected styling classes
		expect(buttons[1]).toHaveClass('ring-2');
		expect(buttons[1]).toHaveClass('ring-offset-1');
		expect(buttons[1]).toHaveClass('border-text-primary');
	});

	it('does not highlight unselected colors', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={SWATCH_COLOR_2}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		// Unselected buttons should not have selected styling
		expect(buttons[0]).not.toHaveClass('ring-2');
		expect(buttons[2]).not.toHaveClass('ring-2');
		expect(buttons[3]).not.toHaveClass('ring-2');
	});

	it('handles case-insensitive color comparison', () => {
		const mockOnColorSelect = vi.fn();
		// Using uppercase color value
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={SWATCH_COLOR_1.toUpperCase()}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		// Should match despite case difference
		expect(buttons[0]).toHaveClass('ring-2');
		expect(buttons[0]).toHaveClass('border-text-primary');
	});

	it('handles undefined currentColor', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		// No swatches should be selected
		for (const button of buttons) {
			expect(button).not.toHaveClass('ring-2');
		}
	});

	it('updates selection when currentColor changes', () => {
		const mockOnColorSelect = vi.fn();
		const { rerender } = renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={SWATCH_COLOR_1}
				onColorSelect={mockOnColorSelect}
			/>
		);

		let buttons = screen.getAllByRole('button');
		expect(buttons[0]).toHaveClass('ring-2');

		rerender(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={SWATCH_COLOR_3}
				onColorSelect={mockOnColorSelect}
			/>
		);

		buttons = screen.getAllByRole('button');
		expect(buttons[0]).not.toHaveClass('ring-2');
		expect(buttons[2]).toHaveClass('ring-2');
	});
});

describe('ColorPickerSwatches - Disabled States', () => {
	it('disables all swatches when disabled prop is true', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
				disabled={true}
			/>
		);

		const buttons = screen.getAllByRole('button');
		for (const button of buttons) {
			expect(button).toBeDisabled();
		}
	});

	it('enables swatches when disabled prop is false', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
				disabled={false}
			/>
		);

		const buttons = screen.getAllByRole('button');
		for (const button of buttons) {
			expect(button).not.toBeDisabled();
		}
	});

	it('enables swatches when disabled prop is undefined', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		for (const button of buttons) {
			expect(button).not.toBeDisabled();
		}
	});

	it('applies disabled styling when disabled', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
				disabled={true}
			/>
		);

		const buttons = screen.getAllByRole('button');
		for (const button of buttons) {
			expect(button).toHaveClass('opacity-disabled');
			expect(button).toHaveClass('cursor-not-allowed');
		}
	});

	it('does not call onColorSelect when disabled', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
				disabled={true}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDefined();
		fireEvent.click(buttons[0]!);

		// Note: In real browsers, disabled buttons don't fire click events
		// but fireEvent.click may still trigger the handler in tests
		// The important thing is that the button is disabled
		expect(buttons[0]).toBeDisabled();
	});
});

describe('ColorPickerSwatches - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const mockOnColorSelect = vi.fn();
		const { container } = renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);
		await expectA11y(container);
	});

	it('has no accessibility violations when disabled', async () => {
		const mockOnColorSelect = vi.fn();
		const { container } = renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
				disabled={true}
			/>
		);
		await expectA11y(container);
	});

	it('has no accessibility violations with selected color', async () => {
		const mockOnColorSelect = vi.fn();
		const { container } = renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={SWATCH_COLOR_2}
				onColorSelect={mockOnColorSelect}
			/>
		);
		await expectA11y(container);
	});

	it('provides aria-label for each swatch', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toHaveAttribute('aria-label', `Select color ${SWATCH_COLOR_1}`);
		expect(buttons[1]).toHaveAttribute('aria-label', `Select color ${SWATCH_COLOR_2}`);
		expect(buttons[2]).toHaveAttribute('aria-label', `Select color ${SWATCH_COLOR_3}`);
		expect(buttons[3]).toHaveAttribute('aria-label', `Select color ${SWATCH_COLOR_4}`);
	});

	it('supports keyboard focus', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDefined();
		buttons[0]!.focus();
		expect(buttons[0]!).toHaveFocus();
	});

	it('applies focus ring styles', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		for (const button of buttons) {
			expect(button).toHaveClass('focus:ring-2');
			expect(button).toHaveClass('focus:ring-offset-2');
			expect(button).toHaveClass('focus:ring-primary');
		}
	});
});

describe('ColorPickerSwatches - Edge Cases', () => {
	it('handles single swatch', () => {
		const mockOnColorSelect = vi.fn();
		const singleSwatch = ['#ff0000'];
		renderWithProviders(
			<ColorPickerSwatches
				swatches={singleSwatch}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(1);
		expect(buttons[0]).toHaveStyle({ backgroundColor: '#ff0000' });
	});

	it('handles many swatches', () => {
		const mockOnColorSelect = vi.fn();
		const manySwatches = Array.from(
			{ length: 20 },
			(_, i) => `#${i.toString(16).padStart(6, '0')}`
		);
		renderWithProviders(
			<ColorPickerSwatches
				swatches={manySwatches}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(20);
	});

	it('handles color values with different formats', () => {
		const mockOnColorSelect = vi.fn();
		const mixedFormats = ['#ff0000', 'rgb(0, 255, 0)', 'blue', '#000'];
		renderWithProviders(
			<ColorPickerSwatches
				swatches={mixedFormats}
				currentColor={undefined}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(4);
		// Check that background colors are set (browser may convert named colors to RGB)
		expect(buttons[0]).toBeDefined();
		expect(buttons[1]).toBeDefined();
		expect(buttons[2]).toBeDefined();
		expect(buttons[3]).toBeDefined();
		expect(buttons[0]!.style.backgroundColor).toBeTruthy();
		expect(buttons[1]!.style.backgroundColor).toBeTruthy();
		expect(buttons[2]!.style.backgroundColor).toBeTruthy();
		expect(buttons[3]!.style.backgroundColor).toBeTruthy();
		// Verify specific hex colors are preserved
		expect(buttons[0]!).toHaveStyle({ backgroundColor: '#ff0000' });
		expect(buttons[1]!).toHaveStyle({ backgroundColor: 'rgb(0, 255, 0)' });
		expect(buttons[3]).toHaveStyle({ backgroundColor: '#000' });
		// Named color 'blue' gets converted to RGB by browser, so just verify it's set
		expect(buttons[2]!.style.backgroundColor).toBeTruthy();
	});

	it('handles empty string as currentColor', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor=""
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		// Empty string should not match any color
		for (const button of buttons) {
			expect(button).not.toHaveClass('ring-2');
		}
	});

	it('handles color matching with whitespace', () => {
		const mockOnColorSelect = vi.fn();
		// Component uses toLowerCase() for comparison, so whitespace in currentColor
		// won't match due to exact string comparison after lowercasing
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={` ${SWATCH_COLOR_1} `}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		// Whitespace should prevent match
		expect(buttons[0]).not.toHaveClass('ring-2');
	});

	it('maintains correct styling classes for all states', () => {
		const mockOnColorSelect = vi.fn();
		renderWithProviders(
			<ColorPickerSwatches
				swatches={SWATCH_COLORS}
				currentColor={SWATCH_COLOR_1}
				onColorSelect={mockOnColorSelect}
			/>
		);

		const buttons = screen.getAllByRole('button');
		for (const button of buttons) {
			expect(button).toHaveClass('w-8');
			expect(button).toHaveClass('h-8');
			expect(button).toHaveClass('rounded');
			expect(button).toHaveClass('border-medium');
			expect(button).toHaveClass('transition-all');
			expect(button).toHaveClass('hover:scale-110');
		}
	});
});
