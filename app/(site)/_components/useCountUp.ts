"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 金額を 0.5秒ほどで数え上げる／下げる。トップの「料金の目安」と /simulator の結果で使う。
 * `prefers-reduced-motion: reduce` のときは動かさず、次のフレームで着地させる。
 * target が null（金額を出さない状態）の間は、最後に出していた数字のまま止まる。
 */
export function useCountUp(target: number | null, initial: number): number {
  const [shown, setShown] = useState(initial);
  const shownRef = useRef(initial);

  useEffect(() => {
    if (target === null) return;
    const from = shownRef.current;
    if (from === target) return;
    const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 520;
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now: number) {
      const p = dur === 0 ? 1 : Math.min(1, (now - start) / dur);
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      shownRef.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return shown;
}
