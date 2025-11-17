import { usePrevious } from '@core/hooks/ui/usePrevious';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const changeValue = <T>(rerender: (props: { value: T }) => void, value: T) => {
	rerender({ value });
};

const describeInitialRender = () =>
	describe('initial render', () => {
		it('should return undefined on first render', () => {
			const { result } = renderHook(() => usePrevious(42));

			expect(result.current).toBeUndefined();
		});

		it('should return undefined for any initial value', () => {
			const { result } = renderHook(() => usePrevious('initial'));

			expect(result.current).toBeUndefined();
		});

		it('should return undefined for null initial value', () => {
			const { result } = renderHook(() => usePrevious(null));

			expect(result.current).toBeUndefined();
		});
	});

const describePreviousValueTracking = () =>
	describe('previous value tracking', () => {
		it('should return previous value after update', () => {
			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: 1 },
			});

			expect(result.current).toBeUndefined();

			changeValue(rerender, 2);
			expect(result.current).toBe(1);

			changeValue(rerender, 3);
			expect(result.current).toBe(2);
		});

		it('should track previous string values', () => {
			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: 'first' },
			});

			expect(result.current).toBeUndefined();

			changeValue(rerender, 'second');
			expect(result.current).toBe('first');

			changeValue(rerender, 'third');
			expect(result.current).toBe('second');
		});

		it('should track previous boolean values', () => {
			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: false },
			});

			expect(result.current).toBeUndefined();

			changeValue(rerender, true);
			expect(result.current).toBe(false);

			changeValue(rerender, false);
			expect(result.current).toBe(true);
		});

		it('should track previous null values', () => {
			const { result, rerender } = renderHook(
				({ value }: { value: string | null }) => usePrevious(value),
				{
					initialProps: { value: null as string | null },
				}
			);

			expect(result.current).toBeUndefined();

			changeValue(rerender, 'not null');
			expect(result.current).toBeNull();

			changeValue(rerender, null);
			expect(result.current).toBe('not null');
		});

		it('should track previous undefined values', () => {
			const { result, rerender } = renderHook(
				({ value }: { value: string | undefined }) => usePrevious(value),
				{
					initialProps: { value: undefined as string | undefined },
				}
			);

			expect(result.current).toBeUndefined();

			changeValue(rerender, 'defined');
			expect(result.current).toBeUndefined();

			changeValue(rerender, undefined);
			expect(result.current).toBe('defined');
		});
	});

const describeObjectReferenceTracking = () =>
	describe('object reference tracking', () => {
		it('should track previous object references', () => {
			const obj1 = { id: 1, name: 'First' };
			const obj2 = { id: 2, name: 'Second' };
			const obj3 = { id: 3, name: 'Third' };

			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: obj1 },
			});

			expect(result.current).toBeUndefined();

			changeValue(rerender, obj2);
			expect(result.current).toBe(obj1);

			changeValue(rerender, obj3);
			expect(result.current).toBe(obj2);
		});

		it('should track previous array references', () => {
			const arr1 = [1, 2, 3];
			const arr2 = [4, 5, 6];
			const arr3 = [7, 8, 9];

			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: arr1 },
			});

			expect(result.current).toBeUndefined();

			changeValue(rerender, arr2);
			expect(result.current).toBe(arr1);

			changeValue(rerender, arr3);
			expect(result.current).toBe(arr2);
		});

		it('should track previous function references', () => {
			const fn1 = () => 1;
			const fn2 = () => 2;
			const fn3 = () => 3;

			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: fn1 },
			});

			expect(result.current).toBeUndefined();

			changeValue(rerender, fn2);
			expect(result.current).toBe(fn1);

			changeValue(rerender, fn3);
			expect(result.current).toBe(fn2);
		});
	});

const describeValueChanges = () =>
	describe('value changes', () => {
		it('should update previous value when current value changes', () => {
			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: 0 },
			});

			changeValue(rerender, 1);
			expect(result.current).toBe(0);

			changeValue(rerender, 2);
			expect(result.current).toBe(1);

			changeValue(rerender, 2);
			expect(result.current).toBe(1);

			changeValue(rerender, 3);
			expect(result.current).toBe(2);
		});

		it('should handle rapid value changes', () => {
			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: 0 },
			});

			for (let i = 1; i <= 10; i++) {
				changeValue(rerender, i);
				expect(result.current).toBe(i - 1);
			}
		});
	});

const describeEdgeCases = () =>
	describe('edge cases', () => {
		it('should handle zero as a valid previous value', () => {
			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: 0 },
			});

			changeValue(rerender, 1);
			expect(result.current).toBe(0);

			changeValue(rerender, 0);
			expect(result.current).toBe(1);
		});

		it('should handle empty string as a valid previous value', () => {
			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: '' },
			});

			changeValue(rerender, 'hello');
			expect(result.current).toBe('');

			changeValue(rerender, '');
			expect(result.current).toBe('hello');
		});

		it('should handle NaN as a valid previous value', () => {
			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: Number.NaN },
			});

			changeValue(rerender, 1);
			expect(result.current).toBeNaN();

			changeValue(rerender, Number.NaN);
			expect(result.current).toBe(1);
		});

		it('should handle complex nested objects', () => {
			const complex1 = {
				nested: {
					array: [1, 2, { deep: 'value' }],
					object: { key: 'value' },
				},
			};
			const complex2 = {
				nested: {
					array: [3, 4, { deep: 'other' }],
					object: { key: 'other' },
				},
			};

			const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
				initialProps: { value: complex1 },
			});

			expect(result.current).toBeUndefined();

			changeValue(rerender, complex2);
			expect(result.current).toBe(complex1);
		});
	});

const describeRealWorldScenarios = () =>
	describe('real-world scenarios', () => {
		it('should track user state changes', () => {
			type User = { id: number; name: string } | null;

			const { result, rerender } = renderHook(({ user }) => usePrevious(user), {
				initialProps: { user: null as User },
			});

			expect(result.current).toBeUndefined();

			const user1 = { id: 1, name: 'Alice' };
			rerender({ user: user1 });
			expect(result.current).toBeNull();

			const user2 = { id: 2, name: 'Bob' };
			rerender({ user: user2 });
			expect(result.current).toBe(user1);

			rerender({ user: null });
			expect(result.current).toBe(user2);
		});

		it('should track count changes for comparison', () => {
			const { result, rerender } = renderHook(({ count }) => usePrevious(count), {
				initialProps: { count: 0 },
			});

			expect(result.current).toBeUndefined();

			rerender({ count: 5 });
			expect(result.current).toBe(0);

			rerender({ count: 10 });
			expect(result.current).toBe(5);

			rerender({ count: 10 });
			expect(result.current).toBe(5);
		});
	});

describe('usePrevious', () => {
	describeInitialRender();
	describePreviousValueTracking();
	describeObjectReferenceTracking();
	describeValueChanges();
	describeEdgeCases();
	describeRealWorldScenarios();
});
