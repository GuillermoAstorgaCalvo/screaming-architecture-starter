/**
 * Tests for Zustand Store Utilities
 *
 * Tests the utilities and type helpers for creating Zustand stores.
 */

import {
	createSelector,
	type StoreActions,
	type StoreSelector,
	type StoreSlice,
	type StoreWithActions,
} from '@core/lib/storeUtils';
import { describe, expect, it } from 'vitest';
import { create, type StoreApi } from 'zustand';

/**
 * Test state interface
 */
interface TestState {
	count: number;
	name: string;
	isActive: boolean;
}

/**
 * Test actions interface
 */
interface TestActions {
	increment: () => void;
	decrement: () => void;
	setName: (name: string) => void;
	reset: () => void;
}

/**
 * Combined store type
 */
type TestStore = StoreWithActions<TestState, TestActions>;

/**
 * Helper function to create a test store
 */
function createTestStore() {
	return create<TestStore>(set => ({
		count: 0,
		name: '',
		isActive: false,
		increment: () => set(state => ({ ...state, count: state.count + 1 })),
		decrement: () => set(state => ({ ...state, count: state.count - 1 })),
		setName: (name: string) => set(state => ({ ...state, name })),
		reset: () =>
			set({
				count: 0,
				name: '',
				isActive: false,
				increment: () => {},
				decrement: () => {},
				setName: () => {},
				reset: () => {},
			}),
	}));
}

/**
 * Helper function to create a test store slice
 */
function createTestStoreSlice(): StoreSlice<TestStore> {
	return (set, _get) => ({
		count: 0,
		name: '',
		isActive: false,
		increment: () => set(state => ({ ...state, count: state.count + 1 })),
		decrement: () => set(state => ({ ...state, count: state.count - 1 })),
		setName: (name: string) => set(state => ({ ...state, name })),
		reset: () =>
			set({
				count: 0,
				name: '',
				isActive: false,
				increment: () => {},
				decrement: () => {},
				setName: () => {},
				reset: () => {},
			}),
	});
}

/**
 * Helper function to create a test store slice with get function
 */
function createTestStoreSliceWithGet(): StoreSlice<TestStore> {
	return (set, get) => ({
		count: 0,
		name: '',
		isActive: false,
		increment: () => {
			const current = get();
			set({ ...current, count: current.count + 1 });
		},
		decrement: () => {
			const current = get();
			set({ ...current, count: current.count - 1 });
		},
		setName: (name: string) => set(state => ({ ...state, name })),
		reset: () =>
			set({
				count: 0,
				name: '',
				isActive: false,
				increment: () => {},
				decrement: () => {},
				setName: () => {},
				reset: () => {},
			}),
	});
}

/**
 * Helper function to create a delay promise
 */
function delay(ms: number): Promise<void> {
	return new Promise<void>(resolve => {
		setTimeout(resolve, ms);
	});
}

/**
 * Helper functions to create Zustand store actions
 */
function createStoreActions(set: StoreApi<StoreWithActions<TestState, TestActions>>['setState']) {
	return {
		increment: () =>
			set((state: StoreWithActions<TestState, TestActions>) => ({
				...state,
				count: state.count + 1,
			})),
		decrement: () =>
			set((state: StoreWithActions<TestState, TestActions>) => ({
				...state,
				count: state.count - 1,
			})),
		setName: (name: string) =>
			set((state: StoreWithActions<TestState, TestActions>) => ({ ...state, name })),
		reset: () =>
			set({
				count: 0,
				name: '',
				isActive: false,
				increment: () => {},
				decrement: () => {},
				setName: () => {},
				reset: () => {},
			}),
	};
}

describe('createSelector - basic functionality', () => {
	it('should return the same selector function', () => {
		const selector = (state: TestState) => state.count;
		const result = createSelector(selector);

		expect(result).toBe(selector);
	});

	it('should preserve selector functionality', () => {
		const testState: TestState = {
			count: 42,
			name: 'test',
			isActive: true,
		};

		const selectCount = createSelector((state: TestState) => state.count);
		const selectName = createSelector((state: TestState) => state.name);
		const selectIsActive = createSelector((state: TestState) => state.isActive);

		expect(selectCount(testState)).toBe(42);
		expect(selectName(testState)).toBe('test');
		expect(selectIsActive(testState)).toBe(true);
	});
});

