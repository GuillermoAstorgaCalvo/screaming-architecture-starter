import Button from '@core/ui/button/Button';
import Popconfirm from '@core/ui/overlays/popconfirm/Popconfirm';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function PopconfirmShowcase({
	isOpen,
	onClose,
}: Readonly<{ isOpen: boolean; onClose: () => void }>) {
	return (
		<ShowcaseSection
			title="Popconfirm"
			description="Popconfirm component"
			tags={['overlay', 'popover', 'confirm']}
		>
			<Popconfirm
				isOpen={isOpen}
				onClose={onClose}
				trigger={<Button variant="secondary">Delete Item</Button>}
				title="Are you sure?"
				description="This action cannot be undone."
				onConfirm={() => {
					onClose();
				}}
			/>
		</ShowcaseSection>
	);
}
