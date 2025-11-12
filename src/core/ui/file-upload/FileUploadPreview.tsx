import { FileUploadPreviewItem } from './FileUploadPreviewItem';
import type { FileUploadPreviewProps } from './FileUploadTypes';

export function FileUploadPreview({
	files,
	onRemove,
	showProgress,
	size,
}: Readonly<FileUploadPreviewProps>) {
	if (files.length === 0) return null;

	return (
		<div className="flex flex-col gap-2 mt-4">
			{files.map(file => (
				<FileUploadPreviewItem
					key={file.id}
					file={file}
					onRemove={onRemove}
					showProgress={showProgress ?? false}
					size={size}
				/>
			))}
		</div>
	);
}
