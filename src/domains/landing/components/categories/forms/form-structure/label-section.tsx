import Input from '@core/ui/forms/input/Input';
import Label from '@core/ui/forms/label/Label';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function LabelSection() {
	return (
		<ShowcaseSection
			title="Label"
			description="Reusable label component"
			tags={['form', 'label', 'helper']}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="demo-input-1">Default Label</Label>
					<Input id="demo-input-1" placeholder="Enter text..." />
				</div>
				<div className="space-y-2">
					<Label htmlFor="demo-input-2" required>
						Required Label
					</Label>
					<Input id="demo-input-2" placeholder="Enter text..." />
				</div>
				<div className="space-y-2">
					<Label htmlFor="demo-input-3" size="sm">
						Small Label
					</Label>
					<Input id="demo-input-3" size="sm" placeholder="Enter text..." />
				</div>
			</div>
		</ShowcaseSection>
	);
}
