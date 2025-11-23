import { FileUploadSection } from './complex-forms/file-upload-section';
import { FormWizardSection } from './complex-forms/form-wizard-section';
import { InlineEditSection } from './complex-forms/inline-edit-section';
import { TransferSection } from './complex-forms/transfer-section';
import { WizardSection } from './complex-forms/wizard-section';
import type { FormsCategoryState } from './state';

export function renderComplexForms(state: FormsCategoryState) {
	return (
		<div className="space-y-8">
			<FileUploadSection />
			<InlineEditSection state={state} />
			<TransferSection state={state} />
			<WizardSection />
			<FormWizardSection />
		</div>
	);
}
