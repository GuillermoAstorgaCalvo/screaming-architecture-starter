import IconButton from '@core/ui/icon-button/IconButton';
import HeartIcon from '@core/ui/icons/heart-icon/HeartIcon';
import SearchIcon from '@core/ui/icons/search-icon/SearchIcon';
import SettingsIcon from '@core/ui/icons/settings-icon/SettingsIcon';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function IconButtonShowcase() {
	return (
		<ShowcaseSection
			title="IconButton"
			description="Icon button component"
			tags={['button', 'icon', 'action']}
		>
			<div className="flex flex-wrap gap-4">
				<IconButton icon={<SearchIcon />} variant="default" aria-label="Search" />
				<IconButton icon={<SettingsIcon />} variant="ghost" aria-label="Settings" />
				<IconButton icon={<HeartIcon />} variant="default" size="sm" aria-label="Small" />
				<IconButton icon={<SearchIcon />} variant="default" size="lg" aria-label="Large" />
				<IconButton icon={<SettingsIcon />} variant="default" disabled aria-label="Disabled" />
			</div>
		</ShowcaseSection>
	);
}
