import type { SliderContainerProps } from '@core/ui/forms/slider/types/SliderTypes';
import { classNames } from '@core/utils/classNames';

export function SliderContainer({
	children,
	className,
	...restProps
}: Readonly<SliderContainerProps>) {
	return (
		<div className={classNames('flex flex-col gap-2', className)} {...restProps}>
			{children}
		</div>
	);
}
