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
		<section className="dark border-y border-border bg-background text-foreground">
			<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<Reveal className="max-w-xl">
					<SectionTag
						index={8}
						label="What Clients Say"
					/>
					<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
						Trusted by the teams we&apos;ve built for
					</h2>
				</Reveal>

				<Reveal
					delay={80}
					className="mt-16"
				>
					<Carousel opts={{ align: 'start', loop: true }}>
						<CarouselContent>
							{testimonials.map((testimonial) => (
								<CarouselItem
									key={testimonial.author}
									className="lg:basis-1/2"
								>
									<figure className="flex h-full flex-col justify-between border-t border-border pt-8 pr-8">
										<blockquote className="font-heading text-2xl leading-snug text-pretty text-foreground sm:text-3xl">
											&ldquo;{testimonial.quote}&rdquo;
										</blockquote>
										<figcaption className="mt-10 flex items-center gap-3">
											<Avatar>
												<AvatarFallback>
													{getInitials(
														testimonial.author
													)}
												</AvatarFallback>
											</Avatar>
											<div>
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
						<div className="mt-10 flex justify-end gap-2">
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
