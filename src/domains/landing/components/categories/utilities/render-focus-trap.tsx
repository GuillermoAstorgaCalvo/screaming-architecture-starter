import Button from '@core/ui/button/Button';
import Text from '@core/ui/text/Text';
import FocusTrap from '@core/ui/utilities/focus-trap/FocusTrap';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface FocusTrapShowcaseProps {
	readonly focusTrapEnabled: boolean;
	readonly setFocusTrapEnabled: (enabled: boolean) => void;
}

export function renderFocusTrapShowcase({
	focusTrapEnabled,
	setFocusTrapEnabled,
}: FocusTrapShowcaseProps) {
	return (
		<ShowcaseSection
			title="FocusTrap"
			description="Traps keyboard focus within content"
			tags={['utility', 'focus', 'accessibility', 'a11y']}
		>
			<div className="space-y-4">
				<Button onClick={() => setFocusTrapEnabled(!focusTrapEnabled)}>
					{focusTrapEnabled ? 'Disable' : 'Enable'} Focus Trap
				</Button>
				<FocusTrap enabled={focusTrapEnabled} className="border border-border rounded-lg p-4">
					<div className="space-y-2">
						<Button variant="primary">First Button</Button>
						<Button variant="secondary">Second Button</Button>
						<Button variant="ghost">Third Button</Button>
						<Text size="sm" className="text-muted-foreground">
							When enabled, Tab key will cycle through these buttons only
						</Text>
					</div>
				</FocusTrap>
			</div>
		</ShowcaseSection>
	);
}
