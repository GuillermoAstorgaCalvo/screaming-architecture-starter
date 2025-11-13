import { ComboboxLabel } from '@core/ui/forms/combobox/components/ComboboxLabel';
import { ComboboxMessages } from '@core/ui/forms/combobox/components/ComboboxMessages';
import { ComboboxPopover } from '@core/ui/forms/combobox/components/ComboboxPopover';
import { ComboboxWrapper } from '@core/ui/forms/combobox/components/ComboboxWrapper';
import {
	buildListboxProps,
	prepareLabelProps,
	prepareMessagesProps,
} from '@core/ui/forms/combobox/helpers/ComboboxContentHelpers';
import type { ComboboxContentProps } from '@core/ui/forms/combobox/types/ComboboxTypes';
import { useRef } from 'react';

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
