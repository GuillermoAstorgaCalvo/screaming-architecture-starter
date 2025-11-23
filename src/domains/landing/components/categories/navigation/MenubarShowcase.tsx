import Menubar from '@core/ui/navigation/menubar/Menubar';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function MenubarShowcase() {
	return (
		<ShowcaseSection
			title="Menubar"
			description="Menubar component"
			tags={['navigation', 'menu', 'menubar']}
		>
			<Menubar
				items={[
					{
						id: 'file',
						label: 'File',
						submenu: [
							{ id: 'new', label: 'New', onSelect: () => {} },
							{ id: 'open', label: 'Open', onSelect: () => {} },
						],
					},
					{
						id: 'edit',
						label: 'Edit',
						submenu: [
							{ id: 'cut', label: 'Cut', onSelect: () => {} },
							{ id: 'copy', label: 'Copy', onSelect: () => {} },
						],
					},
				]}
			/>
		</ShowcaseSection>
	);
}
