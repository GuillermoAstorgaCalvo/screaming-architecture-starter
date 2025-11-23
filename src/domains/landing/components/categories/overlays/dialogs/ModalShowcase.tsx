import Button from '@core/ui/button/Button';
import Modal from '@core/ui/overlays/modal/Modal';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ModalShowcase({
	isOpen,
	onOpen,
	onClose,
}: Readonly<{
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}>) {
	return (
		<ShowcaseSection
			title="Modal"
			description="Modal dialog component"
			tags={['overlay', 'modal', 'dialog']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Open Modal
				</Button>
				<Modal isOpen={isOpen} onClose={onClose} title="Modal Title">
					<Text>This is a modal component.</Text>
				</Modal>
			</div>
		</ShowcaseSection>
	);
}
