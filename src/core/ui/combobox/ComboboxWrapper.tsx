import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

export interface ComboboxWrapperProps {
	readonly children: ReactNode;
	readonly fullWidth: boolean;
}

export function ComboboxWrapper({ children, fullWidth }: Readonly<ComboboxWrapperProps>) {
	return <div className={classNames('flex flex-col gap-2', fullWidth && 'w-full')}>{children}</div>;
}
