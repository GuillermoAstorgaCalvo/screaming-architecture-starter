import i18n from '@core/i18n/i18n';
import type {
	FileUploadFile,
	FileUploadValidation,
} from '@core/ui/forms/file-upload/types/FileUploadTypes';

import { formatFileSize, getFileExtension } from './FileUploadHelpers';

function validateFileSize(file: File, validation: FileUploadValidation): string | undefined {
	const t = (key: string, options?: Record<string, string>) =>
		i18n.t(key, { ns: 'common', ...options });
	if (validation.maxSize && file.size > validation.maxSize) {
		return t('fileUpload.fileSizeExceedsMaximum', {
			maxSize: formatFileSize(validation.maxSize),
		});
	}
	if (validation.minSize && file.size < validation.minSize) {
		return t('fileUpload.fileSizeBelowMinimum', {
			minSize: formatFileSize(validation.minSize),
		});
	}
	return undefined;
}

function validateFileType(file: File, validation: FileUploadValidation): string | undefined {
	if (!validation.acceptedTypes || validation.acceptedTypes.length === 0) {
		return undefined;
	}

	const fileExtension = getFileExtension(file.name);
	const fileType = file.type;
	const isAccepted = validation.acceptedTypes.some(type => {
		if (type.startsWith('.')) {
			return `.${fileExtension}` === type.toLowerCase();
		}
		return fileType === type || fileType.startsWith(`${type}/`);
	});

	if (!isAccepted) {
		const t = (key: string, options?: Record<string, string>) =>
			i18n.t(key, { ns: 'common', ...options });
		return t('fileUpload.fileTypeNotAccepted', {
			types: validation.acceptedTypes.join(', '),
		});
	}

	return undefined;
}

export function validateFile(file: File, validation?: FileUploadValidation): string | undefined {
	if (!validation) return undefined;

	const sizeError = validateFileSize(file, validation);
	if (sizeError) return sizeError;

	const typeError = validateFileType(file, validation);
	if (typeError) return typeError;

	return undefined;
}

function getFileCountMessage(count: number, isMax: boolean): string {
	const t = (key: string) => i18n.t(key, { ns: 'common' });
	const plural = count > 1 ? t('fileUpload.files') : t('fileUpload.file');
	const limit = isMax ? t('fileUpload.maximum') : t('fileUpload.minimum');
	const action = isMax ? t('fileUpload.allowed') : t('fileUpload.required');
	return `${limit} ${count} ${plural} ${action}`;
}

function validateFileCount(
	files: readonly FileUploadFile[],
	validation: FileUploadValidation
): string | undefined {
	if (validation.maxFiles && files.length > validation.maxFiles) {
		return getFileCountMessage(validation.maxFiles, true);
	}
	if (validation.minFiles && files.length < validation.minFiles) {
		return getFileCountMessage(validation.minFiles, false);
	}
	return undefined;
}

export function validateFiles(
	files: readonly FileUploadFile[],
	validation?: FileUploadValidation
): string | undefined {
	if (!validation) return undefined;

	return validateFileCount(files, validation);
}
