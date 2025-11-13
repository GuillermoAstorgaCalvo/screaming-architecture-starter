import { computeWizardHandlerValues } from '@core/ui/forms/wizard/hooks/useWizard.handlers.computed';
import { useWizardHandlersCreation } from '@core/ui/forms/wizard/hooks/useWizard.handlers.creation';
import type {
	UseWizardHandlersOptions,
	UseWizardHandlersReturn,
} from '@core/ui/forms/wizard/types/useWizard.handlers.types';

/**
 * Hook to manage wizard navigation and validation handlers
 */
export function useWizardHandlers(options: UseWizardHandlersOptions): UseWizardHandlersReturn {
	const { state, steps, allowBackNavigation } = options;

	const computed = computeWizardHandlerValues(state, steps, allowBackNavigation);

	return useWizardHandlersCreation(options, computed);
}
