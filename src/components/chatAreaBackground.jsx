import React, { useState, useEffect } from 'react';

export const ChatMessageAreaBackground = ({ children, className = "" }) => {
  const [bubbles, setBubbles] = useState([]);

  // Generate floating bubbles for subtle animation
  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: Math.random() * 40 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.1 + 0.02,
      }));
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Base Background with Subtle Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 via-white/50 to-gray-50/30 dark:from-gray-900/30 dark:via-gray-800/50 dark:to-gray-900/30">
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Subtle Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.008] dark:opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating Bubbles for Ambient Animation */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: `radial-gradient(circle, rgba(59, 130, 246, ${bubble.opacity}) 0%, rgba(147, 51, 234, ${bubble.opacity * 0.7}) 70%, transparent 100%)`,
              animation: `float-gentle ${bubble.duration}s ease-in-out infinite`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}

        {/* Subtle Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 dark:to-black/5" />
        
        {/* Edge Fade Effect */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/20 to-transparent dark:from-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/20 to-transparent dark:from-black/20" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: var(--start-opacity, 0.02);
          }
          25% {
            transform: translateY(-8px) translateX(4px) rotate(1deg);
            opacity: var(--mid-opacity, 0.04);
          }
          50% {
            transform: translateY(-4px) translateX(-6px) rotate(-0.5deg);
            opacity: var(--start-opacity, 0.02);
          }
          75% {
            transform: translateY(-12px) translateX(2px) rotate(0.8deg);
            opacity: var(--mid-opacity, 0.04);
          }
        }
      `}</style>
    </div>
  );
};
