import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VisualizerProps {
  isPlaying: boolean;
  getVisualizerData?: () => Uint8Array | null;
  className?: string;
}

export default function Visualizer({ isPlaying, getVisualizerData, className }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying && getVisualizerData) {
        const dataArray = getVisualizerData();
        if (dataArray) {
          const barWidth = canvas.width / dataArray.length;
          let x = 0;

          for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            
            // Create gradient for each bar
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
            gradient.addColorStop(0, 'hsl(262, 90%, 67%)');
            gradient.addColorStop(0.5, 'hsl(330, 81%, 60%)');
            gradient.addColorStop(1, 'hsl(217, 91%, 60%)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
            
            x += barWidth;
          }
        }
      } else {
        // Static bars when not playing
        const barCount = 8;
        const barWidth = canvas.width / barCount;
        const staticHeights = [0.3, 0.6, 0.4, 0.8, 0.5, 0.7, 0.4, 0.6];

        for (let i = 0; i < barCount; i++) {
          const barHeight = staticHeights[i] * canvas.height;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
          gradient.addColorStop(0, 'hsl(262, 90%, 67%)');
          gradient.addColorStop(0.5, 'hsl(330, 81%, 60%)');
          gradient.addColorStop(1, 'hsl(217, 91%, 60%)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, getVisualizerData]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={60}
      className={cn("rounded-lg", className)}
    />
  );
}

interface StaticVisualizerProps {
  className?: string;
}

export function StaticVisualizer({ className }: StaticVisualizerProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-1 h-4 bg-gradient-to-t from-neon-purple to-neon-pink rounded visualizer-bar"></div>
      <div className="w-1 h-6 bg-gradient-to-t from-neon-pink to-neon-blue rounded visualizer-bar"></div>
      <div className="w-1 h-3 bg-gradient-to-t from-neon-blue to-neon-green rounded visualizer-bar"></div>
      <div className="w-1 h-8 bg-gradient-to-t from-neon-green to-neon-red rounded visualizer-bar"></div>
      <div className="w-1 h-4 bg-gradient-to-t from-neon-red to-neon-purple rounded visualizer-bar"></div>
    </div>
  );
}
