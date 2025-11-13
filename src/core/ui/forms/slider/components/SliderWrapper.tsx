import type { SliderWrapperProps } from '@core/ui/forms/slider/types/SliderTypes';
import { classNames } from '@core/utils/classNames';

export function SliderWrapper({
	fullWidth,
	children,
	className,
	...restProps
}: Readonly<SliderWrapperProps>) {
	return (
		<div className={classNames(fullWidth && 'w-full', className)} {...restProps}>
			{children}
		</div>
	);
}
