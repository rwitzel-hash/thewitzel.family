"use client";

import { useEffect, useRef } from "react";

type HomeStageProps = {
  className: string;
  children: React.ReactNode;
};

export function HomeStage({ className, children }: HomeStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltedRef = useRef<HTMLElement | null>(null);
  const reduceRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceRef.current = media.matches;
      if (media.matches && tiltedRef.current) {
        tiltedRef.current.style.transform = "";
        tiltedRef.current = null;
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage || reduceRef.current || event.pointerType !== "mouse") return;

    stage.style.setProperty("--spot-x", `${event.clientX}px`);
    stage.style.setProperty("--spot-y", `${event.clientY}px`);

    const bounds = stage.getBoundingClientRect();
    const nx = bounds.width ? event.clientX / bounds.width - 0.5 : 0;
    const ny = bounds.height ? event.clientY / bounds.height - 0.5 : 0;
    stage.style.setProperty("--parallax-x", `${(-nx * 16).toFixed(2)}px`);
    stage.style.setProperty("--parallax-y", `${(-ny * 10).toFixed(2)}px`);

    const card =
      (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-tilt]",
      ) ?? null;
    if (tiltedRef.current && tiltedRef.current !== card) {
      tiltedRef.current.style.transform = "";
    }
    tiltedRef.current = card;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const cx = rect.width ? (event.clientX - rect.left) / rect.width - 0.5 : 0;
    const cy = rect.height ? (event.clientY - rect.top) / rect.height - 0.5 : 0;
    card.style.transform = `perspective(1000px) rotateX(${(-cy * 4).toFixed(2)}deg) rotateY(${(cx * 5).toFixed(2)}deg)`;
  }

  function onPointerLeave() {
    const stage = stageRef.current;
    if (stage) {
      stage.style.setProperty("--parallax-x", "0px");
      stage.style.setProperty("--parallax-y", "0px");
    }
    if (tiltedRef.current) {
      tiltedRef.current.style.transform = "";
      tiltedRef.current = null;
    }
  }

  return (
    <div
      ref={stageRef}
      className={`home-stage isolate relative min-h-dvh ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}
