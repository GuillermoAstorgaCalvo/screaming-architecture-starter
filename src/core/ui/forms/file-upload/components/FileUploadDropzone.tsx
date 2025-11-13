import { getFileUploadDropzoneClasses } from '@core/ui/forms/file-upload/helpers/FileUploadHelpers';
import type { FileUploadDropzoneProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import { type DragEvent, type KeyboardEvent, useRef } from 'react';

function useDragCounter() {
	const counterRef = useRef(0);
	return {
		increment: () => {
			counterRef.current += 1;
		},
		decrement: () => {
			counterRef.current -= 1;
			return counterRef.current === 0;
		},
		reset: () => {
			counterRef.current = 0;
		},
	};
}

function createDragHandler(handler: (e: DragEvent<HTMLDivElement>) => void) {
	return (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		handler(e);
	};
}

function createKeyHandler(onClick: () => void, disabled?: boolean) {
	return (e: KeyboardEvent<HTMLDivElement>) => {
		if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
			e.preventDefault();
			onClick();
		}
	};
}

function createDragEnterHandler(
	onDragEnter: (e: DragEvent<HTMLDivElement>) => void,
	increment: () => void
) {
	return (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		increment();
		if (e.dataTransfer.items.length > 0) {
			onDragEnter(e);
		}
	};
}

function createDragLeaveHandler(
	onDragLeave: (e: DragEvent<HTMLDivElement>) => void,
	decrement: () => boolean
) {
	return (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (decrement()) {
			onDragLeave(e);
		}
	};
}

function createDropHandler(onDrop: (e: DragEvent<HTMLDivElement>) => void, reset: () => void) {
	return (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		reset();
		onDrop(e);
	};
}

function useFileUploadDropzoneHandlers({
	onDragEnter,
	onDragLeave,
	onDragOver,
	onDrop,
	onClick,
	disabled,
}: Readonly<
	Pick<
		FileUploadDropzoneProps,
		'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop' | 'onClick'
	> & { disabled?: boolean | undefined }
>) {
	const dragCounter = useDragCounter();

	return {
		handleDragEnter: createDragEnterHandler(onDragEnter, dragCounter.increment),
		handleDragLeave: createDragLeaveHandler(onDragLeave, dragCounter.decrement),
		handleDragOver: createDragHandler(onDragOver),
		handleDrop: createDropHandler(onDrop, dragCounter.reset),
		handleKeyDown: createKeyHandler(onClick, disabled),
	};
}

function getDropzoneProps({
	id,
	disabled,
	className,
	handlers,
	onClick,
}: {
	id: string;
	disabled: boolean | undefined;
	className: string;
	handlers: ReturnType<typeof useFileUploadDropzoneHandlers>;
	onClick: () => void;
}) {
	return {
		id,
		role: 'button' as const,
		tabIndex: disabled ? -1 : 0,
		'aria-disabled': disabled,
		'aria-label': 'File upload dropzone',
		className,
		onDragEnter: handlers.handleDragEnter,
		onDragLeave: handlers.handleDragLeave,
		onDragOver: handlers.handleDragOver,
		onDrop: handlers.handleDrop,
		onClick: disabled ? undefined : onClick,
		onKeyDown: handlers.handleKeyDown,
	};
}

export function FileUploadDropzone(props: Readonly<FileUploadDropzoneProps>) {
	const {
		id,
		disabled,
		dragActive,
		size,
		onClick,
		children,
		onDragEnter,
		onDragLeave,
		onDragOver,
		onDrop,
	} = props;
	const handlers = useFileUploadDropzoneHandlers({
		onDragEnter,
		onDragLeave,
		onDragOver,
		onDrop,
		onClick,
		disabled,
	});
	const className = getFileUploadDropzoneClasses({
		size,
		dragActive,
		disabled: disabled ?? false,
	});

	return (
		<div {...getDropzoneProps({ id, disabled, className, handlers, onClick })}>{children}</div>
	);
}
