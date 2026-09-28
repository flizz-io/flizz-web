import { IntroGate } from '@/enums/intro';

/** Set once the intro has played, so it runs once per browser session. */
export const introSessionKey = 'flizz-intro-seen';
/** `?intro=1` forces the intro, `?intro=0` skips it — for tuning. */
export const introQueryParam = 'intro';

/**
 * Runs in `<head>` before first paint. Reduced-motion visitors and anyone who
 * has already seen it this session skip; the query param overrides both.
 * Any failure (storage blocked) falls back to playing.
 */
export const introGateScript = `(function(){var d=document.documentElement;try{var q=new URLSearchParams(location.search).get('${introQueryParam}');var skip=sessionStorage.getItem('${introSessionKey}')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches;if(q==='1')skip=false;if(q==='0')skip=true;d.setAttribute('data-intro',skip?'${IntroGate.SKIP}':'${IntroGate.PLAY}')}catch(e){d.setAttribute('data-intro','${IntroGate.PLAY}')}})()`;
