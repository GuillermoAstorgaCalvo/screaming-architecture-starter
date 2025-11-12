import Image from '@core/ui/image/Image';
import Progress from '@core/ui/progress/Progress';
import { classNames } from '@core/utils/classNames';
import type { StandardSize } from '@src-types/ui/base';
import { useCallback, useEffect, useState } from 'react';

import { createFilePreview, formatFileSize, isImageFile } from './FileUploadHelpers';
import type { FileUploadPreviewItemProps } from './FileUploadTypes';

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
				'shrink-0 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700',
				sizeClasses
			)}
		>
			<span className="text-xs font-medium text-gray-600 dark:text-gray-300">
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
			<p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
				{file.file.name}
			</p>
			<p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.file.size)}</p>
			{file.error ? (
				<p className="text-xs text-red-600 dark:text-red-400 mt-1">{file.error}</p>
			) : null}
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
			className="shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
		<div className="relative flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
			<FileThumbnail file={file.file} preview={preview} size={size} />
			<FileInfo file={file} showProgress={showProgress} />
			<RemoveButton fileName={file.file.name} onRemove={handleRemove} />
		</div>
	);
}
