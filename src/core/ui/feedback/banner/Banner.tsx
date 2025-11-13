import Button from '@core/ui/button/Button';
import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';
import type { BannerAction, BannerIntent, BannerProps } from '@src-types/ui/feedback';
import type { ReactNode } from 'react';

const BANNER_INTENT_STYLES: Record<BannerIntent, string> = {
	info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-300/40 dark:bg-sky-950/60 dark:text-sky-100',
	success:
		'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/40 dark:bg-emerald-950/60 dark:text-emerald-100',
	warning:
		'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/40 dark:bg-amber-950/60 dark:text-amber-100',
	error:
		'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-300/40 dark:bg-rose-950/60 dark:text-rose-100',
};

const BANNER_INTENT_ICON_STYLES: Record<BannerIntent, string> = {
	info: 'text-sky-500 dark:text-sky-300',
	success: 'text-emerald-500 dark:text-emerald-300',
	warning: 'text-amber-500 dark:text-amber-300',
	error: 'text-rose-500 dark:text-rose-300',
};

const BANNER_ICON_PATHS: Record<BannerIntent, ReactNode> = {
	success: (
		<path
			fillRule="evenodd"
			d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
			clipRule="evenodd"
		/>
	),
	warning: (
		<>
			<path d="M9.04 3.163a1.5 1.5 0 012.92 0l6.112 12.223A1.5 1.5 0 0116.722 17H3.278a1.5 1.5 0 01-1.35-1.614L9.04 3.163z" />
			<path
				fill="#0f172a"
				d="M10 12.5a.75.75 0 01.743.648l.007.102v1a.75.75 0 01-1.493.102L9.25 14.25v-1a.75.75 0 01.75-.75zm0-5a.75.75 0 01.743.648L10.75 8.25v3a.75.75 0 01-1.493.102L9.25 11.25v-3a.75.75 0 01.75-.75z"
			/>
		</>
	),
	error: (
		<path
			fillRule="evenodd"
			d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.828-10.828a1 1 0 10-1.414-1.414L10 7.586 8.586 6.172a1 1 0 10-1.414 1.414L8.586 9 7.172 10.414a1 1 0 101.414 1.414L10 10.414l1.414 1.414a1 1 0 001.414-1.414L11.414 9l1.414-1.414z"
			clipRule="evenodd"
		/>
	),
	info: (
		<path
			fillRule="evenodd"
			d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9-3a1 1 0 112 0v1a1 1 0 11-2 0V7zm0 3a1 1 0 000 2h.01a1 1 0 100-2H9z"
			clipRule="evenodd"
		/>
	),
};

function getDefaultIcon(intent: BannerIntent): ReactNode {
	return BANNER_ICON_PATHS[intent];
}

interface BannerIconProps {
	readonly intent: BannerIntent;
	readonly icon?: ReactNode;
}

function BannerIcon({ intent, icon }: Readonly<BannerIconProps>) {
	return (
		<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
			{icon ?? (
				<span
					aria-hidden
					className={classNames(
						'flex h-5 w-5 items-center justify-center',
						BANNER_INTENT_ICON_STYLES[intent]
					)}
				>
					<svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
						{getDefaultIcon(intent)}
					</svg>
				</span>
			)}
		</div>
	);
}

interface BannerActionButtonProps {
	readonly action: BannerAction;
}

function BannerActionButton({ action }: Readonly<BannerActionButtonProps>) {
	return (
		<div className="pt-2">
			<Button
				size="sm"
				variant={action.variant ?? 'primary'}
				className="inline-flex items-center gap-2"
				type="button"
				onClick={action.onClick}
			>
				{action.icon ? <span aria-hidden>{action.icon}</span> : null}
				{action.label}
			</Button>
		</div>
	);
}

interface BannerContentProps {
	readonly title?: string;
	readonly description?: string | ReactNode;
	readonly children?: ReactNode;
	readonly action?: BannerAction;
}

function BannerContent({ title, description, children, action }: Readonly<BannerContentProps>) {
	return (
		<div className="flex flex-1 flex-col gap-1 text-sm">
			{title ? (
				<Heading as="h6" size="sm" className="font-semibold">
					{title}
				</Heading>
			) : null}
			{description ? (
				<Text size="sm" className="leading-snug opacity-90">
					{description}
				</Text>
			) : null}
			{children}
			{action ? <BannerActionButton action={action} /> : null}
		</div>
	);
}

const BANNER_BASE_CLASSES = 'flex w-full items-start gap-3 rounded-lg border px-4 py-3 shadow-sm';

/**
 * Banner - Static banner component for announcements
 *
 * Features:
 * - Static announcements (vs Alert for dynamic notifications)
 * - Intent variants: info, success, warning, error
 * - Optional title and description
 * - Optional action button
 * - Custom icon support
 * - Accessible: proper ARIA roles
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Banner intent="info" title="Maintenance Notice">
 *   Scheduled maintenance will occur on Friday at 2 AM.
 * </Banner>
 * ```
 *
 * @example
 * ```tsx
 * <Banner
 *   intent="success"
 *   title="Feature Available"
 *   description="New dashboard features are now live!"
 *   action={{
 *     label: "Learn More",
 *     onClick: () => navigate('/features'),
 *   }}
 * />
 * ```
 */
export default function Banner({
	intent = 'info',
	title,
	description,
	children,
	icon,
	className,
	action,
	role = 'region',
	...props
}: Readonly<BannerProps>) {
	const contentProps = {
		...(title !== undefined && { title }),
		...(description !== undefined && { description }),
		...(action !== undefined && { action }),
	};

	return (
		<div
			role={role}
			className={classNames(BANNER_BASE_CLASSES, BANNER_INTENT_STYLES[intent], className)}
			{...props}
		>
			<BannerIcon intent={intent} icon={icon} />
			<BannerContent {...contentProps}>{children}</BannerContent>
		</div>
	);
}
