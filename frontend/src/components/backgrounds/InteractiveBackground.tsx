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
  const animationRef = useRef<number>();

  const getGradientColors = useCallback(() => {
    switch (weatherCondition) {
      case 'sunny':
      case 'clear':
        return { start: '#fbbf24', end: '#7dd3fc', particle: 'rgba(251, 191, 36, 0.6)' };
      case 'rainy':
      case 'stormy':
        return { start: '#312e81', end: '#475569', particle: 'rgba(99, 102, 241, 0.5)' };
      case 'night':
      default:
        return { start: '#2e1065', end: '#020617', particle: 'rgba(168, 85, 247, 0.4)' };
    }
  }, [weatherCondition]);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const colors = getGradientColors();

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    const interactionRadius = 150;

    particlesRef.current.forEach((particle) => {
      // Calculate distance from mouse
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Repel particles from cursor
      if (distance < interactionRadius && distance > 0) {
        const force = (interactionRadius - distance) / interactionRadius;
        const angle = Math.atan2(dy, dx);
        particle.vx -= Math.cos(angle) * force * 2;
        particle.vy -= Math.sin(angle) * force * 2;
      }

      // Return to original position slowly
      const returnForce = 0.01;
      particle.vx += (particle.originalX - particle.x) * returnForce;
      particle.vy += (particle.originalY - particle.y) * returnForce;

      // Apply velocity with damping
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Wrap around edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      // Draw particle with glow
      ctx.beginPath();
      const particleGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      particleGradient.addColorStop(0, colors.particle);
      particleGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = particleGradient;
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw core
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connection lines between nearby particles
    particlesRef.current.forEach((p1, i) => {
      particlesRef.current.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [getGradientColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default InteractiveBackground;
