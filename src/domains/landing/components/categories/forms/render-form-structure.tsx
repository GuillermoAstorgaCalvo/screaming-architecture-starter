import { ErrorTextSection } from './form-structure/error-text-section';
import { FieldsetSection } from './form-structure/fieldset-section';
import { FormActionsSection } from './form-structure/form-actions-section';
import { FormGroupSection } from './form-structure/form-group-section';
import { HelperTextSection } from './form-structure/helper-text-section';
import { LabelSection } from './form-structure/label-section';

export function renderFormStructure() {
	return (
		<div className="space-y-8">
			<LabelSection />
			<ErrorTextSection />
			<HelperTextSection />
			<FieldsetSection />
			<FormGroupSection />
			<FormActionsSection />
		</div>
	);
}
