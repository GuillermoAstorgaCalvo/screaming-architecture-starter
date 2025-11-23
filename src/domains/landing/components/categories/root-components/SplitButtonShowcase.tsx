import SplitButton from '@core/ui/split-button/SplitButton';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function SplitButtonShowcase() {
	return (
		<ShowcaseSection
			title="SplitButton"
			description="Split button with primary action and menu"
			tags={['button', 'menu', 'action']}
		>
			<div className="flex flex-wrap gap-4">
				<SplitButton
					onClick={() => {
						// Primary action handler
					}}
					menuItems={[
						{
							id: '1',
							label: 'Option 1',
							onSelect: () => {
								// Option 1 handler
							},
						},
						{
							id: '2',
							label: 'Option 2',
							onSelect: () => {
								// Option 2 handler
							},
						},
					]}
				>
					Save
				</SplitButton>
			</div>
		</ShowcaseSection>
	);
}
