import { classNames, type ClassValue } from '@core/utils/classNames';
import { describe, expect, it } from 'vitest';

const FOO = 'foo';
const BAR = 'bar';
const BAZ = 'baz';

describe('string concatenation', () => {
	it('combines string classes', () => {
		expect(classNames(FOO, BAR)).toBe(`${FOO} ${BAR}`);
	});

	it('handles single string', () => {
		expect(classNames(FOO)).toBe(FOO);
	});

	it('handles multiple strings', () => {
		expect(classNames(FOO, BAR, BAZ)).toBe(`${FOO} ${BAR} ${BAZ}`);
	});

	it('handles empty string input', () => {
		expect(classNames('')).toBe('');
	});

	it('handles whitespace-only strings', () => {
		expect(classNames(FOO, '  ', '\t', BAR)).toBe(`${FOO} ${BAR}`);
	});

	it('trims whitespace from strings', () => {
		expect(classNames(`  ${FOO}  `, `  ${BAR}  `)).toBe(`${FOO} ${BAR}`);
	});
});

describe('conditional classes', () => {
	it('handles conditional classes with false', () => {
		const condition = false;
		expect(classNames(FOO, condition && BAR, BAZ)).toBe(`${FOO} ${BAZ}`);
	});

	it('handles conditional classes with true', () => {
		const condition = true;
		expect(classNames(FOO, condition && BAR, BAZ)).toBe(`${FOO} ${BAR} ${BAZ}`);
	});

	it('handles multiple conditional classes', () => {
		const isActive = true;
		const isDisabled = false;
		expect(classNames('button', isActive && 'active', isDisabled && 'disabled')).toBe(
			'button active'
		);
	});

	it('handles standalone boolean values', () => {
		expect(classNames(true, false, FOO)).toBe(FOO);
	});
});

describe('array handling', () => {
	it('handles arrays', () => {
		expect(classNames([FOO, BAR])).toBe(`${FOO} ${BAR}`);
	});

	it('handles empty array', () => {
		expect(classNames([])).toBe('');
	});

	it('handles array with mixed values', () => {
		expect(classNames([FOO, null, BAR, undefined, BAZ])).toBe(`${FOO} ${BAR} ${BAZ}`);
	});

	it('handles nested arrays', () => {
		expect(classNames([FOO, [BAR, BAZ]])).toBe(`${FOO} ${BAR} ${BAZ}`);
	});

	it('handles deeply nested arrays', () => {
		expect(classNames([FOO, [[BAR, BAZ]]])).toBe(`${FOO} ${BAR} ${BAZ}`);
	});

	it('handles array with objects', () => {
		expect(classNames([FOO, { [BAR]: true, [BAZ]: false }])).toBe(`${FOO} ${BAR}`);
	});

	it('handles multiple arrays', () => {
		expect(classNames([FOO, BAR], [BAZ, 'qux'])).toBe(`${FOO} ${BAR} ${BAZ} qux`);
	});
});

describe('object notation', () => {
	it('handles object with truthy values', () => {
		expect(classNames({ [FOO]: true, [BAR]: true })).toBe(`${FOO} ${BAR}`);
	});

	it('handles object with falsy values', () => {
		expect(classNames({ [FOO]: true, [BAR]: false })).toBe(FOO);
	});

	it('handles object with null values', () => {
		expect(classNames({ [FOO]: true, [BAR]: null })).toBe(FOO);
	});

	it('handles object with undefined values', () => {
		expect(classNames({ [FOO]: true, [BAR]: undefined })).toBe(FOO);
	});

	it('handles empty object', () => {
		expect(classNames({})).toBe('');
	});

	it('handles object with all falsy values', () => {
		expect(classNames({ [FOO]: false, [BAR]: null, [BAZ]: undefined })).toBe('');
	});
});

describe('falsy values', () => {
	it('filters out falsy values', () => {
		expect(classNames(FOO, null, undefined, '', 0, false, BAR)).toBe(`${FOO} ${BAR}`);
	});

	it('handles only falsy values', () => {
		expect(classNames(null, undefined, false, '', 0)).toBe('');
	});

	it('handles null', () => {
		expect(classNames(FOO, null, BAR)).toBe(`${FOO} ${BAR}`);
	});

	it('handles undefined', () => {
		expect(classNames(FOO, undefined, BAR)).toBe(`${FOO} ${BAR}`);
	});

	it('handles zero', () => {
		expect(classNames(FOO, 0, BAR)).toBe(`${FOO} ${BAR}`);
	});

	it('handles NaN', () => {
		expect(classNames(FOO, Number.NaN, BAR)).toBe(`${FOO} ${BAR}`);
	});
});

