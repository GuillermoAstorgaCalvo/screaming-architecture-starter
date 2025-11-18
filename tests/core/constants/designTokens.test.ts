import {
	type DesignTokens,
	designTokens,
	mergeDesignTokens,
	type PartialDesignTokens,
} from '@core/constants/designTokens';
import { describe, expect, expectTypeOf, it } from 'vitest';

const asPartial = <T>(overrides: T) => overrides as unknown as PartialDesignTokens;

describe('designTokens definitions', () => {
	it('exposes the expected top-level token groups', () => {
		expect(Object.keys(designTokens)).toEqual([
			'color',
			'radius',
			'spacing',
			'shadow',
			'typography',
			'zIndex',
			'transition',
			'animation',
			'opacity',
			'borderWidth',
			'backdropBlur',
			'filterBlur',
			'componentSize',
			'breakpoint',
		]);
	});
});

describe('designTokens critical token values', () => {
	it('defines the primary color token set', () => {
		expect(designTokens.color.primary).toStrictEqual({
			DEFAULT: '#2dd4ff',
			foreground: '#01060f',
			light: '#67e8f9',
			dark: '#0284c7',
		});
	});

	it('exposes the radius scale', () => {
		expect(designTokens.radius).toMatchObject({
			none: '0',
			sm: '0.375rem',
			md: '0.625rem',
			lg: '0.875rem',
			xl: '1.25rem',
			'2xl': '1.75rem',
			full: '9999px',
		});
	});

	it('defines the spacing scale', () => {
		expect(designTokens.spacing).toMatchObject({
			xs: 4,
			sm: 8,
			md: 12,
			lg: 16,
			xl: 24,
			'2xl': 32,
			'3xl': 48,
			'4xl': 64,
		});
	});

	it('defines button component sizes', () => {
		expect(designTokens.componentSize.button).toMatchObject({
			sm: '36px',
			md: '48px',
			lg: '56px',
		});
	});
});

describe('designTokens typography scale', () => {
	it('keeps the sans font stack in sync', () => {
		expect(designTokens.typography.fontFamily.sans).toBe(
			[
				'Space Grotesk',
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'Segoe UI',
				'Roboto',
				'Helvetica',
				'Arial',
				'sans-serif',
			].join(', ')
		);
	});

	it('exposes the xl font size tuple', () => {
		expect(designTokens.typography.fontSize.xl).toEqual([
			'1.35rem',
			{ lineHeight: '2rem', letterSpacing: '-0.005em' },
		]);
	});

	it('captures the font-weight scale', () => {
		expect(designTokens.typography.fontWeight).toMatchObject({
			normal: '400',
			medium: '500',
			semibold: '600',
			bold: '700',
		});
	});
});

describe('mergeDesignTokens color overrides', () => {
	it('overrides nested color tokens without mutating defaults', () => {
		const merged = mergeDesignTokens(
			asPartial({
				color: {
					primary: {
						DEFAULT: '#ffffff',
						dark: '#123456',
					},
				},
			})
		);

		expect(merged.color.primary).toMatchObject({
			DEFAULT: '#ffffff',
			dark: '#123456',
			foreground: designTokens.color.primary.foreground,
			light: designTokens.color.primary.light,
		});

		expect(designTokens.color.primary.DEFAULT).toBe('#2dd4ff');
	});
});

describe('mergeDesignTokens typography overrides', () => {
	it('overrides typography weights without mutating defaults', () => {
		const merged = mergeDesignTokens(
			asPartial({
				typography: {
					fontWeight: {
						bold: '900',
					},
				},
			})
		);

		expect(merged.typography.fontWeight).toMatchObject({
			normal: '400',
			medium: '500',
			semibold: '600',
			bold: '900',
		});

		expect(designTokens.typography.fontWeight.bold).toBe('700');
	});
});

describe('mergeDesignTokens structured overrides', () => {
	it('replaces array-based tokens when overridden', () => {
		const customTuple = ['1.1rem', { lineHeight: '1.7rem', letterSpacing: '0.015em' }] as const;

		const merged = mergeDesignTokens(
			asPartial({
				typography: {
					fontSize: {
						base: customTuple,
					},
				},
			})
		);

		expect(merged.typography.fontSize.base).toEqual(customTuple);
		expect(designTokens.typography.fontSize.base).toEqual([
			'1rem',
			{ lineHeight: '1.6rem', letterSpacing: '0.01em' },
		]);
	});
});

describe('mergeDesignTokens typing guarantees', () => {
	it('preserves typing guarantees for downstream consumers', () => {
		const merged = mergeDesignTokens(
			asPartial({
				color: { success: { DEFAULT: '#00ff00' } },
			})
		);

		expectTypeOf(merged).toEqualTypeOf<DesignTokens>();
	});
});
