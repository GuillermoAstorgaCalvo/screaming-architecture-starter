import type { FileUploadContainerProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import { classNames } from '@core/utils/classNames';

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
