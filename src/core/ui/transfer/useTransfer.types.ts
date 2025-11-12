import type { TransferOption, TransferProps } from '@src-types/ui/data';

export interface UseTransferReturn<T = unknown> {
	readonly sourceOptions: readonly TransferOption<T>[];
	readonly targetOptions: readonly TransferOption<T>[];
	readonly selectedSourceValues: Set<string>;
	readonly selectedTargetValues: Set<string>;
	readonly sourceSearchValue: string;
	readonly targetSearchValue: string;
	readonly handleSourceSearchChange: (value: string) => void;
	readonly handleTargetSearchChange: (value: string) => void;
	readonly handleSourceItemToggle: (value: string) => void;
	readonly handleTargetItemToggle: (value: string) => void;
	readonly handleSourceSelectAll: () => void;
	readonly handleSourceSelectNone: () => void;
	readonly handleTargetSelectAll: () => void;
	readonly handleTargetSelectNone: () => void;
	readonly handleMoveToTarget: () => void;
	readonly handleMoveToSource: () => void;
	readonly isMoveToTargetDisabled: boolean;
	readonly isMoveToSourceDisabled: boolean;
	readonly props: Readonly<TransferProps<T>>;
}

export interface FilterOptionsParams<T> {
	readonly options: readonly TransferOption<T>[];
	readonly searchValue: string;
	readonly showSearch: boolean;
	readonly filterFn?: (option: TransferOption<T>, searchValue: string) => boolean;
}

export interface SearchHandlersParams {
	readonly setSourceSearchValue: (value: string) => void;
	readonly setTargetSearchValue: (value: string) => void;
	readonly setSelectedSourceValues: (
		value: Set<string> | ((prev: Set<string>) => Set<string>)
	) => void;
	readonly setSelectedTargetValues: (
		value: Set<string> | ((prev: Set<string>) => Set<string>)
	) => void;
}

export interface SelectAllHandlersParams<T> {
	readonly disabled: boolean;
	readonly filteredSourceOptions: readonly TransferOption<T>[];
	readonly filteredTargetOptions: readonly TransferOption<T>[];
	readonly setSelectedSourceValues: (value: Set<string>) => void;
	readonly setSelectedTargetValues: (value: Set<string>) => void;
}

export interface MoveHandlersParams {
	readonly disabled: boolean;
	readonly currentValue: string[];
	readonly selectedSourceValues: Set<string>;
	readonly selectedTargetValues: Set<string>;
	readonly setValue: (value: string[]) => void;
	readonly setSelectedSourceValues: (value: Set<string>) => void;
	readonly setSelectedTargetValues: (value: Set<string>) => void;
	readonly setSourceSearchValue: (value: string) => void;
	readonly setTargetSearchValue: (value: string) => void;
}

export interface ComputedDisabledStatesParams<T> {
	readonly disabled: boolean;
	readonly selectedSourceValues: Set<string>;
	readonly selectedTargetValues: Set<string>;
	readonly filteredSourceOptions: readonly TransferOption<T>[];
	readonly filteredTargetOptions: readonly TransferOption<T>[];
}

export interface FilteredOptionsParams<T> {
	readonly sourceOptions: readonly TransferOption<T>[];
	readonly targetOptions: readonly TransferOption<T>[];
	readonly sourceSearchValue: string;
	readonly targetSearchValue: string;
	readonly showSearch: boolean;
	readonly filterFn?: (option: TransferOption<T>, searchValue: string) => boolean;
}

export interface TransferState {
	readonly sourceSearchValue: string;
	readonly targetSearchValue: string;
	readonly selectedSourceValues: Set<string>;
	readonly selectedTargetValues: Set<string>;
	readonly setSourceSearchValue: (value: string) => void;
	readonly setTargetSearchValue: (value: string) => void;
	readonly setSelectedSourceValues: (
		value: Set<string> | ((prev: Set<string>) => Set<string>)
	) => void;
	readonly setSelectedTargetValues: (
		value: Set<string> | ((prev: Set<string>) => Set<string>)
	) => void;
}

export interface TransferHandlers {
	readonly handleSourceSearchChange: (value: string) => void;
	readonly handleTargetSearchChange: (value: string) => void;
	readonly handleSourceItemToggle: (value: string) => void;
	readonly handleTargetItemToggle: (value: string) => void;
	readonly handleSourceSelectAll: () => void;
	readonly handleSourceSelectNone: () => void;
	readonly handleTargetSelectAll: () => void;
	readonly handleTargetSelectNone: () => void;
	readonly handleMoveToTarget: () => void;
	readonly handleMoveToSource: () => void;
}

export interface TransferHandlersParams<T> {
	readonly disabled: boolean;
	readonly currentValue: string[];
	readonly state: TransferState;
	readonly setValue: (value: string[]) => void;
	readonly filteredSourceOptions: readonly TransferOption<T>[];
	readonly filteredTargetOptions: readonly TransferOption<T>[];
}

export interface BuildTransferReturnParams<T> {
	readonly state: TransferState;
	readonly filteredSourceOptions: readonly TransferOption<T>[];
	readonly filteredTargetOptions: readonly TransferOption<T>[];
	readonly handlers: TransferHandlers;
	readonly isMoveToTargetDisabled: boolean;
	readonly isMoveToSourceDisabled: boolean;
	readonly props: Readonly<TransferProps<T>>;
}

export interface TransferComputationResult<T> {
	readonly filteredSourceOptions: readonly TransferOption<T>[];
	readonly filteredTargetOptions: readonly TransferOption<T>[];
	readonly handlers: TransferHandlers;
	readonly isMoveToTargetDisabled: boolean;
	readonly isMoveToSourceDisabled: boolean;
}

export interface TransferComputationParams<T> {
	readonly options: readonly TransferOption<T>[];
	readonly currentValue: string[];
	readonly state: TransferState;
	readonly setValue: (value: string[]) => void;
	readonly showSearch: boolean;
	readonly filterFn: ((option: TransferOption<T>, searchValue: string) => boolean) | undefined;
	readonly disabled: boolean;
}
