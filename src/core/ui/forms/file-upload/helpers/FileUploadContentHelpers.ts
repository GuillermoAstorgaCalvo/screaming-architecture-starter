import type {
	FileUploadContentProps,
	FileUploadFile,
} from '@core/ui/forms/file-upload/types/FileUploadTypes';
import type { StandardSize } from '@src-types/ui/base';
import type { ChangeEvent, DragEvent, RefObject } from 'react';

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

export type DropzoneSectionParams = FileUploadDropzoneSectionProps;

export interface PreviewPropsFromStateParams {
	readonly state: FileUploadFieldState;
	readonly files: readonly FileUploadFile[];
	readonly size: StandardSize;
	readonly onFileRemove: (fileId: string) => void;
}

function normalizeAcceptString(accept?: string | string[]): string | undefined {
	return Array.isArray(accept) ? accept.join(',') : accept;
}

interface BuildInputBasePropsParams {
	readonly inputId: string;
	readonly multiple: boolean;
	readonly acceptString: string | undefined;
	readonly isDisabled: boolean;
	readonly required: boolean | undefined;
	readonly fileUploadId: string | undefined;
	readonly onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function buildInputBaseProps(
	params: Readonly<BuildInputBasePropsParams>
): Omit<Readonly<FileUploadInputProps>, 'inputRef'> {
	return {
		inputId: params.inputId,
		multiple: params.multiple,
		...(params.acceptString && { accept: params.acceptString }),
		disabled: params.isDisabled,
		...(params.required !== undefined && { required: params.required }),
		...(params.fileUploadId && { fileUploadId: params.fileUploadId }),
		onChange: params.onInputChange,
	} as const;
}

function buildPreviewPropsFromShowProgress(
	showProgress: boolean | undefined
): Readonly<{ showProgress?: boolean }> {
	return showProgress === undefined ? {} : { showProgress };
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
	const acceptString = normalizeAcceptString(accept);
	const isDisabled = disabled ?? false;
	const hasPreview = Boolean(showPreview && files.length > 0);
	const previewProps = buildPreviewPropsFromShowProgress(showProgress);
	const inputBaseProps = buildInputBaseProps({
		inputId,
		multiple,
		acceptString,
		isDisabled,
		required,
		fileUploadId,
		onInputChange,
	});
	return {
		...(acceptString && { acceptString }),
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
		...(fileUploadId && { fileUploadId }),
		...(label && { label }),
		...(required !== undefined && { required }),
	};
}

export function buildDropzoneSectionProps(
	params: Readonly<DropzoneSectionParams>
): Readonly<FileUploadDropzoneSectionProps> {
	return params;
}

export const buildDropzoneParamsFromProps = buildDropzoneSectionProps;

export function buildInputProps(
	state: FileUploadFieldState,
	inputRef: RefObject<HTMLInputElement | null>
): Readonly<FileUploadInputProps> {
	return { ...state.inputBaseProps, inputRef };
}

export function buildPreviewPropsFromState(params: Readonly<PreviewPropsFromStateParams>) {
	return {
		hasPreview: params.state.hasPreview,
		files: params.files,
		size: params.size,
		previewProps: params.state.previewProps,
		onFileRemove: params.onFileRemove,
	};
}
