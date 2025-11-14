import { componentZIndex } from '@core/ui/theme/tokens';
import type { AppBarProps, AppBarVariant } from '@src-types/ui/navigation/appBar';
import { twMerge } from 'tailwind-merge';

/**
 * AppBar base classes
 * Uses design tokens for spacing (px-lg = 16px)
 */
const APP_BAR_BASE_CLASSES =
	'flex items-center justify-between w-full h-14 px-lg bg-background dark:bg-background-dark';

/**
 * AppBar variant classes
 */
const APP_BAR_VARIANT_CLASSES: Record<AppBarVariant, string> = {
	default: 'border-b border-border dark:border-border-dark',
	elevated: 'shadow-md border-b border-border dark:border-border-dark',
	outlined: 'border-b-2 border-border dark:border-border-dark',
} as const;

/**
 * AppBar fixed classes
 * Uses design tokens for z-index
 */
const APP_BAR_FIXED_CLASSES = 'fixed top-0 left-0 right-0';

/**
 * AppBar fixed z-index value from design tokens
 *
 * @internal
 */
const APP_BAR_FIXED_Z_INDEX = componentZIndex.fixed;

/**
 * AppBar title classes
 * Uses design tokens for spacing (px-lg = 16px)
 */
const APP_BAR_TITLE_CLASSES =
	'flex-1 text-lg font-semibold text-text-primary dark:text-text-primary truncate px-lg';

/**
 * AppBar leading/trailing classes
 * Uses design tokens for spacing (gap-sm = 8px)
 */
const APP_BAR_ACTION_CLASSES = 'flex items-center gap-sm flex-shrink-0';

/**
 * AppBar - Top navigation bar component
 *
 * Features:
 * - Accessible: proper semantic HTML, keyboard navigation
 * - Variants: default, elevated, outlined
 * - Optional fixed positioning
 * - Leading and trailing action areas
 * - Title support
 * - Dark mode support
 * - Mobile-friendly
 *
 * @example
 * ```tsx
 * <AppBar
 *   title="My App"
 *   leading={<MenuIcon />}
 *   trailing={<SearchIcon />}
 *   variant="elevated"
 *   fixed
 * />
 * ```
 *
 * @example
 * ```tsx
 * <AppBar
 *   title="Settings"
 *   leading={<BackButton />}
 *   trailing={
 *     <>
 *       <IconButton icon={<SearchIcon />} aria-label="Search" />
 *       <IconButton icon={<MoreIcon />} aria-label="More" />
 *     </>
 *   }
 * />
 * ```
 */
export default function AppBar({
	title,
	leading,
	trailing,
	variant = 'default',
	fixed = false,
	className,
	...props
}: Readonly<AppBarProps>) {
	const variantClasses = APP_BAR_VARIANT_CLASSES[variant];
	const fixedClasses = fixed ? APP_BAR_FIXED_CLASSES : '';
	const classes = twMerge(APP_BAR_BASE_CLASSES, variantClasses, fixedClasses, className);
	const style = fixed ? { zIndex: APP_BAR_FIXED_Z_INDEX } : undefined;

	return (
		<header className={classes} style={style} {...props}>
			{leading ? <div className={APP_BAR_ACTION_CLASSES}>{leading}</div> : null}
			{title ? <h1 className={APP_BAR_TITLE_CLASSES}>{title}</h1> : null}
			{trailing ? <div className={APP_BAR_ACTION_CLASSES}>{trailing}</div> : null}
		</header>
	);
}
