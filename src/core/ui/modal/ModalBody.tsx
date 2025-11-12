import { ARIA_LABELS } from '@core/constants/aria';
import { getModalBodyVariantClasses } from '@core/ui/variants/modal';
import type { ModalSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

import { ModalContent, ModalFooter, ModalHeader } from './ModalParts';

interface RenderModalContentProps {
	readonly titleId: string;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly onClose: () => void;
	readonly descriptionId: string;
	readonly children: ReactNode;
	readonly footer?: ReactNode;
}

function renderModalContent(props: RenderModalContentProps) {
	const { titleId, title, showCloseButton, onClose, descriptionId, children, footer } = props;
	return (
		<>
			<ModalHeader
				titleId={titleId}
				title={title}
				showCloseButton={showCloseButton}
				onClose={onClose}
			/>
			<ModalContent descriptionId={descriptionId}>{children}</ModalContent>
			{footer ? <ModalFooter footer={footer} /> : null}
		</>
	);
}

interface ModalBodyProps {
	readonly size: ModalSize;
	readonly titleId: string;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly onClose: () => void;
	readonly descriptionId: string;
	readonly children: ReactNode;
	readonly footer?: ReactNode;
}

function getBodyClassName(size: ModalSize) {
	return getModalBodyVariantClasses({ size });
}

export function ModalBody(props: ModalBodyProps) {
	const { size } = props;
	const bodyClassName = getBodyClassName(size);
	const content = renderModalContent(props);

	return (
		<section className={bodyClassName} aria-label={ARIA_LABELS.MODAL_CONTENT}>
			{content}
		</section>
	);
}
