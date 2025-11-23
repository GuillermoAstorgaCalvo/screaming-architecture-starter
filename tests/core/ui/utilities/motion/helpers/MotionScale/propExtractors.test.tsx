/**
 * Tests for propExtractors helper
 *
 * Tests the prop extraction functions:
 * - Render props extraction
 * - Rest props extraction
 * - Prop filtering
 */

import {
	extractRenderProps,
	extractRestProps,
} from '@core/ui/utilities/motion/helpers/MotionScale/propExtractors';
import { describe, expect, it, vi } from 'vitest';

const TEST_CLASS = 'test-class';
const TEST_ID = 'test';
const TEST_ID_VALUE = 'test-id';
const TEST_LABEL = 'Test';
const DATA_TESTID = 'data-testid';

describe('extractRenderProps', () => {
	it('extracts className and children', () => {
		const props = {
			className: TEST_CLASS,
			children: <div>{TEST_LABEL}</div>,
			initialScale: 0.9,
			finalScale: 1,
		};

		const view = extractRenderProps(props as any);

		expect(view).toEqual({
			className: TEST_CLASS,
			children: props.children,
		});
	});

	it('handles undefined className', () => {
		const props = {
			children: <div>{TEST_LABEL}</div>,
			initialScale: 0.9,
		};

		const view = extractRenderProps(props as any);

		expect(view).toEqual({
			className: undefined,
			children: props.children,
		});
	});

	it('handles undefined children', () => {
		const props = {
			className: TEST_CLASS,
			initialScale: 0.9,
		};

		const view = extractRenderProps(props as any);

		expect(view).toEqual({
			className: TEST_CLASS,
			children: undefined,
		});
	});

	it('handles both undefined', () => {
		const props = {
			initialScale: 0.9,
		};

		const view = extractRenderProps(props as any);

		expect(view).toEqual({
			className: undefined,
			children: undefined,
		});
	});
});

describe('extractRestProps - prop removal', () => {
	it('removes render props', () => {
		const props = {
			className: TEST_CLASS,
			children: <div>{TEST_LABEL}</div>,
			[DATA_TESTID]: TEST_ID,
		};

		const restProps = extractRestProps(props as any);

		expect(restProps).not.toHaveProperty('className');
		expect(restProps).not.toHaveProperty('children');
		expect(restProps).toHaveProperty(DATA_TESTID, TEST_ID);
	});

	it('removes scale props', () => {
		const props = {
			initialScale: 0.9,
			finalScale: 1,
			duration: 'normal',
			ease: 'ease-out',
			delay: 0,
			[DATA_TESTID]: TEST_ID,
		};

		const restProps = extractRestProps(props as any);

		expect(restProps).not.toHaveProperty('initialScale');
		expect(restProps).not.toHaveProperty('finalScale');
		expect(restProps).not.toHaveProperty('duration');
		expect(restProps).not.toHaveProperty('ease');
		expect(restProps).not.toHaveProperty('delay');
		expect(restProps).toHaveProperty(DATA_TESTID, TEST_ID);
	});
});

describe('extractRestProps - gesture props', () => {
	it('removes gesture props', () => {
		const props = {
			initial: false,
			layout: true,
			layoutId: TEST_ID_VALUE,
			whileHover: { scale: 1.1 },
			whileTap: { scale: 0.9 },
			drag: true,
			dragConstraints: { left: 0, right: 100 },
			dragElastic: 0.2,
			dragMomentum: false,
			dragTransition: { type: 'spring' },
			onDragStart: vi.fn(),
			onDragEnd: vi.fn(),
			[DATA_TESTID]: TEST_ID,
		};

		const restProps = extractRestProps(props as any);

		expect(restProps).not.toHaveProperty('initial');
		expect(restProps).not.toHaveProperty('layout');
		expect(restProps).not.toHaveProperty('layoutId');
		expect(restProps).not.toHaveProperty('whileHover');
		expect(restProps).not.toHaveProperty('whileTap');
		expect(restProps).not.toHaveProperty('drag');
		expect(restProps).not.toHaveProperty('dragConstraints');
		expect(restProps).not.toHaveProperty('dragElastic');
		expect(restProps).not.toHaveProperty('dragMomentum');
		expect(restProps).not.toHaveProperty('dragTransition');
		expect(restProps).not.toHaveProperty('onDragStart');
		expect(restProps).not.toHaveProperty('onDragEnd');
		expect(restProps).toHaveProperty(DATA_TESTID, TEST_ID);
	});
});

describe('extractRestProps - prop preservation', () => {
	it('preserves additional props', () => {
		const props = {
			initialScale: 0.9,
			[DATA_TESTID]: TEST_ID,
			'aria-label': TEST_LABEL,
			id: TEST_ID_VALUE,
			role: 'button',
		};

		const restProps = extractRestProps(props as any);

		expect(restProps).toEqual({
			[DATA_TESTID]: TEST_ID,
			'aria-label': TEST_LABEL,
			id: TEST_ID_VALUE,
			role: 'button',
		});
	});
});

describe('extractRestProps - edge cases', () => {
	it('handles empty props', () => {
		const props = {
			initialScale: 0.9,
		};

		const restProps = extractRestProps(props as any);

		expect(restProps).toEqual({});
	});

	it('handles props with only render props', () => {
		const props = {
			className: TEST_CLASS,
			children: <div>{TEST_LABEL}</div>,
		};

		const restProps = extractRestProps(props as any);

		expect(restProps).toEqual({});
	});

	it('handles props with only scale props', () => {
		const props = {
			initialScale: 0.9,
			finalScale: 1,
			duration: 'normal',
		};

		const restProps = extractRestProps(props as any);

		expect(restProps).toEqual({});
	});

	it('handles props with only gesture props', () => {
		const props = {
			initial: false,
			layout: true,
			drag: true,
		};

		const restProps = extractRestProps(props as any);

		expect(restProps).toEqual({});
	});
});
