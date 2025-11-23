import {
	buildAbsoluteUrl,
	buildCanonicalUrl,
	buildOgImageUrl,
	buildPageTitle,
	buildRobotsContent,
	buildTwitterImageUrl,
	getDefaultSEO,
	mergeSEOConfig,
} from '@core/config/seo';
import i18n from '@core/i18n/i18n';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_TITLE = 'Screaming Architecture Starter';
const DEFAULT_DESCRIPTION = 'A modern, scalable React application starter template';
const LANDING_FULL_TITLE = `Landing | ${DEFAULT_TITLE}`;
const DOCS_FULL_TITLE = `Docs | ${DEFAULT_TITLE}`;

type TranslatorParams = Parameters<typeof i18n.t>;
type TranslatorReturn = ReturnType<typeof i18n.t>;

function defaultTranslatorImplementation(...args: TranslatorParams): TranslatorReturn {
	const [keyOrTemplate, options] = args;
	const defaultValue = (options as { defaultValue?: string } | undefined)?.defaultValue;

	if (typeof keyOrTemplate === 'string') {
		return (defaultValue ?? keyOrTemplate) as TranslatorReturn;
	}

	return (defaultValue ?? String(keyOrTemplate)) as TranslatorReturn;
}

vi.mock('@core/i18n/i18n', () => {
	const translator = vi.fn(defaultTranslatorImplementation);
	return {
		__esModule: true,
		default: {
			isInitialized: true,
			t: translator,
		},
	};
});

const mockedI18n = vi.mocked(i18n);

const originalWindow = globalThis.window;

const restoreWindow = () => {
	Reflect.set(globalThis, 'window', originalWindow);
};

const getOrigin = () => globalThis.window?.location.origin ?? '';

describe('core/config/seo', () => {
	beforeEach(() => {
		mockedI18n.isInitialized = true;
		mockedI18n.t.mockReset();
		mockedI18n.t.mockImplementation(defaultTranslatorImplementation);
		restoreWindow();
		globalThis.window?.history.replaceState({}, '', '/');
	});

	afterEach(() => {
		restoreWindow();
	});

	afterAll(() => {
		restoreWindow();
	});

	defineDefaultValueTests();
	defineBuildPageTitleTests();
	defineBuildAbsoluteUrlTests();
	defineBuildCanonicalUrlTests();
	defineRobotsHelperTests();
	defineOpenGraphAndTwitterTests();
	defineMergeSEOConfigTests();
});

function defineDefaultValueTests() {
	describe('default values', () => {
		it('uses translations when i18n is initialized', () => {
			const result = getDefaultSEO();

			expect(mockedI18n.t).toHaveBeenCalledWith(
				'seo.defaultTitle',
				expect.objectContaining({ ns: 'common', defaultValue: DEFAULT_TITLE })
			);
			expect(mockedI18n.t).toHaveBeenCalledWith(
				'seo.defaultDescription',
				expect.objectContaining({
					ns: 'common',
					defaultValue: DEFAULT_DESCRIPTION,
				})
			);
			expect(mockedI18n.t).toHaveBeenCalledWith(
				'seo.siteName',
				expect.objectContaining({ ns: 'common', defaultValue: DEFAULT_TITLE })
			);
			expect(result.title).toBe(DEFAULT_TITLE);
			expect(result.description).toBe(DEFAULT_DESCRIPTION);
		});

		it('falls back to English defaults when translations are unavailable', () => {
			mockedI18n.isInitialized = false;

			const result = getDefaultSEO();

			expect(mockedI18n.t).not.toHaveBeenCalled();
			expect(result.title).toBe(DEFAULT_TITLE);
			expect(result.description).toBe(DEFAULT_DESCRIPTION);
		});

		it('swallows translation errors and keeps safe defaults', () => {
			mockedI18n.t.mockImplementation(() => {
				throw new Error('translation failed');
			});

			const result = getDefaultSEO();

			expect(result.title).toBe(DEFAULT_TITLE);
			expect(result.description).toBe(DEFAULT_DESCRIPTION);
		});
	});
}

function defineBuildPageTitleTests() {
	describe('buildPageTitle', () => {
		it('returns site name when title is not provided', () => {
			expect(buildPageTitle()).toBe(DEFAULT_TITLE);
		});

		it('concatenates page title with provided site name', () => {
			expect(buildPageTitle('Dashboard', 'SAS')).toBe('Dashboard | SAS');
		});
	});
}

