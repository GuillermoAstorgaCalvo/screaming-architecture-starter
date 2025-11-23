import Progress from '@core/ui/feedback/progress/Progress';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ProgressShowcase() {
	return (
		<ShowcaseSection
			title="Progress"
			description="Progress bar component"
			tags={['feedback', 'progress', 'loading']}
		>
			<div className="space-y-4">
				<Progress value={0} />
				<Progress value={25} />
				<Progress value={50} />
				<Progress value={75} />
				<Progress value={100} />
			</div>
		</ShowcaseSection>
	);
}
