import type {
	UseAsyncOperation,
	UseAsyncState,
	UseDependenciesOptions,
	UseImmediateOptions,
	UseLoadingState,
} from '@src-types/hooks';
import { describe, expect, it } from 'vitest';

describe('hooks types', () => {
	describe('UseLoadingState', () => {
		it('should allow UseLoadingState with data', () => {
			const state: UseLoadingState<string> = {
				data: 'test',
				error: null,
				loading: false,
				reset: () => {
					// reset
				},
			};
			expect(state.data).toBe('test');
			expect(state.error).toBeNull();
			expect(state.loading).toBe(false);
			expect(state.reset).toBeDefined();
		});

		it('should allow UseLoadingState with error', () => {
			const state: UseLoadingState<string> = {
				data: null,
				error: new Error('Test error'),
				loading: false,
				reset: () => {
					// reset
				},
			};
			expect(state.data).toBeNull();
			expect(state.error).toBeInstanceOf(Error);
			expect(state.loading).toBe(false);
			expect(state.reset).toBeDefined();
		});

		it('should allow UseLoadingState with string error', () => {
			const state: UseLoadingState<string> = {
				data: null,
				error: 'Error message',
				loading: false,
				reset: () => {
					// reset
				},
			};
			expect(state.data).toBeNull();
			expect(state.error).toBe('Error message');
			expect(state.loading).toBe(false);
			expect(state.reset).toBeDefined();
		});

		it('should allow UseLoadingState with loading state', () => {
			const state: UseLoadingState<string> = {
				data: null,
				error: null,
				loading: true,
				reset: () => {
					// reset
				},
			};
			expect(state.data).toBeNull();
			expect(state.error).toBeNull();
			expect(state.loading).toBe(true);
			expect(state.reset).toBeDefined();
		});
	});

	describe('UseAsyncOperation', () => {
		it('should allow UseAsyncOperation with execute returning Promise<void>', () => {
			const operation: UseAsyncOperation<string> = {
				execute: async () => {
					// void
				},
				reset: () => {
					// reset
				},
			};
			expect(operation.execute).toBeDefined();
			expect(typeof operation.execute).toBe('function');
			expect(operation.reset).toBeDefined();
			expect(typeof operation.reset).toBe('function');
		});

		it('should allow UseAsyncOperation with execute returning Promise<T>', () => {
			const operation: UseAsyncOperation<string> = {
				execute: async () => {
					return 'result';
				},
				reset: () => {
					// reset
				},
			};
			expect(operation.execute).toBeDefined();
			expect(typeof operation.execute).toBe('function');
			expect(operation.reset).toBeDefined();
			expect(typeof operation.reset).toBe('function');
		});
	});

	describe('UseAsyncState', () => {
		it('should allow UseAsyncState combining loading state and operation', () => {
			const state: UseAsyncState<string> = {
				data: 'test',
				error: null,
				loading: false,
				execute: async () => {
					return 'result';
				},
				reset: () => {
					// reset
				},
			};
			expect(state.data).toBe('test');
			expect(state.error).toBeNull();
			expect(state.loading).toBe(false);
			expect(state.execute).toBeDefined();
			expect(typeof state.execute).toBe('function');
			expect(state.reset).toBeDefined();
			expect(typeof state.reset).toBe('function');
		});
	});

	describe('UseDependenciesOptions', () => {
		it('should allow UseDependenciesOptions with dependencies', () => {
			const options: UseDependenciesOptions = {
				dependencies: ['value1', 42, true],
			};
			expect(options.dependencies).toHaveLength(3);
		});

		it('should allow UseDependenciesOptions without dependencies', () => {
			const options: UseDependenciesOptions = {};
			expect(options).toBeDefined();
		});
	});

	describe('UseImmediateOptions', () => {
		it('should allow UseImmediateOptions with immediate true', () => {
			const options: UseImmediateOptions = {
				immediate: true,
			};
			expect(options.immediate).toBe(true);
		});

		it('should allow UseImmediateOptions with immediate false', () => {
			const options: UseImmediateOptions = {
				immediate: false,
			};
			expect(options.immediate).toBe(false);
		});

		it('should allow UseImmediateOptions without immediate', () => {
			const options: UseImmediateOptions = {};
			expect(options).toBeDefined();
		});
	});
});