function defineBuildAbsoluteUrlTests() {
	describe('buildAbsoluteUrl', () => {
		it('returns original url when already absolute', () => {
			const absoluteUrl = 'https://example.com/og.png';
			expect(buildAbsoluteUrl(absoluteUrl)).toBe(absoluteUrl);
		});

		it('prefixes relative paths with current origin', () => {
			globalThis.window?.history.replaceState({}, '', '/base');
			const origin = getOrigin();
			expect(buildAbsoluteUrl('/docs')).toBe(`${origin}/docs`);
			expect(buildAbsoluteUrl('docs/page')).toBe(`${origin}/docs/page`);
		});

		it('returns path as-is during SSR when window is undefined', () => {
			Reflect.set(globalThis, 'window', undefined);
			expect(buildAbsoluteUrl('/docs')).toBe('/docs');
		});
	});
}

function defineBuildCanonicalUrlTests() {
	describe('buildCanonicalUrl', () => {
		it('builds an absolute canonical url when provided', () => {
			globalThis.window?.history.replaceState({}, '', '/base');
			expect(buildCanonicalUrl('/docs/intro')).toBe(`${getOrigin()}/docs/intro`);
		});

		it('falls back to current path when canonical url is missing', () => {
			globalThis.window?.history.replaceState({}, '', '/guides/getting-started?lang=en');
			expect(buildCanonicalUrl()).toBe(`${getOrigin()}/guides/getting-started?lang=en`);
		});

		it('returns root path when rendered on the server', () => {
			Reflect.set(globalThis, 'window', undefined);
			expect(buildCanonicalUrl()).toBe('/');
		});
	});
}

function defineRobotsHelperTests() {
	describe('robots helper', () => {
		it('returns noindex policy when explicitly not indexable', () => {
			expect(buildRobotsContent(false)).toBe('noindex, nofollow');
		});

		it('returns default robots policy otherwise', () => {
			expect(buildRobotsContent()).toBe('index, follow');
			expect(buildRobotsContent(true)).toBe('index, follow');
		});
	});
}

function defineOpenGraphAndTwitterTests() {
	describe('OpenGraph & Twitter helpers', () => {
		it('buildOgImageUrl resolves relative paths', () => {
			globalThis.window?.history.replaceState({}, '', '/base');
			expect(buildOgImageUrl('/og/path.png')).toBe(`${getOrigin()}/og/path.png`);
		});

		it('buildOgImageUrl falls back to default image', () => {
			expect(buildOgImageUrl()).toBe(`${getOrigin()}/og-image.png`);
		});

		it('buildTwitterImageUrl prefers twitter image, then og image, then default', () => {
			globalThis.window?.history.replaceState({}, '', '/base');
			const origin = getOrigin();
			expect(buildTwitterImageUrl('/twitter.png', '/og.png')).toBe(`${origin}/twitter.png`);
			expect(buildTwitterImageUrl(undefined, '/og.png')).toBe(`${origin}/og.png`);
			expect(buildTwitterImageUrl()).toBe(`${origin}/og-image.png`);
		});
	});
}

function defineMergeSEOConfigTests() {
	describe('mergeSEOConfig', () => {
		defineMergeSEOConfigBasicTests();
		defineMergeSEOConfigOptionalPropertiesTests();
		defineMergeSEOConfigImageAltTests();
		defineMergeSEOConfigDefaultValuesTests();
	});
}

