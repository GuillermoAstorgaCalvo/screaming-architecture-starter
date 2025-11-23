/**
 * useSplitButton Tests
 *
 * Tests for the useSplitButton hook:
 * - Memoized values
 * - Class generation
 * - Dropdown trigger creation
 * - Handle select function
 */

import { useSplitButton } from '@core/ui/split-button/hooks/useSplitButton';
import type { ButtonVariant, SplitButtonProps } from '@src-types/ui/buttons';
import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useSplitButton', () => {
	it('should return buttonClasses, dropdownButtonClasses, dropdownTrigger, and handleSelect', () => {
		const { result } = renderHook(() =>
			useSplitButton({
				variant: 'primary',
				size: 'md',
				className: undefined,
				disabled: undefined,
				isLoading: false,
				dropdownAriaLabel: 'More options',
				onMenuItemSelect: undefined,
			})
		);

		expect(result.current).toHaveProperty('buttonClasses');
		expect(result.current).toHaveProperty('dropdownButtonClasses');
		expect(result.current).toHaveProperty('dropdownTrigger');
		expect(result.current).toHaveProperty('handleSelect');
	});

	it('should generate buttonClasses', () => {
		const { result } = renderHook(() =>
			useSplitButton({
				variant: 'primary',
				size: 'md',
				className: undefined,
				disabled: undefined,
				isLoading: false,
				dropdownAriaLabel: 'More options',
				onMenuItemSelect: undefined,
			})
		);

		expect(typeof result.current.buttonClasses).toBe('string');
		expect(result.current.buttonClasses.length).toBeGreaterThan(0);
		expect(result.current.buttonClasses).toContain('rounded-r-none');
	});

	it('should generate dropdownButtonClasses', () => {
		const { result } = renderHook(() =>
			useSplitButton({
				variant: 'primary',
				size: 'md',
				className: undefined,
				disabled: undefined,
				isLoading: false,
				dropdownAriaLabel: 'More options',
				onMenuItemSelect: undefined,
			})
		);

		expect(typeof result.current.dropdownButtonClasses).toBe('string');
		expect(result.current.dropdownButtonClasses.length).toBeGreaterThan(0);
		expect(result.current.dropdownButtonClasses).toContain('rounded-l-none');
		expect(result.current.dropdownButtonClasses).toContain('border-l');
	});

	it('should create dropdownTrigger element', () => {
		const { result } = renderHook(() =>
			useSplitButton({
				variant: 'primary',
				size: 'md',
				className: undefined,
				disabled: undefined,
				isLoading: false,
				dropdownAriaLabel: 'More options',
				onMenuItemSelect: undefined,
			})
		);

		render(result.current.dropdownTrigger);
		const button = screen.getByRole('button', { name: 'More options' });
		expect(button).toBeInTheDocument();
	});

	it('should memoize buttonClasses based on variant, size, and className', () => {
		const { result, rerender } = renderHook(
			({ variant, size, className }) =>
				useSplitButton({
					variant,
					size,
					className,
					disabled: undefined,
					isLoading: false,
					dropdownAriaLabel: 'More options',
					onMenuItemSelect: undefined,
				}),
			{
				initialProps: {
					variant: 'primary' as ButtonVariant,
					size: 'md' as const,
					className: undefined,
				},
			}
		);

		const firstClasses = result.current.buttonClasses;

		// Same props should return same classes
		rerender({
			variant: 'primary',
			size: 'md',
			className: undefined,
		});
		expect(result.current.buttonClasses).toBe(firstClasses);

		// Different variant should return different classes
		rerender({
			variant: 'secondary',
			size: 'md',
			className: undefined,
		});
		expect(result.current.buttonClasses).not.toBe(firstClasses);
	});

	it('should memoize dropdownButtonClasses based on variant, size, and borderColorClass', () => {
		const { result, rerender } = renderHook(
			({ variant, size }) =>
				useSplitButton({
					variant,
					size,
					className: undefined,
					disabled: undefined,
					isLoading: false,
					dropdownAriaLabel: 'More options',
					onMenuItemSelect: undefined,
				}),
			{
				initialProps: {
					variant: 'primary' as ButtonVariant,
					size: 'md' as const,
				},
			}
		);

		const firstClasses = result.current.dropdownButtonClasses;

		// Same props should return same classes
		rerender({
			variant: 'primary' as ButtonVariant,
			size: 'md' as const,
		});
		expect(result.current.dropdownButtonClasses).toBe(firstClasses);

		// Different variant should return different classes
		rerender({
			variant: 'secondary' as ButtonVariant,
			size: 'md' as const,
		});
		expect(result.current.dropdownButtonClasses).not.toBe(firstClasses);
	});

	it('should memoize dropdownTrigger based on disabled, isLoading, dropdownButtonClasses, and dropdownAriaLabel', () => {
		const { result, rerender } = renderHook(
			({ disabled, isLoading, dropdownAriaLabel }) =>
				useSplitButton({
					variant: 'primary',
					size: 'md',
					className: undefined,
					disabled,
					isLoading,
					dropdownAriaLabel,
					onMenuItemSelect: undefined,
				}),
			{
				initialProps: {
					disabled: undefined as boolean | undefined,
					isLoading: false,
					dropdownAriaLabel: 'More options',
				},
			}
		);

		const firstTrigger = result.current.dropdownTrigger;

		// Same props should return same trigger
		rerender({
			disabled: undefined as boolean | undefined,
			isLoading: false,
			dropdownAriaLabel: 'More options',
		});
		expect(result.current.dropdownTrigger).toBe(firstTrigger);

		// Different disabled should return different trigger
		rerender({
			disabled: true as boolean | undefined,
			isLoading: false,
			dropdownAriaLabel: 'More options',
		});
		expect(result.current.dropdownTrigger).not.toBe(firstTrigger);
	});

	it('should create handleSelect function', () => {
		const { result } = renderHook(() =>
			useSplitButton({
				variant: 'primary',
				size: 'md',
				className: undefined,
				disabled: undefined,
				isLoading: false,
				dropdownAriaLabel: 'More options',
				onMenuItemSelect: undefined,
			})
		);

		expect(typeof result.current.handleSelect).toBe('function');
	});

	it('should memoize handleSelect based on onMenuItemSelect', () => {
		const onMenuItemSelect1 = vi.fn();
		const onMenuItemSelect2 = vi.fn();

		const { result, rerender } = renderHook(
			({ onMenuItemSelect }) =>
				useSplitButton({
					variant: 'primary',
					size: 'md',
					className: undefined,
					disabled: undefined,
					isLoading: false,
					dropdownAriaLabel: 'More options',
					onMenuItemSelect,
				}),
			{
				initialProps: {
					onMenuItemSelect: onMenuItemSelect1,
				},
			}
		);

		const firstHandleSelect = result.current.handleSelect;

		// Same callback should return same function
		rerender({ onMenuItemSelect: onMenuItemSelect1 });
		expect(result.current.handleSelect).toBe(firstHandleSelect);

		// Different callback should return different function
		rerender({ onMenuItemSelect: onMenuItemSelect2 });
		expect(result.current.handleSelect).not.toBe(firstHandleSelect);
	});

	it('should work with different variants', () => {
		const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost'];
		for (const variant of variants) {
			const { result } = renderHook(() =>
				useSplitButton({
					variant,
					size: 'md',
					className: undefined,
					disabled: undefined,
					isLoading: false,
					dropdownAriaLabel: 'More options',
					onMenuItemSelect: undefined,
				})
			);

			expect(result.current.buttonClasses).toBeTruthy();
			expect(result.current.dropdownButtonClasses).toBeTruthy();
		}
	});

	it('should work with different sizes', () => {
		const sizes: SplitButtonProps['size'][] = ['sm', 'md', 'lg'];
		for (const size of sizes) {
			const { result } = renderHook(() =>
				useSplitButton({
					variant: 'primary',
					size,
					className: undefined,
					disabled: undefined,
					isLoading: false,
					dropdownAriaLabel: 'More options',
					onMenuItemSelect: undefined,
				})
			);

			expect(result.current.buttonClasses).toBeTruthy();
			expect(result.current.dropdownButtonClasses).toBeTruthy();
		}
	});

	it('should handle className in buttonClasses', () => {
		const { result } = renderHook(() =>
			useSplitButton({
				variant: 'primary',
				size: 'md',
				className: 'custom-class',
				disabled: undefined,
				isLoading: false,
				dropdownAriaLabel: 'More options',
				onMenuItemSelect: undefined,
			})
		);

		expect(result.current.buttonClasses).toContain('custom-class');
	});

	it('should create disabled dropdown trigger when disabled is true', () => {
		const { result } = renderHook(() =>
			useSplitButton({
				variant: 'primary',
				size: 'md',
				className: undefined,
				disabled: true,
				isLoading: false,
				dropdownAriaLabel: 'More options',
				onMenuItemSelect: undefined,
			})
		);

		render(result.current.dropdownTrigger);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('should create disabled dropdown trigger when isLoading is true', () => {
		const { result } = renderHook(() =>
			useSplitButton({
				variant: 'primary',
				size: 'md',
				className: undefined,
				disabled: undefined,
				isLoading: true,
				dropdownAriaLabel: 'More options',
				onMenuItemSelect: undefined,
			})
		);

		render(result.current.dropdownTrigger);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});
});
