import Button from '@core/ui/button/Button';
import type { useFormWizardHandlers } from '@core/ui/forms/form-wizard/hooks/useFormWizardHandlers';
import type { FormWizardState } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import type { StandardSize } from '@src-types/ui/base';
import type { FieldValues } from 'react-hook-form';

interface PreviousButtonProps {
	readonly size: StandardSize;
	readonly label: string;
	readonly onClick: () => void;
	readonly disabled: boolean;
}

function PreviousButton({ size, label, onClick, disabled }: Readonly<PreviousButtonProps>) {
	return (
		<Button variant="secondary" size={size} onClick={onClick} disabled={disabled}>
			{label}
		</Button>
	);
}

interface ActionButtonsProps {
	readonly size: StandardSize;
	readonly isLastStep: boolean;
	readonly isSubmitting: boolean;
	readonly nextLabel: string;
	readonly finishLabel: string;
	readonly onNext: () => void;
	readonly onComplete: () => void;
	readonly onCancel?: () => void;
}

function ActionButtons({
	size,
	isLastStep,
	isSubmitting,
	nextLabel,
	finishLabel,
	onNext,
	onComplete,
	onCancel,
}: Readonly<ActionButtonsProps>) {
	return (
		<div className="flex gap-2">
			{onCancel ? (
				<Button variant="ghost" size={size} onClick={onCancel} disabled={isSubmitting}>
					Cancel
				</Button>
			) : null}
			{isLastStep ? (
				<Button
					variant="primary"
					size={size}
					onClick={onComplete}
					isLoading={isSubmitting}
					disabled={isSubmitting}
				>
					{finishLabel}
				</Button>
			) : (
				<Button variant="primary" size={size} onClick={onNext} disabled={isSubmitting}>
					{nextLabel}
				</Button>
			)}
		</div>
	);
}

interface NavigationButtonsProps<T extends FieldValues> {
	readonly state: FormWizardState<T>;
	readonly handlers: ReturnType<typeof useFormWizardHandlers<T>>;
	readonly isFirstStep: boolean;
	readonly isLastStep: boolean;
	readonly size: StandardSize;
	readonly allowBackNavigation: boolean;
	readonly previousButtonLabel: string;
	readonly nextButtonLabel: string;
	readonly finishButtonLabel: string;
	readonly onCancel?: () => void;
}

/**
 * Navigation buttons component
 */
export function NavigationButtons<T extends FieldValues>({
	state,
	handlers,
	isFirstStep,
	isLastStep,
	size,
	allowBackNavigation,
	previousButtonLabel,
	nextButtonLabel,
	finishButtonLabel,
	onCancel,
}: Readonly<NavigationButtonsProps<T>>) {
	return (
		<div className="flex items-center justify-between gap-4 pt-4 border-t border-border dark:border-border">
			<div>
				{!isFirstStep && (
					<PreviousButton
						size={size}
						label={previousButtonLabel}
						onClick={handlers.handlePrevious}
						disabled={!allowBackNavigation || state.isSubmitting}
					/>
				)}
			</div>
			<ActionButtons
				size={size}
				isLastStep={isLastStep}
				isSubmitting={state.isSubmitting}
				nextLabel={nextButtonLabel}
				finishLabel={finishButtonLabel}
				onNext={handlers.handleNext}
				onComplete={handlers.handleComplete}
				{...(onCancel && { onCancel })}
			/>
		</div>
	);
}

interface NavigationSectionProps<T extends FieldValues> {
	readonly showNavigation: boolean;
	readonly state: FormWizardState<T>;
	readonly handlers: ReturnType<typeof useFormWizardHandlers<T>>;
	readonly isFirstStep: boolean;
	readonly isLastStep: boolean;
	readonly size: StandardSize;
	readonly allowBackNavigation: boolean;
	readonly previousButtonLabel: string;
	readonly nextButtonLabel: string;
	readonly finishButtonLabel: string;
	readonly onCancel: (() => void) | undefined;
}

/**
 * Navigation section component
 */
export function NavigationSection<T extends FieldValues>({
	showNavigation,
	state,
	handlers,
	isFirstStep,
	isLastStep,
	size,
	allowBackNavigation,
	previousButtonLabel,
	nextButtonLabel,
	finishButtonLabel,
	onCancel,
}: Readonly<NavigationSectionProps<T>>) {
	if (!showNavigation) {
		return null;
	}

	return (
		<NavigationButtons
			state={state}
			handlers={handlers}
			isFirstStep={isFirstStep}
			isLastStep={isLastStep}
			size={size}
			allowBackNavigation={allowBackNavigation}
			previousButtonLabel={previousButtonLabel}
			nextButtonLabel={nextButtonLabel}
			finishButtonLabel={finishButtonLabel}
			{...(onCancel && { onCancel })}
		/>
	);
}
