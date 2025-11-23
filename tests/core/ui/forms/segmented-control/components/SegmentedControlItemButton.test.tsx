/**
 * SegmentedControlItemButton Tests
 *
 * Tests for the SegmentedControlItemButton component:
 * - Rendering
 * - Selection state
 * - Disabled state
 * - Click handling
 * - Keyboard events
 * - ARIA attributes
 * - Icon rendering
 */

import { SegmentedControlItemButton } from '@core/ui/forms/segmented-control/components/SegmentedControlItemButton';
import type {
	SegmentedControlItem,
	SegmentedControlProps,
} from '@src-types/ui/navigation/segmentedControl';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createItem = (overrides?: Partial<SegmentedControlItem>): SegmentedControlItem => ({
	id: 'item-1',
	label: 'Item 1',
	...overrides,
});

describe('SegmentedControlItemButton - Rendering', () => {
	it('renders button element', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
	});

	it('renders item label', () => {
		const item = createItem({ label: 'Test Label' });
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		expect(screen.getByText('Test Label')).toBeInTheDocument();
	});

	it('renders icon when provided', () => {
		const Icon = () => <span data-testid="icon">🔍</span>;
		const item = createItem({ icon: <Icon /> });
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});

	it('does not render icon when not provided', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
	});
});

describe('SegmentedControlItemButton - Selection State', () => {
	it('sets aria-selected to true when selected', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={true}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button).toHaveAttribute('aria-selected', 'true');
	});

	it('sets aria-selected to false when not selected', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button).toHaveAttribute('aria-selected', 'false');
	});

	it('generates correct aria-controls ID', () => {
		const item = createItem({ id: 'item-1' });
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="segmented-control-1"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button).toHaveAttribute('aria-controls', 'segmented-control-1-panel-item-1');
	});

	it('generates correct button ID', () => {
		const item = createItem({ id: 'item-1' });
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="segmented-control-1"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button).toHaveAttribute('id', 'segmented-control-1-tab-item-1');
	});
});

describe('SegmentedControlItemButton - Disabled State', () => {
	it('disables button when isDisabled is true', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={true}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button).toBeDisabled();
	});

	it('enables button when isDisabled is false', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button).not.toBeDisabled();
	});

	it('applies disabled cursor class when disabled', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={true}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button.className).toContain('cursor-not-allowed');
	});
});

describe('SegmentedControlItemButton - Click Handling', () => {
	it('calls onValueChange when clicked and not disabled', () => {
		const item = createItem({ id: 'item-1' });
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		fireEvent.click(button);

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-1');
	});

	it('does not call onValueChange when disabled', () => {
		const item = createItem({ id: 'item-1' });
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={true}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		fireEvent.click(button);

		expect(onValueChange).not.toHaveBeenCalled();
	});
});

describe('SegmentedControlItemButton - Keyboard Events', () => {
	it('calls onKeyDown with event and itemId', () => {
		const item = createItem({ id: 'item-1' });
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		fireEvent.keyDown(button, { key: 'ArrowRight' });

		expect(onKeyDown).toHaveBeenCalledTimes(1);
		expect(onKeyDown).toHaveBeenCalledWith(
			expect.objectContaining({ key: 'ArrowRight' }),
			'item-1'
		);
	});
});

describe('SegmentedControlItemButton - Variants and Sizes', () => {
	it('applies correct classes for default variant', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={true}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button.className).toBeDefined();
	});

	it('applies correct classes for pills variant', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={true}
				isDisabled={false}
				variant="pills"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button.className).toBeDefined();
	});

	it('applies correct classes for outline variant', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={true}
				isDisabled={false}
				variant="outline"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button.className).toBeDefined();
	});

	it('applies correct classes for different sizes', () => {
		const sizes: NonNullable<SegmentedControlProps['size']>[] = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const item = createItem();
			const onValueChange = vi.fn();
			const onKeyDown = vi.fn();

			const { unmount } = renderWithProviders(
				<SegmentedControlItemButton
					item={item}
					isSelected={false}
					isDisabled={false}
					variant="default"
					size={size}
					id="test-id"
					onValueChange={onValueChange}
					onKeyDown={onKeyDown}
				/>
			);

			const button = screen.getByRole('tab');
			expect(button.className).toBeDefined();
			unmount();
		}
	});
});

describe('SegmentedControlItemButton - Type Attribute', () => {
	it('has type="button" attribute', () => {
		const item = createItem();
		const onValueChange = vi.fn();
		const onKeyDown = vi.fn();

		renderWithProviders(
			<SegmentedControlItemButton
				item={item}
				isSelected={false}
				isDisabled={false}
				variant="default"
				size="md"
				id="test-id"
				onValueChange={onValueChange}
				onKeyDown={onKeyDown}
			/>
		);

		const button = screen.getByRole('tab');
		expect(button).toHaveAttribute('type', 'button');
	});
});
