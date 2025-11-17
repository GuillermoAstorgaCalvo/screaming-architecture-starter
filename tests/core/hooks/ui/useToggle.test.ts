import { useToggle } from '@core/hooks/ui/useToggle';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const registerInitialValueTests = () => {
	describe('initial value', () => {
		it('should initialize with false by default', () => {
			const { result } = renderHook(() => useToggle());

			const [value] = result.current;
			expect(value).toBe(false);
		});

		it('should initialize with provided true value', () => {
			const { result } = renderHook(() => useToggle(true));

			const [value] = result.current;
			expect(value).toBe(true);
		});

		it('should initialize with provided false value', () => {
			const { result } = renderHook(() => useToggle(false));

			const [value] = result.current;
			expect(value).toBe(false);
		});
	});
};

const registerReturnValueStructureTests = () => {
	describe('return value structure', () => {
		it('should return a tuple with 4 elements', () => {
			const { result } = renderHook(() => useToggle());

			expect(result.current).toHaveLength(4);
			expect(Array.isArray(result.current)).toBe(true);
		});

		it('should return [value, toggle, setTrue, setFalse]', () => {
			const { result } = renderHook(() => useToggle());

			const [value, toggle, setTrue, setFalse] = result.current;

			expect(typeof value).toBe('boolean');
			expect(typeof toggle).toBe('function');
			expect(typeof setTrue).toBe('function');
			expect(typeof setFalse).toBe('function');
		});
	});
};

const registerToggleFunctionalityTests = () => {
	describe('toggle functionality', () => {
		it('should toggle from false to true', () => {
			const { result } = renderHook(() => useToggle(false));

			expect(result.current[0]).toBe(false);

			act(() => {
				result.current[1](); // toggle
			});

			expect(result.current[0]).toBe(true);
		});

		it('should toggle from true to false', () => {
			const { result } = renderHook(() => useToggle(true));

			expect(result.current[0]).toBe(true);

			act(() => {
				result.current[1](); // toggle
			});

			expect(result.current[0]).toBe(false);
		});

		it('should toggle multiple times', () => {
			const { result } = renderHook(() => useToggle(false));

			expect(result.current[0]).toBe(false);

			act(() => {
				result.current[1](); // toggle to true
			});
			expect(result.current[0]).toBe(true);

			act(() => {
				result.current[1](); // toggle to false
			});
			expect(result.current[0]).toBe(false);

			act(() => {
				result.current[1](); // toggle to true
			});
			expect(result.current[0]).toBe(true);
		});
	});
};

const registerSetTrueTests = () => {
	describe('setTrue functionality', () => {
		it('should set value to true when currently false', () => {
			const { result } = renderHook(() => useToggle(false));

			expect(result.current[0]).toBe(false);

			act(() => {
				result.current[2](); // setTrue
			});

			expect(result.current[0]).toBe(true);
		});

		it('should keep value as true when already true', () => {
			const { result } = renderHook(() => useToggle(true));

			expect(result.current[0]).toBe(true);

			act(() => {
				result.current[2](); // setTrue
			});

			expect(result.current[0]).toBe(true);
		});

		it('should set value to true multiple times', () => {
			const { result } = renderHook(() => useToggle(false));

			act(() => {
				result.current[2](); // setTrue
			});
			expect(result.current[0]).toBe(true);

			act(() => {
				result.current[2](); // setTrue again
			});
			expect(result.current[0]).toBe(true);
		});
	});
};

const registerSetFalseTests = () => {
	describe('setFalse functionality', () => {
		it('should set value to false when currently true', () => {
			const { result } = renderHook(() => useToggle(true));

			expect(result.current[0]).toBe(true);

			act(() => {
				result.current[3](); // setFalse
			});

			expect(result.current[0]).toBe(false);
		});

		it('should keep value as false when already false', () => {
			const { result } = renderHook(() => useToggle(false));

			expect(result.current[0]).toBe(false);

			act(() => {
				result.current[3](); // setFalse
			});

			expect(result.current[0]).toBe(false);
		});

		it('should set value to false multiple times', () => {
			const { result } = renderHook(() => useToggle(true));

			act(() => {
				result.current[3](); // setFalse
			});
			expect(result.current[0]).toBe(false);

			act(() => {
				result.current[3](); // setFalse again
			});
			expect(result.current[0]).toBe(false);
		});
	});
};

