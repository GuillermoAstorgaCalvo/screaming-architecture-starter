import { useInterval } from '@core/hooks/interval/useInterval';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const DEFAULT_DELAY = 100;
const CUSTOM_DELAY = 200;

// Helper function to advance time
const advanceTime = (ms: number) => {
	vi.advanceTimersByTime(ms);
};

function describeIntervalExecution() {
	describe('interval execution', () => {
		it('executes callback at specified intervals', () => {
			const callback = vi.fn();
			renderHook(() => useInterval(callback, DEFAULT_DELAY));

			expect(callback).not.toHaveBeenCalled();

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(2);

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(3);
		});

		it('executes callback with custom delay', () => {
			const callback = vi.fn();
			renderHook(() => useInterval(callback, CUSTOM_DELAY));

			expect(callback).not.toHaveBeenCalled();

			advanceTime(CUSTOM_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);

			advanceTime(CUSTOM_DELAY);
			expect(callback).toHaveBeenCalledTimes(2);
		});

		it('continues executing at regular intervals', () => {
			const callback = vi.fn();
			renderHook(() => useInterval(callback, DEFAULT_DELAY));

			// Execute multiple intervals
			advanceTime(DEFAULT_DELAY * 5);
			expect(callback).toHaveBeenCalledTimes(5);
		});

		it('uses latest callback reference', () => {
			const callback1 = vi.fn();
			const callback2 = vi.fn();

			const { rerender } = renderHook(({ cb }) => useInterval(cb, DEFAULT_DELAY), {
				initialProps: { cb: callback1 },
			});

			advanceTime(DEFAULT_DELAY);
			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).not.toHaveBeenCalled();

			// Update callback
			rerender({ cb: callback2 });

			advanceTime(DEFAULT_DELAY);
			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).toHaveBeenCalledTimes(1);
		});
	});
}

