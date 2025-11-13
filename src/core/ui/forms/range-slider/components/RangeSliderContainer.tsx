import type { RangeSliderContainerProps } from '@core/ui/forms/range-slider/types/RangeSliderTypes';
import { classNames } from '@core/utils/classNames';

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
