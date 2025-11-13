import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

export interface SignaturePadWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface SignaturePadCanvasProps {
	readonly id: string | undefined;
	readonly width?: number;
	readonly height?: number;
	readonly backgroundColor?: string;
	readonly penColor?: string;
	readonly velocityFilterWeight?: number;
	readonly minWidth?: number;
	readonly maxWidth?: number;
	readonly throttle?: number;
	readonly disabled?: boolean;
	readonly value?: string | null;
	readonly defaultValue?: string | null;
	readonly onChange?: (dataUrl: string | null) => void;
	readonly showClearButton?: boolean;
	readonly clearButtonText?: string;
	readonly onClear?: () => void;
	readonly canvasClassName?: string;
}

export interface SignaturePadMessagesProps {
	readonly signaturePadId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface SignaturePadLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface UseSignaturePadStateOptions {
	readonly signaturePadId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseSignaturePadStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
}

export interface SignaturePadContentProps extends HTMLAttributes<HTMLDivElement> {
	readonly state: UseSignaturePadStateReturn;
	readonly canvasProps: Readonly<SignaturePadCanvasProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly showClearButton?: boolean;
	readonly clearButtonText?: string;
	readonly onClear?: () => void;
}
