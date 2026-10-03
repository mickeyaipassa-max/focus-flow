function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function smoothScrollTo(targetY: number, duration: number) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Scrolt eased (ease-in/ease-out, `easeInOutCubic`) naar een element i.p.v. de
 * browser-eigen `scroll-behavior: smooth`, zodat de curve exact bepaald is.
 * Respecteert de `scroll-margin-top` van het doelelement (bv. `scroll-mt-6`)
 * i.p.v. die marge te hardcoden, en springt direct bij `prefers-reduced-motion`.
 */
export function smoothScrollToElement(target: HTMLElement, duration = 600) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.scrollIntoView();
    return;
  }
  const scrollMarginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - scrollMarginTop, duration);
}
