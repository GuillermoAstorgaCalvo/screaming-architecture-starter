import Progress from '@core/ui/progress/Progress';

import type { FileUploadProgressProps } from './FileUploadTypes';

export function FileUploadProgress({ progress, size }: Readonly<FileUploadProgressProps>) {
	return (
		<div className="mt-2 w-full">
			<Progress
				value={progress}
				max={100}
				size={size}
				showValue
				aria-label={`Upload progress: ${progress}%`}
			/>
		</div>
	);
}
