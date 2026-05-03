import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

function GradientLayer({ springX, springY, gradientColor, opacity, multiplier }) {
  const x = useTransform(springX, (val) => val * multiplier);
  const y = useTransform(springY, (val) => val * multiplier);
  const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, ${gradientColor} 0%, transparent 60%)`;

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        background,
        pointerEvents: 'none',
      }}
    />
  );
}

export const NoiseBackground = ({
  children,
  containerStyle = {},
  gradientColors = ["#e100ff", "#00ff88", "#cf6fff"],
  speed = 0.06,
  animating = true,
}) => {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 80, damping: 25 });
  const springY = useSpring(y, { stiffness: 80, damping: 25 });
  const topGradientX = useTransform(springX, (val) => val * 0.1 - 50);

  const velocityRef = useRef({ x: speed, y: speed * 0.7 });
  const lastChangeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set(rect.width / 2);
    y.set(rect.height / 2);
  }, [x, y]);

  useAnimationFrame((time) => {
    if (!animating || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (time - lastChangeRef.current > 2000 + Math.random() * 1500) {
      const angle = Math.random() * Math.PI * 2;
      velocityRef.current = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };
      lastChangeRef.current = time;
    }

    let newX = x.get() + velocityRef.current.x * 16;
    let newY = y.get() + velocityRef.current.y * 16;
    const pad = 10;

    if (newX < pad || newX > rect.width - pad) velocityRef.current.x *= -1;
    if (newY < pad || newY > rect.height - pad) velocityRef.current.y *= -1;

    x.set(Math.max(pad, Math.min(rect.width - pad, newX)));
    y.set(Math.max(pad, Math.min(rect.height - pad, newY)));
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        ...containerStyle,
      }}
    >
      {/* Moving gradient blobs */}
      <GradientLayer springX={springX} springY={springY} gradientColor={gradientColors[0]} opacity={0.5} multiplier={1} />
      <GradientLayer springX={springX} springY={springY} gradientColor={gradientColors[1]} opacity={0.35} multiplier={0.65} />
      {gradientColors[2] && (
        <GradientLayer springX={springX} springY={springY} gradientColor={gradientColors[2]} opacity={0.25} multiplier={1.3} />
      )}

      {/* Top highlight strip */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '1px',
          opacity: 0.7,
          background: `linear-gradient(to right, transparent, ${gradientColors[0]}, ${gradientColors[1]}, transparent)`,
          x: topGradientX,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>{children}</div>
    </div>
  );
};
