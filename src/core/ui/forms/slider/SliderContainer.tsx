import { classNames } from '@core/utils/classNames';

import type { SliderContainerProps } from './SliderTypes';

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
