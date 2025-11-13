import type { ColorPickerContainerProps } from '@core/ui/forms/color-picker/types/ColorPickerTypes';
import { classNames } from '@core/utils/classNames';

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
