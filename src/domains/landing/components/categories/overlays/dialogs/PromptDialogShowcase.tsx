import Button from '@core/ui/button/Button';
import PromptDialog from '@core/ui/overlays/prompt-dialog/PromptDialog';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function PromptDialogShowcase({
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
			title="PromptDialog"
			description="Prompt dialog component"
			tags={['overlay', 'dialog', 'prompt', 'input']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Open Prompt Dialog
				</Button>
				<PromptDialog
					isOpen={isOpen}
					onClose={onClose}
					title="Enter Name"
					label="Name"
					placeholder="Enter your name"
					onConfirm={() => {
						onClose();
					}}
				/>
			</div>
		</ShowcaseSection>
	);
}
