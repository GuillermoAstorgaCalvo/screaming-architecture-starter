import { useTranslation } from '@core/i18n/useTranslation';
import type { FileUploadProgressProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import Progress from '@core/ui/progress/Progress';

export function FileUploadProgress({ progress, size }: Readonly<FileUploadProgressProps>) {
	const { t } = useTranslation('common');
	return (
		<div className="mt-2 w-full">
			<Progress
				value={progress}
				max={100}
				size={size}
				showValue
				aria-label={t('fileUpload.uploadProgress', { progress: progress.toString() })}
			/>
		</div>
	);
}
