import { ModalBody } from '@core/ui/overlays/modal/components/ModalBody';
import { createDialogCancelHandler } from '@core/ui/overlays/modal/helpers/ModalHelpers';
import { getModalDialogVariantClasses } from '@core/ui/variants/modal';
import type { ModalSize } from '@src-types/ui/base';
import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react';

interface ModalDialogProps {
	readonly modalRef: RefObject<HTMLDialogElement | null>;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly className?: string;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
	readonly handleOverlayClick: (event: MouseEvent<HTMLDialogElement>) => void;
	readonly handleOverlayKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void;
	readonly size: ModalSize;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly children: ReactNode;
	readonly footer?: ReactNode;
}

function getDialogClassName(className?: string) {
	return getModalDialogVariantClasses({ className });
}

type ModalBodyProps = Pick<
	ModalDialogProps,
	| 'size'
	| 'titleId'
	| 'title'
	| 'showCloseButton'
	| 'onClose'
	| 'descriptionId'
	| 'footer'
	| 'children'
>;

function renderModalBody(props: ModalBodyProps) {
	const { size, titleId, title, showCloseButton, onClose, descriptionId, footer, children } = props;
	return (
		<ModalBody
			size={size}
			titleId={titleId}
			title={title}
			showCloseButton={showCloseButton}
			onClose={onClose}
			descriptionId={descriptionId}
			footer={footer}
		>
			{children}
		</ModalBody>
	);
}

function getDialogAttributes(props: ModalDialogProps) {
	const {
		modalRef,
		titleId,
		descriptionId,
		className,
		closeOnEscape,
		onClose,
		handleOverlayClick,
		handleOverlayKeyDown,
	} = props;
	return {
		ref: modalRef,
		className: getDialogClassName(className),
		'aria-labelledby': titleId,
		'aria-describedby': descriptionId,
		onCancel: createDialogCancelHandler(closeOnEscape, onClose),
		onClick: handleOverlayClick,
		onKeyDown: handleOverlayKeyDown,
	};
}

export function ModalDialog(props: ModalDialogProps) {
	const dialogAttrs = getDialogAttributes(props);
	const bodyProps: ModalBodyProps = {
		size: props.size,
		titleId: props.titleId,
		title: props.title,
		showCloseButton: props.showCloseButton,
		onClose: props.onClose,
		descriptionId: props.descriptionId,
		footer: props.footer,
		children: props.children,
	};

	return <dialog {...dialogAttrs}>{renderModalBody(bodyProps)}</dialog>;
}
