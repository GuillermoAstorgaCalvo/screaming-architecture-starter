import { classNames } from '@core/utils/classNames';

import type { ColorPickerContainerProps } from './ColorPickerTypes';

export function ColorPickerContainer({
	children,
	className,
	...restProps
}: Readonly<ColorPickerContainerProps>) {
	return (
		<div className={classNames('flex flex-col gap-2', className)} {...restProps}>
			{children}
		</div>
	);
}
