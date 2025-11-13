import type { DatePickerContainerProps } from '@core/ui/forms/date-picker/types/DatePickerTypes';
import { classNames } from '@core/utils/classNames';

export function DatePickerContainer({
	children,
	className,
	...restProps
}: Readonly<DatePickerContainerProps>) {
	return (
		<div className={classNames('flex flex-col gap-2', className)} {...restProps}>
			{children}
		</div>
	);
}
