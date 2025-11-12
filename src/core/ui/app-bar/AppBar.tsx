import type { AppBarProps, AppBarVariant } from '@src-types/ui/navigation';
import { twMerge } from 'tailwind-merge';

/**
 * AppBar base classes
 */
const APP_BAR_BASE_CLASSES =
	'flex items-center justify-between w-full h-14 px-4 bg-background dark:bg-background-dark';

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
 */
const APP_BAR_FIXED_CLASSES = 'fixed top-0 left-0 right-0 z-50';

/**
 * AppBar title classes
 */
const APP_BAR_TITLE_CLASSES =
	'flex-1 text-lg font-semibold text-text-primary dark:text-text-primary truncate px-4';

/**
 * AppBar leading/trailing classes
 */
const APP_BAR_ACTION_CLASSES = 'flex items-center gap-2 flex-shrink-0';

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

	return (
		<header className={classes} {...props}>
			{leading ? <div className={APP_BAR_ACTION_CLASSES}>{leading}</div> : null}
			{title ? <h1 className={APP_BAR_TITLE_CLASSES}>{title}</h1> : null}
			{trailing ? <div className={APP_BAR_ACTION_CLASSES}>{trailing}</div> : null}
		</header>
	);
}
