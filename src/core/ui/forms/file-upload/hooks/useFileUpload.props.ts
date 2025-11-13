import type {
	FileUploadContentProps,
	FileUploadFile,
} from '@core/ui/forms/file-upload/types/FileUploadTypes';
import type { FileUploadProps } from '@src-types/ui/forms-inputs';
import type { ChangeEvent, DragEvent } from 'react';

export function buildBasicProps(props: FileUploadProps, validationError: string | undefined) {
	return {
		label: props.label,
		error: props.error ?? validationError,
		helperText: props.helperText,
		required: props.required,
		fullWidth: props.fullWidth ?? false,
		disabled: props.disabled,
		size: props.size ?? 'md',
		multiple: props.multiple ?? false,
	};
}

export function buildFileProps(props: FileUploadProps, files: readonly FileUploadFile[]) {
	return {
		files,
		...(props.accept !== undefined && { accept: props.accept }),
		...(props.validation !== undefined && { validation: props.validation }),
	};
}

export function buildDisplayProps(props: FileUploadProps) {
	return {
		showPreview: props.showPreview ?? true,
		showProgress: props.showProgress ?? false,
	};
}

export function buildEventHandlers(
	props: FileUploadProps,
	handlers: {
		handleFilesChange: (files: File[]) => void;
		removeWithValidation: (fileId: string) => void;
		handleFileProgress: (fileId: string, progress: number) => void;
		handleDragEnter: (e: DragEvent<HTMLDivElement>) => void;
		handleDragLeave: (e: DragEvent<HTMLDivElement>) => void;
		handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
		handleDrop: (e: DragEvent<HTMLDivElement>) => void;
		handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	}
) {
	return {
		onFilesChange: handlers.handleFilesChange,
		onFileRemove: handlers.removeWithValidation,
		...(props.onFileProgress !== undefined && { onFileProgress: handlers.handleFileProgress }),
		onDragEnter: handlers.handleDragEnter,
		onDragLeave: handlers.handleDragLeave,
		onDragOver: handlers.handleDragOver,
		onDrop: handlers.handleDrop,
		onInputChange: handlers.handleInputChange,
	};
}

export function buildContentProps(params: {
	props: FileUploadProps;
	fileUploadId: string | undefined;
	inputId: string;
	files: readonly FileUploadFile[];
	validationError: string | undefined;
	dragActive: boolean;
	handlers: {
		handleFilesChange: (files: File[]) => void;
		removeWithValidation: (fileId: string) => void;
		handleFileProgress: (fileId: string, progress: number) => void;
		handleDragEnter: (e: DragEvent<HTMLDivElement>) => void;
		handleDragLeave: (e: DragEvent<HTMLDivElement>) => void;
		handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
		handleDrop: (e: DragEvent<HTMLDivElement>) => void;
		handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	};
}): FileUploadContentProps {
	const { props, fileUploadId, inputId, files, validationError, dragActive, handlers } = params;

	return {
		fileUploadId,
		inputId,
		dragActive,
		...buildBasicProps(props, validationError),
		...buildFileProps(props, files),
		...buildDisplayProps(props),
		...buildEventHandlers(props, handlers),
	};
}
