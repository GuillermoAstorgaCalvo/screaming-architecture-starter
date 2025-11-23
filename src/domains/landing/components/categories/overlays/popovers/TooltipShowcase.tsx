import Button from '@core/ui/button/Button';
import Tooltip from '@core/ui/overlays/tooltip/Tooltip';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function TooltipShowcase() {
	return (
		<ShowcaseSection
			title="Tooltip"
			description="Tooltip component"
			tags={['overlay', 'tooltip', 'help']}
		>
			<div className="flex flex-wrap gap-4">
				<Tooltip content="This is a tooltip">
					<Button variant="ghost">Hover for tooltip</Button>
				</Tooltip>
			</div>
		</ShowcaseSection>
	);
}
