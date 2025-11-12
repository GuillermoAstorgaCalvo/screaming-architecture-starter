import { classNames } from '@core/utils/classNames';

import type { DatePickerContainerProps } from './DatePickerTypes';

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
