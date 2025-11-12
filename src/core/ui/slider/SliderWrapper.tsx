import { classNames } from '@core/utils/classNames';

import type { SliderWrapperProps } from './SliderTypes';

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
