import Button from '@core/ui/button/Button';
import CommandPalette from '@core/ui/overlays/command-palette/CommandPalette';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function CommandPaletteShowcase({
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
			title="CommandPalette"
			description="Command palette component"
			tags={['overlay', 'command', 'palette', 'search']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Open Command Palette
				</Button>
				<CommandPalette
					isOpen={isOpen}
					onClose={onClose}
					commands={[
						{ id: '1', label: 'New File', onSelect: () => {} },
						{ id: '2', label: 'Open File', onSelect: () => {} },
						{ id: '3', label: 'Save', onSelect: () => {} },
					]}
				/>
			</div>
		</ShowcaseSection>
	);
}
