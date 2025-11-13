import Popover from '@core/ui/popover/Popover';
import type { ReactNode, Ref, RefObject } from 'react';

import type { AutocompleteOption } from './Autocomplete';
import { type AutocompleteListboxProps, MENU_STYLES } from './AutocompleteContentHelpers';
import { AutocompleteField } from './AutocompleteField';
import { AutocompleteListbox } from './AutocompleteListbox';
import type { AutocompleteContentProps } from './AutocompleteTypes';

interface AutocompletePopoverTriggerProps {
	readonly triggerRef: RefObject<HTMLDivElement | null>;
	readonly fieldProps: AutocompleteContentProps['fieldProps'];
	readonly inputRef: AutocompleteContentProps['inputRef'];
}

function AutocompletePopoverTrigger({
	triggerRef,
	fieldProps,
	inputRef,
}: Readonly<AutocompletePopoverTriggerProps>) {
	return (
		<div ref={triggerRef}>
			<AutocompleteField {...fieldProps} ref={inputRef as Ref<HTMLInputElement>} />
		</div>
	);
}

interface AutocompletePopoverContentProps extends AutocompleteListboxProps {
	readonly emptyState: ReactNode;
}

function AutocompletePopoverContent(props: Readonly<AutocompletePopoverContentProps>) {
	return <AutocompleteListbox {...props} />;
}

interface AutocompletePopoverProps {
	readonly isOpen: boolean;
	readonly filteredOptions: AutocompleteOption[];
	readonly setIsOpen: (open: boolean) => void;
	readonly triggerRef: RefObject<HTMLDivElement | null>;
	readonly fieldProps: AutocompleteContentProps['fieldProps'];
	readonly inputRef: AutocompleteContentProps['inputRef'];
	readonly listboxProps: AutocompleteListboxProps & { emptyState: ReactNode };
}

export function AutocompletePopover({
	isOpen,
	filteredOptions,
	setIsOpen,
	triggerRef,
	fieldProps,
	inputRef,
	listboxProps,
}: Readonly<AutocompletePopoverProps>) {
	const popoverIsOpen = isOpen && filteredOptions.length > 0;
	const trigger = (
		<AutocompletePopoverTrigger
			triggerRef={triggerRef}
			fieldProps={fieldProps}
			inputRef={inputRef}
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
			<AutocompletePopoverContent {...listboxProps} />
		</Popover>
	);
}
