## Core UI Structure

This directory hosts the reusable, framework-agnostic UI system. Components are grouped by responsibility to keep the catalogue navigable as it grows.

- **Root** – cross-cutting building blocks (`accordion`, `affix`, `button`, `variants`, etc.).
- **`forms/`** – form controls, inputs, wizards, and related helpers.
- **`navigation/`** – routing, menu, pagination, and navigational surfaces.
- **`data-display/`** – cards, tables, charts, status indicators, and read-only visuals.
- **`feedback/`** – alerts, toasts, banners, progress indicators, and status messaging.
- **`overlays/`** – dialogs, drawers, sheets, tooltips, and other layered interactions.
- **`layout/`** – layout primitives (`box`, `flex`, `grid`, `stack`, etc.).
- **`media/`** – imagery, maps, carousels, signature pads, video, and rich media widgets.
- **`utilities/`** – non-visual helpers (loadable wrappers, scroll utilities, motion, virtualized lists).

### Importing Components

Existing imports continue to use the `@core/ui/<component>/...` convention. Path aliases resolve the grouped structure, so no import updates are required.

### Contributing

1. Place new components in the closest matching subgroup; keep domain-specific logic out of `core`.
2. Co-locate component-specific hooks, helpers, and types with the component.
3. Update this file if you introduce a new subgroup so future contributors understand the layout.
