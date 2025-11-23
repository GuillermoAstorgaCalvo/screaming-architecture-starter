import FloatingActionButton from '@core/ui/navigation/floating-action-button/FloatingActionButton';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function FloatingActionButtonShowcase() {
	return (
		<ShowcaseSection
			title="FloatingActionButton"
			description="Floating action button component"
			tags={['navigation', 'button', 'fab', 'floating']}
		>
			<div className="relative h-32">
				<FloatingActionButton
					icon={<span>+</span>}
					onClick={() => {
						// FAB clicked handler
					}}
					aria-label="Add item"
				/>
			</div>
		</ShowcaseSection>
	);
}
