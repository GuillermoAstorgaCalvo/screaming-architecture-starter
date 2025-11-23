import Button from '@core/ui/button/Button';
import Popover from '@core/ui/overlays/popover/Popover';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function PopoverShowcase({
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
			title="Popover"
			description="Popover component"
			tags={['overlay', 'popover', 'tooltip']}
		>
			<div className="flex flex-wrap gap-4">
				<Popover
					isOpen={isOpen}
					onClose={onClose}
					trigger={<Button variant="secondary">Toggle Popover</Button>}
				>
					<Text>This is popover content</Text>
				</Popover>
				<Button variant="secondary" onClick={onOpen}>
					Open Popover
				</Button>
			</div>
		</ShowcaseSection>
	);
}
