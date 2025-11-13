import type { SwitchContainerProps } from '@core/ui/forms/switch/types/SwitchTypes';
import { classNames } from '@core/utils/classNames';

export function SwitchContainer({
	children,
	className,
	...restProps
}: Readonly<SwitchContainerProps>) {
	return (
		<div className={classNames('flex items-center gap-3', className)} {...restProps}>
			{children}
		</div>
	);
}
