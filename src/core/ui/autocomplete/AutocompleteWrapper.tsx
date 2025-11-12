import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

export interface AutocompleteWrapperProps {
	readonly children: ReactNode;
	readonly fullWidth: boolean;
}

export function AutocompleteWrapper({ children, fullWidth }: Readonly<AutocompleteWrapperProps>) {
	return <div className={classNames('flex flex-col gap-2', fullWidth && 'w-full')}>{children}</div>;
}
