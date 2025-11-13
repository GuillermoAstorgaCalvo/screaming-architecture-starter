import type { SwitchWrapperProps } from '@core/ui/forms/switch/types/SwitchTypes';
import { classNames } from '@core/utils/classNames';

export function SwitchWrapper({
	fullWidth,
	children,
	className,
	...restProps
}: Readonly<SwitchWrapperProps>) {
	return (
		<div className={classNames(fullWidth && 'w-full', className)} {...restProps}>
			{children}
		</div>
	);
}
