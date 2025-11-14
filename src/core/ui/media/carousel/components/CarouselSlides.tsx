import { Children, type ReactElement, type ReactNode } from 'react';

interface CarouselSlidesProps {
	readonly slides: ReactNode[];
	readonly activeIndex: number;
	readonly carouselId: string;
}

export function CarouselSlides({ slides, activeIndex, carouselId }: Readonly<CarouselSlidesProps>) {
	const slidesArray = Children.toArray(slides);

	return (
		<div className="relative overflow-hidden rounded-lg">
			<div
				className="flex transition-transform duration-slow ease-in-out"
				style={{
					transform: `translateX(-${activeIndex * 100}%)`,
				}}
			>
				{slidesArray.map((slide, index) => {
					const slideElement = slide as ReactElement;
					const key = slideElement.key ?? `${carouselId}-slide-${index}`;
					return (
						<div
							key={key}
							id={`${carouselId}-slide-${index}`}
							aria-roledescription="slide"
							aria-label={`Slide ${index + 1} of ${slidesArray.length}`}
							className="min-w-full shrink-0"
						>
							{slide}
						</div>
					);
				})}
			</div>
		</div>
	);
}
