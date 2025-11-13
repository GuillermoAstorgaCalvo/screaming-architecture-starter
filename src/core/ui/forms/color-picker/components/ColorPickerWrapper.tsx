import type { ColorPickerWrapperProps } from '@core/ui/forms/color-picker/types/ColorPickerTypes';
import { classNames } from '@core/utils/classNames';

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
