import { useRef } from 'react';

import {
	buildListboxProps,
	prepareLabelProps,
	prepareMessagesProps,
} from './MultiSelectContentHelpers';
import { MultiSelectLabel } from './MultiSelectLabel';
import { MultiSelectMessages } from './MultiSelectMessages';
import { MultiSelectPopover } from './MultiSelectPopover';
import type { MultiSelectContentProps } from './MultiSelectTypes';
import { MultiSelectWrapper } from './MultiSelectWrapper';

export function MultiSelectContent(props: Readonly<MultiSelectContentProps>) {
	const triggerRef = useRef<HTMLDivElement | null>(null);
	const labelProps = prepareLabelProps(props.label, props.state.finalId, props.required);
	const messagesProps = prepareMessagesProps(props.state.finalId, props.error, props.helperText);
	const listboxProps = buildListboxProps(props);
	const handleRemoveChip = (value: string) => {
		const newValues = props.selectedValues.filter(v => v !== value);
		props.setValue(newValues);
	};

	return (
		<MultiSelectWrapper fullWidth={props.fullWidth}>
			{labelProps ? <MultiSelectLabel {...labelProps} /> : null}
			<MultiSelectPopover
				isOpen={props.isOpen}
				filteredOptions={props.filteredOptions}
				setIsOpen={props.setIsOpen}
				triggerRef={triggerRef}
				fieldProps={props.fieldProps}
				inputRef={props.inputRef}
				listboxProps={listboxProps}
				selectedValues={props.selectedValues}
				options={props.allOptions}
				onRemoveChip={handleRemoveChip}
				handleKeyDown={props.handleKeyDown}
				menuId={props.menuId}
			/>
			{messagesProps ? <MultiSelectMessages {...messagesProps} /> : null}
		</MultiSelectWrapper>
	);
}
