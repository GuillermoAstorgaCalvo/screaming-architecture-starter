import { classNames } from '@core/utils/classNames';

import type { RangeSliderContainerProps } from './RangeSliderTypes';

export function RangeSliderContainer({
	children,
	className,
	...restProps
}: Readonly<RangeSliderContainerProps>) {
	return (
		<div className={classNames('flex flex-col gap-2', className)} {...restProps}>
			{children}
		</div>
	);
}
