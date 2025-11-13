import { validateFile } from '@core/ui/forms/file-upload/helpers/FileUploadHelpers';
import type {
	FileUploadContentProps,
	FileUploadFile,
} from '@core/ui/forms/file-upload/types/FileUploadTypes';

const RADIX_BASE = 36;
const RANDOM_STRING_LENGTH = 9;
const RANDOM_STRING_START = 2;

export function generateFileId(): string {
	return `file-${Date.now()}-${Math.random().toString(RADIX_BASE).slice(RANDOM_STRING_START, RANDOM_STRING_LENGTH)}`;
}

export function processFiles(files: FileList | File[]): File[] {
	return Array.from(files);
}

export function normalizeValueToFileArray(value: File | File[] | null | undefined): File[] {
	if (value === undefined || value === null) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
}

export function createFileUploadFile(
	file: File,
	validation?: FileUploadContentProps['validation']
): FileUploadFile {
	const fileError = validateFile(file, validation);
	return {
		file,
		id: generateFileId(),
		...(fileError !== undefined && { error: fileError }),
		status: fileError ? 'error' : 'pending',
	};
}
