import { classNames } from '@core/utils/classNames';

import type { SwitchContainerProps } from './SwitchTypes';

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
