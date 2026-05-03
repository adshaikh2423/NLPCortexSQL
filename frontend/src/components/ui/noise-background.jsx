"use client";
import { cn } from "../../lib/utils";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

// Helper component for gradient layers
function GradientLayer({
  springX,
  springY,
  gradientColor,
  opacity,
  multiplier
}) {
  const x = useTransform(springX, (val) => val * multiplier);
  const y = useTransform(springY, (val) => val * multiplier);
  const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, ${gradientColor} 0%, transparent 50%)`;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        opacity,
        background,
      }} />
  );
}

export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = [
    "rgb(255, 100, 150)",
    "rgb(100, 150, 255)",
    "rgb(255, 200, 100)",
  ],
  noiseIntensity = 0.05,
  speed = 0.1,
  backdropBlur = false,
  animating = true
}) => {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const topGradientX = useTransform(springX, (val) => val * 0.1 - 50);

  const velocityRef = useRef({ x: 0, y: 0 });
  const lastDirectionChangeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set(rect.width / 2);
    y.set(rect.height / 2);
  }, [x, y]);

  useAnimationFrame((time) => {
    if (!animating || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const maxX = rect.width;
    const maxY = rect.height;

    if (time - lastDirectionChangeRef.current > 2000) {
      const angle = Math.random() * Math.PI * 2;
      velocityRef.current = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };
      lastDirectionChangeRef.current = time;
    }

    const deltaTime = 16;
    let newX = x.get() + velocityRef.current.x * deltaTime;
    let newY = y.get() + velocityRef.current.y * deltaTime;

    const padding = 10;
    if (newX < padding || newX > maxX - padding || newY < padding || newY > maxY - padding) {
      velocityRef.current.x *= -1;
      velocityRef.current.y *= -1;
    }

    x.set(Math.max(0, Math.min(maxX, newX)));
    y.set(Math.max(0, Math.min(maxY, newY)));
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        containerClassName
      )}
      style={{ isolation: 'isolate' }}
    >
      {/* Moving gradient layers */}
      <GradientLayer springX={springX} springY={springY} gradientColor={gradientColors[0]} opacity={0.3} multiplier={1} />
      <GradientLayer springX={springX} springY={springY} gradientColor={gradientColors[1]} opacity={0.2} multiplier={0.7} />
      
      {/* Top gradient strip */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[1px] opacity-50"
        style={{
          background: `linear-gradient(to right, transparent, ${gradientColors.join(", ")}, transparent)`,
          x: animating ? topGradientX : 0,
        }} />

      {/* CSS-only noise pattern (Stable) */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Content */}
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
