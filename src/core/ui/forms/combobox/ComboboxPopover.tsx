import Popover from '@core/ui/popover/Popover';
import type { Ref, RefObject } from 'react';

import type { ComboboxOption } from './Combobox';
import { type ComboboxListboxProps, MENU_STYLES } from './ComboboxContentHelpers';
import { ComboboxField } from './ComboboxField';
import { ComboboxListbox } from './ComboboxListbox';
import type { ComboboxContentProps } from './ComboboxTypes';

interface ComboboxPopoverTriggerProps {
	readonly triggerRef: RefObject<HTMLDivElement | null>;
	readonly fieldProps: ComboboxContentProps['fieldProps'];
	readonly inputRef: ComboboxContentProps['inputRef'];
}

function ComboboxPopoverTrigger({
	triggerRef,
	fieldProps,
	inputRef,
}: Readonly<ComboboxPopoverTriggerProps>) {
	return (
		<div ref={triggerRef}>
			<ComboboxField {...fieldProps} ref={inputRef as Ref<HTMLInputElement>} />
		</div>
	);
}

function ComboboxPopoverContent(props: Readonly<ComboboxListboxProps>) {
	return <ComboboxListbox {...props} />;
}

interface ComboboxPopoverProps {
	readonly isOpen: boolean;
	readonly filteredOptions: ComboboxOption[];
	readonly setIsOpen: (open: boolean) => void;
	readonly triggerRef: RefObject<HTMLDivElement | null>;
	readonly fieldProps: ComboboxContentProps['fieldProps'];
	readonly inputRef: ComboboxContentProps['inputRef'];
	readonly listboxProps: ComboboxListboxProps;
}

export function ComboboxPopover({
	isOpen,
	filteredOptions,
	setIsOpen,
	triggerRef,
	fieldProps,
	inputRef,
	listboxProps,
}: Readonly<ComboboxPopoverProps>) {
	const popoverIsOpen = isOpen && filteredOptions.length > 0;
	const trigger = (
		<ComboboxPopoverTrigger triggerRef={triggerRef} fieldProps={fieldProps} inputRef={inputRef} />
	);

	return (
		<Popover
			isOpen={popoverIsOpen}
			onClose={() => setIsOpen(false)}
			trigger={trigger}
			position="bottom-start"
			className={MENU_STYLES.POPOVER_BASE}
		>
			<ComboboxPopoverContent {...listboxProps} />
		</Popover>
	);
}
