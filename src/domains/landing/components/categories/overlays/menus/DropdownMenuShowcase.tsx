import Button from '@core/ui/button/Button';
import DropdownMenu from '@core/ui/overlays/dropdown-menu/DropdownMenu';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function DropdownMenuShowcase() {
	return (
		<ShowcaseSection
			title="DropdownMenu"
			description="Dropdown menu component"
			tags={['overlay', 'menu', 'dropdown']}
		>
			<DropdownMenu
				trigger={<Button variant="secondary">Open Menu</Button>}
				items={[
					{ id: '1', label: 'Item 1', onSelect: () => {} },
					{ id: '2', label: 'Item 2', onSelect: () => {} },
					{ id: '3', label: 'Item 3', onSelect: () => {} },
				]}
			/>
		</ShowcaseSection>
	);
}
