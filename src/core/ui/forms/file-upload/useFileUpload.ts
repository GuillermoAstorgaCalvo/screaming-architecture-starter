import type { FileUploadProps } from '@src-types/ui/forms-inputs';
import { useId, useState } from 'react';

import { generateFileUploadId } from './FileUploadHelpers';
import type { FileUploadContentProps, FileUploadFile } from './FileUploadTypes';
import { useFileHandlers } from './useFileUpload.handlers';
import { useDragHandlers, useFileState, useValidationWrappers } from './useFileUpload.hooks';
import { buildContentProps } from './useFileUpload.props';

export interface UseFileUploadPropsOptions {
	readonly props: Readonly<FileUploadProps>;
}

export interface UseFileUploadPropsReturn {
	readonly contentProps: Readonly<FileUploadContentProps>;
}

function useFileUploadIds(
	generatedId: string,
	externalFileUploadId: string | undefined,
	label: string | undefined
) {
	const fileUploadId = generateFileUploadId(generatedId, externalFileUploadId, label);
	const inputId = fileUploadId ?? `fileupload-${generatedId.replaceAll(':', '')}`;
	return { fileUploadId, inputId };
}

function useFileUploadHooks(params: {
	props: FileUploadProps;
	files: readonly FileUploadFile[];
	setFiles: (files: readonly FileUploadFile[]) => void;
	setValidationError: (error: string | undefined) => void;
	setDragActive: (active: boolean) => void;
}) {
	const { props, files, setFiles, setValidationError, setDragActive } = params;
	const { onChange, validation, showPreview = true, onFileProgress, multiple = false } = props;
	const handlers = useFileHandlers({
		files,
		setFiles,
		multiple,
		validation,
		onChange,
		onFileProgress,
		showPreview,
	});
	const { processWithValidation, removeWithValidation } = useValidationWrappers(
		handlers.processNewFiles,
		handlers.handleFileRemove,
		setValidationError
	);
	const dragHandlers = useDragHandlers(processWithValidation, setDragActive);

	return {
		handlers,
		removeWithValidation,
		dragHandlers,
	};
}

function buildContentPropsWithHandlers(params: {
	props: FileUploadProps;
	fileUploadId: string | undefined;
	inputId: string;
	files: readonly FileUploadFile[];
	validationError: string | undefined;
	dragActive: boolean;
	hooks: ReturnType<typeof useFileUploadHooks>;
}): FileUploadContentProps {
	const { props, fileUploadId, inputId, files, validationError, dragActive, hooks } = params;
	return buildContentProps({
		props,
		fileUploadId,
		inputId,
		files,
		validationError,
		dragActive,
		handlers: {
			handleFilesChange: hooks.handlers.handleFilesChange,
			removeWithValidation: hooks.removeWithValidation,
			handleFileProgress: hooks.handlers.handleFileProgress,
			...hooks.dragHandlers,
			handleInputChange: hooks.handlers.handleInputChange,
		},
	});
}

export function useFileUploadProps({
	props,
}: Readonly<UseFileUploadPropsOptions>): UseFileUploadPropsReturn {
	const { fileUploadId: externalFileUploadId, value, label } = props;
	const generatedId = useId();
	const { fileUploadId, inputId } = useFileUploadIds(generatedId, externalFileUploadId, label);
	const { files, setFiles, validationError, setValidationError } = useFileState(value);
	const [dragActive, setDragActive] = useState(false);
	const hooks = useFileUploadHooks({ props, files, setFiles, setValidationError, setDragActive });

	return {
		contentProps: buildContentPropsWithHandlers({
			props,
			fileUploadId,
			inputId,
			files,
			validationError,
			dragActive,
			hooks,
		}),
	};
}
