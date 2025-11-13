import Button from '@core/ui/button/Button';
import { FileUploadDropzone } from '@core/ui/forms/file-upload/components/FileUploadDropzone';
import { FileUploadLabel } from '@core/ui/forms/file-upload/components/FileUploadLabel';
import { FileUploadPreview } from '@core/ui/forms/file-upload/components/FileUploadPreview';
import type {
	FileUploadDropzoneSectionProps,
	FileUploadLabelSectionProps,
	FileUploadPreviewSectionProps,
} from '@core/ui/forms/file-upload/helpers/FileUploadContentSections.types';
import type { StandardSize } from '@src-types/ui/base';
import type { DragEvent } from 'react';

export interface FileUploadDropzoneContentProps {
	readonly dragActive: boolean;
	readonly size: StandardSize;
	readonly disabled?: boolean;
	readonly accept?: string;
	readonly onBrowseClick: () => void;
}

function FileUploadIcon() {
	return (
		<svg
			className="w-12 h-12 text-gray-400 dark:text-gray-500"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
			/>
		</svg>
	);
}

export function FileUploadDropzoneContent({
	dragActive,
	size,
	disabled,
	accept,
	onBrowseClick,
}: Readonly<FileUploadDropzoneContentProps>) {
	return (
		<>
			<FileUploadIcon />
			<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
				{dragActive ? 'Drop files here' : 'Drag and drop files here'}
			</p>
			<p className="text-xs text-gray-500 dark:text-gray-400">or</p>
			<Button
				type="button"
				variant="secondary"
				size={size}
				disabled={disabled}
				onClick={e => {
					e.stopPropagation();
					onBrowseClick();
				}}
			>
				Browse Files
			</Button>
			{accept ? (
				<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Accepted: {accept}</p>
			) : null}
		</>
	);
}

export interface FileUploadDropzoneWrapperProps {
	readonly id: string;
	readonly disabled: boolean;
	readonly dragActive: boolean;
	readonly size: StandardSize;
	readonly acceptString?: string;
	readonly onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragOver: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDrop: (e: DragEvent<HTMLDivElement>) => void;
	readonly onClick: () => void;
}

export function FileUploadDropzoneWrapper({
	id,
	disabled,
	dragActive,
	size,
	acceptString,
	onDragEnter,
	onDragLeave,
	onDragOver,
	onDrop,
	onClick,
}: Readonly<FileUploadDropzoneWrapperProps>) {
	return (
		<FileUploadDropzone
			id={id}
			disabled={disabled}
			dragActive={dragActive}
			size={size}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
			onClick={onClick}
		>
			<FileUploadDropzoneContent
				dragActive={dragActive}
				size={size}
				disabled={disabled}
				{...(acceptString && { accept: acceptString })}
				onBrowseClick={onClick}
			/>
		</FileUploadDropzone>
	);
}

export function FileUploadLabelSection({
	fileUploadId,
	label,
	required,
}: Readonly<FileUploadLabelSectionProps>) {
	if (!label || !fileUploadId) return null;
	return <FileUploadLabel id={fileUploadId} label={label} required={required} />;
}

export function FileUploadDropzoneSection({
	fileUploadId,
	inputId,
	size,
	dragActive,
	state,
	onDragEnter,
	onDragLeave,
	onDragOver,
	onDrop,
	onClick,
}: Readonly<FileUploadDropzoneSectionProps>) {
	return (
		<FileUploadDropzoneWrapper
			id={fileUploadId ?? inputId}
			disabled={state.isDisabled}
			dragActive={dragActive}
			size={size}
			{...('acceptString' in state ? { acceptString: state.acceptString } : {})}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
			onClick={onClick}
		/>
	);
}

export function FileUploadPreviewSection({
	hasPreview,
	files,
	size,
	previewProps,
	onFileRemove,
}: Readonly<FileUploadPreviewSectionProps>) {
	if (!hasPreview) return null;
	return <FileUploadPreview files={files} onRemove={onFileRemove} {...previewProps} size={size} />;
}
