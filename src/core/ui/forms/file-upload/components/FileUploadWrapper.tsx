import type { FileUploadWrapperProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import { classNames } from '@core/utils/classNames';

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
