import {
	generateFileId,
	normalizeValueToFileArray,
	processFiles,
} from '@core/ui/forms/file-upload/helpers/useFileUpload.utils';
import type { FileUploadFile } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import { type DragEvent, useCallback, useEffect, useState } from 'react';

export function useFileState(value: File | File[] | null | undefined) {
	const [files, setFiles] = useState<readonly FileUploadFile[]>(() => {
		const fileArray = normalizeValueToFileArray(value);
		return fileArray.map(file => ({ file, id: generateFileId(), status: 'pending' as const }));
	});

	const [validationError, setValidationError] = useState<string | undefined>();

	useEffect(() => {
		if (value === undefined) return;
		const fileArray = normalizeValueToFileArray(value);
		const timeoutId = setTimeout(() => {
			setFiles(fileArray.map(file => ({ file, id: generateFileId(), status: 'pending' as const })));
		}, 0);
		return () => clearTimeout(timeoutId);
	}, [value]);

	return { files, setFiles, validationError, setValidationError };
}

export function useDragHandlers(
	onFilesProcess: (files: File[]) => Promise<void>,
	setDragActive: (active: boolean) => void
) {
	const handleDragEnter = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(true);
		},
		[setDragActive]
	);

	const handleDragLeave = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(false);
		},
		[setDragActive]
	);

	const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(false);
			const droppedFiles = e.dataTransfer.files;
			if (droppedFiles.length > 0) {
				onFilesProcess(processFiles(droppedFiles)).catch(() => {
					// Ignore errors
				});
			}
		},
		[onFilesProcess, setDragActive]
	);

	return { handleDragEnter, handleDragLeave, handleDragOver, handleDrop };
}

export function useValidationWrappers(
	processNewFiles: (files: File[]) => Promise<string | undefined>,
	handleFileRemove: (fileId: string) => string | undefined,
	setValidationError: (error: string | undefined) => void
) {
	const processWithValidation = useCallback(
		async (newFiles: File[]) => {
			const error = await processNewFiles(newFiles);
			setValidationError(error ?? undefined);
		},
		[processNewFiles, setValidationError]
	);

	const removeWithValidation = useCallback(
		(fileId: string) => {
			setValidationError(handleFileRemove(fileId));
		},
		[handleFileRemove, setValidationError]
	);

	return { processWithValidation, removeWithValidation };
}
