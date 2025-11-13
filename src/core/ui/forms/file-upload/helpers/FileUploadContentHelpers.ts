import type { StandardSize } from '@src-types/ui/base';
import type { ChangeEvent, DragEvent, RefObject } from 'react';

import type { FileUploadContentProps, FileUploadFile } from './FileUploadTypes';

export interface FileUploadFieldState {
	readonly acceptString?: string;
	readonly hasPreview: boolean;
	readonly inputBaseProps: Omit<Readonly<FileUploadInputProps>, 'inputRef'>;
	readonly isDisabled: boolean;
	readonly previewProps: Readonly<{ showProgress?: boolean }>;
}

export interface FileUploadInputProps {
	readonly inputId: string;
	readonly multiple: boolean;
	readonly accept?: string;
	readonly disabled: boolean;
	readonly required?: boolean;
	readonly fileUploadId?: string;
	readonly onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	readonly inputRef: RefObject<HTMLInputElement | null>;
}

export interface FileUploadLabelSectionProps {
	readonly fileUploadId?: string;
	readonly label?: string;
	readonly required?: boolean;
}

export interface FileUploadDropzoneSectionProps {
	readonly fileUploadId?: string;
	readonly inputId: string;
	readonly size: StandardSize;
	readonly dragActive: boolean;
	readonly state: FileUploadFieldState;
	readonly onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragOver: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDrop: (e: DragEvent<HTMLDivElement>) => void;
	readonly onClick: () => void;
}

export interface DropzoneSectionParams {
	readonly fileUploadId?: string;
	readonly inputId: string;
	readonly size: StandardSize;
	readonly dragActive: boolean;
	readonly state: FileUploadFieldState;
	readonly onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragOver: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDrop: (e: DragEvent<HTMLDivElement>) => void;
	readonly onClick: () => void;
}

export interface PreviewPropsParams {
	readonly hasPreview: boolean;
	readonly files: readonly FileUploadFile[];
	readonly size: StandardSize;
	readonly previewProps: Readonly<{ showProgress?: boolean }>;
	readonly onFileRemove: (fileId: string) => void;
}

export interface PreviewPropsFromStateParams {
	readonly state: FileUploadFieldState;
	readonly files: readonly FileUploadFile[];
	readonly size: StandardSize;
	readonly onFileRemove: (fileId: string) => void;
}

export function prepareFileUploadState(
	props: Readonly<FileUploadContentProps>
): FileUploadFieldState {
	const {
		accept,
		disabled,
		fileUploadId,
		files,
		inputId,
		multiple,
		onInputChange,
		required,
		showPreview,
		showProgress,
	} = props;
	const acceptString = Array.isArray(accept) ? accept.join(',') : accept;
	const isDisabled = disabled ?? false;
	const hasPreview = Boolean(showPreview && files.length > 0);
	const previewProps = showProgress === undefined ? {} : { showProgress };
	const inputBaseProps = {
		inputId,
		multiple,
		...(acceptString ? { accept: acceptString } : {}),
		disabled: isDisabled,
		...(required !== undefined && { required }),
		...(fileUploadId ? { fileUploadId } : {}),
		onChange: onInputChange,
	} as const;
	return {
		...(acceptString ? { acceptString } : {}),
		hasPreview,
		inputBaseProps,
		isDisabled,
		previewProps,
	};
}

export function buildLabelSectionProps(
	fileUploadId?: string,
	label?: string,
	required?: boolean
): Readonly<FileUploadLabelSectionProps> {
	return {
		...(fileUploadId ? { fileUploadId } : {}),
		...(label ? { label } : {}),
		...(required === undefined ? {} : { required }),
	};
}

export function buildDropzoneSectionProps(
	params: Readonly<DropzoneSectionParams>
): Readonly<FileUploadDropzoneSectionProps> {
	return {
		...(params.fileUploadId ? { fileUploadId: params.fileUploadId } : {}),
		inputId: params.inputId,
		size: params.size,
		dragActive: params.dragActive,
		state: params.state,
		onDragEnter: params.onDragEnter,
		onDragLeave: params.onDragLeave,
		onDragOver: params.onDragOver,
		onDrop: params.onDrop,
		onClick: params.onClick,
	};
}

export function buildPreviewProps(params: Readonly<PreviewPropsParams>) {
	return {
		hasPreview: params.hasPreview,
		files: params.files,
		size: params.size,
		previewProps: params.previewProps,
		onFileRemove: params.onFileRemove,
	};
}

export function buildDropzoneParamsFromProps(
	params: Readonly<DropzoneSectionParams>
): Readonly<FileUploadDropzoneSectionProps> {
	return buildDropzoneSectionProps(params);
}

export function buildInputProps(
	state: FileUploadFieldState,
	inputRef: RefObject<HTMLInputElement | null>
): Readonly<FileUploadInputProps> {
	return { ...state.inputBaseProps, inputRef };
}

export function buildPreviewPropsFromState(params: Readonly<PreviewPropsFromStateParams>) {
	return buildPreviewProps({
		hasPreview: params.state.hasPreview,
		files: params.files,
		size: params.size,
		previewProps: params.state.previewProps,
		onFileRemove: params.onFileRemove,
	});
}
