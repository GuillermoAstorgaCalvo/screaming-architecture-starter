import Spinner from '@core/ui/feedback/spinner/Spinner';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function SpinnerShowcase() {
	return (
		<ShowcaseSection
			title="Spinner"
			description="Loading spinner component"
			tags={['feedback', 'loading', 'spinner']}
		>
			<div className="flex flex-wrap items-center gap-8">
				<div className="flex flex-col items-center gap-2">
					<Spinner size="sm" />
					<Text size="sm">Small</Text>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size="md" />
					<Text size="sm">Medium</Text>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size="lg" />
					<Text size="sm">Large</Text>
				</div>
			</div>
		</ShowcaseSection>
	);
}