function describeStartStopFunctionality() {
	describe('start/stop functionality', () => {
		it('starts interval by default when active is not specified', () => {
			const callback = vi.fn();
			renderHook(() => useInterval(callback, DEFAULT_DELAY));

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('starts interval when active is true', () => {
			const callback = vi.fn();
			renderHook(() => useInterval(callback, DEFAULT_DELAY, { active: true }));

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('stops interval when active is false', () => {
			const callback = vi.fn();
			renderHook(() => useInterval(callback, DEFAULT_DELAY, { active: false }));

			advanceTime(DEFAULT_DELAY * 3);
			expect(callback).not.toHaveBeenCalled();
		});

		it('can be paused and resumed', () => {
			const callback = vi.fn();
			const { rerender } = renderHook(
				({ active }) => useInterval(callback, DEFAULT_DELAY, { active }),
				{
					initialProps: { active: true },
				}
			);

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);

			// Pause
			rerender({ active: false });
			advanceTime(DEFAULT_DELAY * 2);
			expect(callback).toHaveBeenCalledTimes(1);

			// Resume
			rerender({ active: true });
			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(2);
		});

		it('stops interval when delay is null', () => {
			const callback = vi.fn();
			renderHook(() => useInterval(callback, null));

			advanceTime(DEFAULT_DELAY * 3);
			expect(callback).not.toHaveBeenCalled();
		});

		it('stops interval when delay is null even if active is true', () => {
			const callback = vi.fn();
			renderHook(() => useInterval(callback, null, { active: true }));

			advanceTime(DEFAULT_DELAY * 3);
			expect(callback).not.toHaveBeenCalled();
		});
	});
}

function describeDelayChanges() {
	describe('delay changes', () => {
		it('restarts interval when delay changes', () => {
			const callback = vi.fn();
			const { rerender } = renderHook(({ delay }) => useInterval(callback, delay), {
				initialProps: { delay: DEFAULT_DELAY },
			});

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);

			// Change delay
			rerender({ delay: CUSTOM_DELAY });

			// Should reset and use new delay
			advanceTime(CUSTOM_DELAY);
			expect(callback).toHaveBeenCalledTimes(2);
		});

		it('handles delay change from null to number', () => {
			const callback = vi.fn();
			const { rerender } = renderHook(
				({ delay }: { delay: number | null }) => useInterval(callback, delay),
				{
					initialProps: { delay: null as number | null },
				}
			);

			advanceTime(DEFAULT_DELAY);
			expect(callback).not.toHaveBeenCalled();

			// Start interval
			rerender({ delay: DEFAULT_DELAY as number | null });
			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('handles delay change from number to null', () => {
			const callback = vi.fn();
			const { rerender } = renderHook(
				({ delay }: { delay: number | null }) => useInterval(callback, delay),
				{
					initialProps: { delay: DEFAULT_DELAY as number | null },
				}
			);

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);

			// Stop interval
			rerender({ delay: null as number | null });
			advanceTime(DEFAULT_DELAY * 2);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('restarts interval when delay changes while active', () => {
			const callback = vi.fn();
			const { rerender } = renderHook(
				({ delay }) => useInterval(callback, delay, { active: true }),
				{
					initialProps: { delay: DEFAULT_DELAY },
				}
			);

			advanceTime(50); // Partway through first interval
			expect(callback).not.toHaveBeenCalled();

			// Change delay - should restart
			rerender({ delay: CUSTOM_DELAY });
			advanceTime(50); // Still not enough for new delay
			expect(callback).not.toHaveBeenCalled();

			advanceTime(CUSTOM_DELAY - 50);
			expect(callback).toHaveBeenCalledTimes(1);
		});
	});
}

function describeCleanupOnUnmount() {
	describe('cleanup on unmount', () => {
		it('cleans up interval on unmount', () => {
			const callback = vi.fn();
			const { unmount } = renderHook(() => useInterval(callback, DEFAULT_DELAY));

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);

			unmount();

			// Should not execute after unmount
			advanceTime(DEFAULT_DELAY * 2);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('cleans up interval when delay changes', () => {
			const callback = vi.fn();
			const { rerender } = renderHook(({ delay }) => useInterval(callback, delay), {
				initialProps: { delay: DEFAULT_DELAY },
			});

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);

			// Change delay - old interval should be cleaned up
			rerender({ delay: CUSTOM_DELAY });

			// Old interval should not fire
			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);

			// New interval should fire
			advanceTime(CUSTOM_DELAY - DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(2);
		});

		it('cleans up interval when active changes to false', () => {
			const callback = vi.fn();
			const { rerender } = renderHook(
				({ active }) => useInterval(callback, DEFAULT_DELAY, { active }),
				{
					initialProps: { active: true },
				}
			);

			advanceTime(DEFAULT_DELAY);
			expect(callback).toHaveBeenCalledTimes(1);

			// Deactivate - should clean up
			rerender({ active: false });

			advanceTime(DEFAULT_DELAY * 2);
			expect(callback).toHaveBeenCalledTimes(1);
		});
	});
}

function describeImmediateExecution() {
	describe('immediate execution option', () => {
		itDoesNotExecuteImmediatelyByDefault();
		itExecutesImmediatelyWhenImmediateTrue();
		itExecutesImmediatelyThenContinues();
		itDoesNotExecuteImmediatelyWhenImmediateFalse();
		itExecutesImmediatelyWhenInactive();
		itExecutesImmediatelyOnDelayChange();
		itUsesLatestCallbackWhenImmediate();
	});
}

function itDoesNotExecuteImmediatelyByDefault() {
	it('does not execute immediately by default', () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback, DEFAULT_DELAY));

		expect(callback).not.toHaveBeenCalled();

		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(1);
	});
}

function itExecutesImmediatelyWhenImmediateTrue() {
	it('executes immediately when immediate is true', () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback, DEFAULT_DELAY, { immediate: true }));

		expect(callback).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(2);
	});
}

function itExecutesImmediatelyThenContinues() {
	it('executes immediately then continues at intervals', () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback, DEFAULT_DELAY, { immediate: true }));

		expect(callback).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(2);

		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(3);
	});
}

