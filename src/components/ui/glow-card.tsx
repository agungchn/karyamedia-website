"use client"

import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 }
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  style,
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement>(null);
  const [isMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768)
  );

  const { base, spread } = glowColorMap[glowColor];

  useEffect(() => {
    if (isMobile || !cardRef.current) return;

    const el = cardRef.current;
    let rafId: number;

    const syncPointer = (e: PointerEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const { clientX: x, clientY: y } = e;
        const xp = x / window.innerWidth;
        const yp = y / window.innerHeight;
        const hue = base + (xp * spread);
        const bs = 3;
        const sl = 200;

        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
        el.style.setProperty('--hue', `${hue}`);
        el.style.setProperty('--sl', `${sl}px`);
        el.style.setProperty('--bs', `${bs}px`);

        if (styleRef.current) {
          styleRef.current.textContent = `
            [data-glow]::before, [data-glow]::after {
              pointer-events: none; content: ""; position: absolute;
              inset: calc(var(--bs) * -1);
              border: var(--bs) solid transparent;
              border-radius: 14px;
              background-attachment: fixed;
              background-size: calc(100% + ${2 * bs}px) calc(100% + ${2 * bs}px);
              background-repeat: no-repeat; background-position: 50% 50%;
              mask: linear-gradient(transparent,transparent), linear-gradient(white,white);
              mask-clip: padding-box, border-box; mask-composite: intersect;
            }
            [data-glow]::before {
              background-image: radial-gradient(calc(var(--sl)*0.75) calc(var(--sl)*0.75) at var(--x) var(--y), hsla(var(--hue),100%,50%,1), transparent 100%);
              filter: brightness(2);
            }
            [data-glow]::after {
              background-image: radial-gradient(calc(var(--sl)*0.5) calc(var(--sl)*0.5) at var(--x) var(--y), hsl(0,100%,100%), transparent 100%);
            }
            [data-glow] [data-glow] {
              position: absolute; inset: 0; will-change: filter;
              border-radius: 14px; border-width: 60px;
              filter: blur(30px); background: none; pointer-events: none; border: none;
            }
            [data-glow] > [data-glow]::before {
              inset: -10px; border-width: 10px;
            }
          `;
        }
      });
    };

    document.addEventListener('pointermove', syncPointer);
    return () => {
      document.removeEventListener('pointermove', syncPointer);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile, base, spread]);

  const getSizeClasses = () => {
    if (customSize) return '';
    return sizeMap[size];
  };

  if (isMobile) {
    return (
      <div className={`rounded-2xl bg-white/5 backdrop-blur-sm ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      data-glow
      style={{
        position: 'relative',
        touchAction: 'none',
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        ...style,
      }}
      className={`
        ${getSizeClasses()}
        ${!customSize ? 'aspect-[3/4]' : ''}
        rounded-2xl relative grid grid-rows-[1fr_auto]
        shadow-[0_1rem_2rem_-1rem_black] p-4 gap-4 backdrop-blur-[5px]
        ${className}
      `}
    >
      <style ref={styleRef} />
      <div data-glow></div>
      {children}
    </div>
  );
};

export { GlowCard }
