"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** 最終値。**page.tsx の定数から渡す。直書きしない** */
  to: number;
  /** 小数の桁数。積める量（2.8）だけ 1 */
  digits?: number;
};

/** 数え上げにかける時間（ミリ秒）。モックと同じ */
const DURATION = 1200;

function show(n: number, digits: number): string {
  return n.toLocaleString("ja-JP", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/**
 * トップの「先に出している数字」。画面に入ったら 0 から最終値まで数え上げる（91_top_lower）。
 *
 * ★**サーバーが出す HTML は最初から最終値。**JS が動かないとき、
 *   `prefers-reduced-motion: reduce` のとき、IntersectionObserver が無いときは、何もしない。
 * ★読み上げには最終値だけを渡す（動いているほうは aria-hidden）。
 *
 * まだ画面の外にあるうちに 0 に戻しておき、入ったところで数え始める。
 * 最初から画面の中にあるとき（/#faq から戻ったときなど）は、その場で数え始める。
 * 動いている間は React の state を通さず、文字だけを書き換えている（毎フレーム描き直さない）。
 */
export default function CountUp({ to, digits = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const put = (n: number) => {
      el.textContent = show(n, digits);
    };
    put(0);
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / DURATION);
          // 終わりは計算せず、渡された値をそのまま出す（丸めで1ずれるのを避ける）
          put(p < 1 ? to * (1 - Math.pow(1 - p, 3)) : to);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      put(to);
    };
  }, [to, digits]);

  return (
    <>
      <span className="tp-vh">{show(to, digits)}</span>
      <span ref={ref} aria-hidden="true">
        {show(to, digits)}
      </span>
    </>
  );
}
