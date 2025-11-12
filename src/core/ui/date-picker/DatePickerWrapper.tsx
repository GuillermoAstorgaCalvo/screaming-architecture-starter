import { classNames } from '@core/utils/classNames';

import type { DatePickerWrapperProps } from './DatePickerTypes';

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
