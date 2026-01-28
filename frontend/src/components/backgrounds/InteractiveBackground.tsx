import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  originalX: number;
  originalY: number;
}

interface InteractiveBackgroundProps {
  weatherCondition?: 'sunny' | 'rainy' | 'night' | 'stormy' | 'clear' | 'cloudy' | 'snowy';
  particleCount?: number;
}

const InteractiveBackground = ({
  weatherCondition = 'night',
  particleCount = 80
}: InteractiveBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  const getGradientColors = useCallback(() => {
    switch (weatherCondition) {
      case 'sunny':
      case 'clear':
        return { start: '#f59e0b', end: '#0ea5e9', particle: 'rgba(251, 191, 36, 0.5)' };
      case 'rainy':
        return { start: '#1e3a8a', end: '#334155', particle: 'rgba(147, 197, 253, 0.4)' };
      case 'stormy':
        return { start: '#4c1d95', end: '#0f172a', particle: 'rgba(251, 191, 36, 0.6)' };
      case 'cloudy':
        return { start: '#475569', end: '#1e293b', particle: 'rgba(203, 213, 225, 0.3)' };
      default:
        return { start: '#2e1065', end: '#020617', particle: 'rgba(168, 85, 247, 0.3)' };
    }
  }, [weatherCondition]);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        originalX: x,
        originalY: y,
      });
    }
    particlesRef.current = particles;
  }, [particleCount]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d'); // 💡 FIX: Define ctx inside the function
    if (!ctx) return;

    const { width, height } = canvas;
    const colors = getGradientColors();

    // 1. Draw Background
    const gradient = ctx.createRadialGradient(width * 0.3, height * 0.2, 0, width * 0.5, height * 0.5, Math.max(width, height));
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Update and Draw Particles
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;

    particlesRef.current.forEach((particle) => {
      // Weather Physics
      if (weatherCondition === 'rainy' || weatherCondition === 'stormy') {
        particle.vy += 0.2; // Gravity for rain
        particle.vx *= 0.1; // Minimal horizontal movement
        if (particle.y > height) {
          particle.y = -20;
          particle.vy = Math.random() * 5 + 5;
        }
      } else if (weatherCondition === 'sunny' || weatherCondition === 'clear') {
        particle.vy -= 0.02; // Floating up like heat haze
        if (particle.y < 0) particle.y = height;
      }

      // Mouse Interaction
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        const angle = Math.atan2(dy, dx);
        particle.vx -= Math.cos(angle) * force * 2;
        particle.vy -= Math.sin(angle) * force * 2;
      }

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Draw specialized shapes
      if (weatherCondition === 'rainy' || weatherCondition === 'stormy') {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x, particle.y + 15);
        ctx.stroke();
      } else {
        ctx.beginPath();
        const pGrd = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 4);
        pGrd.addColorStop(0, colors.particle);
        pGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = pGrd;
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [getGradientColors, weatherCondition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    const handleMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 block"
      style={{ pointerEvents: 'none' }} // 💡 Fixed inline style error by moving mostly to Tailwind
    />
  );
};

export default InteractiveBackground;