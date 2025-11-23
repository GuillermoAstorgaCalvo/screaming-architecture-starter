import Checkbox from '@core/ui/forms/checkbox/Checkbox';
import Fieldset from '@core/ui/forms/fieldset/Fieldset';
import Input from '@core/ui/forms/input/Input';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function FieldsetSection() {
	return (
		<ShowcaseSection
			title="Fieldset"
			description="Semantic grouping for form fields"
			tags={['form', 'group', 'layout']}
		>
			<div className="space-y-4">
				<Fieldset legend="Personal Information">
					<div className="space-y-4">
						<Input label="First Name" placeholder="John" />
						<Input label="Last Name" placeholder="Doe" />
						<Input label="Email" type="email" placeholder="john@example.com" />
					</div>
				</Fieldset>
				<Fieldset legend="Preferences" disabled>
					<div className="space-y-4">
						<Checkbox label="Email notifications" />
						<Checkbox label="SMS notifications" />
					</div>
				</Fieldset>
			</div>
		</ShowcaseSection>
	);
}
