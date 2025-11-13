import type { ResizableDirection } from '@src-types/ui/overlays/containers';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';

export interface ResizableContainerProps {
	readonly id: string;
	readonly direction: ResizableDirection;
	readonly size: number | undefined;
	readonly isResizing: boolean;
	readonly disabled: boolean;
	readonly className?: string;
	readonly handleClassName?: string;
	readonly style?: CSSProperties;
	readonly children: ReactNode;
	readonly onMouseDown: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ContainerClassesParams {
	readonly isResizing: boolean;
	readonly disabled: boolean;
	readonly className: string | undefined;
}

export interface ContainerStylesParams {
	readonly direction: ResizableDirection;
	readonly size: number | undefined;
	readonly style: CSSProperties | undefined;
}

export interface PrepareContainerParams {
	readonly direction: ResizableDirection;
	readonly size: number | undefined;
	readonly style: CSSProperties | undefined;
	readonly isResizing: boolean;
	readonly disabled: boolean;
	readonly className: string | undefined;
}

export interface PreparedContainerData {
	readonly containerStyle: CSSProperties;
	readonly containerClasses: string;
}

export interface ProcessedContainerProps {
	readonly id: string;
	readonly containerStyle: CSSProperties;
	readonly containerClasses: string;
	readonly handle: ReactNode;
	readonly children: ReactNode;
}

export interface PrepareDataParams {
	readonly direction: ResizableDirection;
	readonly size: number | undefined;
	readonly style: CSSProperties | undefined;
	readonly isResizing: boolean;
	readonly disabled: boolean;
	readonly className: string | undefined;
	readonly handleClassName: string | undefined;
	readonly onMouseDown: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface PreparedData {
	readonly containerStyle: CSSProperties;
	readonly containerClasses: string;
	readonly handle: ReactNode;
}
