import Button from '@core/ui/button/Button';
import ConfirmDialog from '@core/ui/overlays/confirm-dialog/ConfirmDialog';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ConfirmDialogShowcase({
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
			title="ConfirmDialog"
			description="Confirm dialog component"
			tags={['overlay', 'dialog', 'confirm']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Open Confirm Dialog
				</Button>
				<ConfirmDialog
					isOpen={isOpen}
					onClose={onClose}
					title="Confirm Action"
					description="Are you sure you want to proceed?"
					onConfirm={() => {
						onClose();
					}}
				/>
			</div>
		</ShowcaseSection>
	);
}
