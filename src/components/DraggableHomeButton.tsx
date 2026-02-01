'use client';

import React, { useState, useRef, useEffect, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/LoadingContext';

export default function DraggableHomeButton() {
  const router = useRouter();
  const nodeRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const { showLoading } = useLoading();

  useEffect(() => {
    setIsClient(true);
    setPosition({
      x: window.innerWidth - 80,
      y: window.innerHeight - 100,
    });
  }, []);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    if (!nodeRef.current) return;
    
    isDraggingRef.current = false;
    const rect = nodeRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    // A single mouse move now registers as a drag, making it feel instant.
    isDraggingRef.current = true;
    e.preventDefault(); // Prevent text selection while dragging.
    
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    
    if (nodeRef.current) {
        const maxX = window.innerWidth - nodeRef.current.offsetWidth;
        const maxY = window.innerHeight - nodeRef.current.offsetHeight;
        setPosition({ 
            x: Math.max(0, Math.min(newX, maxX)), 
            y: Math.max(0, Math.min(newY, maxY))
        });
    } else {
        setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (!isDraggingRef.current) {
      showLoading();
      router.push('/home');
    }
    // No need to reset isDraggingRef here, it's reset on mousedown.
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <Button
      ref={nodeRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
      }}
      variant="default"
      size="icon"
      className={cn(
        'z-50 h-14 w-14 rounded-full shadow-lg cursor-grab active:cursor-grabbing'
      )}
    >
      <Home className="h-6 w-6" />
      <span className="sr-only">Home</span>
    </Button>
  );
}
