import Button from '@core/ui/button/Button';
import Modal from '@core/ui/modal/Modal';
import type { ReactNode } from 'react';

interface ModalProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
}

interface SizeModalProps extends ModalProps {
	readonly title: string;
	readonly size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	readonly children: ReactNode;
}

function SizeModal({ isOpen, onClose, title, size, children }: SizeModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
			<p className="text-gray-600 dark:text-gray-400">{children}</p>
		</Modal>
	);
}

function SmallModal({ isOpen, onClose }: ModalProps) {
	return (
		<SizeModal isOpen={isOpen} onClose={onClose} title="Small Modal" size="sm">
			This is a small modal. It has a compact width perfect for simple confirmations or brief
			messages.
		</SizeModal>
	);
}

function MediumModal({ isOpen, onClose }: ModalProps) {
	return (
		<SizeModal isOpen={isOpen} onClose={onClose} title="Medium Modal" size="md">
			This is a medium modal. It&apos;s the default size and works well for most use cases.
		</SizeModal>
	);
}

function LargeModal({ isOpen, onClose }: ModalProps) {
	return (
		<SizeModal isOpen={isOpen} onClose={onClose} title="Large Modal" size="lg">
			This is a large modal. It provides more space for content that requires additional room.
		</SizeModal>
	);
}

function XlModal({ isOpen, onClose }: ModalProps) {
	return (
		<SizeModal isOpen={isOpen} onClose={onClose} title="Extra Large Modal" size="xl">
			This is an extra large modal. It&apos;s ideal for complex forms or content that needs maximum
			width.
		</SizeModal>
	);
}

function FullModal({ isOpen, onClose }: ModalProps) {
	return (
		<SizeModal isOpen={isOpen} onClose={onClose} title="Full Width Modal" size="full">
			This is a full-width modal. It spans the entire viewport width with appropriate margins.
		</SizeModal>
	);
}

interface ModalSizesProps {
	readonly smallModalOpen: boolean;
	readonly setSmallModalOpen: (_open: boolean) => void;
	readonly mediumModalOpen: boolean;
	readonly setMediumModalOpen: (_open: boolean) => void;
	readonly largeModalOpen: boolean;
	readonly setLargeModalOpen: (_open: boolean) => void;
	readonly xlModalOpen: boolean;
	readonly setXlModalOpen: (_open: boolean) => void;
	readonly fullModalOpen: boolean;
	readonly setFullModalOpen: (_open: boolean) => void;
}

function ModalSizes(props: ModalSizesProps) {
	return (
		<>
			<SmallModal isOpen={props.smallModalOpen} onClose={() => props.setSmallModalOpen(false)} />
			<MediumModal isOpen={props.mediumModalOpen} onClose={() => props.setMediumModalOpen(false)} />
			<LargeModal isOpen={props.largeModalOpen} onClose={() => props.setLargeModalOpen(false)} />
			<XlModal isOpen={props.xlModalOpen} onClose={() => props.setXlModalOpen(false)} />
			<FullModal isOpen={props.fullModalOpen} onClose={() => props.setFullModalOpen(false)} />
		</>
	);
}

interface ModalVariantsProps {
	readonly modalWithFooterOpen: boolean;
	readonly setModalWithFooterOpen: (_open: boolean) => void;
	readonly modalWithoutCloseOpen: boolean;
	readonly setModalWithoutCloseOpen: (_open: boolean) => void;
}

function ModalWithFooter({ isOpen, onClose }: ModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Modal with Footer"
			size="md"
			footer={
				<div className="flex justify-end gap-3">
					<Button variant="ghost" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={onClose}>Confirm</Button>
				</div>
			}
		>
			<p className="text-gray-600 dark:text-gray-400">
				This modal includes a custom footer with action buttons. You can add any content you need in
				the footer.
			</p>
		</Modal>
	);
}

function ModalWithoutCloseButton({ isOpen, onClose }: ModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Modal without Close Button"
			size="md"
			showCloseButton={false}
		>
			<p className="text-gray-600 dark:text-gray-400 mb-4">
				This modal doesn&apos;t have a close button in the header. You can still close it by
				clicking the overlay or pressing Escape (if enabled).
			</p>
			<div className="flex justify-end">
				<Button onClick={onClose}>Close</Button>
			</div>
		</Modal>
	);
}

function ModalVariants(props: ModalVariantsProps) {
	return (
		<>
			<ModalWithFooter
				isOpen={props.modalWithFooterOpen}
				onClose={() => props.setModalWithFooterOpen(false)}
			/>
			<ModalWithoutCloseButton
				isOpen={props.modalWithoutCloseOpen}
				onClose={() => props.setModalWithoutCloseOpen(false)}
			/>
		</>
	);
}

interface ModalInstancesProps extends ModalSizesProps, ModalVariantsProps {}

export function ModalInstances(props: ModalInstancesProps) {
	return (
		<>
			<ModalSizes
				smallModalOpen={props.smallModalOpen}
				setSmallModalOpen={props.setSmallModalOpen}
				mediumModalOpen={props.mediumModalOpen}
				setMediumModalOpen={props.setMediumModalOpen}
				largeModalOpen={props.largeModalOpen}
				setLargeModalOpen={props.setLargeModalOpen}
				xlModalOpen={props.xlModalOpen}
				setXlModalOpen={props.setXlModalOpen}
				fullModalOpen={props.fullModalOpen}
				setFullModalOpen={props.setFullModalOpen}
			/>
			<ModalVariants
				modalWithFooterOpen={props.modalWithFooterOpen}
				setModalWithFooterOpen={props.setModalWithFooterOpen}
				modalWithoutCloseOpen={props.modalWithoutCloseOpen}
				setModalWithoutCloseOpen={props.setModalWithoutCloseOpen}
			/>
		</>
	);
}
