import type { StandardSize } from '@src-types/ui/base';
import type { ChangeEvent, DragEvent, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface FileUploadFile {
	readonly file: File;
	readonly id: string;
	readonly preview?: string;
	readonly progress?: number;
	readonly error?: string;
	readonly status?: 'pending' | 'uploading' | 'success' | 'error';
}

export interface FileUploadValidation {
	readonly maxSize?: number; // in bytes
	readonly minSize?: number; // in bytes
	readonly acceptedTypes?: string[]; // MIME types or extensions
	readonly maxFiles?: number;
	readonly minFiles?: number;
}

export interface FileUploadInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'multiple' | 'accept'> {
	readonly multiple?: boolean;
	readonly accept?: string | string[];
}

export interface FileUploadContentProps {
	readonly fileUploadId: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly disabled?: boolean | undefined;
	readonly size: StandardSize;
	readonly multiple: boolean;
	readonly accept?: string | string[];
	readonly files: readonly FileUploadFile[];
	readonly validation?: FileUploadValidation;
	readonly showPreview?: boolean;
	readonly showProgress?: boolean;
	readonly onFilesChange: (files: File[]) => void;
	readonly onFileRemove: (fileId: string) => void;
	readonly onFileProgress?: (fileId: string, progress: number) => void;
	readonly dragActive: boolean;
	readonly onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragOver: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDrop: (e: DragEvent<HTMLDivElement>) => void;
	readonly onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	readonly inputId: string;
}

export interface FileUploadWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface FileUploadContainerProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface FileUploadDropzoneProps {
	readonly id: string;
	readonly disabled?: boolean;
	readonly dragActive: boolean;
	readonly size: StandardSize;
	readonly onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDragOver: (e: DragEvent<HTMLDivElement>) => void;
	readonly onDrop: (e: DragEvent<HTMLDivElement>) => void;
	readonly onClick: () => void;
	readonly children: ReactNode;
}

export interface FileUploadPreviewProps {
	readonly files: readonly FileUploadFile[];
	readonly onRemove: (fileId: string) => void;
	readonly showProgress?: boolean;
	readonly size: StandardSize;
}

export interface FileUploadPreviewItemProps {
	readonly file: FileUploadFile;
	readonly onRemove: (fileId: string) => void;
	readonly showProgress?: boolean;
	readonly size: StandardSize;
}

export interface FileUploadProgressProps {
	readonly progress: number;
	readonly size: StandardSize;
}

export interface FileUploadMessagesProps {
	readonly fileUploadId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface FileUploadLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
}
