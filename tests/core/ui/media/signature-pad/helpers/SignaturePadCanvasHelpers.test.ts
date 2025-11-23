/**
 * SignaturePadCanvasHelpers Tests
 *
 * Tests for SignaturePadCanvas helper functions including:
 * - getCanvasStyle
 * - getCanvasProps
 * - normalizeProps
 * - Default constants
 */

import { designTokens } from '@core/constants/designTokens';
import {
	DEFAULT_BACKGROUND_COLOR,
	DEFAULT_CLEAR_BUTTON_TEXT,
	DEFAULT_HEIGHT,
	DEFAULT_MAX_WIDTH,
	DEFAULT_MIN_WIDTH,
	DEFAULT_PEN_COLOR,
	DEFAULT_THROTTLE,
	DEFAULT_VELOCITY_FILTER_WEIGHT,
	DEFAULT_WIDTH,
	DISABLED_OPACITY,
	getCanvasProps,
	getCanvasStyle,
	normalizeProps,
} from '@core/ui/media/signature-pad/helpers/SignaturePadCanvasHelpers';
import type { SignaturePadCanvasProps } from '@core/ui/media/signature-pad/types/SignaturePadTypes';
import { describe, expect, it, vi } from 'vitest';

describe('SignaturePadCanvasHelpers - Constants', () => {
	it('has correct default width', () => {
		expect(DEFAULT_WIDTH).toBe(500);
	});

	it('has correct default height', () => {
		expect(DEFAULT_HEIGHT).toBe(200);
	});

	it('has correct disabled opacity', () => {
		expect(DISABLED_OPACITY).toBe(0.5);
	});

	it('has correct default clear button text', () => {
		expect(DEFAULT_CLEAR_BUTTON_TEXT).toBe('Clear');
	});

	it('has correct default velocity filter weight', () => {
		expect(DEFAULT_VELOCITY_FILTER_WEIGHT).toBe(0.7);
	});

	it('has correct default min width', () => {
		expect(DEFAULT_MIN_WIDTH).toBe(0.5);
	});

	it('has correct default max width', () => {
		expect(DEFAULT_MAX_WIDTH).toBe(2.5);
	});

	it('has correct default throttle', () => {
		expect(DEFAULT_THROTTLE).toBe(16);
	});

	it('uses design tokens for default colors', () => {
		expect(DEFAULT_BACKGROUND_COLOR).toBe(designTokens.color.surface.DEFAULT);
		expect(DEFAULT_PEN_COLOR).toBe(designTokens.color.text.primary);
	});
});

describe('SignaturePadCanvasHelpers - getCanvasStyle', () => {
	it('returns correct style for enabled canvas', () => {
		const style = getCanvasStyle({
			backgroundColor: '#FFFFFF',
			disabled: false,
		});

		expect(style.border).toBe('1px solid');
		expect(style.borderColor).toBe('currentColor');
		expect(style.borderRadius).toBe('var(--radius-md)');
		expect(style.backgroundColor).toBe('#FFFFFF');
		expect(style.cursor).toBe('crosshair');
		expect(style.opacity).toBe(1);
	});

	it('returns correct style for disabled canvas', () => {
		const style = getCanvasStyle({
			backgroundColor: '#FFFFFF',
			disabled: true,
		});

		expect(style.cursor).toBe('not-allowed');
		expect(style.opacity).toBe(DISABLED_OPACITY);
	});

	it('handles custom background color', () => {
		const style = getCanvasStyle({
			backgroundColor: '#FF0000',
			disabled: false,
		});

		expect(style.backgroundColor).toBe('#FF0000');
	});
});

describe('SignaturePadCanvasHelpers - getCanvasProps', () => {
	it('returns correct props with all options', () => {
		const props = getCanvasProps({
			id: 'test-canvas',
			width: 600,
			height: 300,
			canvasClassName: 'custom-class',
			backgroundColor: '#FFFFFF',
			disabled: false,
		});

		expect(props.id).toBe('test-canvas');
		expect(props.width).toBe(600);
		expect(props.height).toBe(300);
		expect(props.className).toBe('custom-class');
		expect(props.style).toBeDefined();
		expect(props.style?.backgroundColor).toBe('#FFFFFF');
		expect(props.style?.cursor).toBe('crosshair');
	});

	it('handles undefined id', () => {
		const props = getCanvasProps({
			id: undefined,
			width: 500,
			height: 200,
			canvasClassName: undefined,
			backgroundColor: '#FFFFFF',
			disabled: false,
		});

		expect(props.id).toBeUndefined();
	});

	it('handles undefined className', () => {
		const props = getCanvasProps({
			id: 'test-canvas',
			width: 500,
			height: 200,
			canvasClassName: undefined,
			backgroundColor: '#FFFFFF',
			disabled: false,
		});

		expect(props.className).toBeUndefined();
	});

	it('includes disabled styles when disabled', () => {
		const props = getCanvasProps({
			id: 'test-canvas',
			width: 500,
			height: 200,
			canvasClassName: undefined,
			backgroundColor: '#FFFFFF',
			disabled: true,
		});

		expect(props.style?.cursor).toBe('not-allowed');
		expect(props.style?.opacity).toBe(DISABLED_OPACITY);
	});
});

