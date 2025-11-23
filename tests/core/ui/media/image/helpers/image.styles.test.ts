/**
 * Image Styles Helper Tests
 *
 * Tests for the image style helper functions including:
 * - createImageClasses
 * - createImageStyle
 */

import { createImageClasses, createImageStyle } from '@core/ui/media/image/helpers/image.styles';
import { describe, expect, it } from 'vitest';

describe('createImageClasses', () => {
	it('returns base transition classes', () => {
		const classes = createImageClasses({ isLoading: false });
		expect(classes).toContain('transition-opacity');
		expect(classes).toContain('duration-slow');
	});

	it('applies opacity-0 when loading', () => {
		const classes = createImageClasses({ isLoading: true });
		expect(classes).toContain('opacity-0');
		expect(classes).not.toContain('opacity-100');
	});

	it('applies opacity-100 when not loading', () => {
		const classes = createImageClasses({ isLoading: false });
		expect(classes).toContain('opacity-100');
		expect(classes).not.toContain('opacity-0');
	});

	it('merges custom className', () => {
		const classes = createImageClasses({
			isLoading: false,
			className: 'custom-class',
		});
		expect(classes).toContain('custom-class');
		expect(classes).toContain('opacity-100');
		expect(classes).toContain('transition-opacity');
	});

	it('filters out empty className', () => {
		const classes = createImageClasses({
			isLoading: false,
			className: undefined,
		});
		expect(classes).not.toContain('undefined');
		expect(classes).not.toContain('null');
	});

	it('handles empty string className', () => {
		const classes = createImageClasses({
			isLoading: false,
			className: '',
		});
		expect(classes).toContain('transition-opacity');
		expect(classes).toContain('duration-slow');
		expect(classes).toContain('opacity-100');
	});
});

describe('createImageStyle', () => {
	it('returns style with width and height', () => {
		const style = createImageStyle({
			width: 400,
			height: 300,
			objectFit: 'cover',
		});
		expect(style).toEqual({
			width: 400,
			height: 300,
			objectFit: 'cover',
		});
	});

	it('returns style with string width and height', () => {
		const style = createImageStyle({
			width: '100%',
			height: 'auto',
			objectFit: 'cover',
		});
		expect(style).toEqual({
			width: '100%',
			height: 'auto',
			objectFit: 'cover',
		});
	});

	it('returns style with objectFit', () => {
		const style = createImageStyle({
			objectFit: 'contain',
		});
		expect(style).toEqual({
			objectFit: 'contain',
		});
	});

	it('merges custom style', () => {
		const style = createImageStyle({
			width: 400,
			height: 300,
			objectFit: 'cover',
			style: { border: '1px solid red' },
		});
		expect(style).toEqual({
			width: 400,
			height: 300,
			objectFit: 'cover',
			border: '1px solid red',
		});
	});

	it('custom style overrides width, height, and objectFit', () => {
		const style = createImageStyle({
			width: 400,
			height: 300,
			objectFit: 'cover',
			style: {
				width: 500,
				height: 400,
				objectFit: 'contain',
			},
		});
		expect(style).toEqual({
			width: 500,
			height: 400,
			objectFit: 'contain',
		});
	});

	it('handles undefined width and height', () => {
		const style = createImageStyle({
			objectFit: 'cover',
		});
		expect(style).toEqual({
			objectFit: 'cover',
		});
	});

	it('handles undefined style', () => {
		const style = createImageStyle({
			width: 400,
			height: 300,
			objectFit: 'cover',
			style: undefined,
		});
		expect(style).toEqual({
			width: 400,
			height: 300,
			objectFit: 'cover',
		});
	});
});
