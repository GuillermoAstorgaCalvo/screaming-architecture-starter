import type { DatePickerWrapperProps } from '@core/ui/forms/date-picker/types/DatePickerTypes';
import { classNames } from '@core/utils/classNames';

export function DatePickerWrapper(props: Readonly<DatePickerWrapperProps>) {
	const { fullWidth, children, className, ...restProps } = props;

	// Create a new object explicitly excluding fullWidth to prevent React warnings
	// React's development mode checks props objects, so we need to ensure fullWidth
	// is not present in the object we spread to the DOM element
	const { fullWidth: _excluded, ...domProps } = {
		...restProps,
	} as typeof restProps & { fullWidth?: never };

	return (
		<div className={classNames(fullWidth && 'w-full', className)} {...domProps}>
			{children}
		</div>
	);
}
