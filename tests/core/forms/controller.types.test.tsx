/**
 * Tests for Controller type exports
 */

import type {
	ControllerFieldState,
	ControllerProps,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	Path,
	PathValue,
	UseControllerProps,
	UseControllerReturn,
} from '@core/forms/controller';
import { describe, expect, it } from 'vitest';

import type { TestFormData } from './controller.test-helpers';

// Helper functions for type export tests
function testControllerFieldStateType() {
	const fieldState: ControllerFieldState = {
		invalid: false,
		isTouched: false,
		isDirty: false,
		isValidating: false,
	};
	expect(fieldState).toBeDefined();
}

function testControllerPropsType() {
	const props: ControllerProps<TestFormData, 'name'> = {
		name: 'name',
		control: {} as any,
		render: () => <input />,
	};
	expect(props).toBeDefined();
}

function testControllerRenderPropsType() {
	const renderFn = (_props: ControllerRenderProps<TestFormData, 'name'>) => <input />;
	expect(renderFn).toBeDefined();
}

function testFieldPathType() {
	const path: FieldPath<TestFormData> = 'name';
	expect(path).toBeDefined();
}

function testFieldValuesType() {
	const values: FieldValues = {};
	expect(values).toBeDefined();
}

function testPathType() {
	const path: Path<TestFormData> = 'name';
	expect(path).toBeDefined();
}

function testPathValueType() {
	const value: PathValue<TestFormData, 'name'> = 'test';
	expect(value).toBeDefined();
}

function testUseControllerPropsType() {
	const props: UseControllerProps<TestFormData, 'name'> = {
		name: 'name',
		control: {} as any,
	};
	expect(props).toBeDefined();
}

function testUseControllerReturnType() {
	const returnValue: UseControllerReturn<TestFormData, 'name'> = {
		field: {
			onChange: () => {},
			onBlur: () => {},
			value: '',
			name: 'name',
			ref: () => {},
		},
		fieldState: {
			invalid: false,
			isTouched: false,
			isDirty: false,
			isValidating: false,
		},
		formState: {} as any,
	};
	expect(returnValue).toBeDefined();
}

describe('Controller - type exports', () => {
	it('exports ControllerFieldState type', testControllerFieldStateType);
	it('exports ControllerProps type', testControllerPropsType);
	it('exports ControllerRenderProps type', testControllerRenderPropsType);
	it('exports FieldPath type', testFieldPathType);
	it('exports FieldValues type', testFieldValuesType);
	it('exports Path type', testPathType);
	it('exports PathValue type', testPathValueType);
	it('exports UseControllerProps type', testUseControllerPropsType);
	it('exports UseControllerReturn type', testUseControllerReturnType);
});
