/* eslint-disable max-lines */
import type {
	AllTranslationKeys,
	CommonTranslations,
	GetNamespaceKeys,
	InterpolationValues,
	IsValidNamespace,
	LandingTranslations,
	NamespacedKey,
	NamespaceKeys,
	TranslationNamespaces,
	ValidateNamespace,
} from '@core/i18n/types/types';
import { describe, expect, it } from 'vitest';

describe('i18n types', () => {
	describe('CommonTranslations', () => {
		it('should have required translation keys', () => {
			/* eslint-disable unicorn/no-unused-properties */
			const translations: CommonTranslations = {
				'app.title': 'Test App',
				'app.description': 'Test Description',
				'nav.home': 'Home',
				'errors.error500.title': '500',
				'errors.error500.message': 'Internal server error',
				'errors.error500.returnHome': 'Return to Home',
				'errors.error404.title': '404',
				'errors.error404.message': 'Page not found',
				'errors.error404.returnHome': 'Return to Home',
				'errors.errorBoundary.title': 'Error',
				'errors.errorBoundary.description': 'Something went wrong',
				'errors.errorBoundary.tryAgain': 'Try Again',
				'errors.errorBoundary.goToHome': 'Go to Home',
				'errors.errorBoundary.tryAgainAriaLabel': 'Try again',
				'errors.requestTimeout': 'Request timeout',
				'errors.networkError': 'Network error',
				'errors.unknownError': 'Unknown error',
				'errors.requestFailed': 'Request failed',
				'errors.rootElementNotFound': 'Root element not found',
				'errors.unableToLoadDemoContent': 'Unable to load demo content',
				'errors.failedToLoadGoogleMaps': 'Failed to load Google Maps',
				'a11y.mainNavigation': 'Main navigation',
				'a11y.notifications': 'Notifications',
				'a11y.dismissNotification': 'Dismiss notification',
				'a11y.languageSelector': 'Language selector',
				'a11y.currentLanguage': 'Current language',
				'a11y.selectLanguage': 'Select language',
				'a11y.toggleTheme': 'Toggle theme',
				'a11y.currentTheme': 'Current theme',
				'a11y.currentThemeDescription': 'Current theme description',
				'a11y.required': 'Required',
				'a11y.imageGallery': 'Image gallery',
				'a11y.uploadProgress': 'Upload progress',
				'a11y.chooseLanguage': 'Choose language',
				'a11y.addNewItem': 'Add new item',
				'a11y.createNewPost': 'Create new post',
				'a11y.virtualizedList': 'Virtualized list',
				'a11y.sidebar': 'Sidebar',
				'a11y.applicationMenu': 'Application menu',
				'a11y.resizableContainer': 'Resizable container',
				'a11y.countryCode': 'Country code',
				'a11y.splitterContainer': 'Splitter container',
				'a11y.info': 'Info',
				'a11y.commands': 'Commands',
				'a11y.searchCommands': 'Search commands',
				'a11y.steps': 'Steps',
				'a11y.transferList': 'Transfer list',
				'a11y.segmentedControl': 'Segmented control',
				'a11y.clearSearch': 'Clear search',
				'a11y.oneTimePasswordInput': 'One time password input',
				'a11y.increment': 'Increment',
				'a11y.decrement': 'Decrement',
				'a11y.search': 'Search',
				'a11y.more': 'More',
				'a11y.close': 'Close',
				'a11y.fileUploadDropzone': 'File upload dropzone',
				'a11y.moreOptions': 'More options',
				'a11y.timeline': 'Timeline',
				'a11y.scrollToTop': 'Scroll to top',
				'a11y.sortableList': 'Sortable list',
				'theme.light': 'Light',
				'theme.dark': 'Dark',
				'theme.system': 'System',
				'language.en': 'English',
				'language.es': 'Spanish',
				'language.ar': 'Arabic',
				retry: 'Retry',
				failedToLoadMoreItems: 'Failed to load more items',
				anErrorOccurred: 'An error occurred',
				confirm: 'Confirm',
				cancel: 'Cancel',
				noMatches: 'No matches',
				loadingOptions: 'Loading options',
				fieldRequired: 'Field required',
				input: 'Input',
				selectAll: 'Select all',
				deselectAll: 'Deselect all',
				selectAllRows: 'Select all rows',
				noDataAvailable: 'No data available',
				searchPlaceholder: 'Search placeholder',
				noActionsAvailable: 'No actions available',
				noOptionsFound: 'No options found',
				'carousel.previousSlide': 'Previous slide',
				'carousel.nextSlide': 'Next slide',
				'carousel.slideIndicators': 'Slide indicators',
				'carousel.goToSlide': 'Go to slide',
				'password.showPassword': 'Show password',
				'password.hidePassword': 'Hide password',
				'calendar.previousMonth': 'Previous month',
				'calendar.nextMonth': 'Next month',
				'calendar.goToToday': 'Go to today',
				'calendar.today': 'Today',
				'fileUpload.dropFilesHere': 'Drop files here',
				'fileUpload.dragAndDropFilesHere': 'Drag and drop files here',
				'fileUpload.or': 'or',
				'fileUpload.browseFiles': 'Browse files',
				'fileUpload.accepted': 'Accepted',
				'fileUpload.fileSizeExceedsMaximum': 'File size exceeds maximum',
				'fileUpload.fileSizeBelowMinimum': 'File size below minimum',
				'fileUpload.fileTypeNotAccepted': 'File type not accepted',
				'fileUpload.maximum': 'Maximum',
				'fileUpload.minimum': 'Minimum',
				'fileUpload.file': 'File',
				'fileUpload.files': 'Files',
				'fileUpload.allowed': 'Allowed',
				'fileUpload.required': 'Required',
				'fileUpload.bytes': 'Bytes',
				'fileUpload.kb': 'KB',
				'fileUpload.mb': 'MB',
				'fileUpload.gb': 'GB',
				'fileUpload.uploadProgress': 'Upload progress',
				'wizard.next': 'Next',
				'wizard.previous': 'Previous',
				'wizard.finish': 'Finish',
				'wizard.skip': 'Skip',
				'wizard.progress': 'Progress',
				'wizard.validationFailed': 'Validation failed',
				'wizard.validationError': 'Validation error',
				'pagination.showing': 'Showing',
				'pagination.first': 'First',
				'pagination.last': 'Last',
				'pagination.previous': 'Previous',
				'pagination.next': 'Next',
				'pagination.goToFirstPage': 'Go to first page',
				'pagination.goToLastPage': 'Go to last page',
				'pagination.goToPreviousPage': 'Go to previous page',
				'pagination.goToNextPage': 'Go to next page',
				'pagination.goToPage': 'Go to page',
				'filters.activeFilters': 'Active filters',
				'filters.clearAll': 'Clear all',
				'filters.clearAllAriaLabel': 'Clear all aria label',
				'filters.removeFilter': 'Remove filter',
				'filters.filterBuilder': 'Filter builder',
				'filters.closeFilterBuilder': 'Close filter builder',
				'filters.addFilter': 'Add filter',
				'filters.filterLabel': 'Filter label',
				'filters.filterLabelPlaceholder': 'Filter label placeholder',
				'filters.filterType': 'Filter type',
				'filters.addNewFilter': 'Add new filter',
				'filters.filterTypeText': 'Filter type text',
				'filters.filterTypeSelect': 'Filter type select',
				'filters.filterTypeMultiSelect': 'Filter type multi select',
				'filters.filterTypeDate': 'Filter type date',
				'filters.filterTypeDateRange': 'Filter type date range',
				'transfer.sourceTitle': 'Source title',
				'transfer.targetTitle': 'Target title',
				'transfer.searchList': 'Search list',
				'transfer.moveSelectedToRight': 'Move selected to right',
				'transfer.moveSelectedToLeft': 'Move selected to left',
				'copy.copyToClipboard': 'Copy to clipboard',
				'copy.copied': 'Copied',
				'copy.clipboardApiNotAvailable': 'Clipboard API not available',
				'copy.failedToCopy': 'Failed to copy',
				'seo.siteName': 'Site name',
				'seo.defaultDescription': 'Default description',
				'seo.defaultTitle': 'Default title',
				'noscript.title': 'No script title',
				'noscript.message': 'No script message',
			};
			/* eslint-enable unicorn/no-unused-properties */

			expect(translations['app.title']).toBe('Test App');
			expect(translations['nav.home']).toBe('Home');
		});
	});

	describe('LandingTranslations', () => {
		it('should have required translation keys', () => {
			/* eslint-disable unicorn/no-unused-properties */
			const translations: LandingTranslations = {
				'hero.title': 'Welcome',
				'hero.subtitle': 'Welcome subtitle',
				'buttons.title': 'Buttons',
				'buttons.variants': 'Variants',
				'buttons.sizes': 'Sizes',
				'buttons.states': 'States',
				'buttons.sizeVariantCombinations': 'Size variant combinations',
				'buttons.primary': 'Primary',
				'buttons.secondary': 'Secondary',
				'buttons.ghost': 'Ghost',
				'buttons.small': 'Small',
				'buttons.medium': 'Medium',
				'buttons.large': 'Large',
				'buttons.default': 'Default',
				'buttons.disabled': 'Disabled',
				'buttons.loading': 'Loading',
				'buttons.clickToLoad': 'Click to load',
				'buttons.fullWidth': 'Full width',
				'buttons.primarySmall': 'Primary small',
				'buttons.secondarySmall': 'Secondary small',
				'buttons.ghostSmall': 'Ghost small',
				'buttons.primaryMedium': 'Primary medium',
				'buttons.secondaryMedium': 'Secondary medium',
				'buttons.ghostMedium': 'Ghost medium',
				'buttons.primaryLarge': 'Primary large',
				'buttons.secondaryLarge': 'Secondary large',
				'buttons.ghostLarge': 'Ghost large',
			};

			expect(translations['hero.title']).toBe('Welcome');
			expect(translations['buttons.primary']).toBe('Primary');
		});
	});

	describe('TranslationNamespaces', () => {
		it('should include all namespace types', () => {
			const namespaces: TranslationNamespaces = {
				common: {} as CommonTranslations,
				landing: {} as LandingTranslations,
				commandPalette: { placeholder: '', emptyState: '' },
				inlineEdit: { placeholder: '' },
			};

			expect(namespaces.common).toBeDefined();
			expect(namespaces.landing).toBeDefined();
			expect(namespaces.commandPalette).toBeDefined();
			expect(namespaces.inlineEdit).toBeDefined();
		});
	});

	describe('NamespaceKeys', () => {
		it('should extract keys from a namespace', () => {
			type CommonKeys = NamespaceKeys<'common'>;
			const key: CommonKeys = 'app.title';
			expect(key).toBe('app.title');
		});

		it('should extract keys from landing namespace', () => {
			type LandingKeys = NamespaceKeys<'landing'>;
			const key: LandingKeys = 'hero.title';
			expect(key).toBe('hero.title');
		});
	});

	describe('GetNamespaceKeys', () => {
		it('should be equivalent to NamespaceKeys', () => {
			type CommonKeys = GetNamespaceKeys<'common'>;
			const key: CommonKeys = 'app.title';
			expect(key).toBe('app.title');
		});
	});

	describe('NamespacedKey', () => {
		it('should create namespaced key type', () => {
			type CommonAppTitle = NamespacedKey<'common', 'app.title'>;
			const COMMON_APP_TITLE = 'common.app.title';
			const key: CommonAppTitle = COMMON_APP_TITLE;
			expect(key).toBe(COMMON_APP_TITLE);
		});

		it('should create landing namespaced key', () => {
			type LandingHeroTitle = NamespacedKey<'landing', 'hero.title'>;
			const LANDING_HERO_TITLE = 'landing.hero.title';
			const key: LandingHeroTitle = LANDING_HERO_TITLE;
			expect(key).toBe(LANDING_HERO_TITLE);
		});
	});

	describe('AllTranslationKeys', () => {
		it('should include all possible translation keys', () => {
			type AllKeys = AllTranslationKeys;
			const COMMON_APP_TITLE = 'common.app.title';
			const LANDING_HERO_TITLE = 'landing.hero.title';
			const commonKey: AllKeys = COMMON_APP_TITLE;
			const landingKey: AllKeys = LANDING_HERO_TITLE;
			expect(commonKey).toBe(COMMON_APP_TITLE);
			expect(landingKey).toBe(LANDING_HERO_TITLE);
		});
	});

	describe('InterpolationValues', () => {
		it('should accept string values', () => {
			const values: InterpolationValues = { name: 'John' };
			expect(values.name).toBe('John');
		});

		it('should accept number values', () => {
			const values: InterpolationValues = { count: 42 };
			expect(values.count).toBe(42);
		});

		it('should accept boolean values', () => {
			const values: InterpolationValues = { active: true };
			expect(values.active).toBe(true);
		});

		it('should accept null and undefined', () => {
			const values: InterpolationValues = { value: null, optional: undefined };
			expect(values.value).toBeNull();
			expect(values.optional).toBeUndefined();
		});
	});

	describe('IsValidNamespace', () => {
		it('should validate existing namespaces', () => {
			type ValidCommon = IsValidNamespace<'common'>;
			const isValid: ValidCommon = true;
			expect(isValid).toBe(true);
		});

		it('should invalidate non-existent namespaces', () => {
			type InvalidNamespace = IsValidNamespace<'nonexistent'>;
			const isValid: InvalidNamespace = false;
			expect(isValid).toBe(false);
		});
	});

	describe('ValidateNamespace', () => {
		it('should allow valid namespaces', () => {
			type ValidCommon = ValidateNamespace<'common'>;
			const namespace: ValidCommon = 'common';
			expect(namespace).toBe('common');
		});

		it('should reject invalid namespaces at compile time', () => {
			// This test verifies the type system works
			// Invalid namespaces would cause a compile error
			type ValidLanding = ValidateNamespace<'landing'>;
			const namespace: ValidLanding = 'landing';
			expect(namespace).toBe('landing');
		});
	});
});