describe('number handling', () => {
	it('handles positive numbers', () => {
		expect(classNames(FOO, 42, BAR)).toBe(`${FOO} 42 ${BAR}`);
	});

	it('handles negative numbers', () => {
		expect(classNames(FOO, -42, BAR)).toBe(`${FOO} -42 ${BAR}`);
	});

	it('handles zero (filtered out)', () => {
		expect(classNames(FOO, 0, BAR)).toBe(`${FOO} ${BAR}`);
	});

	it('handles decimal numbers', () => {
		expect(classNames(FOO, 3.14, BAR)).toBe(`${FOO} 3.14 ${BAR}`);
	});
});

describe('mixed inputs', () => {
	it('handles mixed string, object, and array', () => {
		expect(classNames(FOO, { [BAR]: true, [BAZ]: false }, ['qux'])).toBe(`${FOO} ${BAR} qux`);
	});

	it('handles complex mixed scenario', () => {
		expect(
			classNames('base', { active: true, disabled: false }, ['nested', 'classes'], null, 'final')
		).toBe('base active nested classes final');
	});

	it('handles conditional with object and array', () => {
		const isActive = true;
		expect(classNames('button', isActive && 'active', { primary: true }, ['large'])).toBe(
			'button active primary large'
		);
	});
});

describe('edge cases', () => {
	it('handles no arguments', () => {
		expect(classNames()).toBe('');
	});

	it('handles only whitespace strings', () => {
		expect(classNames('   ', '\t', '\n')).toBe('');
	});

	it('handles string with only whitespace and valid classes', () => {
		expect(classNames('  ', FOO, '  ', BAR)).toBe(`${FOO} ${BAR}`);
	});

	it('handles object with inherited properties', () => {
		// Create object with own and inherited properties
		const parent = { inherited: true };
		const child = Object.create(parent);
		child.own = true;
		// classNames should only include own properties
		expect(classNames(child)).toBe('own');
	});

	it('handles array with empty strings', () => {
		expect(classNames([FOO, '', BAR, '   '])).toBe(`${FOO} ${BAR}`);
	});

	it('handles array with all falsy values', () => {
		expect(classNames([null, undefined, false, '', 0])).toBe('');
	});
});

describe('performance with large inputs', () => {
	it('handles large number of strings', () => {
		const classes = Array.from({ length: 1000 }, (_, i) => `class-${i}`);
		const result = classNames(...classes);
		expect(result.split(' ').length).toBe(1000);
		expect(result).toContain('class-0');
		expect(result).toContain('class-999');
	});

	it('handles large array', () => {
		const classes = Array.from({ length: 1000 }, (_, i) => `class-${i}`);
		const result = classNames(classes);
		expect(result.split(' ').length).toBe(1000);
	});

	it('handles large object', () => {
		const obj: Record<string, boolean> = {};
		for (let i = 0; i < 1000; i++) {
			obj[`class-${i}`] = i % 2 === 0;
		}
		const result = classNames(obj);
		expect(result.split(' ').length).toBe(500); // Only truthy values
	});

	it('handles deeply nested arrays efficiently', () => {
		const nested: ClassValue[] = [];
		let current = nested;
		for (let i = 0; i < 100; i++) {
			current.push(`class-${i}`);
			const next: ClassValue[] = [];
			current.push(next);
			current = next;
		}
		const result = classNames(nested);
		expect(result.split(' ').length).toBe(100);
	});
});

describe('real-world scenarios', () => {
	it('handles typical React className pattern', () => {
		const baseClass = 'button';
		const variant = 'primary';
		const size = 'large';
		const isDisabled = false;
		const isActive = true;

		expect(
			classNames(baseClass, `button-${variant}`, `button-${size}`, {
				'button-disabled': isDisabled,
				'button-active': isActive,
			})
		).toBe('button button-primary button-large button-active');
	});

	it('handles conditional styling based on state', () => {
		const isLoading = true;
		const hasError = false;
		const isSuccess = false;

		expect(
			classNames('status', {
				loading: isLoading,
				error: hasError,
				success: isSuccess,
			})
		).toBe('status loading');
	});

	it('handles responsive class names', () => {
		expect(
			classNames('grid', ['col-12', 'md:col-6', 'lg:col-4'], {
				'gap-4': true,
				'gap-8': false,
			})
		).toBe('grid col-12 md:col-6 lg:col-4 gap-4');
	});
});
