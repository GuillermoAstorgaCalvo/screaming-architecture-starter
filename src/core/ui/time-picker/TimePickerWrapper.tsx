import { classNames } from '@core/utils/classNames';

import type { TimePickerWrapperProps } from './TimePickerTypes';

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
