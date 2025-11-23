import { useNavigationMenu } from '@core/ui/navigation/navigation-menu/hooks/useNavigationMenu';
import type { NavigationMenuItem } from '@src-types/ui/navigation/navigationMenu';
import { renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useNavigationMenu', () => {
	const createMockItems = (): readonly NavigationMenuItem[] => [
		{ id: 'home', label: 'Home', to: '/' },
		{ id: 'about', label: 'About', to: '/about' },
		{ id: 'contact', label: 'Contact', to: '/contact' },
	];

	it('returns handleKeyDown and itemRefs', () => {
		const items = createMockItems();
		const activeItemId = 'home';
		const onItemChange = vi.fn();

		const { result } = renderHook(() => useNavigationMenu({ items, activeItemId, onItemChange }));

		expect(result.current.handleKeyDown).toBeDefined();
		expect(result.current.itemRefs).toBeDefined();
		expect(Array.isArray(result.current.itemRefs)).toBe(true);
	});

	it('creates refs for all items', () => {
		const items = createMockItems();
		const activeItemId = 'home';
		const onItemChange = vi.fn();

		const { result } = renderHook(() => useNavigationMenu({ items, activeItemId, onItemChange }));

		expect(result.current.itemRefs).toHaveLength(items.length);
		for (const ref of result.current.itemRefs) {
			expect(ref).toHaveProperty('current');
		}
	});

	it('creates new refs when items change', () => {
		const initialItems = createMockItems();
		const activeItemId = 'home';
		const onItemChange = vi.fn();

		const { result, rerender } = renderHook(
			({ items }) => useNavigationMenu({ items, activeItemId, onItemChange }),
			{
				initialProps: { items: initialItems },
			}
		);

		const initialRefs = result.current.itemRefs;

		const newItems: readonly NavigationMenuItem[] = [
			...initialItems,
			{ id: 'blog', label: 'Blog', to: '/blog' },
		];

		rerender({ items: newItems });

		expect(result.current.itemRefs).toHaveLength(newItems.length);
		// Refs should be new instances
		expect(result.current.itemRefs).not.toBe(initialRefs);
	});

	it('handleKeyDown calls onItemChange when ArrowRight is pressed', () => {
		const items = createMockItems();
		const activeItemId = 'home';
		const onItemChange = vi.fn();

		const { result } = renderHook(() => useNavigationMenu({ items, activeItemId, onItemChange }));

		// Mock refs with elements
		for (const ref of result.current.itemRefs) {
			ref.current = {
				querySelector: vi.fn(() => document.createElement('a')),
			} as unknown as HTMLLIElement;
		}

		const event = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLElement>;

		result.current.handleKeyDown(event);

		expect(onItemChange).toHaveBeenCalledWith('about');
		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('handleKeyDown calls onItemChange when ArrowLeft is pressed', () => {
		const items = createMockItems();
		const activeItemId = 'about';
		const onItemChange = vi.fn();

		const { result } = renderHook(() => useNavigationMenu({ items, activeItemId, onItemChange }));

		// Mock refs with elements
		for (const ref of result.current.itemRefs) {
			ref.current = {
				querySelector: vi.fn(() => document.createElement('a')),
			} as unknown as HTMLLIElement;
		}

		const event = {
			key: 'ArrowLeft',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLElement>;

		result.current.handleKeyDown(event);

		expect(onItemChange).toHaveBeenCalledWith('home');
		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('handleKeyDown updates when items change', () => {
		const initialItems = createMockItems();
		const activeItemId = 'home';
		const onItemChange = vi.fn();

		const { result, rerender } = renderHook(
			({ items }) => useNavigationMenu({ items, activeItemId, onItemChange }),
			{
				initialProps: { items: initialItems },
			}
		);

		// Mock refs
		for (const ref of result.current.itemRefs) {
			ref.current = {
				querySelector: vi.fn(() => document.createElement('a')),
			} as unknown as HTMLLIElement;
		}

		const newItems: readonly NavigationMenuItem[] = [
			{ id: 'home', label: 'Home' },
			{ id: 'services', label: 'Services' },
		];

		rerender({ items: newItems });

		// Mock new refs
		for (const ref of result.current.itemRefs) {
			ref.current = {
				querySelector: vi.fn(() => document.createElement('a')),
			} as unknown as HTMLLIElement;
		}

		const event = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLElement>;

		result.current.handleKeyDown(event);

		expect(onItemChange).toHaveBeenCalledWith('services');
	});

	it('handleKeyDown updates when activeItemId changes', () => {
		const items = createMockItems();
		const onItemChange = vi.fn();

		const { result, rerender } = renderHook(
			({ activeItemId }) => useNavigationMenu({ items, activeItemId, onItemChange }),
			{
				initialProps: { activeItemId: 'home' },
			}
		);

		// Mock refs
		for (const ref of result.current.itemRefs) {
			ref.current = {
				querySelector: vi.fn(() => document.createElement('a')),
			} as unknown as HTMLLIElement;
		}

		rerender({ activeItemId: 'about' });

		const event = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLElement>;

		result.current.handleKeyDown(event);

		expect(onItemChange).toHaveBeenCalledWith('contact');
	});

	it('handleKeyDown updates when onItemChange changes', () => {
		const items = createMockItems();
		const activeItemId = 'home';
		const onItemChange1 = vi.fn();
		const onItemChange2 = vi.fn();

		const { result, rerender } = renderHook(
			({ onItemChange }) => useNavigationMenu({ items, activeItemId, onItemChange }),
			{
				initialProps: { onItemChange: onItemChange1 },
			}
		);

		// Mock refs
		for (const ref of result.current.itemRefs) {
			ref.current = {
				querySelector: vi.fn(() => document.createElement('a')),
			} as unknown as HTMLLIElement;
		}

		rerender({ onItemChange: onItemChange2 });

		const event = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLElement>;

		result.current.handleKeyDown(event);

		expect(onItemChange2).toHaveBeenCalledWith('about');
		expect(onItemChange1).not.toHaveBeenCalled();
	});

	it('maintains stable refs when items array reference changes but content is same', () => {
		const items1 = createMockItems();
		const items2 = createMockItems(); // Same content, different reference
		const activeItemId = 'home';
		const onItemChange = vi.fn();

		const { result, rerender } = renderHook(
			({ items }) => useNavigationMenu({ items, activeItemId, onItemChange }),
			{
				initialProps: { items: items1 },
			}
		);

		const initialRefs = result.current.itemRefs;

		rerender({ items: items2 });

		// Refs should be recreated because items array reference changed
		expect(result.current.itemRefs).not.toBe(initialRefs);
		expect(result.current.itemRefs).toHaveLength(items2.length);
	});
});
