import { useRef } from 'react';

import {
	buildListboxProps,
	prepareLabelProps,
	prepareMessagesProps,
} from './AutocompleteContentHelpers';
import { AutocompleteLabel } from './AutocompleteLabel';
import { AutocompleteMessages } from './AutocompleteMessages';
import { AutocompletePopover } from './AutocompletePopover';
import type { AutocompleteContentProps } from './AutocompleteTypes';
import { AutocompleteWrapper } from './AutocompleteWrapper';

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
