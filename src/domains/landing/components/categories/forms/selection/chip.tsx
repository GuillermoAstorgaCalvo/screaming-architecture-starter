import Chip from '@core/ui/forms/chip/Chip';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderChipSection() {
	return (
		<ShowcaseSection
			title="Chip"
			description="Chip/tag component"
			tags={['form', 'chip', 'tag', 'badge']}
		>
			<div className="space-y-4">
				<div className="flex flex-wrap gap-2">
					<Chip removable onRemove={() => {}}>
						Chip 1
					</Chip>
					<Chip variant="primary" removable onRemove={() => {}}>
						Chip 2
					</Chip>
					<Chip variant="success" removable onRemove={() => {}}>
						Chip 3
					</Chip>
				</div>
			</div>
		</ShowcaseSection>
	);
}
