import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { testimonials } from '@/constants/home';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@workspace/ui/components/carousel';

function getInitials(name: string) {
	return name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

export function Testimonials() {
	return (
		<section className="border-t border-border bg-secondary/30">
			<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<SectionTag
					index={10}
					label="What Clients Say"
				/>

				<Reveal
					delay={80}
					className="mt-14"
				>
					<Carousel opts={{ align: 'start', loop: true }}>
						<CarouselContent>
							{testimonials.map((testimonial) => (
								<CarouselItem key={testimonial.author}>
									<figure className="mx-auto flex max-w-3xl flex-col items-center gap-8 py-4 text-center">
										<blockquote className="font-serif text-3xl leading-tight text-pretty text-foreground italic sm:text-4xl">
											&ldquo;{testimonial.quote}&rdquo;
										</blockquote>
										<figcaption className="flex items-center gap-3">
											<Avatar>
												<AvatarFallback>
													{getInitials(
														testimonial.author
													)}
												</AvatarFallback>
											</Avatar>
											<div className="text-left">
												<p className="text-sm font-medium text-foreground">
													{testimonial.author}
												</p>
												<p className="text-xs text-muted-foreground">
													{testimonial.role}
												</p>
											</div>
										</figcaption>
									</figure>
								</CarouselItem>
							))}
						</CarouselContent>
						<div className="mt-4 flex justify-center gap-2">
							<CarouselPrevious
								variant="outline"
								className="static translate-y-0"
							/>
							<CarouselNext
								variant="outline"
								className="static translate-y-0"
							/>
						</div>
					</Carousel>
				</Reveal>
			</div>
		</section>
	);
}
