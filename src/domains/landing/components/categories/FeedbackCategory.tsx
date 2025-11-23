import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import { AlertShowcase } from '@domains/landing/components/categories/feedback/AlertShowcase';
import { BannerShowcase } from '@domains/landing/components/categories/feedback/BannerShowcase';
import { EmptyStateShowcase } from '@domains/landing/components/categories/feedback/EmptyStateShowcase';
import { NotificationBellShowcase } from '@domains/landing/components/categories/feedback/NotificationBellShowcase';
import { ProgressShowcase } from '@domains/landing/components/categories/feedback/ProgressShowcase';
import { SkeletonShowcase } from '@domains/landing/components/categories/feedback/SkeletonShowcase';
import { SnackbarShowcase } from '@domains/landing/components/categories/feedback/SnackbarShowcase';
import { SpinnerShowcase } from '@domains/landing/components/categories/feedback/SpinnerShowcase';
import { ToastShowcase } from '@domains/landing/components/categories/feedback/ToastShowcase';

/**
 * FeedbackCategory - Showcase for feedback components
 */
export default function FeedbackCategory() {
	return (
		<div className="space-y-8">
			<div>
				<Heading as="h1" size="lg" className="mb-2 text-white">
					Feedback
				</Heading>
				<Text className="text-white/70">
					Components for user feedback, notifications, and status messaging
				</Text>
			</div>

			<AlertShowcase />
			<SpinnerShowcase />
			<ProgressShowcase />
			<SkeletonShowcase />
			<ToastShowcase />
			<SnackbarShowcase />
			<BannerShowcase />
			<EmptyStateShowcase />
			<NotificationBellShowcase />
		</div>
	);
}
