import { buildContentPropsFromValues } from '@core/ui/forms/date-range-picker/hooks/useDateRangePicker.contentProps';
import { createFieldOptionsFromProps } from '@core/ui/forms/date-range-picker/hooks/useDateRangePicker.fieldProps';
import { useDateRangePickerState } from '@core/ui/forms/date-range-picker/hooks/useDateRangePicker.state';
import type {
	UseDateRangePickerPropsOptions,
	UseDateRangePickerPropsReturn,
} from '@core/ui/forms/date-range-picker/types/useDateRangePicker.types';

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
