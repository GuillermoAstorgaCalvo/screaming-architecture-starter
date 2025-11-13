import type { DateRangePickerWrapperProps } from '@core/ui/forms/date-range-picker/types/DateRangePickerTypes';
import { classNames } from '@core/utils/classNames';

export function DateRangePickerWrapper({
	fullWidth,
	children,
	className,
	...restProps
}: Readonly<DateRangePickerWrapperProps>) {
	return (
		<div className={classNames(fullWidth && 'w-full', className)} {...restProps}>
			{children}
		</div>
	);
}
