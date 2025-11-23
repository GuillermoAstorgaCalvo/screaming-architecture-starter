import Button from '@core/ui/button/Button';
import ContextMenu from '@core/ui/overlays/context-menu/ContextMenu';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ContextMenuShowcase() {
	return (
		<ShowcaseSection
			title="ContextMenu"
			description="Context menu component"
			tags={['overlay', 'menu', 'context', 'right-click']}
		>
			<ContextMenu
				trigger={<Button variant="secondary">Right-click me</Button>}
				items={[
					{ id: '1', label: 'Copy', onSelect: () => {} },
					{ id: '2', label: 'Paste', onSelect: () => {} },
					{ id: '3', label: 'Delete', onSelect: () => {} },
				]}
			/>
		</ShowcaseSection>
	);
}
