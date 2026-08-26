import { Reveal } from '@/components/snippets/reveal/reveal';
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
					<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
						What Clients Say
					</p>
					<h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
						Trusted by the teams we&apos;ve built for
					</h2>
				</Reveal>

				<Reveal
					delay={80}
					className="mt-12"
				>
					<Carousel opts={{ align: 'start', loop: true }}>
						<CarouselContent>
							{testimonials.map((testimonial) => (
								<CarouselItem
									key={testimonial.author}
									className="sm:basis-1/2 lg:basis-1/3"
								>
									<figure className="flex h-full flex-col rounded-md border border-border bg-card p-6">
										<blockquote className="flex-1 text-sm text-pretty text-foreground">
											&ldquo;{testimonial.quote}&rdquo;
										</blockquote>
										<figcaption className="mt-6 flex items-center gap-3">
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
						<div className="mt-6 flex justify-end gap-2">
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
