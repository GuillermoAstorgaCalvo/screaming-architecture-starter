/**
 * useWizard.state.tracking Tests
 *
 * Tests for step tracking:
 * - Completed steps tracking
 * - Skipped steps tracking
 * - Step status helpers
 */

import {
	useStepHelpers,
	useStepTracking,
} from '@core/ui/forms/wizard/hooks/useWizard.state.tracking';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useStepTracking', () => {
	it('initializes with empty sets', () => {
		const { result } = renderHook(() => useStepTracking());

		expect(result.current.completedSteps.size).toBe(0);
		expect(result.current.skippedSteps.size).toBe(0);
	});

	it('marks step as completed', () => {
		const { result } = renderHook(() => useStepTracking());

		act(() => {
			result.current.markStepCompleted(0);
		});

		expect(result.current.completedSteps.has(0)).toBe(true);
		expect(result.current.completedSteps.size).toBe(1);
	});

	it('marks multiple steps as completed', () => {
		const { result } = renderHook(() => useStepTracking());

		act(() => {
			result.current.markStepCompleted(0);
			result.current.markStepCompleted(2);
		});

		expect(result.current.completedSteps.has(0)).toBe(true);
		expect(result.current.completedSteps.has(2)).toBe(true);
		expect(result.current.completedSteps.size).toBe(2);
	});

	it('marks step as skipped', () => {
		const { result } = renderHook(() => useStepTracking());

		act(() => {
			result.current.markStepSkipped(1);
		});

		expect(result.current.skippedSteps.has(1)).toBe(true);
		expect(result.current.skippedSteps.size).toBe(1);
	});

	it('marks multiple steps as skipped', () => {
		const { result } = renderHook(() => useStepTracking());

		act(() => {
			result.current.markStepSkipped(1);
			result.current.markStepSkipped(3);
		});

		expect(result.current.skippedSteps.has(1)).toBe(true);
		expect(result.current.skippedSteps.has(3)).toBe(true);
		expect(result.current.skippedSteps.size).toBe(2);
	});

	it('allows setting completed steps directly', () => {
		const { result } = renderHook(() => useStepTracking());

		act(() => {
			result.current.setCompletedSteps(new Set([0, 1, 2]));
		});

		expect(result.current.completedSteps.size).toBe(3);
		expect(result.current.completedSteps.has(0)).toBe(true);
		expect(result.current.completedSteps.has(1)).toBe(true);
		expect(result.current.completedSteps.has(2)).toBe(true);
	});

	it('allows setting skipped steps directly', () => {
		const { result } = renderHook(() => useStepTracking());

		act(() => {
			result.current.setSkippedSteps(new Set([1, 3]));
		});

		expect(result.current.skippedSteps.size).toBe(2);
		expect(result.current.skippedSteps.has(1)).toBe(true);
		expect(result.current.skippedSteps.has(3)).toBe(true);
	});
});

describe('useStepHelpers', () => {
	it('checks if step is completed', () => {
		const completedSteps = new Set([0, 2]);
		const skippedSteps = new Set<number>();

		const { result } = renderHook(() => useStepHelpers(completedSteps, skippedSteps));

		expect(result.current.isStepCompleted(0)).toBe(true);
		expect(result.current.isStepCompleted(1)).toBe(false);
		expect(result.current.isStepCompleted(2)).toBe(true);
	});

	it('checks if step is skipped', () => {
		const completedSteps = new Set<number>();
		const skippedSteps = new Set([1, 3]);

		const { result } = renderHook(() => useStepHelpers(completedSteps, skippedSteps));

		expect(result.current.isStepSkipped(0)).toBe(false);
		expect(result.current.isStepSkipped(1)).toBe(true);
		expect(result.current.isStepSkipped(2)).toBe(false);
		expect(result.current.isStepSkipped(3)).toBe(true);
	});

	it('handles empty sets', () => {
		const completedSteps = new Set<number>();
		const skippedSteps = new Set<number>();

		const { result } = renderHook(() => useStepHelpers(completedSteps, skippedSteps));

		expect(result.current.isStepCompleted(0)).toBe(false);
		expect(result.current.isStepSkipped(0)).toBe(false);
	});

	it('updates when sets change', () => {
		const { result, rerender } = renderHook(
			({ completedSteps, skippedSteps }) => useStepHelpers(completedSteps, skippedSteps),
			{
				initialProps: {
					completedSteps: new Set<number>(),
					skippedSteps: new Set<number>(),
				},
			}
		);

		expect(result.current.isStepCompleted(0)).toBe(false);

		rerender({
			completedSteps: new Set([0]),
			skippedSteps: new Set<number>(),
		});

		expect(result.current.isStepCompleted(0)).toBe(true);
	});
});
