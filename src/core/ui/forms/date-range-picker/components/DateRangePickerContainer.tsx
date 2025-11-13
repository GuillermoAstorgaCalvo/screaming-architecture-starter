import type { DateRangePickerContainerProps } from '@core/ui/forms/date-range-picker/types/DateRangePickerTypes';
import { classNames } from '@core/utils/classNames';

export function DateRangePickerContainer({
	children,
	className,
	...restProps
}: Readonly<DateRangePickerContainerProps>) {
	return (
		<div className={classNames('flex flex-col gap-2', className)} {...restProps}>
			{children}
		</div>
	);
}
