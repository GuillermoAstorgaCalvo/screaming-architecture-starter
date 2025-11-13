import type { StandardSize } from '@src-types/ui/base';

import type { FileUploadFile, FileUploadValidation } from './FileUploadTypes';

export interface GetFileUploadDropzoneClassesOptions {
	size: StandardSize;
	dragActive: boolean;
	disabled?: boolean;
	className?: string | undefined;
}

export function getFileUploadDropzoneClasses(options: GetFileUploadDropzoneClassesOptions): string {
	const baseClasses =
		'relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors cursor-pointer';
	const sizeClasses = {
		sm: 'p-4 gap-2',
		md: 'p-6 gap-3',
		lg: 'p-8 gap-4',
	};
	let stateClasses: string;
	if (options.disabled) {
		stateClasses =
			'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50';
	} else if (options.dragActive) {
		stateClasses = 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20';
	} else {
		stateClasses =
			'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500';
	}

	return `${baseClasses} ${sizeClasses[options.size]} ${stateClasses} ${options.className ?? ''}`;
}

export function getAriaDescribedBy(
	fileUploadId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${fileUploadId}-error`);
	if (helperText) ids.push(`${fileUploadId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateFileUploadId(
	generatedId: string,
	fileUploadId?: string,
	label?: string
): string | undefined {
	if (fileUploadId) {
		return fileUploadId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `fileupload-${cleanId}`;
}

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
	const parts = filename.split('.');
	return parts.length > 1 ? (parts.at(-1)?.toLowerCase() ?? '') : '';
}

export function isImageFile(file: File): boolean {
	return file.type.startsWith('image/');
}

export function createFilePreview(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!isImageFile(file)) {
			resolve('');
			return;
		}

		const reader = new FileReader();
		reader.addEventListener('load', e => {
			resolve(e.target?.result as string);
		});
		reader.addEventListener('error', reject);
		reader.readAsDataURL(file);
	});
}

export function validateFile(file: File, validation?: FileUploadValidation): string | undefined {
	if (!validation) return undefined;

	// Check file size
	if (validation.maxSize && file.size > validation.maxSize) {
		return `File size exceeds maximum of ${formatFileSize(validation.maxSize)}`;
	}
	if (validation.minSize && file.size < validation.minSize) {
		return `File size is below minimum of ${formatFileSize(validation.minSize)}`;
	}

	// Check file type
	if (validation.acceptedTypes && validation.acceptedTypes.length > 0) {
		const fileExtension = getFileExtension(file.name);
		const fileType = file.type;
		const isAccepted = validation.acceptedTypes.some(type => {
			if (type.startsWith('.')) {
				return `.${fileExtension}` === type.toLowerCase();
			}
			return fileType === type || fileType.startsWith(`${type}/`);
		});

		if (!isAccepted) {
			return `File type not accepted. Accepted types: ${validation.acceptedTypes.join(', ')}`;
		}
	}

	return undefined;
}

export function validateFiles(
	files: readonly FileUploadFile[],
	validation?: FileUploadValidation
): string | undefined {
	if (!validation) return undefined;

	// Check file count
	if (validation.maxFiles && files.length > validation.maxFiles) {
		return `Maximum ${validation.maxFiles} file${validation.maxFiles > 1 ? 's' : ''} allowed`;
	}
	if (validation.minFiles && files.length < validation.minFiles) {
		return `Minimum ${validation.minFiles} file${validation.minFiles > 1 ? 's' : ''} required`;
	}

	return undefined;
}
