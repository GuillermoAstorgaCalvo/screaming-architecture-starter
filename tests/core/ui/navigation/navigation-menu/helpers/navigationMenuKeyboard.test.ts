import { handleNavigationKeyDown } from '@core/ui/navigation/navigation-menu/helpers/navigationMenuKeyboard';
import type { NavigationMenuItem } from '@src-types/ui/navigation/navigationMenu';
import type { KeyboardEvent } from 'react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('navigationMenuKeyboard', () => {
	const createMockEvent = (key: string): KeyboardEvent<HTMLElement> => {
		return {
			key,
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as KeyboardEvent<HTMLElement>;
	};

	const createMockItems = (): readonly NavigationMenuItem[] => [
		{ id: 'home', label: 'Home', to: '/' },
		{ id: 'about', label: 'About', to: '/about' },
		{ id: 'contact', label: 'Contact', to: '/contact' },
	];

	const createMockRefs = (count: number) => {
		return Array.from({ length: count }, () => {
			const ref = createRef<HTMLLIElement | null>();
			// Mock the element with querySelector
			ref.current = {
				querySelector: vi.fn((selector: string) => {
					if (selector === 'a, button') {
						return document.createElement('a');
					}
					return null;
				}),
			} as unknown as HTMLLIElement;
			return ref;
		});
	};

	describe('ArrowRight key', () => {
		it('navigates to next item', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowRight');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'home',
				onItemChange,
				itemRefs,
			});

			expect(event.preventDefault).toHaveBeenCalled();
			expect(onItemChange).toHaveBeenCalledWith('about');
		});

		it('wraps around to first item when at last item', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowRight');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'contact',
				onItemChange,
				itemRefs,
			});

			expect(onItemChange).toHaveBeenCalledWith('home');
		});

		it('skips disabled items', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: 'home', label: 'Home' },
				{ id: 'about', label: 'About', disabled: true },
				{ id: 'contact', label: 'Contact' },
			];
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowRight');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'home',
				onItemChange,
				itemRefs,
			});

			expect(onItemChange).toHaveBeenCalledWith('contact');
		});
	});

	describe('ArrowLeft key', () => {
		it('navigates to previous item', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowLeft');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'about',
				onItemChange,
				itemRefs,
			});

			expect(event.preventDefault).toHaveBeenCalled();
			expect(onItemChange).toHaveBeenCalledWith('home');
		});

		it('wraps around to last item when at first item', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowLeft');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'home',
				onItemChange,
				itemRefs,
			});

			expect(onItemChange).toHaveBeenCalledWith('contact');
		});

		it('skips disabled items', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: 'home', label: 'Home' },
				{ id: 'about', label: 'About', disabled: true },
				{ id: 'contact', label: 'Contact' },
			];
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowLeft');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'contact',
				onItemChange,
				itemRefs,
			});

			expect(onItemChange).toHaveBeenCalledWith('home');
		});
	});

	describe('ArrowDown key', () => {
		it('navigates to next item (same as ArrowRight)', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowDown');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'home',
				onItemChange,
				itemRefs,
			});

			expect(event.preventDefault).toHaveBeenCalled();
			expect(onItemChange).toHaveBeenCalledWith('about');
		});
	});

	describe('ArrowUp key', () => {
		it('navigates to previous item (same as ArrowLeft)', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowUp');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'about',
				onItemChange,
				itemRefs,
			});

			expect(event.preventDefault).toHaveBeenCalled();
			expect(onItemChange).toHaveBeenCalledWith('home');
		});
	});

	describe('Home key', () => {
		it('navigates to first enabled item', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('Home');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'contact',
				onItemChange,
				itemRefs,
			});

			expect(event.preventDefault).toHaveBeenCalled();
			expect(onItemChange).toHaveBeenCalledWith('home');
		});

		it('skips disabled first item', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: 'home', label: 'Home', disabled: true },
				{ id: 'about', label: 'About' },
				{ id: 'contact', label: 'Contact' },
			];
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('Home');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'contact',
				onItemChange,
				itemRefs,
			});

			expect(onItemChange).toHaveBeenCalledWith('about');
		});
	});

	describe('End key', () => {
		it('navigates to last enabled item', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('End');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'home',
				onItemChange,
				itemRefs,
			});

			expect(event.preventDefault).toHaveBeenCalled();
			expect(onItemChange).toHaveBeenCalledWith('contact');
		});

		it('skips disabled last item', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: 'home', label: 'Home' },
				{ id: 'about', label: 'About' },
				{ id: 'contact', label: 'Contact', disabled: true },
			];
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('End');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'home',
				onItemChange,
				itemRefs,
			});

			expect(onItemChange).toHaveBeenCalledWith('about');
		});
	});

	describe('unknown keys', () => {
		it('does not call onItemChange for unknown keys', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('Enter');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'home',
				onItemChange,
				itemRefs,
			});

			expect(onItemChange).not.toHaveBeenCalled();
		});
	});

	describe('edge cases', () => {
		it('handles activeItemId not found in items', () => {
			const items = createMockItems();
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowRight');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'nonexistent',
				onItemChange,
				itemRefs,
			});

			// Should navigate to first item when current index is -1
			expect(onItemChange).toHaveBeenCalledWith('home');
		});

		it('handles all items disabled gracefully', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: 'home', label: 'Home', disabled: true },
				{ id: 'about', label: 'About', disabled: true },
			];
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowRight');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'home',
				onItemChange,
				itemRefs,
			});

			// Should not call onItemChange when no enabled items found
			expect(onItemChange).not.toHaveBeenCalled();
		});

		it('handles single item', () => {
			const items: readonly NavigationMenuItem[] = [{ id: 'home', label: 'Home' }];
			const itemRefs = createMockRefs(items.length);
			const onItemChange = vi.fn();
			const event = createMockEvent('ArrowRight');

			handleNavigationKeyDown({
				event,
				items,
				activeItemId: 'home',
				onItemChange,
				itemRefs,
			});

			// Should wrap to same item
			expect(onItemChange).toHaveBeenCalledWith('home');
		});
	});
});
