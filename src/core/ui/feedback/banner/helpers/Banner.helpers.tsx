import { BANNER_ICON_PATHS } from '@core/ui/feedback/banner/constants/Banner.constants';
import type { BannerIntent } from '@src-types/ui/feedback';
import type { ReactNode } from 'react';

export function getDefaultIcon(intent: BannerIntent): ReactNode {
	return BANNER_ICON_PATHS[intent];
}
