import Button from '@core/ui/button/Button';
import AppBar from '@core/ui/navigation/app-bar/AppBar';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function AppBarShowcase() {
	return (
		<ShowcaseSection
			title="AppBar"
			description="App bar component"
			tags={['navigation', 'appbar', 'header', 'bar']}
		>
			<AppBar
				title="Application Title"
				trailing={
					<Button variant="ghost" size="sm">
						Action
					</Button>
				}
			/>
		</ShowcaseSection>
	);
}
