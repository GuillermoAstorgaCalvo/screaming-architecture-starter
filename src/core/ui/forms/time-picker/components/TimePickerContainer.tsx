import type { TimePickerContainerProps } from '@core/ui/forms/time-picker/types/TimePickerTypes';
import { classNames } from '@core/utils/classNames';

export function TimePickerContainer({
	children,
	className,
	...restProps
}: Readonly<TimePickerContainerProps>) {
	return (
		<div className={classNames('flex flex-col gap-2', className)} {...restProps}>
			{children}
		</div>
	);
}
