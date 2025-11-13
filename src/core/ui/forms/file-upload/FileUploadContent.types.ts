import type { StandardSize } from '@src-types/ui/base';
import type { DragEvent, RefObject } from 'react';

import type {
	FileUploadDropzoneSectionProps,
	FileUploadFieldState,
	FileUploadInputProps,
	FileUploadLabelSectionProps,
} from './FileUploadContentHelpers';
import type { FileUploadContentProps, FileUploadFile } from './FileUploadTypes';

export interface FileUploadFieldContentProps {
	readonly fileUploadId?: string;
	readonly inputId: string;
	readonly label?: string;
	readonly required?: boolean;
	readonly size: StandardSize;
	readonly files: readonly FileUploadFile[];
	readonly dragActive: boolean;
	readonly state: FileUploadFieldState;
	readonly inputRef: RefObject<HTMLInputElement | null>;
	readonly onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragOver: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDrop: (e: DragEvent<HTMLDivElement>) => void;
	readonly onFileRemove: (fileId: string) => void;
	readonly onClick: () => void;
}

export interface PreparedFieldContentProps {
	readonly labelProps: Readonly<FileUploadLabelSectionProps>;
	readonly dropzoneProps: Readonly<FileUploadDropzoneSectionProps>;
	readonly inputProps: Readonly<FileUploadInputProps>;
	readonly previewProps: {
		readonly hasPreview: boolean;
		readonly files: readonly FileUploadFile[];
		readonly size: StandardSize;
		readonly previewProps: Readonly<{ showProgress?: boolean }>;
		readonly onFileRemove: (fileId: string) => void;
	};
}

export interface PrepareFieldPropsParams {
	readonly props: Readonly<FileUploadContentProps>;
	readonly state: FileUploadFieldState;
}
