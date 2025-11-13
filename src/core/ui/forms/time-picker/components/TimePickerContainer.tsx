import { classNames } from '@core/utils/classNames';

import type { TimePickerContainerProps } from './TimePickerTypes';

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
