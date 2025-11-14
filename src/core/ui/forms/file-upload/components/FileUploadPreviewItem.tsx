import {
	createFilePreview,
	formatFileSize,
	isImageFile,
} from '@core/ui/forms/file-upload/helpers/FileUploadHelpers';
import type { FileUploadPreviewItemProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import Image from '@core/ui/image/Image';
import Progress from '@core/ui/progress/Progress';
import { classNames } from '@core/utils/classNames';
import type { StandardSize } from '@src-types/ui/base';
import { useCallback, useEffect, useState } from 'react';

const FILE_EXTENSION_DISPLAY_LENGTH = 3;

function getSizeClasses(size: StandardSize): string {
	if (size === 'sm') return 'w-16 h-16';
	if (size === 'md') return 'w-20 h-20';
	return 'w-24 h-24';
}

function getImageDimensions(size: StandardSize): { width: number; height: number } {
	if (size === 'sm') return { width: 64, height: 64 };
	if (size === 'md') return { width: 80, height: 80 };
	return { width: 96, height: 96 };
}

function getFileExtension(fileName: string): string {
	const extension = fileName
		.split('.')
		.at(-1)
		?.toUpperCase()
		.slice(0, FILE_EXTENSION_DISPLAY_LENGTH);
	return extension ?? 'FILE';
}

function FileThumbnail({
	file,
	preview,
	size,
}: {
	readonly file: File;
	readonly preview: string | undefined;
	readonly size: StandardSize;
}) {
	const sizeClasses = getSizeClasses(size);
	const imageDimensions = getImageDimensions(size);

	if (preview && isImageFile(file)) {
		return (
			<div className={classNames('shrink-0 rounded overflow-hidden', sizeClasses)}>
				<Image
					src={preview}
					alt={file.name}
					width={imageDimensions.width}
					height={imageDimensions.height}
					objectFit="cover"
				/>
			</div>
		);
	}

	return (
		<div
			className={classNames(
				'shrink-0 flex items-center justify-center rounded bg-muted dark:bg-muted',
				sizeClasses
			)}
		>
			<span className="text-xs font-medium text-text-secondary dark:text-text-secondary">
				{getFileExtension(file.name)}
			</span>
		</div>
	);
}

function FileInfo({
	file,
	showProgress,
}: {
	readonly file: FileUploadPreviewItemProps['file'];
	readonly showProgress: boolean | undefined;
}) {
	const hasProgress = showProgress === true && file.progress !== undefined && file.progress < 100;

	return (
		<div className="flex-1 min-w-0">
			<p className="text-sm font-medium text-text-primary dark:text-text-primary truncate">
				{file.file.name}
			</p>
			<p className="text-xs text-text-muted dark:text-text-muted">
				{formatFileSize(file.file.size)}
			</p>
			{file.error ? <p className="text-xs text-destructive mt-1">{file.error}</p> : null}
			{hasProgress ? (
				<div className="mt-2">
					<Progress value={file.progress} max={100} size="sm" showValue />
				</div>
			) : null}
		</div>
	);
}

function RemoveButton({
	fileName,
	onRemove,
}: {
	readonly fileName: string;
	readonly onRemove: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onRemove}
			className="shrink-0 p-1 text-text-muted hover:text-destructive dark:hover:text-destructive transition-colors"
			aria-label={`Remove ${fileName}`}
		>
			<svg
				className="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	);
}

export function FileUploadPreviewItem({
	file,
	onRemove,
	showProgress,
	size,
}: Readonly<FileUploadPreviewItemProps>) {
	const [preview, setPreview] = useState<string | undefined>(file.preview);

	useEffect(() => {
		if (!preview && isImageFile(file.file)) {
			createFilePreview(file.file)
				.then(setPreview)
				.catch(() => {
					// Ignore preview errors
				});
		}
	}, [file.file, preview]);

	const handleRemove = useCallback(() => {
		onRemove(file.id);
	}, [file.id, onRemove]);

	return (
		<div className="relative flex items-center gap-3 p-2 border border-border dark:border-border rounded-lg bg-muted dark:bg-muted">
			<FileThumbnail file={file.file} preview={preview} size={size} />
			<FileInfo file={file} showProgress={showProgress} />
			<RemoveButton fileName={file.file.name} onRemove={handleRemove} />
		</div>
	);
}
