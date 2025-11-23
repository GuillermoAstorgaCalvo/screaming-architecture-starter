import { AutocompleteField } from '@core/ui/forms/autocomplete/components/AutocompleteField';
import { AutocompleteListbox } from '@core/ui/forms/autocomplete/components/AutocompleteListbox';
import type { AutocompleteListboxProps } from '@core/ui/forms/autocomplete/helpers/AutocompleteContentHelpers';
import { MENU_STYLES } from '@core/ui/forms/autocomplete/helpers/AutocompleteMenuStyles';
import type { AutocompleteContentProps } from '@core/ui/forms/autocomplete/types/AutocompleteTypes';
import Popover from '@core/ui/popover/Popover';
import type { ReactNode, Ref, RefObject } from 'react';

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
	readonly setIsOpen: (open: boolean) => void;
	readonly triggerRef: RefObject<HTMLDivElement | null>;
	readonly fieldProps: AutocompleteContentProps['fieldProps'];
	readonly inputRef: AutocompleteContentProps['inputRef'];
	readonly listboxProps: AutocompleteListboxProps & { emptyState: ReactNode };
}

export function AutocompletePopover({
	isOpen,
	setIsOpen,
	triggerRef,
	fieldProps,
	inputRef,
	listboxProps,
}: Readonly<AutocompletePopoverProps>) {
	// Show popover when open, even if there are no filtered options (to show empty state)
	const popoverIsOpen = isOpen;
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
