import Button from '@core/ui/button/Button';
import { BANNER_INTENT_ICON_STYLES } from '@core/ui/feedback/banner/constants/Banner.constants';
import { getDefaultIcon } from '@core/ui/feedback/banner/helpers/Banner.helpers';
import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';
import type { BannerAction, BannerIntent } from '@src-types/ui/feedback';
import type { ReactNode } from 'react';

interface BannerIconProps {
	readonly intent: BannerIntent;
	readonly icon?: ReactNode;
}

export function BannerIcon({ intent, icon }: Readonly<BannerIconProps>) {
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

export function BannerActionButton({ action }: Readonly<BannerActionButtonProps>) {
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

export function BannerContent({
	title,
	description,
	children,
	action,
}: Readonly<BannerContentProps>) {
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
