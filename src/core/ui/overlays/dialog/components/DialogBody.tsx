import { ARIA_LABELS } from '@core/constants/aria';
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
} from '@core/ui/overlays/dialog/components/DialogParts';
import type { DialogVariant } from '@core/ui/overlays/dialog/types/dialog.types';
import { getDialogBodyVariantClasses } from '@core/ui/variants/dialog';
import type { ModalSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

interface RenderDialogContentProps {
	readonly titleId: string;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly onClose: () => void;
	readonly descriptionId: string;
	readonly children: ReactNode;
	readonly footer?: ReactNode;
}

function renderDialogContent(props: RenderDialogContentProps) {
	const { titleId, title, showCloseButton, onClose, descriptionId, children, footer } = props;
	return (
		<>
			<DialogHeader
				titleId={titleId}
				title={title}
				showCloseButton={showCloseButton}
				onClose={onClose}
			/>
			<DialogContent descriptionId={descriptionId}>{children}</DialogContent>
			{footer ? <DialogFooter footer={footer} /> : null}
		</>
	);
}

interface DialogBodyProps {
	readonly size: ModalSize;
	readonly variant: DialogVariant;
	readonly titleId: string;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly onClose: () => void;
	readonly descriptionId: string;
	readonly children: ReactNode;
	readonly footer?: ReactNode;
}

function getBodyClassName(size: ModalSize, variant: DialogVariant) {
	return getDialogBodyVariantClasses({ size, variant });
}

export function DialogBody(props: DialogBodyProps) {
	const {
		size,
		variant,
		titleId,
		title,
		showCloseButton,
		onClose,
		descriptionId,
		children,
		footer,
	} = props;
	const bodyClassName = getBodyClassName(size, variant);
	const content = renderDialogContent({
		titleId,
		title,
		showCloseButton,
		onClose,
		descriptionId,
		children,
		footer,
	});

	return (
		<section className={bodyClassName} aria-label={ARIA_LABELS.MODAL_CONTENT}>
			{content}
		</section>
	);
}
