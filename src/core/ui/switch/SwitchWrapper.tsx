import { classNames } from '@core/utils/classNames';

import type { SwitchWrapperProps } from './SwitchTypes';

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
