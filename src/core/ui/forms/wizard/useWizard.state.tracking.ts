import { useCallback, useState } from 'react';

/**
 * Hook to track completed and skipped steps
 */
export function useStepTracking() {
	const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
	const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());

	const markStepCompleted = useCallback((stepIndex: number) => {
		setCompletedSteps(prev => {
			const next = new Set(prev);
			next.add(stepIndex);
			return next;
		});
	}, []);

	const markStepSkipped = useCallback((stepIndex: number) => {
		setSkippedSteps(prev => {
			const next = new Set(prev);
			next.add(stepIndex);
			return next;
		});
	}, []);

	return {
		completedSteps,
		skippedSteps,
		markStepCompleted,
		markStepSkipped,
		setCompletedSteps,
		setSkippedSteps,
	};
}

/**
 * Hook to provide step status helper functions
 */
export function useStepHelpers(completedSteps: Set<number>, skippedSteps: Set<number>) {
	const isStepCompleted = useCallback(
		(stepIndex: number) => completedSteps.has(stepIndex),
		[completedSteps]
	);

	const isStepSkipped = useCallback(
		(stepIndex: number) => skippedSteps.has(stepIndex),
		[skippedSteps]
	);

	return { isStepCompleted, isStepSkipped };
}
