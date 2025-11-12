import { classNames } from '@core/utils/classNames';

import type { FileUploadContainerProps } from './FileUploadTypes';

export function FileUploadContainer({
	children,
	className,
	...restProps
}: Readonly<FileUploadContainerProps>) {
	return (
		<div className={classNames('flex flex-col gap-2', className)} {...restProps}>
			{children}
		</div>
	);
}
