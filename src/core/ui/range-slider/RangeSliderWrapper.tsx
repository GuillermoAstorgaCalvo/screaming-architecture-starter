import { classNames } from '@core/utils/classNames';

import type { RangeSliderWrapperProps } from './RangeSliderTypes';

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
