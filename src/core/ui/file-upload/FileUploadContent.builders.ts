import type {
	FileUploadFieldContentProps,
	PreparedFieldContentProps,
	PrepareFieldPropsParams,
} from './FileUploadContent.types';
import {
	buildDropzoneParamsFromProps,
	buildInputProps,
	buildLabelSectionProps,
	buildPreviewPropsFromState,
	type DropzoneSectionParams,
} from './FileUploadContentHelpers';

/**
 * Builds conditional field props based on optional values
 */
export function buildConditionalFieldProps(
	fileUploadId?: string,
	label?: string,
	required?: boolean
) {
	return {
		...(fileUploadId ? { fileUploadId } : {}),
		...(label ? { label } : {}),
		...(required === undefined ? {} : { required }),
	};
}

/**
 * Prepares field content props from field content props
 */
export function prepareFieldContentProps(
	props: Readonly<FileUploadFieldContentProps>
): PreparedFieldContentProps {
	const {
		fileUploadId,
		inputId,
		label,
		required,
		size,
		files,
		dragActive,
		state,
		inputRef,
		onDragEnter,
		onDragLeave,
		onDragOver,
		onDrop,
		onFileRemove,
		onClick,
	} = props;
	const dropzoneParams: DropzoneSectionParams = {
		...(fileUploadId ? { fileUploadId } : {}),
		inputId,
		size,
		dragActive,
		state,
		onDragEnter,
		onDragLeave,
		onDragOver,
		onDrop,
		onClick,
	};
	return {
		labelProps: buildLabelSectionProps(fileUploadId, label, required),
		dropzoneProps: buildDropzoneParamsFromProps(dropzoneParams),
		inputProps: buildInputProps(state, inputRef),
		previewProps: buildPreviewPropsFromState({ state, files, size, onFileRemove }),
	};
}

/**
 * Prepares file upload field props from content props and state
 */
export function prepareFileUploadFieldProps(
	params: Readonly<PrepareFieldPropsParams>
): Omit<Readonly<FileUploadFieldContentProps>, 'inputRef' | 'onClick'> {
	const {
		props: {
			fileUploadId,
			label,
			required,
			inputId,
			size,
			files,
			dragActive,
			onDragEnter,
			onDragLeave,
			onDragOver,
			onDrop,
			onFileRemove,
		},
		state,
	} = params;
	const conditionalProps = buildConditionalFieldProps(fileUploadId, label, required);
	return {
		...conditionalProps,
		inputId,
		size,
		files,
		dragActive,
		state,
		onDragEnter,
		onDragLeave,
		onDragOver,
		onDrop,
		onFileRemove,
	};
}
