import { classNames } from '@core/utils/classNames';

import type { ColorPickerWrapperProps } from './ColorPickerTypes';

export function ColorPickerWrapper({
	fullWidth,
	children,
	className,
	...restProps
}: Readonly<ColorPickerWrapperProps>) {
	return (
		<div className={classNames(fullWidth && 'w-full', className)} {...restProps}>
			{children}
		</div>
	);
}