describe('createSelector - complex selectors', () => {
	it('should work with complex selector functions', () => {
		const testState: TestState = {
			count: 10,
			name: 'test',
			isActive: true,
		};

		const selectComputed = createSelector((state: TestState) => ({
			doubleCount: state.count * 2,
			displayName: state.name.toUpperCase(),
			isReady: state.isActive && state.count > 0,
		}));

		const result = selectComputed(testState);

		expect(result).toEqual({
			doubleCount: 20,
			displayName: 'TEST',
			isReady: true,
		});
	});

	it('should work with nested property selectors', () => {
		interface NestedState {
			user: {
				profile: {
					name: string;
					age: number;
				};
			};
		}

		const nestedState: NestedState = {
			user: {
				profile: {
					name: 'John',
					age: 30,
				},
			},
		};

		const selectUserName = createSelector((state: NestedState) => state.user.profile.name);
		const selectUserAge = createSelector((state: NestedState) => state.user.profile.age);

		expect(selectUserName(nestedState)).toBe('John');
		expect(selectUserAge(nestedState)).toBe(30);
	});
});

describe('createSelector - integration with Zustand', () => {
	it('should work with Zustand store hooks', () => {
		const useTestStore = createTestStore();
		const selectCount = createSelector((state: TestStore) => state.count);
		const selectName = createSelector((state: TestStore) => state.name);

		// Get initial values
		const initialState = useTestStore.getState();
		expect(initialState.count).toBe(0);
		expect(initialState.name).toBe('');

		// Use selectors to get values from state
		const count = selectCount(useTestStore.getState());
		const name = selectName(useTestStore.getState());

		expect(count).toBe(0);
		expect(name).toBe('');
	});

	it('should maintain type safety', () => {
		const selectCount: StoreSelector<TestState, number> = createSelector(
			(state: TestState) => state.count
		);

		const testState: TestState = {
			count: 5,
			name: 'test',
			isActive: true,
		};

		const result: number = selectCount(testState);
		expect(typeof result).toBe('number');
		expect(result).toBe(5);
	});
});

describe('StoreSelector type helper', () => {
	it('should correctly type selector functions', () => {
		const selector: StoreSelector<TestState, number> = (state: TestState) => state.count;

		const testState: TestState = {
			count: 100,
			name: 'test',
			isActive: true,
		};

		const result = selector(testState);
		expect(result).toBe(100);
		expect(typeof result).toBe('number');
	});

	it('should work with boolean return types', () => {
		const selector: StoreSelector<TestState, boolean> = (state: TestState) => state.isActive;

		const testState: TestState = {
			count: 0,
			name: '',
			isActive: true,
		};

		const result = selector(testState);
		expect(result).toBe(true);
		expect(typeof result).toBe('boolean');
	});

	it('should work with string return types', () => {
		const selector: StoreSelector<TestState, string> = (state: TestState) => state.name;

		const testState: TestState = {
			count: 0,
			name: 'hello',
			isActive: false,
		};

		const result = selector(testState);
		expect(result).toBe('hello');
		expect(typeof result).toBe('string');
	});

	it('should work with object return types', () => {
		const selector: StoreSelector<TestState, { count: number; name: string }> = (
			state: TestState
		) => ({
			count: state.count,
			name: state.name,
		});

		const testState: TestState = {
			count: 42,
			name: 'test',
			isActive: true,
		};

		const result = selector(testState);
		expect(result).toEqual({ count: 42, name: 'test' });
	});
});

describe('StoreSlice type helper', () => {
	it('should work with Zustand create function', () => {
		const slice = createTestStoreSlice();
		const useStore = create<TestStore>(slice);

		expect(useStore.getState().count).toBe(0);
		expect(useStore.getState().name).toBe('');
		expect(useStore.getState().isActive).toBe(false);
	});

	it('should allow access to get function', () => {
		const slice = createTestStoreSliceWithGet();
		const useStore = create<TestStore>(slice);

		useStore.getState().increment();
		expect(useStore.getState().count).toBe(1);

		useStore.getState().decrement();
		expect(useStore.getState().count).toBe(0);
	});
});

describe('StoreActions type helper - action typing', () => {
	it('should correctly type action objects', () => {
		const actions: StoreActions<TestState> = {
			increment: () => {},
			decrement: () => {},
			setName: (..._args: unknown[]) => {},
			reset: () => {},
		};

		expect(typeof actions.increment).toBe('function');
		expect(typeof actions.decrement).toBe('function');
		expect(typeof actions.setName).toBe('function');
		expect(typeof actions.reset).toBe('function');
	});
});

describe('StoreActions type helper - action return types', () => {
	it('should allow actions that return void', () => {
		const actions: StoreActions<TestState> = {
			update: () => {
				// Action that returns void
			},
		};

		if (actions.update) {
			const result = actions.update();
			expect(result).toBeUndefined();
		}
	});

	it('should allow actions that return state', () => {
		const testState: TestState = {
			count: 5,
			name: 'test',
			isActive: true,
		};

		const actions: StoreActions<TestState> = {
			getState: () => testState,
		};

		if (actions.getState) {
			const result = actions.getState();
			expect(result).toBe(testState);
		}
	});

	it('should allow async actions', async () => {
		const actions: StoreActions<TestState> = {
			asyncAction: async () => {
				await delay(10);
				return {
					count: 10,
					name: 'async',
					isActive: true,
				};
			},
		};

		if (actions.asyncAction) {
			const result = await actions.asyncAction();
			if (result && typeof result === 'object' && 'count' in result) {
				expect(result.count).toBe(10);
				expect(result.name).toBe('async');
			}
		}
	});
});

