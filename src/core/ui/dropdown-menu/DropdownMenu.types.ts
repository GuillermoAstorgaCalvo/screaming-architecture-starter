import type { ReactElement, ReactNode } from 'react';

export type DropdownPosition = 'start' | 'center' | 'end';

export interface DropdownMenuItem {
	readonly id: string;
	readonly label: ReactNode;
	readonly description?: ReactNode;
	readonly icon?: ReactNode;
	readonly shortcut?: string;
	readonly disabled?: boolean;
	readonly onSelect?: () => void | Promise<void>;
}

export interface DropdownMenuSeparator {
	readonly id: string;
	readonly type: 'separator';
}

export type DropdownMenuItemOrSeparator = DropdownMenuItem | DropdownMenuSeparator;

export interface DropdownMenuProps {
	readonly trigger: ReactElement;
	readonly items: DropdownMenuItemOrSeparator[];
	readonly isOpen?: boolean;
	readonly onOpenChange?: (isOpen: boolean) => void;
	readonly onSelect?: (item: DropdownMenuItem) => void;
	readonly align?: DropdownPosition;
	readonly className?: string;
	readonly menuLabel?: string;
	readonly maxHeight?: number;
	readonly emptyState?: ReactNode;
}
