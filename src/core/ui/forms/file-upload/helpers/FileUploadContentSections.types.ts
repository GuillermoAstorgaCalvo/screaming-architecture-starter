import type { FileUploadFieldState } from '@core/ui/forms/file-upload/helpers/FileUploadContentHelpers';
import type { FileUploadFile } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import type { StandardSize } from '@src-types/ui/base';
import type { DragEvent } from 'react';

export interface FileUploadLabelSectionProps {
	readonly fileUploadId?: string;
	readonly label?: string;
	readonly required?: boolean;
}

export interface FileUploadDropzoneSectionProps {
	readonly fileUploadId?: string;
	readonly inputId: string;
	readonly size: StandardSize;
	readonly dragActive: boolean;
	readonly state: FileUploadFieldState;
	readonly onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragOver: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDrop: (e: DragEvent<HTMLDivElement>) => void;
	readonly onClick: () => void;
}

export interface FileUploadPreviewSectionProps {
	readonly hasPreview: boolean;
	readonly files: readonly FileUploadFile[];
	readonly size: StandardSize;
	readonly previewProps: Readonly<{ showProgress?: boolean }>;
	readonly onFileRemove: (fileId: string) => void;
}
