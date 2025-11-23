import NotificationBell from '@core/ui/feedback/notification-bell/NotificationBell';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function NotificationBellShowcase() {
	return (
		<ShowcaseSection title="NotificationBell" description="Notification bell component with badge">
			<div className="flex flex-wrap gap-4">
				<NotificationBell count={0} />
				<NotificationBell count={5} />
				<NotificationBell count={99} />
				<NotificationBell count={100} maxCount={99} />
			</div>
		</ShowcaseSection>
	);
}