function defineMergeSEOConfigBasicTests() {
	it('fills in defaults for missing values and preserves optional fields', () => {
		globalThis.window?.history.replaceState({}, '', '/base?ref=home');
		const config = {
			title: 'Landing',
			description: 'Landing page description',
			indexable: false,
			canonicalUrl: '/landing',
			ogType: 'article' as const,
			ogImage: '/assets/og.png',
			ogImageWidth: 800,
			ogImageHeight: 418,
			ogImageAlt: 'Landing OG',
			ogLocale: 'en_GB',
			twitterCard: 'summary' as const,
			twitterImage: '/assets/twitter.png',
			twitterImageAlt: 'Landing Twitter',
			keywords: 'react,starter',
			author: 'Screaming Team',
			customMeta: [{ name: 'viewport', content: 'width=device-width' }],
		};

		const result = mergeSEOConfig(config);

		expect(result.title).toBe(LANDING_FULL_TITLE);
		expect(result.description).toBe('Landing page description');
		expect(result.indexable).toBe(false);
		expect(result.canonicalUrl).toBe(`${getOrigin()}/landing`);
		expect(result.ogType).toBe('article');
		expect(result.ogImage).toBe(`${getOrigin()}/assets/og.png`);
		expect(result.ogImageWidth).toBe(800);
		expect(result.ogImageHeight).toBe(418);
		expect(result.ogImageAlt).toBe('Landing OG');
		expect(result.ogLocale).toBe('en_GB');
		expect(result.twitterCard).toBe('summary');
		expect(result.twitterImage).toBe(`${getOrigin()}/assets/twitter.png`);
		expect(result.twitterImageAlt).toBe('Landing Twitter');
		expect(result.keywords).toBe('react,starter');
		expect(result.author).toBe('Screaming Team');
		expect(result.customMeta).toEqual([{ name: 'viewport', content: 'width=device-width' }]);
	});

	it('fills derived values when optional imagery is missing', () => {
		globalThis.window?.history.replaceState({}, '', '/base');
		const result = mergeSEOConfig({ title: 'Docs' });

		expect(result.title).toBe(DOCS_FULL_TITLE);
		expect(result.ogImage).toBe(`${getOrigin()}/og-image.png`);
		expect(result.ogImageAlt).toBe(DOCS_FULL_TITLE);
		expect(result.twitterImage).toBe(`${getOrigin()}/og-image.png`);
		expect(result.twitterImageAlt).toBe(DOCS_FULL_TITLE);
	});

	it('handles empty config object', () => {
		globalThis.window?.history.replaceState({}, '', '/base');
		const result = mergeSEOConfig({});

		expect(result.title).toBe(DEFAULT_TITLE);
		expect(result.description).toBe(DEFAULT_DESCRIPTION);
		expect(result.indexable).toBe(true);
	});
}

function defineMergeSEOConfigOptionalPropertiesTests() {
	it('handles optional properties being undefined (not included in result)', () => {
		globalThis.window?.history.replaceState({}, '', '/base');
		const result = mergeSEOConfig({
			title: 'Test',
		});

		expect(result.title).toBe(`Test | ${DEFAULT_TITLE}`);
		expect(result.keywords).toBeUndefined();
		expect(result.author).toBeUndefined();
		expect(result.customMeta).toBeUndefined();
	});
}

function defineMergeSEOConfigImageAltTests() {
	const CUSTOM_OG_ALT = 'Custom OG Alt';

	it('uses provided ogImageAlt and twitterImageAlt when specified', () => {
		globalThis.window?.history.replaceState({}, '', '/base');
		const result = mergeSEOConfig({
			title: 'Test',
			ogImageAlt: CUSTOM_OG_ALT,
			twitterImageAlt: 'Custom Twitter Alt',
		});

		expect(result.ogImageAlt).toBe(CUSTOM_OG_ALT);
		expect(result.twitterImageAlt).toBe('Custom Twitter Alt');
	});

	it('falls back ogImageAlt to title when not provided', () => {
		globalThis.window?.history.replaceState({}, '', '/base');
		const result = mergeSEOConfig({
			title: 'Test Page',
		});

		expect(result.ogImageAlt).toBe(`Test Page | ${DEFAULT_TITLE}`);
	});

	it('falls back twitterImageAlt to ogImageAlt when not provided', () => {
		globalThis.window?.history.replaceState({}, '', '/base');
		const result = mergeSEOConfig({
			title: 'Test Page',
			ogImageAlt: CUSTOM_OG_ALT,
		});

		expect(result.twitterImageAlt).toBe(CUSTOM_OG_ALT);
	});
}

function defineMergeSEOConfigDefaultValuesTests() {
	it('handles all default value paths in buildBaseSEOResult', () => {
		globalThis.window?.history.replaceState({}, '', '/base');
		const result = mergeSEOConfig({
			title: 'Minimal Config',
		});

		expect(result.description).toBe(DEFAULT_DESCRIPTION);
		expect(result.indexable).toBe(true);
		expect(result.ogType).toBe('website');
		expect(result.ogImageWidth).toBe(1200);
		expect(result.ogImageHeight).toBe(630);
		expect(result.ogLocale).toBe('en_US');
		expect(result.twitterCard).toBe('summary_large_image');
	});
}
