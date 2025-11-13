import { MultiSelectField } from '@core/ui/forms/multi-select/components/MultiSelectField';
import { MultiSelectListbox } from '@core/ui/forms/multi-select/components/MultiSelectListbox';
import {
	MENU_STYLES,
	type MultiSelectListboxProps,
} from '@core/ui/forms/multi-select/helpers/MultiSelectContentHelpers';
import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';
import type { MultiSelectContentProps } from '@core/ui/forms/multi-select/types/MultiSelectTypes';
import Popover from '@core/ui/popover/Popover';
import type { KeyboardEvent, Ref, RefObject } from 'react';

interface MultiSelectPopoverTriggerProps {
	readonly triggerRef: RefObject<HTMLDivElement | null>;
	readonly fieldProps: MultiSelectContentProps['fieldProps'];
	readonly inputRef: MultiSelectContentProps['inputRef'];
	readonly selectedValues: string[];
	readonly options: MultiSelectOption[];
	readonly onRemoveChip: (value: string) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly menuId: string;
	readonly isOpen: boolean;
}

function MultiSelectPopoverTrigger({
	triggerRef,
	fieldProps,
	inputRef,
	selectedValues,
	options,
	onRemoveChip,
	handleKeyDown,
	menuId,
	isOpen,
}: Readonly<MultiSelectPopoverTriggerProps>) {
	return (
		<div ref={triggerRef}>
			<MultiSelectField
				{...fieldProps}
				ref={inputRef as Ref<HTMLInputElement>}
				selectedValues={selectedValues}
				options={options}
				onRemoveChip={onRemoveChip}
				handleKeyDown={handleKeyDown}
				menuId={menuId}
				isOpen={isOpen}
			/>
		</div>
	);
}

interface MultiSelectPopoverProps {
	readonly isOpen: boolean;
	readonly filteredOptions: MultiSelectOption[];
	readonly setIsOpen: (open: boolean) => void;
	readonly triggerRef: RefObject<HTMLDivElement | null>;
	readonly fieldProps: MultiSelectContentProps['fieldProps'];
	readonly inputRef: MultiSelectContentProps['inputRef'];
	readonly listboxProps: MultiSelectListboxProps;
	readonly selectedValues: string[];
	readonly options: MultiSelectOption[];
	readonly onRemoveChip: (value: string) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly menuId: string;
}

export function MultiSelectPopover({
	isOpen,
	filteredOptions,
	setIsOpen,
	triggerRef,
	fieldProps,
	inputRef,
	listboxProps,
	selectedValues,
	options,
	onRemoveChip,
	handleKeyDown,
	menuId,
}: Readonly<MultiSelectPopoverProps>) {
	const popoverIsOpen = isOpen && filteredOptions.length > 0;
	const trigger = (
		<MultiSelectPopoverTrigger
			triggerRef={triggerRef}
			fieldProps={fieldProps}
			inputRef={inputRef}
			selectedValues={selectedValues}
			options={options}
			onRemoveChip={onRemoveChip}
			handleKeyDown={handleKeyDown}
			menuId={menuId}
			isOpen={isOpen}
		/>
	);

	return (
		<Popover
			isOpen={popoverIsOpen}
			onClose={() => setIsOpen(false)}
			trigger={trigger}
			position="bottom-start"
			className={MENU_STYLES.POPOVER_BASE}
		>
			<MultiSelectListbox {...listboxProps} />
		</Popover>
	);
}
