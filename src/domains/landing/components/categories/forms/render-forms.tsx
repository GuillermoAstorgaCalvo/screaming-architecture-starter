import type { Subcategory } from '@domains/landing/components/shared/SubcategoryNavigation';

import { renderBasicInputs } from './basic-inputs/render-basic-inputs';
import { renderAdvanced } from './render-advanced-forms';
import { renderComplexForms } from './render-complex-forms';
import { renderDateAndTime } from './render-date-time';
import { renderFormStructure } from './render-form-structure';
import { renderSelection } from './render-selection';
import { renderSpecialized } from './render-specialized';
import type { FormsCategoryState } from './state';

export function getSubcategories(state: FormsCategoryState): Subcategory[] {
	return [
		{
			id: 'basic-inputs',
			label: 'Basic Inputs',
			content: renderBasicInputs(state),
		},
		{
			id: 'selection',
			label: 'Selection',
			content: renderSelection(state),
		},
		{
			id: 'date-time',
			label: 'Date & Time',
			content: renderDateAndTime(state),
		},
		{
			id: 'specialized',
			label: 'Specialized',
			content: renderSpecialized(state),
		},
		{
			id: 'advanced',
			label: 'Advanced',
			content: renderAdvanced(state),
		},
		{
			id: 'form-structure',
			label: 'Form Structure',
			content: renderFormStructure(),
		},
		{
			id: 'complex-forms',
			label: 'Complex Forms',
			content: renderComplexForms(state),
		},
	];
}
