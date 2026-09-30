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

/** Set on `<html>` while a page has an intro loader — the header's CSS gate. */
export const introPageAttribute = 'data-intro-page';

/** Where the loader's count holds while the hero's assets are still loading. */
export const loaderWaitingCap = 0.9;

/**
 * Inlined at the end of the loader's markup, so it runs during HTML parsing.
 * It marks `<html>` with `introPageAttribute` straight away. Then, until the
 * loader hydrates (it sets `data-loader-live`), it rolls the count and
 * hairline by time since navigation start — the count moves from the first
 * paint rather than sitting at 000 while the page's JavaScript loads. Same
 * formula as the component, which picks up from whatever this last wrote.
 */
export const loaderTickerScript = `(function(){var r=document.currentScript&&document.currentScript.parentElement;if(!r)return;var c=r.querySelector('[data-loader-count]'),l=r.querySelector('[data-loader-line]'),m=parseFloat(r.getAttribute('data-min-seconds'))||2,d=document.documentElement;d.setAttribute('${introPageAttribute}','');if(!c||!l)return;(function t(){if(r.hasAttribute('data-loader-live')||d.getAttribute('data-intro')!=='${IntroGate.PLAY}')return;var p=Math.min(performance.now()/1000/m,${loaderWaitingCap});c.textContent=String(Math.round(p*100)).padStart(3,'0');l.style.transform='scaleX('+p+')';requestAnimationFrame(t)})()})()`;
