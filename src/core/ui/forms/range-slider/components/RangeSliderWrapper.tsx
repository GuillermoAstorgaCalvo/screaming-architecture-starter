import type { RangeSliderWrapperProps } from '@core/ui/forms/range-slider/types/RangeSliderTypes';
import { classNames } from '@core/utils/classNames';

export function RangeSliderWrapper({
	fullWidth,
	children,
	className,
	...restProps
}: Readonly<RangeSliderWrapperProps>) {
	return (
		<div className={classNames(fullWidth && 'w-full', className)} {...restProps}>
			{children}
		</div>
	);
}
