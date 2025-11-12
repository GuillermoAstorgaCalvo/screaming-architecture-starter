import type { StandardSize } from '@src-types/ui/base';
import type { TransferOption } from '@src-types/ui/data';
import type { ReactNode } from 'react';

import type { UseTransferReturn } from './useTransfer.types';

export interface TransferContentProps<T = unknown> extends UseTransferReturn<T> {}

export interface RenderSourceListProps<T> {
	readonly sourceOptions: readonly TransferOption<T>[];
	readonly selectedSourceValues: Set<string>;
	readonly sourceSearchValue: string;
	readonly handleSourceSearchChange: (value: string) => void;
	readonly handleSourceItemToggle: (value: string) => void;
	readonly handleSourceSelectAll: () => void;
	readonly handleSourceSelectNone: () => void;
	readonly sourceTitle: ReactNode;
	readonly searchPlaceholder: string;
	readonly showSearch: boolean;

	readonly size: StandardSize;
	readonly disabled: boolean;
	readonly renderItem?: ((option: TransferOption<T>, isSelected: boolean) => ReactNode) | undefined;
	readonly renderEmpty?: ((listType: 'source' | 'target') => ReactNode) | undefined;
	readonly maxHeight: number;
	readonly showSelectAll: boolean;
	readonly listLabels?: { selectAll?: string; selectNone?: string } | undefined;
}

export interface RenderTargetListProps<T> {
	readonly targetOptions: readonly TransferOption<T>[];
	readonly selectedTargetValues: Set<string>;
	readonly targetSearchValue: string;
	readonly handleTargetSearchChange: (value: string) => void;
	readonly handleTargetItemToggle: (value: string) => void;
	readonly handleTargetSelectAll: () => void;
	readonly handleTargetSelectNone: () => void;
	readonly targetTitle: ReactNode;
	readonly searchPlaceholder: string;
	readonly showSearch: boolean;
	readonly size: StandardSize;
	readonly disabled: boolean;
	readonly renderItem?: ((option: TransferOption<T>, isSelected: boolean) => ReactNode) | undefined;
	readonly renderEmpty?: ((listType: 'source' | 'target') => ReactNode) | undefined;
	readonly maxHeight: number;
	readonly showSelectAll: boolean;
	readonly listLabels?: { selectAll?: string; selectNone?: string } | undefined;
}

export interface RenderActionsProps {
	readonly handleMoveToTarget: () => void;
	readonly handleMoveToSource: () => void;
	readonly isMoveToTargetDisabled: boolean;
	readonly isMoveToSourceDisabled: boolean;
	readonly size: StandardSize;
	readonly disabled: boolean;
	readonly actionLabels?: { moveToRight?: string; moveToLeft?: string } | undefined;
}
