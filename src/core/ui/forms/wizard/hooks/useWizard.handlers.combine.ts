import type { CombineHandlersParams } from '@core/ui/forms/wizard/types/useWizard.handlers.groups.types';

/**
 * Combine all wizard handlers into a single object
 */
export function combineAllHandlers({
	validation,
	actions,
	basicNav,
	advancedNav,
}: CombineHandlersParams) {
	return {
		validateCurrentStep: validation.validateCurrentStep,
		handleComplete: actions.handleComplete,
		handleNext: basicNav.handleNext,
		handlePrevious: basicNav.handlePrevious,
		goToStep: advancedNav.goToStep,
		skipStep: advancedNav.skipStep,
		handleCancel: actions.handleCancel,
	};
}
