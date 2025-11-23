import Button from '@core/ui/button/Button';
import FormGroup from '@core/ui/forms/form-group/FormGroup';
import Input from '@core/ui/forms/input/Input';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function FormGroupSection() {
	return (
		<ShowcaseSection
			title="FormGroup"
			description="Wrapper for related fields with spacing"
			tags={['form', 'group', 'layout']}
		>
			<div className="space-y-4">
				<FormGroup gap="md" align="start">
					<Input label="First Name" placeholder="John" />
					<Input label="Last Name" placeholder="Doe" />
				</FormGroup>
				<FormGroup gap="lg" align="stretch" fullWidth>
					<Input label="Email" fullWidth placeholder="email@example.com" />
					<Input label="Phone" fullWidth placeholder="+1 234 567 8900" />
				</FormGroup>
				<FormGroup gap="sm" align="center">
					<Button variant="primary">Submit</Button>
					<Button variant="secondary">Cancel</Button>
				</FormGroup>
			</div>
		</ShowcaseSection>
	);
}
