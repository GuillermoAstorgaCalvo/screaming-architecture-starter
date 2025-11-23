import Map from '@core/ui/media/map/Map';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

/**
 * MapShowcase - Showcase for Map component
 */
export function MapShowcase() {
	return (
		<ShowcaseSection
			title="Map"
			description="Google Maps integration component"
			tags={['media', 'map', 'google', 'location', 'geography']}
		>
			<div className="space-y-4">
				<Map
					options={{
						center: { lat: 37.7749, lng: -122.4194 },
						zoom: 13,
					}}
					markers={[
						{
							id: '1',
							lat: 37.7749,
							lng: -122.4194,
							title: 'San Francisco',
						},
						{
							id: '2',
							lat: 37.7849,
							lng: -122.4094,
							title: 'Marker 2',
						},
					]}
					height="400px"
					className="rounded-lg border border-border"
				/>
				<Text size="sm" className="text-muted-foreground">
					Google Maps component with markers. API key is loaded from environment variables or
					runtime config.
				</Text>
			</div>
		</ShowcaseSection>
	);
}
