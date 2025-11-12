import type { FieldValues } from 'react-hook-form';

import { useFormWizardInit } from './FormWizard.init';
import type { FormWizardProps } from './FormWizardTypes';
import FormWizardView from './FormWizardView';

/**
 * FormWizard - Multi-step form component with validation and data persistence
 *
 * Features:
 * - Stepper navigation integration
 * - Form validation per step
 * - Data persistence between steps
 * - Step completion tracking
 * - Progress indicator
 * - Customizable navigation buttons
 * - Optional localStorage persistence
 * - Accessible: proper ARIA attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * const steps = [
 *   {
 *     id: 'personal',
 *     label: 'Personal Info',
 *     content: ({ register, errors }) => (
 *       <div>
 *         <input {...register('name', { required: true })} />
 *         {errors.name && <span>{errors.name.message}</span>}
 *       </div>
 *     ),
 *   },
 *   {
 *     id: 'contact',
 *     label: 'Contact Info',
 *     content: ({ register, errors }) => (
 *       <div>
 *         <input {...register('email', { required: true })} />
 *         {errors.email && <span>{errors.email.message}</span>}
 *       </div>
 *     ),
 *   },
 * ];
 *
 * <FormWizard
 *   steps={steps}
 *   formOptions={{
 *     defaultValues: { name: '', email: '' },
 *     resolver: zodResolver(schema),
 *   }}
 *   onComplete={(data) => console.log('Form data:', data)}
 * />
 * ```
 */
export default function FormWizard<T extends FieldValues = FieldValues>(
	props: Readonly<FormWizardProps<T>>
) {
	const {
		steps,
		formOptions,
		initialStep = 0,
		activeStep: controlledActiveStep,
		persistData = false,
		persistKey = 'form-wizard-data',
		validateOnStepChange = true,
		allowBackNavigation = true,
		...restProps
	} = props;

	const initConfig = {
		formOptions,
		initialStep,
		controlledActiveStep,
		persistData,
		persistKey,
		steps,
		validateOnStepChange,
		allowBackNavigation,
		...(props.onStepChange !== undefined && { onStepChange: props.onStepChange }),
		...(props.onComplete !== undefined && { onComplete: props.onComplete }),
		...(props.onCancel !== undefined && { onCancel: props.onCancel }),
	} as Parameters<typeof useFormWizardInit<T>>[0];

	const { formControls, synchronizedState, handlers } = useFormWizardInit<T>(initConfig);

	return (
		<FormWizardView
			state={synchronizedState}
			steps={steps}
			formControls={formControls}
			handlers={handlers}
			props={restProps}
		/>
	);
}
