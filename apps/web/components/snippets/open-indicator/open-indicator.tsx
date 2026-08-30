/**
 * A plus that loses its upright stroke on open, in place of the default
 * chevron swap — a quieter, more mechanical tell that matches the schematic
 * language used across the site. Expects an `AccordionTrigger` ancestor, which
 * supplies the `group/accordion-trigger` it reads its open state from.
 */
export function OpenIndicator() {
	return (
		<span
			aria-hidden
			className="relative mt-1.5 ml-6 size-3.5 shrink-0"
		>
			<span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-muted-foreground transition-colors duration-300 group-aria-expanded/accordion-trigger:bg-primary" />
			<span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-muted-foreground transition-transform duration-300 ease-power-on group-aria-expanded/accordion-trigger:scale-y-0" />
		</span>
	);
}
