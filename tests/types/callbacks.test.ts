import type {
	AsyncCallback,
	Callback,
	ComparatorCallback,
	CompleteCallback,
	ErrorCallback,
	ErrorHandlingCallback,
	FilterCallback,
	MapCallback,
	MaybeCallback,
	NoArgsCallback,
	NullableCallback,
	OptionalCallback,
	PredicateCallback,
	ReduceCallback,
	SingleArgCallback,
	SuccessCallback,
	SyncCallback,
	TransformCallback,
	TwoArgCallback,
} from '@src-types/callbacks';
import { describe, expect, it } from 'vitest';

const TEST_STRING = 'test';
const TEST_NUMBER = 5;
const TEST_RESULT = 10;

describe('callbacks types', () => {
	describe('AsyncCallback', () => {
		it('should accept async function with no args', async () => {
			const callback: AsyncCallback<[], string> = async () => TEST_STRING;
			const result = await callback();
			expect(result).toBe(TEST_STRING);
		});

		it('should accept async function with args', async () => {
			const callback: AsyncCallback<[number, string], number> = async (a, b) => a + b.length;
			const result = await callback(5, 'hello');
			expect(result).toBe(10);
		});

		it('should accept async function returning void', async () => {
			const callback: AsyncCallback<[], void> = async () => {
				// void
			};
			await callback();
			// Type system ensures void return type
		});
	});

	describe('SyncCallback', () => {
		it('should accept sync function with no args', () => {
			const callback: SyncCallback<[], string> = () => TEST_STRING;
			const result = callback();
			expect(result).toBe(TEST_STRING);
		});

		it('should accept sync function with args', () => {
			const callback: SyncCallback<[number, string], number> = (a, b) => a + b.length;
			const result = callback(5, 'hello');
			expect(result).toBe(10);
		});

		it('should accept sync function returning void', () => {
			const callback: SyncCallback<[], void> = () => {
				// void
			};
			callback();
			// Type system ensures void return type
		});
	});

	describe('Callback', () => {
		it('should accept async callback', async () => {
			const callback: Callback<[], string> = async () => 'async';
			const result = await callback();
			expect(result).toBe('async');
		});

		it('should accept sync callback', () => {
			const callback: Callback<[], string> = () => 'sync';
			const result = callback();
			expect(result).toBe('sync');
		});
	});

	describe('NoArgsCallback', () => {
		it('should accept function with no args', () => {
			const callback: NoArgsCallback<string> = () => TEST_STRING;
			const result = callback();
			expect(result).toBe(TEST_STRING);
		});

		it('should accept NoArgsCallback returning void', () => {
			const callback: NoArgsCallback<void> = () => {
				// void
			};
			callback();
			// Type system ensures void return type
		});
	});

	describe('SingleArgCallback', () => {
		it('should accept function with single arg', () => {
			const callback: SingleArgCallback<number, number> = x => x * 2;
			const result = callback(TEST_NUMBER);
			expect(result).toBe(TEST_RESULT);
		});

		it('should accept SingleArgCallback returning void', () => {
			const callback: SingleArgCallback<string, void> = _str => {
				// void
			};
			callback(TEST_STRING);
			// Type system ensures void return type
		});
	});

	describe('TwoArgCallback', () => {
		it('should accept function with two args', () => {
			const callback: TwoArgCallback<number, string, number> = (a, b) => a + b.length;
			const result = callback(5, 'hello');
			expect(result).toBe(10);
		});

		it('should accept TwoArgCallback returning void', () => {
			const callback: TwoArgCallback<string, number, void> = (_str, _num) => {
				// void
			};
			callback(TEST_STRING, 42);
			// Type system ensures void return type
		});
	});

	describe('OptionalCallback', () => {
		it('should accept OptionalCallback function', () => {
			const callback: OptionalCallback<[number], number> = x => x * 2;
			const result = callback(TEST_NUMBER);
			expect(result).toBe(TEST_RESULT);
		});

		it('should accept undefined', () => {
			const callback: OptionalCallback<[number], number> = undefined;
			expect(callback).toBeUndefined();
		});
	});

	describe('NullableCallback', () => {
		it('should accept NullableCallback function', () => {
			const callback: NullableCallback<[number], number> = x => x * 2;
			const result = callback(TEST_NUMBER);
			expect(result).toBe(TEST_RESULT);
		});

		it('should accept null', () => {
			const callback: NullableCallback<[number], number> = null;
			expect(callback).toBeNull();
		});
	});

	describe('MaybeCallback', () => {
		it('should accept MaybeCallback function', () => {
			const callback: MaybeCallback<[number], number> = x => x * 2;
			const result = callback(TEST_NUMBER);
			expect(result).toBe(TEST_RESULT);
		});

		it('should accept null', () => {
			const callback: MaybeCallback<[number], number> = null;
			expect(callback).toBeNull();
		});

		it('should accept undefined', () => {
			const callback: MaybeCallback<[number], number> = undefined;
			expect(callback).toBeUndefined();
		});
	});

	describe('ErrorHandlingCallback', () => {
		it('should accept sync function', () => {
			const callback: ErrorHandlingCallback<[number], number> = x => x * 2;
			const result = callback(TEST_NUMBER);
			expect(result).toBe(TEST_RESULT);
		});

		it('should accept async function', async () => {
			const callback: ErrorHandlingCallback<[number], number> = async x => x * 2;
			const result = await callback(TEST_NUMBER);
			expect(result).toBe(TEST_RESULT);
		});
	});

	describe('SuccessCallback', () => {
		it('should accept function with data parameter', () => {
			const callback: SuccessCallback<string> = data => {
				expect(data).toBe('success');
			};
			callback('success');
		});

		it('should accept function with void return', () => {
			const callback: SuccessCallback<number> = data => {
				expect(data).toBe(42);
			};
			callback(42);
		});
	});

	describe('ErrorCallback', () => {
		it('should accept function with error parameter', () => {
			const callback: ErrorCallback<Error> = error => {
				expect(error).toBeInstanceOf(Error);
			};
			callback(new Error('test'));
		});

		it('should accept function with string error', () => {
			const callback: ErrorCallback<string> = error => {
				expect(error).toBe('error message');
			};
			callback('error message');
		});
	});

	describe('CompleteCallback', () => {
		it('should accept function with no parameters', () => {
			const callback: CompleteCallback = () => {
				// complete
			};
			callback();
		});
	});

	describe('TransformCallback', () => {
		it('should accept transform function', () => {
			const callback: TransformCallback<number, string> = String;
			const result = callback(42);
			expect(result).toBe('42');
		});
	});

	describe('PredicateCallback', () => {
		it('should accept predicate function', () => {
			const callback: PredicateCallback<number> = value => value > 0;
			expect(callback(5)).toBe(true);
			expect(callback(-5)).toBe(false);
		});
	});

	describe('FilterCallback', () => {
		it('should accept filter function', () => {
			const callback: FilterCallback<number> = value => value > 0;
			expect(callback(5)).toBe(true);
			expect(callback(-5)).toBe(false);
		});
	});

	describe('MapCallback', () => {
		it('should accept map function', () => {
			const callback: MapCallback<number, string> = String;
			const result = callback(42);
			expect(result).toBe('42');
		});
	});

	describe('ReduceCallback', () => {
		it('should accept reduce function', () => {
			const callback: ReduceCallback<number, number> = (acc, curr) => acc + curr;
			const result = callback(10, 5);
			expect(result).toBe(15);
		});

		it('should accept reduce function with index', () => {
			const callback: ReduceCallback<number, number> = (acc, curr, index) =>
				acc + curr + (index ?? 0);
			const result = callback(10, 5, 0);
			expect(result).toBe(15);
		});
	});

	describe('ComparatorCallback', () => {
		it('should accept comparator function returning negative', () => {
			const callback: ComparatorCallback<number> = (a, b) => a - b;
			expect(callback(1, 2)).toBeLessThan(0);
		});

		it('should accept comparator function returning positive', () => {
			const callback: ComparatorCallback<number> = (a, b) => a - b;
			expect(callback(2, 1)).toBeGreaterThan(0);
		});

		it('should accept comparator function returning zero', () => {
			const callback: ComparatorCallback<number> = (a, b) => a - b;
			expect(callback(1, 1)).toBe(0);
		});
	});
});
