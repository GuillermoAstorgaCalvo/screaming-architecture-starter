import Button from '@core/ui/button/Button';
import Sheet from '@core/ui/overlays/sheet/Sheet';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function SheetShowcase({
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
			title="Sheet"
			description="Sheet component"
			tags={['overlay', 'sheet', 'panel', 'drawer']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Open Sheet
				</Button>
				<Sheet isOpen={isOpen} onClose={onClose} title="Sheet Title">
					<Text>This is a sheet component.</Text>
				</Sheet>
			</div>
		</ShowcaseSection>
	);
}
