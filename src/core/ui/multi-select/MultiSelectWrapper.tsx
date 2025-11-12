import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

export interface MultiSelectWrapperProps {
	readonly children: ReactNode;
	readonly fullWidth: boolean;
}

export function MultiSelectWrapper({ children, fullWidth }: Readonly<MultiSelectWrapperProps>) {
	return <div className={classNames('flex flex-col gap-2', fullWidth && 'w-full')}>{children}</div>;
}
