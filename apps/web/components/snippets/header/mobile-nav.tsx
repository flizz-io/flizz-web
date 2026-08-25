'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { NavItem } from '@/types/nav';
import { Button } from '@workspace/ui/components/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@workspace/ui/components/sheet';

interface MobileNavProps {
	navItems: NavItem[];
}

export function MobileNav({ navItems }: MobileNavProps) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet
			open={open}
			onOpenChange={setOpen}
		>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden"
					aria-label="Open menu"
				>
					<Menu className="size-5" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-full sm:max-w-xs"
			>
				<SheetHeader>
					<SheetTitle className="font-heading">Menu</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-1 px-4">
					{navItems.map((item) => (
						<SheetClose
							asChild
							key={item.href}
						>
							<Link
								href={item.href}
								className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-secondary"
							>
								{item.label}
							</Link>
						</SheetClose>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
