/**
 * SplitButtonHelpers Tests
 *
 * Tests for SplitButton helper functions:
 * - getBorderColorClass: Border color classes for different variants
 * - getMainButtonClasses: CSS classes for main button
 * - getDropdownButtonClasses: CSS classes for dropdown button
 * - createDropdownTrigger: Dropdown trigger element creation
 * - isSeparator: Separator detection
 * - handleMenuItemSelect: Menu item selection handling
 */

import type { DropdownMenuItemOrSeparator } from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import {
	createDropdownTrigger,
	getBorderColorClass,
	getDropdownButtonClasses,
	getMainButtonClasses,
	handleMenuItemSelect,
	isSeparator,
} from '@core/ui/split-button/helpers/SplitButtonHelpers';
import type { ButtonVariant, SplitButtonProps } from '@src-types/ui/buttons';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('SplitButtonHelpers', () => {
	describe('getBorderColorClass', () => {
		it('should return correct border class for primary variant', () => {
			const result = getBorderColorClass('primary');
			expect(result).toBe('border-l-primary-foreground/20');
		});

		it('should return correct border class for secondary variant', () => {
			const result = getBorderColorClass('secondary');
			expect(result).toBe('border-l-secondary-foreground/20');
		});

		it('should return correct border class for ghost variant', () => {
			const result = getBorderColorClass('ghost');
			expect(result).toBe('border-l-border');
		});

		it('should return a non-empty string for all variants', () => {
			const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost'];
			for (const variant of variants) {
				const result = getBorderColorClass(variant);
				expect(result).toBeTruthy();
				expect(typeof result).toBe('string');
				expect(result.length).toBeGreaterThan(0);
			}
		});

		it('should return different classes for different variants', () => {
			const primary = getBorderColorClass('primary');
			const secondary = getBorderColorClass('secondary');
			const ghost = getBorderColorClass('ghost');

			expect(primary).not.toBe(secondary);
			expect(primary).not.toBe(ghost);
			expect(secondary).not.toBe(ghost);
		});
	});

	describe('getMainButtonClasses', () => {
		it('should return classes with rounded-r-none', () => {
			const result = getMainButtonClasses('primary', 'md');
			expect(result).toContain('rounded-r-none');
		});

		it('should include variant and size classes', () => {
			const result = getMainButtonClasses('primary', 'md');
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('should merge additional className', () => {
			const result = getMainButtonClasses('primary', 'md', 'custom-class');
			expect(result).toContain('custom-class');
		});

		it('should work with different variants', () => {
			const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost'];
			for (const variant of variants) {
				const result = getMainButtonClasses(variant, 'md');
				expect(result).toBeTruthy();
				expect(result).toContain('rounded-r-none');
			}
		});

		it('should work with different sizes', () => {
			const sizes: SplitButtonProps['size'][] = ['sm', 'md', 'lg'];
			for (const size of sizes) {
				const result = getMainButtonClasses('primary', size);
				expect(result).toBeTruthy();
			}
		});
	});

	describe('getDropdownButtonClasses', () => {
		it('should return classes with rounded-l-none and border-l', () => {
			const borderClass = getBorderColorClass('primary');
			const result = getDropdownButtonClasses('primary', 'md', borderClass);
			expect(result).toContain('rounded-l-none');
			expect(result).toContain('border-l');
		});

		it('should include border color class', () => {
			const borderClass = getBorderColorClass('primary');
			const result = getDropdownButtonClasses('primary', 'md', borderClass);
			expect(result).toContain(borderClass);
		});

		it('should include px-2 class', () => {
			const borderClass = getBorderColorClass('primary');
			const result = getDropdownButtonClasses('primary', 'md', borderClass);
			expect(result).toContain('px-2');
		});

		it('should work with different variants', () => {
			const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost'];
			for (const variant of variants) {
				const borderClass = getBorderColorClass(variant);
				const result = getDropdownButtonClasses(variant, 'md', borderClass);
				expect(result).toBeTruthy();
				expect(result).toContain('rounded-l-none');
				expect(result).toContain('border-l');
			}
		});

		it('should work with different sizes', () => {
			const borderClass = getBorderColorClass('primary');
			const sizes: SplitButtonProps['size'][] = ['sm', 'md', 'lg'];
			for (const size of sizes) {
				const result = getDropdownButtonClasses('primary', size, borderClass);
				expect(result).toBeTruthy();
			}
		});
	});

	describe('createDropdownTrigger', () => {
		it('should create a button element', () => {
			const trigger = createDropdownTrigger({
				disabled: false,
				isLoading: false,
				dropdownButtonClasses: 'test-class',
				dropdownAriaLabel: 'More options',
			});

			render(trigger);
			const button = screen.getByRole('button', { name: 'More options' });
			expect(button).toBeInTheDocument();
			expect(button.tagName).toBe('BUTTON');
		});

		it('should apply dropdownButtonClasses', () => {
			const trigger = createDropdownTrigger({
				disabled: false,
				isLoading: false,
				dropdownButtonClasses: 'custom-class',
				dropdownAriaLabel: 'More options',
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('custom-class');
		});

		it('should apply aria-label', () => {
			const trigger = createDropdownTrigger({
				disabled: false,
				isLoading: false,
				dropdownButtonClasses: 'test-class',
				dropdownAriaLabel: 'Custom label',
			});

			render(trigger);
			const button = screen.getByRole('button', { name: 'Custom label' });
			expect(button).toHaveAttribute('aria-label', 'Custom label');
		});

		it('should disable button when disabled is true', () => {
			const trigger = createDropdownTrigger({
				disabled: true,
				isLoading: false,
				dropdownButtonClasses: 'test-class',
				dropdownAriaLabel: 'More options',
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toBeDisabled();
		});

		it('should disable button when isLoading is true', () => {
			const trigger = createDropdownTrigger({
				disabled: false,
				isLoading: true,
				dropdownButtonClasses: 'test-class',
				dropdownAriaLabel: 'More options',
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toBeDisabled();
		});

		it('should disable button when both disabled and isLoading are true', () => {
			const trigger = createDropdownTrigger({
				disabled: true,
				isLoading: true,
				dropdownButtonClasses: 'test-class',
				dropdownAriaLabel: 'More options',
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toBeDisabled();
		});

		it('should have type="button"', () => {
			const trigger = createDropdownTrigger({
				disabled: false,
				isLoading: false,
				dropdownButtonClasses: 'test-class',
				dropdownAriaLabel: 'More options',
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('type', 'button');
		});

		it('should render an icon', () => {
			const trigger = createDropdownTrigger({
				disabled: false,
				isLoading: false,
				dropdownButtonClasses: 'test-class',
				dropdownAriaLabel: 'More options',
			});

			render(trigger);
			const button = screen.getByRole('button');
			const svg = button.querySelector('svg');
			expect(svg).toBeInTheDocument();
		});
	});

	describe('isSeparator', () => {
		it('should return true for separator items', () => {
			const item: DropdownMenuItemOrSeparator = { id: 'sep-1', type: 'separator' };
			expect(isSeparator(item)).toBe(true);
		});

		it('should return false for menu items', () => {
			const item: DropdownMenuItemOrSeparator = {
				id: 'item-1',
				label: 'Option 1',
			};
			expect(isSeparator(item)).toBe(false);
		});

		it('should work as a type guard', () => {
			const item: DropdownMenuItemOrSeparator = { id: 'sep-1', type: 'separator' };
			if (isSeparator(item)) {
				expect(item.type).toBe('separator');
			}
		});

		it('should return false for items with onSelect', () => {
			const item: DropdownMenuItemOrSeparator = {
				id: 'item-1',
				label: 'Option 1',
				onSelect: () => {},
			};
			expect(isSeparator(item)).toBe(false);
		});
	});

	describe('handleMenuItemSelect', () => {
		it('should call onMenuItemSelect callback with item', () => {
			const onMenuItemSelect = vi.fn();
			const item: DropdownMenuItemOrSeparator = {
				id: 'item-1',
				label: 'Option 1',
			};

			handleMenuItemSelect({ item, onMenuItemSelect });

			expect(onMenuItemSelect).toHaveBeenCalledTimes(1);
			expect(onMenuItemSelect).toHaveBeenCalledWith(item);
		});

		it('should not call onMenuItemSelect for separators', () => {
			const onMenuItemSelect = vi.fn();
			const item: DropdownMenuItemOrSeparator = { id: 'sep-1', type: 'separator' };

			handleMenuItemSelect({ item, onMenuItemSelect });

			expect(onMenuItemSelect).not.toHaveBeenCalled();
		});

		it('should call item.onSelect if provided', () => {
			const itemOnSelect = vi.fn();
			const item: DropdownMenuItemOrSeparator = {
				id: 'item-1',
				label: 'Option 1',
				onSelect: itemOnSelect,
			};

			handleMenuItemSelect({ item, onMenuItemSelect: undefined });

			expect(itemOnSelect).toHaveBeenCalledTimes(1);
		});

		it('should call both onMenuItemSelect and item.onSelect', () => {
			const onMenuItemSelect = vi.fn();
			const itemOnSelect = vi.fn();
			const item: DropdownMenuItemOrSeparator = {
				id: 'item-1',
				label: 'Option 1',
				onSelect: itemOnSelect,
			};

			handleMenuItemSelect({ item, onMenuItemSelect });

			expect(onMenuItemSelect).toHaveBeenCalledTimes(1);
			expect(itemOnSelect).toHaveBeenCalledTimes(1);
		});

		it('should handle async item.onSelect', async () => {
			const itemOnSelect = vi.fn().mockResolvedValue(undefined);
			const item: DropdownMenuItemOrSeparator = {
				id: 'item-1',
				label: 'Option 1',
				onSelect: itemOnSelect,
			};

			handleMenuItemSelect({ item, onMenuItemSelect: undefined });

			expect(itemOnSelect).toHaveBeenCalledTimes(1);
			// Wait for promise to resolve
			await itemOnSelect.mock.results[0]?.value;
		});

		it('should handle errors from async item.onSelect gracefully', async () => {
			const itemOnSelect = vi.fn().mockRejectedValue(new Error('Test error'));
			const item: DropdownMenuItemOrSeparator = {
				id: 'item-1',
				label: 'Option 1',
				onSelect: itemOnSelect,
			};

			// Should not throw
			expect(() => {
				handleMenuItemSelect({ item, onMenuItemSelect: undefined });
			}).not.toThrow();

			// Wait for promise to reject
			await expect(itemOnSelect.mock.results[0]?.value).rejects.toThrow('Test error');
		});

		it('should not throw when onMenuItemSelect is undefined', () => {
			const item: DropdownMenuItemOrSeparator = {
				id: 'item-1',
				label: 'Option 1',
			};

			expect(() => {
				handleMenuItemSelect({ item, onMenuItemSelect: undefined });
			}).not.toThrow();
		});
	});
});
