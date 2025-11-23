import Avatar from '@core/ui/data-display/avatar/Avatar';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function AvatarShowcase() {
	return (
		<ShowcaseSection
			title="Avatar"
			description="Avatar component for user profile images"
			tags={['data', 'avatar', 'profile', 'image']}
		>
			<div className="flex flex-wrap gap-4">
				<Avatar fallback="JD" size="sm" />
				<Avatar fallback="JS" size="md" />
				<Avatar fallback="BJ" size="lg" />
				<Avatar fallback="AB" size="md" />
			</div>
		</ShowcaseSection>
	);
}
