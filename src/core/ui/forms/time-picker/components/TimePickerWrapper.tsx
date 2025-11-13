import type { TimePickerWrapperProps } from '@core/ui/forms/time-picker/types/TimePickerTypes';
import { classNames } from '@core/utils/classNames';

export function TimePickerWrapper({
	fullWidth,
	children,
	className,
	...restProps
}: Readonly<TimePickerWrapperProps>) {
	return (
		<div className={classNames(fullWidth && 'w-full', className)} {...restProps}>
			{children}
		</div>
	);
}
