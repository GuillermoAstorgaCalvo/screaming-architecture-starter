import Button from '@core/ui/button/Button';
import ActionSheet from '@core/ui/overlays/action-sheet/ActionSheet';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ActionSheetShowcase({
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
			title="ActionSheet"
			description="Action sheet component"
			tags={['overlay', 'actionsheet', 'menu', 'mobile']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Open Action Sheet
				</Button>
				<ActionSheet
					isOpen={isOpen}
					onClose={onClose}
					actions={[
						{ id: '1', label: 'Option 1', onSelect: () => {} },
						{ id: '2', label: 'Option 2', onSelect: () => {} },
						{
							id: '3',
							label: 'Delete',
							onSelect: () => {
								onClose();
							},
							destructive: true,
						},
					]}
				/>
			</div>
		</ShowcaseSection>
	);
}