function itDoesNotExecuteImmediatelyWhenImmediateFalse() {
	it('does not execute immediately when immediate is false', () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback, DEFAULT_DELAY, { immediate: false }));

		expect(callback).not.toHaveBeenCalled();

		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(1);
	});
}

function itExecutesImmediatelyWhenInactive() {
	it('executes immediately even when active is false initially', () => {
		const callback = vi.fn();
		renderHook(() =>
			useInterval(callback, DEFAULT_DELAY, {
				active: false,
				immediate: true,
			})
		);

		// Should not execute when inactive
		expect(callback).not.toHaveBeenCalled();
	});
}

function itExecutesImmediatelyOnDelayChange() {
	it('executes immediately when delay changes and immediate is true', () => {
		const callback = vi.fn();
		const { rerender } = renderHook(
			({ delay, immediate }) => useInterval(callback, delay, { immediate }),
			{
				initialProps: { delay: DEFAULT_DELAY, immediate: false },
			}
		);

		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(1);

		// Change to immediate
		rerender({ delay: CUSTOM_DELAY, immediate: true });
		expect(callback).toHaveBeenCalledTimes(2); // Immediate execution

		advanceTime(CUSTOM_DELAY);
		expect(callback).toHaveBeenCalledTimes(3);
	});
}

function itUsesLatestCallbackWhenImmediate() {
	it('uses latest callback when executing immediately', () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();

		const { rerender } = renderHook(
			({ cb, immediate }) => useInterval(cb, DEFAULT_DELAY, { immediate }),
			{
				initialProps: { cb: callback1, immediate: false },
			}
		);

		advanceTime(DEFAULT_DELAY);
		expect(callback1).toHaveBeenCalledTimes(1);

		// Update callback and enable immediate
		rerender({ cb: callback2, immediate: true });
		expect(callback2).toHaveBeenCalledTimes(1);
		expect(callback1).toHaveBeenCalledTimes(1);
	});
}

function describeEdgeCases() {
	describe('edge cases', () => {
		itHandlesVeryShortDelays();
		itHandlesCallbackErrors();
		itHandlesMultipleIntervals();
		itHandlesRapidActiveChanges();
		itHandlesRapidDelayChanges();
		itHandlesCallbackChangeDuringExecution();
	});
}

function itHandlesVeryShortDelays() {
	it('handles very short delays', () => {
		const callback = vi.fn();
		const shortDelay = 10;
		renderHook(() => useInterval(callback, shortDelay));

		advanceTime(shortDelay);
		expect(callback).toHaveBeenCalledTimes(1);

		advanceTime(shortDelay);
		expect(callback).toHaveBeenCalledTimes(2);
	});
}

function itHandlesCallbackErrors() {
	it('handles callback that throws error', () => {
		const errorCallback = vi.fn(() => {
			throw new Error('Test error');
		});

		// Should not crash the hook, but error will be thrown
		renderHook(() => useInterval(errorCallback, DEFAULT_DELAY));

		// The error will be thrown, but the interval mechanism should still work
		// We expect the error to be thrown when the callback executes
		expect(() => {
			advanceTime(DEFAULT_DELAY);
		}).toThrow('Test error');

		// Verify callback was called despite the error
		expect(errorCallback).toHaveBeenCalledTimes(1);
	});
}

function itHandlesMultipleIntervals() {
	it('handles multiple simultaneous intervals', () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();

		renderHook(() => useInterval(callback1, DEFAULT_DELAY));
		renderHook(() => useInterval(callback2, CUSTOM_DELAY));

		advanceTime(DEFAULT_DELAY);
		expect(callback1).toHaveBeenCalledTimes(1);
		expect(callback2).not.toHaveBeenCalled();

		// Advance remaining time to reach CUSTOM_DELAY total
		// At 200ms: callback1 fires again (2nd time), callback2 fires (1st time)
		advanceTime(CUSTOM_DELAY - DEFAULT_DELAY);
		expect(callback1).toHaveBeenCalledTimes(2);
		expect(callback2).toHaveBeenCalledTimes(1);

		// Advance another DEFAULT_DELAY - callback1 should fire again
		advanceTime(DEFAULT_DELAY);
		expect(callback1).toHaveBeenCalledTimes(3);
		expect(callback2).toHaveBeenCalledTimes(1);
	});
}

