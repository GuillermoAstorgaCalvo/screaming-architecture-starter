import type { FileUploadProps } from '@src-types/ui/forms-inputs';
import { type ChangeEvent, useCallback } from 'react';

import { createFilePreview, validateFiles } from './FileUploadHelpers';
import type { FileUploadContentProps, FileUploadFile } from './FileUploadTypes';
import { createFileUploadFile, processFiles } from './useFileUpload.utils';

export function useFilePreviewUpdater(
	files: readonly FileUploadFile[],
	setFiles: (files: readonly FileUploadFile[]) => void
) {
	return useCallback(
		(fileId: string, preview: string) => {
			setFiles(files.map(f => (f.id === fileId ? { ...f, preview } : f)));
		},
		[files, setFiles]
	);
}

export function useFileProcessor(params: {
	files: readonly FileUploadFile[];
	setFiles: (files: readonly FileUploadFile[]) => void;
	multiple: boolean;
	validation: FileUploadContentProps['validation'];
	onChange?: FileUploadProps['onChange'];
	showPreview: boolean;
	updateFilePreview: (fileId: string, preview: string) => void;
}) {
	const { files, setFiles, multiple, validation, onChange, showPreview, updateFilePreview } =
		params;

	return useCallback(
		async (newFiles: File[]) => {
			const processedFiles = newFiles.map(file => {
				const fileData = createFileUploadFile(file, validation);
				if (showPreview) {
					createFilePreview(file)
						.then(p => updateFilePreview(fileData.id, p))
						.catch(() => {
							// Ignore preview errors
						});
				}
				return fileData;
			});

			const filesError = validateFiles([...files, ...processedFiles], validation);
			if (filesError) {
				return filesError;
			}

			const updatedFiles = multiple ? [...files, ...processedFiles] : processedFiles.slice(0, 1);
			setFiles(updatedFiles);

			if (onChange) {
				const fileObjects = updatedFiles.map(f => f.file);
				onChange(multiple ? fileObjects : (fileObjects[0] ?? null));
			}
			return undefined;
		},
		[files, multiple, validation, showPreview, onChange, updateFilePreview, setFiles]
	);
}

export function useFileInputHandler(
	processNewFiles: (files: File[]) => Promise<string | undefined>
) {
	return useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const selectedFiles = e.target.files;
			if (selectedFiles && selectedFiles.length > 0) {
				processNewFiles(processFiles(selectedFiles)).catch(() => {
					// Ignore errors
				});
			}
			e.target.value = '';
		},
		[processNewFiles]
	);
}

export function useFileRemoveHandler(params: {
	files: readonly FileUploadFile[];
	setFiles: (files: readonly FileUploadFile[]) => void;
	multiple: boolean;
	validation: FileUploadContentProps['validation'];
	onChange?: FileUploadProps['onChange'];
}) {
	const { files, setFiles, multiple, validation, onChange } = params;

	return useCallback(
		(fileId: string) => {
			const updatedFiles = files.filter(f => f.id !== fileId);
			setFiles(updatedFiles);
			const filesError = validateFiles(updatedFiles, validation);
			if (onChange) {
				const fileObjects = updatedFiles.map(f => f.file);
				onChange(multiple ? fileObjects : (fileObjects[0] ?? null));
			}
			return filesError;
		},
		[files, multiple, validation, onChange, setFiles]
	);
}

export function useFileProgressHandler(
	files: readonly FileUploadFile[],
	setFiles: (files: readonly FileUploadFile[]) => void,
	onFileProgress?: FileUploadProps['onFileProgress']
) {
	return useCallback(
		(fileId: string, progress: number) => {
			setFiles(
				files.map(f => {
					if (f.id === fileId) {
						return { ...f, progress, status: progress === 100 ? 'success' : 'uploading' };
					}
					return f;
				})
			);
			onFileProgress?.(fileId, progress);
		},
		[files, onFileProgress, setFiles]
	);
}

export function useFilesChangeHandler(
	processNewFiles: (files: File[]) => Promise<string | undefined>
) {
	return useCallback(
		(filesToProcess: File[]) => {
			processNewFiles(filesToProcess).catch(() => {
				// Ignore errors
			});
		},
		[processNewFiles]
	);
}

export function useFileHandlers(params: {
	files: readonly FileUploadFile[];
	setFiles: (files: readonly FileUploadFile[]) => void;
	multiple: boolean;
	validation: FileUploadContentProps['validation'];
	onChange?: FileUploadProps['onChange'];
	onFileProgress?: FileUploadProps['onFileProgress'];
	showPreview: boolean;
}) {
	const { files, setFiles, multiple, validation, onChange, onFileProgress, showPreview } = params;

	const updateFilePreview = useFilePreviewUpdater(files, setFiles);
	const processNewFiles = useFileProcessor({
		files,
		setFiles,
		multiple,
		validation,
		onChange,
		showPreview,
		updateFilePreview,
	});
	const handleInputChange = useFileInputHandler(processNewFiles);
	const handleFileRemove = useFileRemoveHandler({
		files,
		setFiles,
		multiple,
		validation,
		onChange,
	});
	const handleFileProgress = useFileProgressHandler(files, setFiles, onFileProgress);
	const handleFilesChange = useFilesChangeHandler(processNewFiles);

	return {
		processNewFiles,
		handleInputChange,
		handleFileRemove,
		handleFileProgress,
		handleFilesChange,
	};
}