describe('StoreWithActions type helper - type composition', () => {
	it('should combine state and actions correctly', () => {
		const state: TestState = {
			count: 0,
			name: '',
			isActive: false,
		};

		const actions: TestActions = {
			increment: () => {},
			decrement: () => {},
			setName: () => {},
			reset: () => {},
		};

		const store: StoreWithActions<TestState, TestActions> = {
			...state,
			...actions,
		};

		expect(store.count).toBe(0);
		expect(store.name).toBe('');
		expect(store.isActive).toBe(false);
		expect(typeof store.increment).toBe('function');
		expect(typeof store.decrement).toBe('function');
		expect(typeof store.setName).toBe('function');
		expect(typeof store.reset).toBe('function');
	});

	it('should maintain type safety when accessing properties', () => {
		const store: StoreWithActions<TestState, TestActions> = {
			count: 42,
			name: 'test',
			isActive: true,
			increment: () => {},
			decrement: () => {},
			setName: () => {},
			reset: () => {},
		};

		// TypeScript should infer correct types
		const { count, name, isActive, increment, decrement, setName, reset } = store;

		expect(count).toBe(42);
		expect(name).toBe('test');
		expect(isActive).toBe(true);
		expect(typeof increment).toBe('function');
		expect(typeof decrement).toBe('function');
		expect(typeof setName).toBe('function');
		expect(typeof reset).toBe('function');
	});
});

describe('StoreWithActions type helper - Zustand integration', () => {
	it('should work with Zustand store creation', () => {
		const useStore = create<StoreWithActions<TestState, TestActions>>(set => ({
			count: 0,
			name: '',
			isActive: false,
			...createStoreActions(set),
		}));

		const store = useStore.getState();

		// Verify state properties
		expect(store.count).toBe(0);
		expect(store.name).toBe('');
		expect(store.isActive).toBe(false);

		// Verify action methods
		expect(typeof store.increment).toBe('function');
		expect(typeof store.decrement).toBe('function');
		expect(typeof store.setName).toBe('function');
		expect(typeof store.reset).toBe('function');
	});

	it('should test store actions functionality', () => {
		const useStore = create<StoreWithActions<TestState, TestActions>>(set => ({
			count: 0,
			name: '',
			isActive: false,
			...createStoreActions(set),
		}));

		const store = useStore.getState();

		// Test actions
		store.increment();
		expect(useStore.getState().count).toBe(1);

		store.setName('test');
		expect(useStore.getState().name).toBe('test');

		store.reset();
		expect(useStore.getState().count).toBe(0);
		expect(useStore.getState().name).toBe('');
	});
});

describe('Integration: All utilities working together', () => {
	it('should work together in a complete store setup', () => {
		// Define state and actions
		interface CounterState {
			value: number;
		}

		interface CounterActions {
			increment: () => void;
			decrement: () => void;
			reset: () => void;
		}

		type CounterStore = StoreWithActions<CounterState, CounterActions>;

		// Create store slice
		const incrementState = (state: CounterStore) => ({ ...state, value: state.value + 1 });
		const decrementState = (state: CounterStore) => ({ ...state, value: state.value - 1 });

		const createCounterActions = (
			set: StoreApi<CounterStore>['setState'],
			get: () => CounterStore
		) => ({
			increment: () => set(incrementState),
			decrement: () => set(decrementState),
			reset: () => {
				const current = get();
				set({
					...current,
					value: 0,
				});
			},
		});

		const slice: StoreSlice<CounterStore> = (set, get) => ({
			value: 0,
			...createCounterActions(set, get),
		});

		// Create store
		const useCounterStore = create<CounterStore>(slice);

		// Create selectors
		const selectValue: StoreSelector<CounterStore, number> = createSelector(
			(state: CounterStore) => state.value
		);

		// Test store
		expect(useCounterStore.getState().value).toBe(0);

		useCounterStore.getState().increment();
		expect(useCounterStore.getState().value).toBe(1);

		useCounterStore.getState().increment();
		expect(useCounterStore.getState().value).toBe(2);

		useCounterStore.getState().decrement();
		expect(useCounterStore.getState().value).toBe(1);

		useCounterStore.getState().reset();
		expect(useCounterStore.getState().value).toBe(0);

		// Test selector
		const value = selectValue(useCounterStore.getState());
		expect(value).toBe(0);
	});
});
