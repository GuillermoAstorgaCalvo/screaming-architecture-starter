import { extractMultiSelectProps } from '@core/ui/forms/multi-select/helpers/MultiSelectHelpers';
import { buildMultiSelectContentProps } from '@core/ui/forms/multi-select/hooks/useMultiSelect.contentProps';
import { buildMultiSelectFieldPropsFromState } from '@core/ui/forms/multi-select/hooks/useMultiSelect.fieldProps';
import {
	useMultiSelectData,
	useMultiSelectStateSetup,
} from '@core/ui/forms/multi-select/hooks/useMultiSelect.setup';
import type { MultiSelectProps } from '@core/ui/forms/multi-select/MultiSelect';
import type { MultiSelectContentProps } from '@core/ui/forms/multi-select/types/MultiSelectTypes';

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
