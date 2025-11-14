import i18n from '@core/i18n/i18n';
import type { StandardSize } from '@src-types/ui/base';

export interface GetFileUploadDropzoneClassesOptions {
	size: StandardSize;
	dragActive: boolean;
	disabled?: boolean;
	className?: string | undefined;
}

export function getFileUploadDropzoneClasses(options: GetFileUploadDropzoneClassesOptions): string {
	const baseClasses =
		'relative flex flex-col items-center justify-center border-medium border-dashed rounded-lg transition-colors cursor-pointer';
	// Uses design token spacing: xs=4px, sm=8px, md=12px, lg=16px, xl=24px
	// sm: p-lg (16px) gap-sm (8px), md: p-xl (24px) gap-md (12px), lg: p-2xl (32px) gap-lg (16px)
	const sizeClasses = {
		sm: 'p-lg gap-sm',
		md: 'p-xl gap-md',
		lg: 'p-2xl gap-lg',
	};
	let stateClasses: string;
	if (options.disabled) {
		stateClasses =
			'border-border dark:border-border bg-muted dark:bg-muted cursor-not-allowed opacity-disabled';
	} else if (options.dragActive) {
		stateClasses = 'border-primary dark:border-primary bg-primary/10 dark:bg-primary/20';
	} else {
		stateClasses =
			'border-border dark:border-border bg-surface dark:bg-surface hover:border-primary dark:hover:border-primary';
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
	const t = (key: string) => i18n.t(key, { ns: 'common' });
	if (bytes === 0) return `0 ${t('fileUpload.bytes')}`;
	const k = 1024;
	const sizes = [t('fileUpload.bytes'), t('fileUpload.kb'), t('fileUpload.mb'), t('fileUpload.gb')];
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
