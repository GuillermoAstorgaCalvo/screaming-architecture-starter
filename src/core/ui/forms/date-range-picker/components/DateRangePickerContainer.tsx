import { classNames } from '@core/utils/classNames';

import type { DateRangePickerContainerProps } from './DateRangePickerTypes';

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
