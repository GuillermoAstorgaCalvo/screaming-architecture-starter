import type { DatePickerWrapperProps } from '@core/ui/forms/date-picker/types/DatePickerTypes';
import { classNames } from '@core/utils/classNames';

export function DatePickerWrapper({
	fullWidth,
	children,
	className,
	...restProps
}: Readonly<DatePickerWrapperProps>) {
	return (
		<div className={classNames(fullWidth && 'w-full', className)} {...restProps}>
			{children}
		</div>
	);
}
