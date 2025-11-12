import { buildContentPropsFromValues } from './useDateRangePicker.contentProps';
import { createFieldOptionsFromProps } from './useDateRangePicker.fieldProps';
import { useDateRangePickerState } from './useDateRangePicker.state';
import type {
	UseDateRangePickerPropsOptions,
	UseDateRangePickerPropsReturn,
} from './useDateRangePicker.types';

/**
 * Hook to process DateRangePicker component props and return content props
 */
export function useDateRangePickerProps({
	props,
}: Readonly<UseDateRangePickerPropsOptions>): UseDateRangePickerPropsReturn {
	const { label, error, helperText, size = 'md', dateRangePickerId, className } = props;
	const state = useDateRangePickerState({
		dateRangePickerId,
		label,
		error,
		helperText,
		size,
		className,
	});
	const fieldOptions = createFieldOptionsFromProps(props);
	return { contentProps: buildContentPropsFromValues(props, state, fieldOptions) };
}
