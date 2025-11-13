import { MultiSelectLabel } from '@core/ui/forms/multi-select/components/MultiSelectLabel';
import { MultiSelectMessages } from '@core/ui/forms/multi-select/components/MultiSelectMessages';
import { MultiSelectPopover } from '@core/ui/forms/multi-select/components/MultiSelectPopover';
import { MultiSelectWrapper } from '@core/ui/forms/multi-select/components/MultiSelectWrapper';
import {
	buildListboxProps,
	prepareLabelProps,
	prepareMessagesProps,
} from '@core/ui/forms/multi-select/helpers/MultiSelectContentHelpers';
import type { MultiSelectContentProps } from '@core/ui/forms/multi-select/types/MultiSelectTypes';
import { useRef } from 'react';

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
