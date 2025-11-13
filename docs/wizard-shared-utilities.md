# Shared Wizard Utilities

This document outlines the shared utilities extracted from `Wizard` and `FormWizard` components to reduce code duplication.

## Extracted Utilities

### 1. Progress Calculation

**Location:** `src/core/ui/forms/wizard/wizardUtils.ts`

Two variants support different progress strategies:

#### `calculateWizardProgress(activeStep, totalSteps)`

- **Used by:** `FormWizardView.metadata.ts` through `calculateStepMetadata`
- **Logic:** `(activeStep + 1) / totalSteps * 100`
- **Use case:** Step-based progress indicator

#### `calculateWizardProgressByCompletion(totalSteps, completedSteps, skippedSteps)`

- **Used by:** `useWizard.state.utils.ts`
- **Logic:** `(completedSteps.size + skippedSteps.size) / totalSteps * 100`
- **Use case:** Completion-based progress tracking

### 2. Step Conversion

**Function:** `convertStepsToStepperSteps(steps)`

Converts wizard step definitions into the shared `StepperStep[]` shape used by the Stepper component.

**Used by:**

- `FormWizard`: `prepareWizardViewData()` in `FormWizardView.data.ts`
- `Wizard`: `useStepperSteps()` in `WizardHelpers.ts`

### 3. Step Metadata

**Function:** `calculateStepMetadata(activeStep, totalSteps)`

Calculates reusable step metadata:

- `isFirstStep`: Whether the current step is the first
- `isLastStep`: Whether the current step is the last
- `progress`: Calculated via `calculateWizardProgress`

**Used by:**

- `FormWizard`: `getStepMetadata()` in `FormWizardView.metadata.ts`

### 4. Navigation Validation

**Function:** `canNavigateToStep(targetStep, currentStep, allowBackNavigation)`

Validates whether navigation to a target step is allowed based on:

- Current and target step positions
- Back-navigation settings

**Used by:** `useFormWizardHandlers.ts` and wizard handler utilities to gate step changes

## Current State

- ✅ Shared helpers live in `@core/ui/forms/wizard/wizardUtils`
- ✅ Both `FormWizard` and `Wizard` import from the same utility file
- ✅ Stepper integration flows through the shared conversion helper
- ✅ Navigation logic is centralized to avoid duplicated conditionals

## Maintenance Notes

- Add new shared helpers to `wizardUtils.ts` so both implementations stay aligned.
- Prefer updating `wizardUtils.ts` before duplicating behaviour inside either wizard.
- If a helper becomes implementation-specific, move it back into that implementation to keep the shared module focused.

## Usage Example

```typescript
import {
	calculateWizardProgress,
	convertStepsToStepperSteps,
	calculateStepMetadata,
	canNavigateToStep,
} from '@core/ui/forms/wizard/wizardUtils';

const progress = calculateWizardProgress(activeStep, totalSteps);
const stepperSteps = convertStepsToStepperSteps(wizardSteps);
const {
	isFirstStep,
	isLastStep,
	progress: percentage,
} = calculateStepMetadata(activeStep, totalSteps);

if (canNavigateToStep(targetStep, currentStep, allowBackNavigation)) {
	// Navigate to the requested step
}
```

## Related Files

- `src/core/ui/forms/form-wizard/FormWizardView.data.ts`
- `src/core/ui/forms/form-wizard/FormWizardView.metadata.ts`
- `src/core/ui/forms/form-wizard/useFormWizardHandlers.ts`
- `src/core/ui/forms/wizard/useWizard.state.utils.ts`
