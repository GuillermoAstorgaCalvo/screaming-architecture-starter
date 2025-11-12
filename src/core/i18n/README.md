# Internationalization (i18n)

This directory contains the core i18n configuration using i18next with a scalable, domain-driven architecture.

## Architecture

The i18n system is designed to be scalable and maintainable:

- **Dynamic Resource Loading**: Translations are loaded on-demand as needed
- **Domain Registration**: Domains register their translations independently
- **No Core Dependencies**: Core doesn't need to know about domain translations
- **Type Safety**: Full TypeScript support for translation keys

## Structure

- `i18n.ts` - Core i18next instance configuration
- `types.ts` - TypeScript types for translation keys (type-safe access)
- `useTranslation.ts` - Custom hook wrapper with automatic resource loading
- `useRtl.ts` - Hook to check if current language is RTL (Right-to-Left)
- `resourceLoader.ts` - Dynamic resource loading system (main export, imports from sub-modules)
- `resourceLoader.cache.ts` - Resource caching utilities (clearResourceCacheFor, isResourceCached, isResourceLoading)
- `resourceLoader.i18n.ts` - i18next integration functions (addResourceToI18n, loadAndAddResource)
- `resourceLoader.load.ts` - Resource loading functions (loadResource)
- `resourceLoader.registry.ts` - Resource loader registry (registerResourceLoader, getRegisteredNamespaces, clearResourceLoaders)
- `resourceLoader.types.ts` - Type definitions for resource loading (ResourceLoader, TranslationResource, AddResourceOptions, etc.)
- `resourceLoader.validation.ts` - Resource validation utilities
- `registry.ts` - Domain translation registration system
- `constants.ts` - Centralized i18n constants (supported languages, RTL languages, default namespace, etc.)
- `errors.ts` - Custom error classes for i18n resource loading
- `locales/` - Common/shared translations (e.g., `en.json`, `es.json`, `ar.json`)
- `useTranslationHelpers.ts` - Internal helper functions for resource loading state management
- `useTranslationLoader.ts` - Internal hook for managing resource loading effects
- `useTranslationState.ts` - Internal hook for managing translation loading state

## Domain Translations

Domain-specific translations are co-located with each domain:

- `domains/<domain>/i18n/<locale>.json` - Translation files
- `domains/<domain>/i18n/index.ts` - Registration file

Example: `domains/landing/i18n/en.json`, `domains/landing/i18n/es.json`, `domains/landing/i18n/index.ts`

### Registering Domain Translations

Each domain should have an `i18n/index.ts` file that registers its translations:

```ts
// domains/my-domain/i18n/index.ts
import { registerDomainTranslations } from '@core/i18n/registry';

// Register domain translations
// Registration is synchronous, so it completes immediately when this module is imported
registerDomainTranslations('my-domain', async language => {
	switch (language) {
		case 'en': {
			return import('./en.json');
		}
		case 'es': {
			return import('./es.json');
		}
		case 'ar': {
			return import('./ar.json');
		}
		default: {
			return import('./en.json');
		}
	}
});
```

Then import the registration file in `app/main.tsx`:

```ts
// app/main.tsx
import '@domains/my-domain/i18n';
```

## Usage

### In Components

```tsx
import { useTranslation } from '@core/i18n/useTranslation';

function MyComponent() {
	const { t } = useTranslation('landing');

	return (
		<div>
			<h1>{t('hero.title')}</h1>
			<p>{t('hero.subtitle')}</p>
		</div>
	);
}
```

The `useTranslation` hook automatically loads translation resources for the namespace when first used.

### Using Common Translations

```tsx
import { useTranslation } from '@core/i18n/useTranslation';

function Navbar() {
	const { t } = useTranslation('common');

	return <Link to="/">{t('nav.home')}</Link>;
}
```

### Changing Language

```tsx
import { useTranslation } from '@core/i18n/useTranslation';

function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<>
			<button onClick={() => changeLanguage('en')}>English</button>
			<button onClick={() => changeLanguage('es')}>Español</button>
			<button onClick={() => changeLanguage('ar')}>العربية</button>
		</>
	);
}
```

### RTL (Right-to-Left) Support

The system automatically handles RTL languages by setting the HTML `dir` and `lang` attributes when the language changes. For custom RTL handling in components, use the `useRtl` hook:

```tsx
import { useRtl } from '@core/i18n/useRtl';

function MyComponent() {
	const isRtl = useRtl();

	return (
		<div className={isRtl ? 'rtl-container' : 'ltr-container'}>
			Content that adapts to direction
		</div>
	);
}
```

The HTML `dir` attribute is automatically managed by the i18n system, but `useRtl` can be used for component-level styling or conditional rendering based on text direction.

### Constants and Error Handling

The module provides constants and error classes for i18n operations:

