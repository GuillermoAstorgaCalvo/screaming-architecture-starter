import type { StandardSize } from '@src-types/ui/base';
import type { TransferOption } from '@src-types/ui/data';
import type { ReactNode } from 'react';

export interface TransferListProps<T = unknown> {
	readonly type: 'source' | 'target';
	readonly options: readonly TransferOption<T>[];
	readonly selectedValues: Set<string>;
	readonly searchValue: string;
	readonly onSearchChange: (value: string) => void;
	readonly onItemToggle: (value: string) => void;
	readonly onSelectAll: () => void;
	readonly onSelectNone: () => void;
	readonly title: ReactNode;
	readonly searchPlaceholder?: string;
	readonly showSearch?: boolean;
	readonly size?: StandardSize;
	readonly disabled?: boolean;
	readonly renderItem?: ((option: TransferOption<T>, isSelected: boolean) => ReactNode) | undefined;
	readonly renderEmpty?: ((listType: 'source' | 'target') => ReactNode) | undefined;
	readonly maxHeight?: number | undefined;
	readonly showSelectAll?: boolean | undefined;
	readonly labels?:
		| {
				selectAll?: string | undefined;
				selectNone?: string | undefined;
		  }
		| undefined;
}

export interface RenderSelectAllButtonProps {
	readonly allSelected: boolean;
	readonly disabled: boolean;
	readonly labels?: { selectAll?: string | undefined; selectNone?: string | undefined } | undefined;
	readonly onSelectAllToggle: () => void;
}

export interface RenderHeaderProps {
	readonly headerId: string;
	readonly headerClasses: string;
	readonly title: ReactNode;
	readonly showSelectAll: boolean;
	readonly enabledOptionsCount: number;
	readonly allSelected: boolean;
	readonly disabled: boolean;
	readonly labels?: { selectAll?: string | undefined; selectNone?: string | undefined } | undefined;
	readonly onSelectAllToggle: () => void;
}

export interface RenderSearchProps {
	readonly showSearch: boolean;
	readonly searchId: string;
	readonly searchPlaceholder: string;
	readonly searchValue: string;
	readonly onSearchChange: (value: string) => void;
	readonly disabled: boolean;
	readonly size: StandardSize;
	readonly type: 'source' | 'target';
}

export interface RenderListItemProps<T> {
	readonly option: TransferOption<T>;
	readonly isSelected: boolean;
	readonly disabled: boolean;
	readonly size: StandardSize;
	readonly renderItem?: ((option: TransferOption<T>, isSelected: boolean) => ReactNode) | undefined;
	readonly onItemToggle: (value: string) => void;
}

export interface RenderListProps<T> {
	readonly options: readonly TransferOption<T>[];
	readonly selectedValues: Set<string>;
	readonly headerId: string;
	readonly listContainerClasses: string;
	readonly maxHeight: number;
	readonly size: StandardSize;
	readonly disabled: boolean;
	readonly renderItem?: ((option: TransferOption<T>, isSelected: boolean) => ReactNode) | undefined;
	readonly renderEmpty?: ((listType: 'source' | 'target') => ReactNode) | undefined;
	readonly type: 'source' | 'target';
	readonly onItemToggle: (value: string) => void;
}

export interface TransferListSetup<T> {
	readonly searchId: string;
	readonly headerId: string;
	readonly enabledOptions: readonly TransferOption<T>[];
	readonly allSelected: boolean;
	readonly handleSelectAllToggle: () => void;
	readonly containerClasses: string;
	readonly headerClasses: string;
	readonly listContainerClasses: string;
}

export interface TransferListSetupOptions<T> {
	readonly type: 'source' | 'target';
	readonly options: readonly TransferOption<T>[];
	readonly selectedValues: Set<string>;
	readonly size: StandardSize;
	readonly onSelectAll: () => void;
	readonly onSelectNone: () => void;
}

export interface TransferListContentProps<T> {
	readonly type: 'source' | 'target';
	readonly options: readonly TransferOption<T>[];
	readonly selectedValues: Set<string>;
	readonly searchValue: string;
	readonly onSearchChange: (value: string) => void;
	readonly onItemToggle: (value: string) => void;
	readonly title: ReactNode;
	readonly searchPlaceholder: string;
	readonly showSearch: boolean;
	readonly size: StandardSize;
	readonly disabled: boolean;
	readonly renderItem?: ((option: TransferOption<T>, isSelected: boolean) => ReactNode) | undefined;
	readonly renderEmpty?: ((listType: 'source' | 'target') => ReactNode) | undefined;
	readonly maxHeight: number;
	readonly showSelectAll: boolean;
	readonly labels?: { selectAll?: string | undefined; selectNone?: string | undefined } | undefined;
}
