import { getDialogDialogVariantClasses } from '@core/ui/variants/dialog';
import type { ModalSize } from '@src-types/ui/base';
import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react';

import type { DialogVariant } from './dialog.types';
import { DialogBody } from './DialogBody';
import { createDialogCancelHandler } from './DialogHelpers';

interface DialogDialogProps {
	readonly dialogRef: RefObject<HTMLDialogElement | null>;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly className?: string;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
	readonly handleOverlayClick: (event: MouseEvent<HTMLDialogElement>) => void;
	readonly handleOverlayKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void;
	readonly size: ModalSize;
	readonly variant: DialogVariant;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly children: ReactNode;
	readonly footer?: ReactNode;
}

function getDialogClassName(className?: string, variant?: DialogVariant) {
	return getDialogDialogVariantClasses({ className, variant });
}

type DialogBodyProps = Pick<
	DialogDialogProps,
	| 'size'
	| 'titleId'
	| 'title'
	| 'showCloseButton'
	| 'onClose'
	| 'descriptionId'
	| 'footer'
	| 'children'
	| 'variant'
>;

function renderDialogBody(props: DialogBodyProps) {
	const {
		size,
		titleId,
		title,
		showCloseButton,
		onClose,
		descriptionId,
		footer,
		children,
		variant,
	} = props;
	return (
		<DialogBody
			size={size}
			variant={variant}
			titleId={titleId}
			title={title}
			showCloseButton={showCloseButton}
			onClose={onClose}
			descriptionId={descriptionId}
			footer={footer}
		>
			{children}
		</DialogBody>
	);
}

function getDialogAttributes(props: DialogDialogProps) {
	const {
		dialogRef,
		titleId,
		descriptionId,
		className,
		variant,
		closeOnEscape,
		onClose,
		handleOverlayClick,
		handleOverlayKeyDown,
	} = props;
	return {
		ref: dialogRef,
		className: getDialogClassName(className, variant),
		'aria-labelledby': titleId,
		'aria-describedby': descriptionId,
		onCancel: createDialogCancelHandler(closeOnEscape, onClose),
		onClick: handleOverlayClick,
		onKeyDown: handleOverlayKeyDown,
	};
}

export function DialogDialog(props: DialogDialogProps) {
	const dialogAttrs = getDialogAttributes(props);
	const bodyProps: DialogBodyProps = {
		size: props.size,
		variant: props.variant,
		titleId: props.titleId,
		title: props.title,
		showCloseButton: props.showCloseButton,
		onClose: props.onClose,
		descriptionId: props.descriptionId,
		footer: props.footer,
		children: props.children,
	};

	return <dialog {...dialogAttrs}>{renderDialogBody(bodyProps)}</dialog>;
}