describe('SignaturePadCanvasHelpers - normalizeProps', () => {
	it('normalizes props with defaults', () => {
		const props: SignaturePadCanvasProps = { id: 'test-canvas' };
		const normalized = normalizeProps(props);

		expect(normalized.width).toBe(DEFAULT_WIDTH);
		expect(normalized.height).toBe(DEFAULT_HEIGHT);
		expect(normalized.backgroundColor).toBe(DEFAULT_BACKGROUND_COLOR);
		expect(normalized.penColor).toBe(DEFAULT_PEN_COLOR);
		expect(normalized.velocityFilterWeight).toBe(DEFAULT_VELOCITY_FILTER_WEIGHT);
		expect(normalized.minWidth).toBe(DEFAULT_MIN_WIDTH);
		expect(normalized.maxWidth).toBe(DEFAULT_MAX_WIDTH);
		expect(normalized.throttle).toBe(DEFAULT_THROTTLE);
		expect(normalized.disabled).toBe(false);
		expect(normalized.showClearButton).toBe(true);
		expect(normalized.clearButtonText).toBe(DEFAULT_CLEAR_BUTTON_TEXT);
	});

	it('preserves provided props', () => {
		const onChange = vi.fn();
		const onClear = vi.fn();
		const props: SignaturePadCanvasProps = {
			id: 'custom-id',
			width: 600,
			height: 300,
			backgroundColor: '#FF0000',
			penColor: '#00FF00',
			velocityFilterWeight: 0.8,
			minWidth: 1,
			maxWidth: 3,
			throttle: 20,
			disabled: true,
			value: 'data:image/png;base64,test',
			defaultValue: 'data:image/png;base64,default',
			onChange,
			onClear,
			showClearButton: false,
			clearButtonText: 'Reset',
			canvasClassName: 'custom-canvas-class',
		};

		const normalized = normalizeProps(props);

		expect(normalized.id).toBe('custom-id');
		expect(normalized.width).toBe(600);
		expect(normalized.height).toBe(300);
		expect(normalized.backgroundColor).toBe('#FF0000');
		expect(normalized.penColor).toBe('#00FF00');
		expect(normalized.velocityFilterWeight).toBe(0.8);
		expect(normalized.minWidth).toBe(1);
		expect(normalized.maxWidth).toBe(3);
		expect(normalized.throttle).toBe(20);
		expect(normalized.disabled).toBe(true);
		expect(normalized.value).toBe('data:image/png;base64,test');
		expect(normalized.defaultValue).toBe('data:image/png;base64,default');
		expect(normalized.onChange).toBe(onChange);
		expect(normalized.onClear).toBe(onClear);
		expect(normalized.showClearButton).toBe(false);
		expect(normalized.clearButtonText).toBe('Reset');
		expect(normalized.canvasClassName).toBe('custom-canvas-class');
	});

	it('handles partial props', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			width: 800,
			height: 400,
		};

		const normalized = normalizeProps(props);

		expect(normalized.width).toBe(800);
		expect(normalized.height).toBe(400);
		expect(normalized.backgroundColor).toBe(DEFAULT_BACKGROUND_COLOR);
		expect(normalized.penColor).toBe(DEFAULT_PEN_COLOR);
	});

	it('handles null values', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			value: null,
			defaultValue: null,
		};

		const normalized = normalizeProps(props);

		expect(normalized.value).toBeNull();
		expect(normalized.defaultValue).toBeNull();
	});

	it('handles undefined optional callbacks', () => {
		const props: SignaturePadCanvasProps = { id: 'test-canvas' };

		const normalized = normalizeProps(props);

		expect(normalized.onChange).toBeUndefined();
		expect(normalized.onClear).toBeUndefined();
	});

	it('defaults showClearButton to true', () => {
		const props: SignaturePadCanvasProps = { id: 'test-canvas' };
		const normalized = normalizeProps(props);
		expect(normalized.showClearButton).toBe(true);
	});

	it('allows showClearButton to be false', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			showClearButton: false,
		};
		const normalized = normalizeProps(props);
		expect(normalized.showClearButton).toBe(false);
	});
});
