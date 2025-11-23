import Button from '@core/ui/button/Button';
import AlertDialog from '@core/ui/feedback/alert-dialog/AlertDialog';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function AlertDialogShowcase({
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
			title="AlertDialog"
			description="Alert dialog component"
			tags={['overlay', 'dialog', 'alert', 'confirm']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Open Alert Dialog
				</Button>
				<AlertDialog
					isOpen={isOpen}
					onClose={onClose}
					title="Confirm Action"
					description="Are you sure you want to perform this action?"
					confirmLabel="Confirm"
					cancelLabel="Cancel"
					onConfirm={() => {
						onClose();
					}}
				/>
			</div>
		</ShowcaseSection>
	);
}
