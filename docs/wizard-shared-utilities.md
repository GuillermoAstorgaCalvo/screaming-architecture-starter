# Shared Wizard Utilities

This document outlines the shared utilities extracted from `Wizard` and `FormWizard` components to reduce code duplication.

## Extracted Utilities

### 1. Progress Calculation

**Location:** `src/core/ui/wizard/wizardUtils.ts`

Two variants for different progress calculation strategies:

#### `calculateWizardProgress(activeStep, totalSteps)`

- **Used by:** `FormWizard`
- **Logic:** `(activeStep + 1) / totalSteps * 100`
- **Use case:** Simple progress based on current step position

#### `calculateWizardProgressByCompletion(totalSteps, completedSteps, skippedSteps)`

- **Used by:** `Wizard`
- **Logic:** `(completedSteps.size + skippedSteps.size) / totalSteps * 100`
- **Use case:** Progress based on actual step completion status

### 2. Step Conversion

**Function:** `convertStepsToStepperSteps(steps)`

Converts wizard step configurations to `StepperStep[]` format used by the `Stepper` component.

**Used by:**

- `FormWizard`: `convertStepsToStepperSteps()` in `FormWizardView.tsx`
- `Wizard`: `useStepperSteps()` in `WizardHelpers.ts`

### 3. Step Metadata

**Function:** `calculateStepMetadata(activeStep, totalSteps)`

Calculates common step metadata:

- `isFirstStep`: Whether current step is the first
- `isLastStep`: Whether current step is the last
- `progress`: Progress percentage

**Used by:**

- `FormWizard`: `getStepMetadata()` in `FormWizardView.tsx`

### 4. Navigation Validation

**Function:** `canNavigateToStep(targetStep, currentStep, allowBackNavigation)`

Validates if navigation to a target step is allowed based on:

- Current step position
- Back navigation settings

**Used by:** Both components for step click validation

## Refactoring Opportunities

### High Priority (Clear Duplication)

1. ✅ **Progress Calculation** - Extracted
2. ✅ **Step to Stepper Conversion** - Extracted
3. ✅ **Step Metadata** - Extracted
4. ✅ **Navigation Validation** - Extracted

### Medium Priority (Similar Patterns)

1. **Props Extraction with Defaults**
   - `FormWizard`: `extractWizardProps()` in `FormWizardView.tsx`
   - `Wizard`: `extractWizardConfig()` in `WizardHelpers.ts`
   - **Note:** Different prop structures, but similar pattern

2. **Step Status Determination**
   - `Wizard`: `getStepStatus()` in `useWizard.ts`
   - `Stepper`: `getStepStatus()` in `Stepper.tsx`
   - **Note:** Different logic (Wizard has validation state, Stepper is simpler)

### Low Priority (Different Implementations)

1. **State Management**
   - Different state structures (`FormWizardState` vs `WizardState`)
   - Different persistence strategies
   - **Recommendation:** Keep separate

2. **Validation Logic**
   - `FormWizard`: React Hook Form integration
   - `Wizard`: Custom validator functions
   - **Recommendation:** Keep separate

3. **Handlers**
   - Different handler signatures and dependencies
   - **Recommendation:** Keep separate

## Usage Example

```typescript
import {
	calculateWizardProgress,
	convertStepsToStepperSteps,
	calculateStepMetadata,
	canNavigateToStep,
} from '@core/ui/wizard/wizardUtils';

// Calculate progress
const progress = calculateWizardProgress(activeStep, totalSteps);

// Convert steps
const stepperSteps = convertStepsToStepperSteps(wizardSteps);

// Get metadata
const { isFirstStep, isLastStep, progress } = calculateStepMetadata(activeStep, totalSteps);

// Validate navigation
if (canNavigateToStep(targetStep, currentStep, allowBackNavigation)) {
	// Navigate
}
```

## Next Steps

1. Refactor `FormWizard` to use `calculateWizardProgress` instead of local `calculateProgress`
2. Refactor `FormWizard` to use `convertStepsToStepperSteps` instead of local function
3. Refactor `FormWizard` to use `calculateStepMetadata` instead of local `getStepMetadata`
4. Refactor both components to use `canNavigateToStep` for navigation validation
5. Consider extracting `calculateWizardProgressByCompletion` usage in `Wizard`
