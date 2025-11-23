import {
	getNavigationMenuClasses,
	getNavigationMenuItemClasses,
} from '@core/ui/navigation/navigation-menu/helpers/navigationMenuClasses';
import { describe, expect, it } from 'vitest';

describe('navigationMenuClasses', () => {
	describe('getNavigationMenuClasses', () => {
		it('returns base classes for default variant horizontal', () => {
			const result = getNavigationMenuClasses({
				variant: 'default',
				orientation: 'horizontal',
			});

			expect(result).toContain('w-full');
			expect(result).toContain('flex-row');
		});

		it('returns base classes for default variant vertical', () => {
			const result = getNavigationMenuClasses({
				variant: 'default',
				orientation: 'vertical',
			});

			expect(result).toContain('w-full');
			expect(result).toContain('flex-col');
		});

		it('returns underline variant classes for horizontal orientation', () => {
			const result = getNavigationMenuClasses({
				variant: 'underline',
				orientation: 'horizontal',
			});

			expect(result).toContain('w-full');
			expect(result).toContain('flex-row');
			expect(result).toContain('border-b');
			expect(result).toContain('border-border');
		});

		it('returns underline variant classes for vertical orientation', () => {
			const result = getNavigationMenuClasses({
				variant: 'underline',
				orientation: 'vertical',
			});

			expect(result).toContain('w-full');
			expect(result).toContain('flex-col');
			expect(result).toContain('border-l');
			expect(result).toContain('border-border');
		});

		it('returns pills variant classes', () => {
			const result = getNavigationMenuClasses({
				variant: 'pills',
				orientation: 'horizontal',
			});

			expect(result).toContain('w-full');
			expect(result).toContain('flex-row');
			expect(result).toContain('bg-muted');
			expect(result).toContain('rounded-lg');
			expect(result).toContain('p-1');
		});

		it('includes custom className when provided', () => {
			const result = getNavigationMenuClasses({
				variant: 'default',
				orientation: 'horizontal',
				className: 'custom-class',
			});

			expect(result).toContain('custom-class');
		});

		it('handles undefined className', () => {
			const result = getNavigationMenuClasses({
				variant: 'default',
				orientation: 'horizontal',
			});

			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});
	});

	describe('getNavigationMenuItemClasses', () => {
		describe('size classes', () => {
			it('returns sm size classes for horizontal orientation', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'sm',
					variant: 'default',
					orientation: 'horizontal',
				});

				expect(result).toContain('px-2');
				expect(result).toContain('py-1');
				expect(result).toContain('text-sm');
			});

			it('returns sm size classes for vertical orientation', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'sm',
					variant: 'default',
					orientation: 'vertical',
				});

				expect(result).toContain('px-3');
				expect(result).toContain('py-2');
				expect(result).toContain('text-sm');
			});

			it('returns md size classes for horizontal orientation', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'md',
					variant: 'default',
					orientation: 'horizontal',
				});

				expect(result).toContain('px-3');
				expect(result).toContain('py-1.5');
				expect(result).toContain('text-base');
			});

			it('returns md size classes for vertical orientation', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'md',
					variant: 'default',
					orientation: 'vertical',
				});

				expect(result).toContain('px-4');
				expect(result).toContain('py-2.5');
				expect(result).toContain('text-base');
			});

			it('returns lg size classes for horizontal orientation', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'lg',
					variant: 'default',
					orientation: 'horizontal',
				});

				expect(result).toContain('px-4');
				expect(result).toContain('py-2');
				expect(result).toContain('text-lg');
			});

			it('returns lg size classes for vertical orientation', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'lg',
					variant: 'default',
					orientation: 'vertical',
				});

				expect(result).toContain('px-5');
				expect(result).toContain('py-3');
				expect(result).toContain('text-lg');
			});
		});

		describe('variant classes - default', () => {
			it('returns active classes for default variant', () => {
				const result = getNavigationMenuItemClasses({
					isActive: true,
					size: 'md',
					variant: 'default',
					orientation: 'horizontal',
				});

				expect(result).toContain('text-primary');
			});

			it('returns inactive classes for default variant', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'md',
					variant: 'default',
					orientation: 'horizontal',
				});

				expect(result).toContain('text-text-secondary');
				expect(result).toContain('hover:text-text-primary');
			});
		});

		describe('variant classes - underline', () => {
			it('returns active classes for underline variant horizontal', () => {
				const result = getNavigationMenuItemClasses({
					isActive: true,
					size: 'md',
					variant: 'underline',
					orientation: 'horizontal',
				});

				expect(result).toContain('text-primary');
				expect(result).toContain('border-b-2');
				expect(result).toContain('border-primary');
				expect(result).toContain('-mb-px');
			});

			it('returns active classes for underline variant vertical', () => {
				const result = getNavigationMenuItemClasses({
					isActive: true,
					size: 'md',
					variant: 'underline',
					orientation: 'vertical',
				});

				expect(result).toContain('text-primary');
				expect(result).toContain('border-l-2');
				expect(result).toContain('border-primary');
				expect(result).toContain('-ml-px');
			});

			it('returns inactive classes for underline variant', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'md',
					variant: 'underline',
					orientation: 'horizontal',
				});

				expect(result).toContain('text-text-secondary');
				expect(result).toContain('hover:text-text-primary');
			});
		});

		describe('variant classes - pills', () => {
			it('returns active classes for pills variant', () => {
				const result = getNavigationMenuItemClasses({
					isActive: true,
					size: 'md',
					variant: 'pills',
					orientation: 'horizontal',
				});

				expect(result).toContain('bg-surface');
				expect(result).toContain('text-primary');
				expect(result).toContain('shadow-sm');
			});

			it('returns inactive classes for pills variant', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'md',
					variant: 'pills',
					orientation: 'horizontal',
				});

				expect(result).toContain('text-text-secondary');
				expect(result).toContain('hover:text-text-primary');
			});
		});

		describe('base classes', () => {
			it('always includes base classes', () => {
				const result = getNavigationMenuItemClasses({
					isActive: false,
					size: 'md',
					variant: 'default',
					orientation: 'horizontal',
				});

				expect(result).toContain('inline-flex');
				expect(result).toContain('items-center');
				expect(result).toContain('justify-center');
				expect(result).toContain('font-medium');
				expect(result).toContain('transition-colors');
				expect(result).toContain('focus:outline-none');
				expect(result).toContain('focus:ring-2');
				expect(result).toContain('focus:ring-primary');
				expect(result).toContain('focus:ring-offset-2');
				expect(result).toContain('disabled:opacity-disabled');
				expect(result).toContain('disabled:cursor-not-allowed');
			});
		});
	});
});
