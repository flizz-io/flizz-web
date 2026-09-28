'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import { IntroPhase } from '@/enums/intro';

interface IntroContextValue {
	phase: IntroPhase;
	setPhase: (phase: IntroPhase) => void;
}

const IntroContext = createContext<IntroContextValue>({
	phase: IntroPhase.IDLE,
	setPhase: () => {}
});

/**
 * Shares the intro phase between the hero that owns the loader and the header,
 * which lives outside the page content and has to time its own entrance.
 */
export function IntroProvider({ children }: { children: React.ReactNode }) {
	const [phase, setPhase] = useState(IntroPhase.IDLE);
	const value = useMemo(() => ({ phase, setPhase }), [phase]);

	return (
		<IntroContext.Provider value={value}>{children}</IntroContext.Provider>
	);
}

export function useIntro() {
	return useContext(IntroContext);
}
