// FILE: /app/components/CustomCursor.tsx

"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const NUM_TRAILS = 6;

    // Create trail elements
    trailsRef.current = Array.from({ length: NUM_TRAILS }).map((_, i) => {
      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed; pointer-events: none; z-index: 99996;
        width: ${4 - i * 0.4}px; height: ${4 - i * 0.4}px;
        background: rgba(0, 212, 255, ${0.4 - i * 0.06});
        border-radius: 50%; transform: translate(-50%, -50%);
        transition: opacity 0.1s ease;
      `;
      document.body.appendChild(el);
      return el;
    });

    const trailPositions = Array.from({ length: NUM_TRAILS }).map(() => ({
      x: 0,
      y: 0,
    }));

    let animId: number;

    const animate = () => {
      // Update dot (instant)
      if (dotRef.current) {
        dotRef.current.style.left = `${posRef.current.x}px`;
        dotRef.current.style.top = `${posRef.current.y}px`;
      }

      // Ring follows with lag
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosRef.current.x}px`;
        ringRef.current.style.top = `${ringPosRef.current.y}px`;
      }

      // Trail follows with cascading lag
      trailPositions[0].x += (posRef.current.x - trailPositions[0].x) * 0.25;
      trailPositions[0].y += (posRef.current.y - trailPositions[0].y) * 0.25;

      for (let i = 1; i < NUM_TRAILS; i++) {
        trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.4;
        trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.4;
      }

      trailPositions.forEach((pos, i) => {
        if (trailsRef.current[i]) {
          trailsRef.current[i].style.left = `${pos.x}px`;
          trailsRef.current[i].style.top = `${pos.y}px`;
        }
      });

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.style.cursor === "pointer"
      ) {
        setHovering(true);
      }
    };

    const handleMouseLeave = () => setHovering(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
      trailsRef.current.forEach((el) => el.remove());
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        id="custom-cursor"
        style={{ position: "fixed", zIndex: 99999, pointerEvents: "none" }}
      >
        <div id="cursor-dot" />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        id="cursor-ring"
        className={hovering ? "hovering" : ""}
      />
    </>
  );
}
