import Button from '@core/ui/button/Button';
import Dialog from '@core/ui/overlays/dialog/Dialog';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function DialogShowcase({
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
			title="Dialog"
			description="Dialog component"
			tags={['overlay', 'dialog', 'modal']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Open Dialog
				</Button>
				<Dialog isOpen={isOpen} onClose={onClose} title="Dialog Title">
					<Text>This is a dialog component. Click outside or press ESC to close.</Text>
				</Dialog>
			</div>
		</ShowcaseSection>
	);
}
