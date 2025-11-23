import { ComboboxField } from '@core/ui/forms/combobox/components/ComboboxField';
import { ComboboxListbox } from '@core/ui/forms/combobox/components/ComboboxListbox';
import {
	type ComboboxListboxProps,
	MENU_STYLES,
} from '@core/ui/forms/combobox/helpers/ComboboxContentHelpers';
import type { ComboboxContentProps } from '@core/ui/forms/combobox/types/ComboboxTypes';
import Popover from '@core/ui/popover/Popover';
import type { Ref, RefObject } from 'react';

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
	readonly setIsOpen: (open: boolean) => void;
	readonly triggerRef: RefObject<HTMLDivElement | null>;
	readonly fieldProps: ComboboxContentProps['fieldProps'];
	readonly inputRef: ComboboxContentProps['inputRef'];
	readonly listboxProps: ComboboxListboxProps;
}

export function ComboboxPopover({
	isOpen,
	setIsOpen,
	triggerRef,
	fieldProps,
	inputRef,
	listboxProps,
}: Readonly<ComboboxPopoverProps>) {
	// Show popover when open, even if there are no filtered options (to show empty state)
	const popoverIsOpen = isOpen;
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
