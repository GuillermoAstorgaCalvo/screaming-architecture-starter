import { useMotionAnimationFrame } from '@core/hooks/motion/useMotionAnimationFrame';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

interface MotionAnimationFrameTestContext {
	advanceFrame: (delta?: number) => void;
	getRafSpy: () => (callback: FrameRequestCallback) => number;
	getCancelRafSpy: () => (handle: number) => void;
}

const registerBasicFunctionalityTests = (context: MotionAnimationFrameTestContext) => {
	describe('basic functionality', () => {
		it('should call callback on each animation frame', () => {
			const { advanceFrame, getRafSpy } = context;
			const callback = vi.fn((time: number, delta: number) => {
				expect(typeof time).toBe('number');
				expect(typeof delta).toBe('number');
			});

			renderHook(() => useMotionAnimationFrame(callback));

			expect(getRafSpy()).toHaveBeenCalled();
			advanceFrame(16);
			expect(callback).toHaveBeenCalledTimes(1);
			advanceFrame(16);
			expect(callback).toHaveBeenCalledTimes(2);
		});

		it('should pass correct time and delta values', () => {
			const { advanceFrame } = context;
			const callback = vi.fn();
			renderHook(() => useMotionAnimationFrame(callback));

			advanceFrame(16);
			expect(callback).toHaveBeenCalledWith(16, 0);

			advanceFrame(8);
			expect(callback).toHaveBeenCalledWith(24, 8);
		});

		it('should handle delta calculation correctly on first frame', () => {
			const { advanceFrame } = context;
			const callback = vi.fn();
			renderHook(() => useMotionAnimationFrame(callback));

			advanceFrame(16);
			expect(callback).toHaveBeenCalledWith(16, 0);
		});
	});
};

const registerEnabledOptionTests = (context: MotionAnimationFrameTestContext) => {
	describe('enabled option', () => {
		it('should not call callback when enabled is false', () => {
			const { advanceFrame, getRafSpy } = context;
			const callback = vi.fn();
			renderHook(() => useMotionAnimationFrame(callback, { enabled: false }));

			expect(getRafSpy()).not.toHaveBeenCalled();
			advanceFrame(16);
			expect(callback).not.toHaveBeenCalled();
		});

		it('should start animation when enabled changes from false to true', () => {
			const { advanceFrame, getRafSpy } = context;
			const callback = vi.fn();
			const { rerender } = renderHook(
				({ enabled }) => useMotionAnimationFrame(callback, { enabled }),
				{ initialProps: { enabled: false } }
			);

			expect(getRafSpy()).not.toHaveBeenCalled();

			rerender({ enabled: true });
			expect(getRafSpy()).toHaveBeenCalled();
			advanceFrame(16);
			expect(callback).toHaveBeenCalled();
		});

		it('should stop animation when enabled changes from true to false', () => {
			const { advanceFrame, getCancelRafSpy } = context;
			const callback = vi.fn();
			const { rerender } = renderHook(
				({ enabled }) => useMotionAnimationFrame(callback, { enabled }),
				{ initialProps: { enabled: true } }
			);

			advanceFrame(16);
			expect(callback).toHaveBeenCalledTimes(1);

			rerender({ enabled: false });
			expect(getCancelRafSpy()).toHaveBeenCalled();
			advanceFrame(16);
			expect(callback).toHaveBeenCalledTimes(1);
		});
	});
};

const registerCallbackUpdateTests = (context: MotionAnimationFrameTestContext) => {
	describe('callback updates', () => {
		it('should use latest callback reference', () => {
			const { advanceFrame } = context;
			const callback1 = vi.fn();
			const callback2 = vi.fn();

			const { rerender } = renderHook(({ callback }) => useMotionAnimationFrame(callback), {
				initialProps: { callback: callback1 },
			});

			advanceFrame(16);
			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).not.toHaveBeenCalled();

			rerender({ callback: callback2 });
			advanceFrame(16);
			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).toHaveBeenCalledTimes(1);
		});
	});
};

const registerCleanupTests = (context: MotionAnimationFrameTestContext) => {
	describe('cleanup', () => {
		it('should cancel animation frame on unmount', () => {
			const { getRafSpy, getCancelRafSpy } = context;
			const callback = vi.fn();
			const { unmount } = renderHook(() => useMotionAnimationFrame(callback));

			expect(getRafSpy()).toHaveBeenCalled();
			unmount();
			expect(getCancelRafSpy()).toHaveBeenCalled();
		});

		it('should cancel previous animation frame when disabled', () => {
			const { getCancelRafSpy } = context;
			const callback = vi.fn();
			const { rerender } = renderHook(
				({ enabled }) => useMotionAnimationFrame(callback, { enabled }),
				{ initialProps: { enabled: true } }
			);

			rerender({ enabled: false });
			expect(getCancelRafSpy()).toHaveBeenCalled();
		});
	});
};

