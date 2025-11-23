# Landing Domain

The landing domain serves as a component library showcase, demonstrating the UI components, hooks, and utilities available in the core system.

## Current Structure

### Implemented Directories

- **`pages/`** - Route-level page components (`LandingPage.tsx`, `LandingPageHeader.tsx`)
- **`components/`** - Domain-specific UI components organized by category (forms, data-display, feedback, navigation, etc.)
- **`hooks/`** - Domain-specific hooks (`useComponentFilter`, `useShowcaseFilter`, etc.)
- **`context/`** - React Context providers (`ComponentFilterContext`)
- **`store/`** - ✅ Zustand stores for domain state management
  - `landingStore.ts` - Domain state (activeCategory, searchQuery, selectedTags) with selectors
  - Demonstrates Zustand patterns with type-safe selectors
  - Integrated with `ComponentFilterContext` for backward compatibility
  - See `STATE_MANAGEMENT.md` for detailed state management guidelines

- **`services/`** - API services and business logic
  - Add when you need to make API calls specific to this domain
  - Use `createApiService` from `@core/api/createApiService`
  - Example: `services/api/getDemoContentService.ts`

- **`i18n/`** - Domain-specific translations
  - Add when you need translations specific to this domain
  - Note: Currently uses common translations from `@core/i18n/locales/`
  - Structure: `i18n/index.ts` (registration), `i18n/en.json`, `i18n/es.json`, `i18n/ar.json`

- **`models/`** - Zod schemas and type definitions
  - Add when you need runtime-safe domain models with validation
  - Example: `models/landing.types.ts` with Zod schemas

### Optional Directories (Not Currently Implemented)

The following directories are **optional** and may be added as the domain grows:

- **`services/`** - API services and business logic
  - Add when you need to make API calls specific to this domain
  - Use `createApiService` from `@core/api/createApiService`
  - Example: `services/api/getDemoContentService.ts`

- **`i18n/`** - Domain-specific translations
  - Add when you need translations specific to this domain
  - Note: Currently uses common translations from `@core/i18n/locales/`
  - Structure: `i18n/index.ts` (registration), `i18n/en.json`, `i18n/es.json`, `i18n/ar.json`

- **`models/`** - Zod schemas and type definitions
  - Add when you need runtime-safe domain models with validation
  - Example: `models/landing.types.ts` with Zod schemas

## Assessment

**Current Status**: The landing domain demonstrates:

- ✅ Zustand store implementation for component filtering state
- ✅ Integration of Zustand with React Context for backward compatibility
- ✅ Type-safe selectors following best practices
- ❌ No API calls (no need for services yet)
- ❌ Uses common translations (no need for domain-specific i18n yet)
- ❌ Uses TypeScript types directly (no need for Zod models yet)

**Recommendation**: Add remaining optional directories when needed:

- `services/` - When you need to make API calls
- `i18n/` - When you need domain-specific translations
- `models/` - When you need runtime validation with Zod schemas

## References

- See `docs/creating-domains.md` for domain creation guidelines
- See `.cursor/rules/architecture/folder-structure-domains-shared.mdc` for domain structure details
