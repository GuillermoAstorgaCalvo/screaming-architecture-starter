/**
 * MenubarRender Tests
 *
 * Tests for menubar rendering helper:
 * - renderMenubarItem
 */

import { MenubarItem } from '@core/ui/navigation/menubar/components/MenubarItem';
import { MenubarSubmenu } from '@core/ui/navigation/menubar/components/MenubarSubmenu';
import { renderMenubarItem } from '@core/ui/navigation/menubar/helpers/MenubarRender';
import type { MenubarItem as MenubarItemType } from '@src-types/ui/navigation/menubar';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('renderMenubarItem', () => {
	it('renders MenubarItem for item without submenu', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		const handleItemClick = vi.fn();
		const handleSubmenuClose = vi.fn();

		const result = renderMenubarItem({
			item,
			activeItemId: null,
			openSubmenuId: null,
			itemRef: createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>,
			handleItemClick,
			handleSubmenuClose,
		});

		expect(result.type).toBe(MenubarItem);
		expect(result.props.item).toBe(item);
		expect(result.props.isActive).toBe(false);
	});

	it('renders MenubarSubmenu for item with submenu', () => {
		const item: MenubarItemType = {
			id: 'file',
			label: 'File',
			submenu: [{ id: 'new', label: 'New' }],
		};
		const handleItemClick = vi.fn();
		const handleSubmenuClose = vi.fn();

		const result = renderMenubarItem({
			item,
			activeItemId: null,
			openSubmenuId: null,
			itemRef: createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>,
			handleItemClick,
			handleSubmenuClose,
		});

		expect(result.type).toBe(MenubarSubmenu);
		expect(result.props.item).toBe(item);
		expect(result.props.isActive).toBe(false);
		expect(result.props.isOpen).toBe(false);
	});

	it('sets isActive correctly', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		const handleItemClick = vi.fn();
		const handleSubmenuClose = vi.fn();

		const result = renderMenubarItem({
			item,
			activeItemId: 'file',
			openSubmenuId: null,
			itemRef: createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>,
			handleItemClick,
			handleSubmenuClose,
		});

		expect(result.props.isActive).toBe(true);
	});

	it('sets isOpen correctly for submenu', () => {
		const item: MenubarItemType = {
			id: 'file',
			label: 'File',
			submenu: [{ id: 'new', label: 'New' }],
		};
		const handleItemClick = vi.fn();
		const handleSubmenuClose = vi.fn();

		const result = renderMenubarItem({
			item,
			activeItemId: 'file',
			openSubmenuId: 'file',
			itemRef: createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>,
			handleItemClick,
			handleSubmenuClose,
		});

		expect(result.props.isOpen).toBe(true);
		expect(result.props.isActive).toBe(true);
	});

	it('passes itemRef to rendered component', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		const itemRef = createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>;
		const handleItemClick = vi.fn();
		const handleSubmenuClose = vi.fn();

		const result = renderMenubarItem({
			item,
			activeItemId: null,
			openSubmenuId: null,
			itemRef,
			handleItemClick,
			handleSubmenuClose,
		});

		expect(result.props.itemRef).toBe(itemRef);
	});

	it('wraps onClick handler correctly for MenubarItem', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		const handleItemClick = vi.fn();
		const handleSubmenuClose = vi.fn();

		const result = renderMenubarItem({
			item,
			activeItemId: null,
			openSubmenuId: null,
			itemRef: createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>,
			handleItemClick,
			handleSubmenuClose,
		});

		expect(result.props.onClick).toBeDefined();
		expect(typeof result.props.onClick).toBe('function');
	});

	it('wraps onItemClick handler correctly for MenubarSubmenu', () => {
		const item: MenubarItemType = {
			id: 'file',
			label: 'File',
			submenu: [{ id: 'new', label: 'New' }],
		};
		const handleItemClick = vi.fn();
		const handleSubmenuClose = vi.fn();

		const result = renderMenubarItem({
			item,
			activeItemId: null,
			openSubmenuId: null,
			itemRef: createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>,
			handleItemClick,
			handleSubmenuClose,
		});

		expect(result.props.onItemClick).toBeDefined();
		expect(typeof result.props.onItemClick).toBe('function');
	});

	it('renders item with empty submenu as regular item', () => {
		const item: MenubarItemType = {
			id: 'file',
			label: 'File',
			submenu: [],
		};
		const handleItemClick = vi.fn();
		const handleSubmenuClose = vi.fn();

		const result = renderMenubarItem({
			item,
			activeItemId: null,
			openSubmenuId: null,
			itemRef: createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>,
			handleItemClick,
			handleSubmenuClose,
		});

		expect(result.type).toBe(MenubarItem);
	});
});
