import type { MultiSelectProps } from './MultiSelect';
import { extractMultiSelectProps } from './MultiSelectHelpers';
import type { MultiSelectContentProps } from './MultiSelectTypes';
import { buildMultiSelectContentProps } from './useMultiSelect.contentProps';
import { buildMultiSelectFieldPropsFromState } from './useMultiSelect.fieldProps';
import { useMultiSelectData, useMultiSelectStateSetup } from './useMultiSelect.setup';

export function useMultiSelect(props: Readonly<MultiSelectProps>): MultiSelectContentProps {
	const extracted = extractMultiSelectProps(props);
	const stateSetup = useMultiSelectStateSetup(props);
	const { interactions, menuId } = useMultiSelectData(props, stateSetup);
	const fieldProps = buildMultiSelectFieldPropsFromState({
		state: stateSetup.state,
		disabled: extracted.disabled,
		required: extracted.required,
		placeholder: extracted.placeholder,
		rest: extracted.rest,
		stateSetup,
		interactions,
	});
	return buildMultiSelectContentProps({
		extracted,
		stateSetup,
		interactions,
		fieldProps,
		menuId,
		options: props.options,
	});
}