```ts
import {
	SUPPORTED_LANGUAGES,
	DEFAULT_LANGUAGE,
	RTL_LANGUAGES,
	isSupportedLanguage,
	isRtlLanguage,
	normalizeLanguage,
} from '@core/i18n/constants';

import { ResourceLoaderNotFoundError, InvalidResourceFormatError } from '@core/i18n/errors';
```

**Constants (`constants.ts`):**

- `SUPPORTED_LANGUAGES` - Array of supported language codes
- `DEFAULT_LANGUAGE` - Default/fallback language ('en')
- `RTL_LANGUAGES` - Array of RTL language codes
- `DEFAULT_NAMESPACE` - Default namespace ('common')
- `LANGUAGE_STORAGE_KEY` - LocalStorage key for language preference
- `LANGUAGE_DETECTION_ORDER` - Order of language detection methods
- `isSupportedLanguage()` - Check if a language is supported
- `isRtlLanguage()` - Check if a language is RTL
- `normalizeLanguage()` - Normalize language code to supported language

**Errors (`errors.ts`):**

- `ResourceLoaderNotFoundError` - Thrown when resource loader is not found for a namespace
- `InvalidResourceFormatError` - Thrown when resource format is invalid

## Configuration

### Language Detection

Language detection is configured to:

1. Check `localStorage` for saved preference
2. Check browser `navigator` language
3. Check HTML `lang` attribute

The selected language is persisted to `localStorage` with key `i18nextLng`.

### Supported Languages

Currently supported languages are defined in `constants.ts`:

- `en` (English) - default/fallback, LTR
- `es` (Spanish) - LTR
- `ar` (Arabic) - RTL

To add more languages:

1. Update `SUPPORTED_LANGUAGES` in `core/i18n/constants.ts`
2. Update `RTL_LANGUAGES` in `core/i18n/constants.ts` if the language is RTL
3. Add translation files for each locale in each domain
4. Update the loader factory in each domain's `i18n/index.ts`

## Adding New Translations

### Adding to an Existing Domain

1. Add translation keys to the domain's JSON files:
   - `domains/<domain>/i18n/en.json`
   - `domains/<domain>/i18n/es.json`

2. Update TypeScript types in `core/i18n/types.ts`:
   ```typescript
   export interface MyDomainTranslations {
   	'new.key': string;
   }
   ```

### Adding a New Domain

1. Create translation files:
   - `domains/<new-domain>/i18n/en.json`
   - `domains/<new-domain>/i18n/es.json`

2. Create registration file:
   - `domains/<new-domain>/i18n/index.ts` (register with `registerDomainTranslations`)

   ```ts
   import { registerDomainTranslations } from '@core/i18n/registry';

   // Register domain translations
   // Registration is synchronous, so it completes immediately when this module is imported
   registerDomainTranslations('new-domain', async language => {
   	switch (language) {
   		case 'en': {
   			return import('./en.json');
   		}
   		case 'es': {
   			return import('./es.json');
   		}
   		case 'ar': {
   			return import('./ar.json');
   		}
   		default: {
   			return import('./en.json');
   		}
   	}
   });
   ```

3. Import registration in `app/main.tsx`:

   ```ts
   import '@domains/<new-domain>/i18n';
   ```

4. Add TypeScript types in `core/i18n/types.ts`:

   ```typescript
   export interface NewDomainTranslations {
   	key: string;
   }

   export type TranslationNamespaces = {
   	common: CommonTranslations;
   	landing: LandingTranslations;
   	'new-domain': NewDomainTranslations; // Add here
   };
   ```

### Removing a Domain

1. Remove the domain's `i18n/` directory
2. Remove the import from `app/main.tsx`
3. Remove the type definition from `core/i18n/types.ts`

## Type Safety

Translation keys are type-safe. The `useTranslation` hook provides autocomplete and type checking for translation keys based on the namespace.

## Scalability Features

- **Lazy Loading**: Translations are loaded only when needed
- **Independent Domains**: Each domain manages its own translations
- **No Circular Dependencies**: Core doesn't import from domains
- **Easy to Add/Remove**: Adding or removing a domain is just a few lines
- **Resource Caching**: Loaded resources are cached to prevent re-loading
- **Common Translations**: Core translations are registered via `registerCommonTranslations()` and loaded at initialization

## Internal Architecture

### Resource Loading Flow

1. **Registration**: Domains register their translations via `registerDomainTranslations()`
2. **Lazy Loading**: When `useTranslation()` is called with a namespace, it checks if resources are loaded
3. **Resource Loader**: The registered loader factory is called to load translations for the current language
4. **Caching**: Loaded resources are cached to prevent re-loading
5. **Fallback**: If a language is not supported or loading fails, it falls back to the default language

### Common Translations

Common translations are registered in `i18n.ts` using `registerCommonTranslations()` and are loaded during i18n initialization. They are available in the `common` namespace by default.
