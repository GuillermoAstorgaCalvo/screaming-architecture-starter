import { useRef } from 'react';

import {
	buildListboxProps,
	prepareLabelProps,
	prepareMessagesProps,
} from './ComboboxContentHelpers';
import { ComboboxLabel } from './ComboboxLabel';
import { ComboboxMessages } from './ComboboxMessages';
import { ComboboxPopover } from './ComboboxPopover';
import type { ComboboxContentProps } from './ComboboxTypes';
import { ComboboxWrapper } from './ComboboxWrapper';

export function ComboboxContent(props: Readonly<ComboboxContentProps>) {
	const triggerRef = useRef<HTMLDivElement | null>(null);
	const labelProps = prepareLabelProps(props.label, props.state.finalId, props.required);
	const messagesProps = prepareMessagesProps(props.state.finalId, props.error, props.helperText);
	const listboxProps = buildListboxProps(props);

	return (
		<ComboboxWrapper fullWidth={props.fullWidth}>
			{labelProps ? <ComboboxLabel {...labelProps} /> : null}
			<ComboboxPopover
				isOpen={props.isOpen}
				filteredOptions={props.filteredOptions}
				setIsOpen={props.setIsOpen}
				triggerRef={triggerRef}
				fieldProps={props.fieldProps}
				inputRef={props.inputRef}
				listboxProps={listboxProps}
			/>
			{messagesProps ? <ComboboxMessages {...messagesProps} /> : null}
		</ComboboxWrapper>
	);
}
