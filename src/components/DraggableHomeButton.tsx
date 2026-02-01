'use client';

import React, { useState, useRef, useEffect, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function DraggableHomeButton() {
  const router = useRouter();
  const nodeRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

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
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    const rect = nodeRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    const distance = Math.sqrt(
      Math.pow(e.clientX - dragStartPos.current.x, 2) +
      Math.pow(e.clientY - dragStartPos.current.y, 2)
    );
    if (distance > 5) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current) {
        e.preventDefault(); // Prevent text selection while dragging
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
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (!isDraggingRef.current) {
      router.push('/home');
    }
    isDraggingRef.current = false;
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
        'z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing'
      )}
    >
      <Home className="h-6 w-6" />
      <span className="sr-only">Home</span>
    </Button>
  );
}
