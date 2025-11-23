import { AvatarShowcase } from './cards-badges/AvatarShowcase';
import { BadgeShowcase } from './cards-badges/BadgeShowcase';
import { CardShowcase } from './cards-badges/CardShowcase';
import { StatCardShowcase } from './cards-badges/StatCardShowcase';

export function CardsBadgesShowcase() {
	return (
		<div className="space-y-8">
			<CardShowcase />
			<BadgeShowcase />
			<AvatarShowcase />
			<StatCardShowcase />
		</div>
	);
}
