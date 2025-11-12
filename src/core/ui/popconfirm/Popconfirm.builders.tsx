import type { PopoverPosition } from '@src-types/ui/overlays';
import type { ReactNode } from 'react';

import { prepareHandlers } from './Popconfirm.handlers';
import { renderFooter, renderPopconfirmContent } from './Popconfirm.renderers';

/**
 * Popover props type for Popconfirm
 */
export interface PopconfirmPopoverProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly trigger: ReactNode;
	readonly position: PopoverPosition;
	readonly closeOnOutsideClick: boolean;
	readonly closeOnEscape: boolean;
	readonly popoverId?: string;
	readonly className?: string;
	readonly containerClassName?: string;
	readonly children: ReactNode;
}

export interface BuildPopconfirmSetupProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly trigger: ReactNode;
	readonly title: string;
	readonly description?: ReactNode;
	readonly confirmLabel: string;
	readonly cancelLabel: string;
	readonly onConfirm?: (() => void | Promise<void>) | undefined;
	readonly onCancel?: (() => void) | undefined;
	readonly destructive: boolean;
	readonly showCancel: boolean;
	readonly position: PopoverPosition;
	readonly closeOnOutsideClick: boolean;
	readonly closeOnEscape: boolean;
	readonly popconfirmId?: string;
	readonly className?: string;
	readonly containerClassName?: string;
}

/**
 * Builds popconfirm content with footer
 */
export function buildPopconfirmContent({
	title,
	description,
	showCancel,
	cancelLabel,
	confirmLabel,
	destructive,
	onCancel,
	onConfirm,
}: {
	readonly title: string;
	readonly description?: ReactNode;
	readonly showCancel: boolean;
	readonly cancelLabel: string;
	readonly confirmLabel: string;
	readonly destructive: boolean;
	readonly onCancel: () => void;
	readonly onConfirm: () => Promise<void>;
}): ReactNode {
	const footer = renderFooter({
		showCancel,
		cancelLabel,
		confirmLabel,
		destructive,
		onCancel,
		onConfirm,
	});
	return renderPopconfirmContent({ title, description, footer });
}

/**
 * Builds popover props from Popconfirm props
 */
export function buildPopoverProps(options: {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly trigger: ReactNode;
	readonly position: PopoverPosition;
	readonly closeOnOutsideClick: boolean;
	readonly closeOnEscape: boolean;
	readonly popconfirmId?: string | undefined;
	readonly className?: string | undefined;
	readonly containerClassName?: string | undefined;
	readonly children: ReactNode;
}): PopconfirmPopoverProps {
	const { popconfirmId, className, containerClassName, ...baseProps } = options;
	const props = { ...baseProps } as PopconfirmPopoverProps;

	if (popconfirmId !== undefined) {
		Object.assign(props, { popoverId: popconfirmId });
	}
	if (className !== undefined) {
		Object.assign(props, { className });
	}
	if (containerClassName !== undefined) {
		Object.assign(props, { containerClassName });
	}

	return props;
}

/**
 * Builds complete popconfirm props and content
 */
export function buildPopconfirmSetup(props: BuildPopconfirmSetupProps): PopconfirmPopoverProps {
	const { handleConfirm, handleCancel } = prepareHandlers(
		props.onConfirm,
		props.onCancel,
		props.onClose
	);
	return buildPopoverProps({
		isOpen: props.isOpen,
		onClose: props.onClose,
		trigger: props.trigger,
		position: props.position,
		closeOnOutsideClick: props.closeOnOutsideClick,
		closeOnEscape: props.closeOnEscape,
		popconfirmId: props.popconfirmId,
		className: props.className,
		containerClassName: props.containerClassName,
		children: buildPopconfirmContent({
			title: props.title,
			description: props.description,
			showCancel: props.showCancel,
			cancelLabel: props.cancelLabel,
			confirmLabel: props.confirmLabel,
			destructive: props.destructive,
			onCancel: handleCancel,
			onConfirm: handleConfirm,
		}),
	});
}
