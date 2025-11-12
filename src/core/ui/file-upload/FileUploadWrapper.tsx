import { classNames } from '@core/utils/classNames';

import type { FileUploadWrapperProps } from './FileUploadTypes';

export function FileUploadWrapper({
	fullWidth,
	children,
	className,
	...restProps
}: Readonly<FileUploadWrapperProps>) {
	return (
		<div className={classNames(fullWidth && 'w-full', className)} {...restProps}>
			{children}
		</div>
	);
}
