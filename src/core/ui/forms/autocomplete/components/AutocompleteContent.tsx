import { AutocompleteLabel } from '@core/ui/forms/autocomplete/components/AutocompleteLabel';
import { AutocompleteMessages } from '@core/ui/forms/autocomplete/components/AutocompleteMessages';
import { AutocompletePopover } from '@core/ui/forms/autocomplete/components/AutocompletePopover';
import { AutocompleteWrapper } from '@core/ui/forms/autocomplete/components/AutocompleteWrapper';
import {
	buildListboxProps,
	prepareLabelProps,
	prepareMessagesProps,
} from '@core/ui/forms/autocomplete/helpers/AutocompleteContentHelpers';
import type { AutocompleteContentProps } from '@core/ui/forms/autocomplete/types/AutocompleteTypes';
import { useRef } from 'react';

export function AutocompleteContent(props: Readonly<AutocompleteContentProps>) {
	const triggerRef = useRef<HTMLDivElement | null>(null);
	const labelProps = prepareLabelProps(props.label, props.state.finalId, props.required);
	const messagesProps = prepareMessagesProps(props.state.finalId, props.error, props.helperText);

	// Get highlightMatches from props (default to true)
	const highlightMatches = props.highlightMatches ?? true;

	const listboxProps = buildListboxProps(props, highlightMatches);

	return (
		<AutocompleteWrapper fullWidth={props.fullWidth}>
			{labelProps ? <AutocompleteLabel {...labelProps} /> : null}
			<AutocompletePopover
				isOpen={props.isOpen}
				filteredOptions={props.filteredOptions}
				setIsOpen={props.setIsOpen}
				triggerRef={triggerRef}
				fieldProps={props.fieldProps}
				inputRef={props.inputRef}
				listboxProps={listboxProps}
			/>
			{messagesProps ? <AutocompleteMessages {...messagesProps} /> : null}
		</AutocompleteWrapper>
	);
}