const registerContinuousLoopTests = (context: MotionAnimationFrameTestContext) => {
	describe('continuous animation loop', () => {
		it('should continuously request new animation frames', () => {
			const { advanceFrame, getRafSpy } = context;
			const callback = vi.fn();
			renderHook(() => useMotionAnimationFrame(callback));

			advanceFrame(16);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(getRafSpy()).toHaveBeenCalledTimes(2);

			advanceFrame(16);
			expect(callback).toHaveBeenCalledTimes(2);
			expect(getRafSpy()).toHaveBeenCalledTimes(3);
		});

		it('should maintain correct delta across multiple frames', () => {
			const { advanceFrame } = context;
			const deltas: number[] = [];
			const callback = vi.fn((_time: number, delta: number) => {
				deltas.push(delta);
			});

			renderHook(() => useMotionAnimationFrame(callback));

			advanceFrame(16);
			advanceFrame(8);
			advanceFrame(20);
			advanceFrame(12);

			expect(deltas).toEqual([0, 8, 20, 12]);
		});
	});
};

const registerEdgeCaseTests = (context: MotionAnimationFrameTestContext) => {
	describe('edge cases', () => {
		it('should handle very small delta values', () => {
			const { advanceFrame } = context;
			const callback = vi.fn();
			renderHook(() => useMotionAnimationFrame(callback));

			advanceFrame(0.1);
			expect(callback).toHaveBeenCalledWith(0.1, 0);
		});

		it('should handle large delta values', () => {
			const { advanceFrame } = context;
			const callback = vi.fn();
			renderHook(() => useMotionAnimationFrame(callback));

			advanceFrame(1000);
			expect(callback).toHaveBeenCalledWith(1000, 0);
		});

		it('should handle callback that throws error gracefully', () => {
			const { advanceFrame } = context;
			const errorCallback = vi.fn(() => {
				throw new Error('Test error');
			});

			renderHook(() => useMotionAnimationFrame(errorCallback));

			expect(() => {
				advanceFrame(16);
			}).toThrow('Test error');
		});

		it('should reset lastTime when disabled and re-enabled', async () => {
			const { advanceFrame } = context;
			const deltas: number[] = [];
			const callback = vi.fn((_time: number, delta: number) => {
				deltas.push(delta);
			});

			const { rerender } = renderHook(
				({ enabled }) => useMotionAnimationFrame(callback, { enabled }),
				{ initialProps: { enabled: true } }
			);

			advanceFrame(16);
			expect(deltas).toEqual([0]);

			rerender({ enabled: false });
			await new Promise<void>(resolve => {
				setTimeout(resolve, 10);
			});

			rerender({ enabled: true });
			advanceFrame(16);
			expect(deltas).toEqual([0, 0]);
		});
	});
};

describe('useMotionAnimationFrame', () => {
	let rafSpy: (callback: FrameRequestCallback) => number;
	let cancelRafSpy: (handle: number) => void;
	let rafCallbacks: Array<(time: number) => void>;
	let currentTime: number;

	beforeEach(() => {
		currentTime = 0;
		rafCallbacks = [];
		rafSpy = vi.fn((callback: (time: number) => void) => {
			rafCallbacks.push(callback);
			return rafCallbacks.length;
		});
		cancelRafSpy = vi.fn((id: number) => {
			rafCallbacks.splice(id - 1, 1);
		});

		globalThis.requestAnimationFrame = rafSpy;
		globalThis.cancelAnimationFrame = cancelRafSpy;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	const advanceFrame = (delta: number = 16) => {
		currentTime += delta;
		const callbacks = [...rafCallbacks];
		rafCallbacks.length = 0;
		for (const callback of callbacks) {
			callback(currentTime);
		}
	};

	const context: MotionAnimationFrameTestContext = {
		advanceFrame,
		getRafSpy: () => rafSpy,
		getCancelRafSpy: () => cancelRafSpy,
	};

	registerBasicFunctionalityTests(context);
	registerEnabledOptionTests(context);
	registerCallbackUpdateTests(context);
	registerCleanupTests(context);
	registerContinuousLoopTests(context);
	registerEdgeCaseTests(context);
});
