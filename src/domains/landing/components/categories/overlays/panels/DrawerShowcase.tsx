import Button from '@core/ui/button/Button';
import Drawer from '@core/ui/overlays/drawer/Drawer';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function DrawerShowcase({
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
			title="Drawer"
			description="Drawer/side panel component"
			tags={['overlay', 'drawer', 'panel', 'side']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Open Drawer
				</Button>
				<Drawer isOpen={isOpen} onClose={onClose} title="Drawer Title">
					<Text>This is a drawer component that slides in from the side.</Text>
				</Drawer>
			</div>
		</ShowcaseSection>
	);
}
