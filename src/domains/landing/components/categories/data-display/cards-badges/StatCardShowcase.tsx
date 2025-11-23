import StatCard from '@core/ui/data-display/stat/StatCard';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function StatCardShowcase() {
	return (
		<ShowcaseSection
			title="StatCard"
			description="Statistics/metrics display component"
			tags={['data', 'card', 'stat', 'metric', 'chart']}
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<StatCard value="1,234" label="Total Users" trend={{ direction: 'up', value: 12.5 }} />
				<StatCard
					value="42"
					label="Active Sessions"
					trend={{ direction: 'down', value: 5.2, label: 'vs last week' }}
				/>
				<StatCard value="98%" label="Uptime" />
			</div>
		</ShowcaseSection>
	);
}
