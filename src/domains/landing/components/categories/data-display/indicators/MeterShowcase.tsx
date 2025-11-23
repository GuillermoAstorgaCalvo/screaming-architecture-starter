import Meter from '@core/ui/data-display/meter/Meter';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function MeterShowcase() {
	return (
		<ShowcaseSection
			title="Meter"
			description="Meter/progress indicator component"
			tags={['data', 'meter', 'progress', 'indicator']}
		>
			<div className="space-y-4">
				<Meter value={25} max={100} label="25%" />
				<Meter value={50} max={100} label="50%" />
				<Meter value={75} max={100} label="75%" />
			</div>
		</ShowcaseSection>
	);
}
