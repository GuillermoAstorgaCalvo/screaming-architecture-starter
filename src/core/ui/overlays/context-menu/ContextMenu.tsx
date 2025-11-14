import { useTranslation } from '@core/i18n/useTranslation';
import { ContextMenuContent } from '@core/ui/overlays/context-menu/components/ContextMenuContent';
import { useContextMenu } from '@core/ui/overlays/context-menu/hooks/useContextMenu';
import type { ReactElement, ReactNode } from 'react';

export type ContextMenuPosition = 'start' | 'center' | 'end';

export interface ContextMenuItem {
	readonly id: string;
	readonly label: ReactNode;
	readonly description?: ReactNode;
	readonly icon?: ReactNode;
	readonly shortcut?: string;
	readonly disabled?: boolean;
	readonly onSelect?: () => void | Promise<void>;
}

export interface ContextMenuSeparator {
	readonly id: string;
	readonly type: 'separator';
}

export type ContextMenuItemOrSeparator = ContextMenuItem | ContextMenuSeparator;

export interface ContextMenuProps {
	/** Trigger element (the element that opens the context menu on right-click) */
	trigger: ReactElement;
	/** Menu items to display */
	items: ContextMenuItemOrSeparator[];
	/** Whether the menu is open (controlled) */
	isOpen?: boolean;
	/** Callback when open state changes */
	onOpenChange?: (isOpen: boolean) => void;
	/** Callback when an item is selected */
	onSelect?: (item: ContextMenuItem) => void;
	/** Alignment of the menu @default 'center' */
	align?: ContextMenuPosition;
	/** Additional className */
	className?: string;
	/** Label for the menu (for accessibility) */
	menuLabel?: string;
	/** Maximum height of the menu in pixels @default 280 */
	maxHeight?: number;
	/** Empty state message when no items @default 'No actions available' */
	emptyState?: ReactNode;
}

/**
 * ContextMenu - Right-click context menu component
 *
 * Features:
 * - Accessible: proper ARIA attributes and keyboard navigation
 * - Right-click trigger
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Positioned relative to cursor
 * - Click outside to close
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <ContextMenu
 *   trigger={<div>Right-click me</div>}
 *   items={[
 *     { id: '1', label: 'Copy', onSelect: () => console.log('Copy') },
 *     { id: '2', label: 'Paste', onSelect: () => console.log('Paste') },
 *   ]}
 * />
 * ```
 */
export default function ContextMenu({
	trigger,
	items,
	isOpen,
	onOpenChange,
	onSelect,
	align = 'center',
	className,
	menuLabel,
	maxHeight = 280,
	emptyState,
}: Readonly<ContextMenuProps>) {
	const { t } = useTranslation('common');
	const defaultEmptyState = emptyState ?? t('noActionsAvailable');
	const contextMenuData = useContextMenu({ items, isOpen, onOpenChange, onSelect });
	return (
		<ContextMenuContent
			{...contextMenuData}
			trigger={trigger}
			align={align}
			className={className}
			menuLabel={menuLabel}
			maxHeight={maxHeight}
			emptyState={defaultEmptyState}
			items={items}
		/>
	);
}
