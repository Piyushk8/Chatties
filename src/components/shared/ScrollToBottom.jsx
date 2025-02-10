import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const ScrollBottomButton = ({ containerRef, messages }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (!container) return;
    
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToBottom}
      className={cn(
        'fixed bottom-24 right-8 z-50 rounded-full bg-primary p-2 text-white shadow-lg transition-all duration-200 hover:bg-primary/90',
        showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="h-6 w-6" />
    </button>
  );
};

export default ScrollBottomButton;