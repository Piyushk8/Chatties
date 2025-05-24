import React, { useState, useEffect } from 'react';
import { MessageCircle, Zap, Coffee } from 'lucide-react';

const ChatAppLoader = () => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState('');

  // Messages that change based on loading time
  const messages = [
    {
      icon: MessageCircle,
      text: "Starting conversations...",
      subtext: "Great things happen when people connect",
      timeThreshold: 0
    },
    {
      icon: Zap,
      text: "Almost ready...",
      subtext: "Every message is a new beginning",
      timeThreshold: 3000
    },
    {
      icon: Coffee,
      text: "Taking a bit longer...",
      subtext: "We're on Render - cold starts happen, but it's worth the wait!",
      timeThreshold: 10000
    }
  ];

  // Animated dots for loading text
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Track loading time and update messages
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime(prev => {
        const newTime = prev + 100;
        
        // Update message based on time threshold
        const newMessageIndex = messages.findIndex((msg, index) => {
          const nextMsg = messages[index + 1];
          return newTime >= msg.timeThreshold && (!nextMsg || newTime < nextMsg.timeThreshold);
        });
        
        if (newMessageIndex !== -1 && newMessageIndex !== currentMessage) {
          setCurrentMessage(newMessageIndex);
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentMessage]);

  const CurrentIcon = messages[currentMessage].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-gray-600 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Main Logo/Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <CurrentIcon className="w-10 h-10 text-white dark:text-gray-100" />
          </div>
          
          {/* Animated Ring */}
          <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-blue-200 dark:border-gray-700 rounded-full animate-spin">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Outer Ring */}
          <div className="absolute -inset-2 w-24 h-24 mx-auto border-2 border-purple-100 dark:border-purple-200 rounded-full animate-ping opacity-30 dark:opacity-40"></div>
        </div>

        {/* Loading Text with Animated Transition */}
        <div className="transition-all duration-500 ease-in-out">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {messages[currentMessage].text}
            <span className="inline-block w-8 text-left">{dots}</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            {messages[currentMessage].subtext}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full max-w-xs mx-auto">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${Math.min(100, (loadingTime / 15000) * 100)}%`,
                animation: 'shimmer 2s infinite'
              }}
            ></div>
          </div>
        </div>

        {/* Floating Chat Bubbles Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-blue-100 dark:bg-gray-700 rounded-full opacity-20 dark:opacity-30"
              style={{
                left: `${20 + (i * 15)}%`,
                animationDelay: `${i * 0.5}s`,
                animation: 'float 3s ease-in-out infinite'
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        .animate-spin {
          animation: spin 2s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ChatAppLoader;