function itHandlesRapidActiveChanges() {
	it('handles rapid active state changes', () => {
		const callback = vi.fn();
		const { rerender } = renderHook(
			({ active }) => useInterval(callback, DEFAULT_DELAY, { active }),
			{
				initialProps: { active: true },
			}
		);

		// Rapidly toggle active state
		rerender({ active: false });
		rerender({ active: true });
		rerender({ active: false });
		rerender({ active: true });

		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(1);
	});
}

function itHandlesRapidDelayChanges() {
	it('handles rapid delay changes', () => {
		const callback = vi.fn();
		const { rerender } = renderHook(({ delay }) => useInterval(callback, delay), {
			initialProps: { delay: DEFAULT_DELAY },
		});

		rerender({ delay: CUSTOM_DELAY });
		rerender({ delay: DEFAULT_DELAY });
		rerender({ delay: CUSTOM_DELAY });

		advanceTime(CUSTOM_DELAY);
		expect(callback).toHaveBeenCalledTimes(1);
	});
}

function itHandlesCallbackChangeDuringExecution() {
	it('handles callback that changes during execution', () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();

		const { rerender } = renderHook(({ cb }) => useInterval(cb, DEFAULT_DELAY), {
			initialProps: { cb: callback1 },
		});

		// Change callback partway through interval
		advanceTime(50);
		rerender({ cb: callback2 });

		advanceTime(50);
		expect(callback1).not.toHaveBeenCalled();
		expect(callback2).toHaveBeenCalledTimes(1);
	});
}

function describeOptionCombinations() {
	describe('option combinations', () => {
		itWorksWithImmediateAndActiveTrue();
		itWorksWithImmediateTrueAndActiveFalse();
		itWorksWithImmediateFalseAndActiveTrue();
		itWorksWithImmediateFalseAndActiveFalse();
	});
}

function itWorksWithImmediateAndActiveTrue() {
	it('works with immediate and active true', () => {
		const callback = vi.fn();
		renderHook(() =>
			useInterval(callback, DEFAULT_DELAY, {
				active: true,
				immediate: true,
			})
		);

		expect(callback).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(2);
	});
}

function itWorksWithImmediateTrueAndActiveFalse() {
	it('works with immediate true and active false', () => {
		const callback = vi.fn();
		renderHook(() =>
			useInterval(callback, DEFAULT_DELAY, {
				active: false,
				immediate: true,
			})
		);

		expect(callback).not.toHaveBeenCalled();
	});
}

function itWorksWithImmediateFalseAndActiveTrue() {
	it('works with immediate false and active true', () => {
		const callback = vi.fn();
		renderHook(() =>
			useInterval(callback, DEFAULT_DELAY, {
				active: true,
				immediate: false,
			})
		);

		expect(callback).not.toHaveBeenCalled();

		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(1);
	});
}

function itWorksWithImmediateFalseAndActiveFalse() {
	it('works with immediate false and active false', () => {
		const callback = vi.fn();
		renderHook(() =>
			useInterval(callback, DEFAULT_DELAY, {
				active: false,
				immediate: false,
			})
		);

		expect(callback).not.toHaveBeenCalled();

		advanceTime(DEFAULT_DELAY * 2);
		expect(callback).not.toHaveBeenCalled();
	});
}

describe('useInterval', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describeIntervalExecution();
	describeStartStopFunctionality();
	describeDelayChanges();
	describeCleanupOnUnmount();
	describeImmediateExecution();
	describeEdgeCases();
	describeOptionCombinations();
});
