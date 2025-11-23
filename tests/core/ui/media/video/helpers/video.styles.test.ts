/**
 * Video Styles Tests
 *
 * Tests for the video style helper functions including:
 * - createVideoClasses
 * - createVideoStyle
 */

import { createVideoClasses, createVideoStyle } from '@core/ui/media/video/helpers/video.styles';
import { describe, expect, it } from 'vitest';

describe('createVideoClasses', () => {
	it('returns base classes with opacity-0 when loading', () => {
		const result = createVideoClasses({ isLoading: true });
		expect(result).toContain('transition-opacity');
		expect(result).toContain('duration-slow');
		expect(result).toContain('opacity-0');
		expect(result).not.toContain('opacity-100');
	});

	it('returns base classes with opacity-100 when not loading', () => {
		const result = createVideoClasses({ isLoading: false });
		expect(result).toContain('transition-opacity');
		expect(result).toContain('duration-slow');
		expect(result).toContain('opacity-100');
		expect(result).not.toContain('opacity-0');
	});

	it('includes custom className when provided', () => {
		const result = createVideoClasses({ isLoading: false, className: 'custom-class' });
		expect(result).toContain('custom-class');
		expect(result).toContain('transition-opacity');
		expect(result).toContain('duration-slow');
		expect(result).toContain('opacity-100');
	});

	it('filters out falsy values', () => {
		const result = createVideoClasses({ isLoading: false, className: undefined });
		expect(result).not.toContain('undefined');
		expect(result).not.toContain('null');
	});

	it('handles empty className', () => {
		const result = createVideoClasses({ isLoading: false, className: '' });
		expect(result).toContain('transition-opacity');
		expect(result).toContain('duration-slow');
		expect(result).toContain('opacity-100');
	});

	it('handles multiple class names', () => {
		const result = createVideoClasses({
			isLoading: true,
			className: 'class1 class2',
		});
		expect(result).toContain('class1');
		expect(result).toContain('class2');
		expect(result).toContain('opacity-0');
	});
});

describe('createVideoStyle', () => {
	it('returns style with width and height', () => {
		const result = createVideoStyle({
			width: 800,
			height: 600,
			objectFit: 'contain',
		});
		expect(result).toEqual({
			width: 800,
			height: 600,
			objectFit: 'contain',
		});
	});

	it('returns style with string dimensions', () => {
		const result = createVideoStyle({
			width: '100%',
			height: 'auto',
			objectFit: 'cover',
		});
		expect(result).toEqual({
			width: '100%',
			height: 'auto',
			objectFit: 'cover',
		});
	});

	it('merges custom style with base style', () => {
		const customStyle = { border: '1px solid red', padding: '10px' };
		const result = createVideoStyle({
			width: 800,
			height: 600,
			objectFit: 'contain',
			style: customStyle,
		});
		expect(result).toEqual({
			width: 800,
			height: 600,
			objectFit: 'contain',
			border: '1px solid red',
			padding: '10px',
		});
	});

	it('overrides base style with custom style when conflicts exist', () => {
		const customStyle: React.CSSProperties = { width: '50%', objectFit: 'fill' };
		const result = createVideoStyle({
			width: 800,
			height: 600,
			objectFit: 'contain',
			style: customStyle,
		});
		expect(result).toEqual({
			width: '50%',
			height: 600,
			objectFit: 'fill',
		});
	});

	it('handles undefined width and height', () => {
		const result = createVideoStyle({
			objectFit: 'contain',
		});
		expect(result).toEqual({
			width: undefined,
			height: undefined,
			objectFit: 'contain',
		});
	});

	it('handles undefined style', () => {
		const result = createVideoStyle({
			width: 800,
			height: 600,
			objectFit: 'contain',
			style: undefined,
		});
		expect(result).toEqual({
			width: 800,
			height: 600,
			objectFit: 'contain',
		});
	});

	it('handles all objectFit values', () => {
		const objectFits = ['contain', 'cover', 'fill', 'none', 'scale-down'] as const;
		for (const objectFit of objectFits) {
			const result = createVideoStyle({
				objectFit,
			});
			expect(result.objectFit).toBe(objectFit);
		}
	});
});
