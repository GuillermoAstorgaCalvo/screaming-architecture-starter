import Badge from '@core/ui/data-display/badge/Badge';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function BadgeShowcase() {
	return (
		<ShowcaseSection
			title="Badge"
			description="Status/label display component"
			tags={['data', 'badge', 'status', 'label']}
		>
			<div className="flex flex-wrap gap-4">
				<Badge variant="default">Default</Badge>
				<Badge variant="primary">Primary</Badge>
				<Badge variant="success">Success</Badge>
				<Badge variant="warning">Warning</Badge>
				<Badge variant="error">Error</Badge>
				<Badge variant="info">Info</Badge>
				<Badge size="sm">Small</Badge>
				<Badge size="lg">Large</Badge>
			</div>
		</ShowcaseSection>
	);
}