const registerCombinedOperationTests = () => {
	describe('combined operations', () => {
		it('should work with toggle, setTrue, and setFalse together', () => {
			const { result } = renderHook(() => useToggle(false));

			// Start false
			expect(result.current[0]).toBe(false);

			// Toggle to true
			act(() => {
				result.current[1](); // toggle
			});
			expect(result.current[0]).toBe(true);

			// Set to false
			act(() => {
				result.current[3](); // setFalse
			});
			expect(result.current[0]).toBe(false);

			// Set to true
			act(() => {
				result.current[2](); // setTrue
			});
			expect(result.current[0]).toBe(true);

			// Toggle to false
			act(() => {
				result.current[1](); // toggle
			});
			expect(result.current[0]).toBe(false);
		});

		it('should maintain function references across renders', () => {
			const { result, rerender } = renderHook(() => useToggle(false));

			const [, toggle1, setTrue1, setFalse1] = result.current;

			rerender();

			const [, toggle2, setTrue2, setFalse2] = result.current;

			// Functions should be stable (memoized with useCallback)
			expect(toggle1).toBe(toggle2);
			expect(setTrue1).toBe(setTrue2);
			expect(setFalse1).toBe(setFalse2);
		});
	});
};

const registerRealWorldScenarioTests = () => {
	describe('real-world scenarios', () => {
		it('should work for modal open/close state', () => {
			const { result } = renderHook(() => useToggle(false));
			const [isOpen, toggle, open, close] = result.current;

			expect(isOpen).toBe(false);

			act(() => {
				open();
			});
			expect(result.current[0]).toBe(true);

			act(() => {
				close();
			});
			expect(result.current[0]).toBe(false);

			act(() => {
				toggle();
			});
			expect(result.current[0]).toBe(true);
		});

		it('should work for dropdown menu state', () => {
			const { result } = renderHook(() => useToggle(false));
			const [isOpen, toggle] = result.current;

			expect(isOpen).toBe(false);

			act(() => {
				toggle();
			});
			expect(result.current[0]).toBe(true);

			act(() => {
				toggle();
			});
			expect(result.current[0]).toBe(false);
		});

		it('should work for checkbox-like state', () => {
			const { result } = renderHook(() => useToggle(false));
			const [checked, toggle] = result.current;

			expect(checked).toBe(false);

			act(() => {
				toggle();
			});
			expect(result.current[0]).toBe(true);

			act(() => {
				toggle();
			});
			expect(result.current[0]).toBe(false);
		});
	});
};

const registerEdgeCaseTests = () => {
	describe('edge cases', () => {
		it('should handle rapid toggles', () => {
			const { result } = renderHook(() => useToggle(false));

			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current[1](); // toggle
				}
			});

			// After 10 toggles from false, should be false (even number)
			expect(result.current[0]).toBe(false);
		});

		it('should handle multiple setTrue calls', () => {
			const { result } = renderHook(() => useToggle(false));

			act(() => {
				result.current[2](); // setTrue
				result.current[2](); // setTrue
				result.current[2](); // setTrue
			});

			expect(result.current[0]).toBe(true);
		});

		it('should handle multiple setFalse calls', () => {
			const { result } = renderHook(() => useToggle(true));

			act(() => {
				result.current[3](); // setFalse
				result.current[3](); // setFalse
				result.current[3](); // setFalse
			});

			expect(result.current[0]).toBe(false);
		});
	});
};

describe('useToggle', () => {
	registerInitialValueTests();
	registerReturnValueStructureTests();
	registerToggleFunctionalityTests();
	registerSetTrueTests();
	registerSetFalseTests();
	registerCombinedOperationTests();
	registerRealWorldScenarioTests();
	registerEdgeCaseTests();
});
