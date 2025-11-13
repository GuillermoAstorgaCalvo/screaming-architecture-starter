import { classNames } from '@core/utils/classNames';

import type { DateRangePickerWrapperProps } from './DateRangePickerTypes';

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
