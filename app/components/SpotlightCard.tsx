import React, { useRef, ElementType } from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  as?: ElementType;
}

const SpotlightCard = ({ 
  children, 
  className = '', 
  spotlightColor, 
  as: Component = 'div', 
  ...props 
}: SpotlightCardProps) => {
  const elementRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    elementRef.current.style.setProperty('--mouse-x', `${x}px`);
    elementRef.current.style.setProperty('--mouse-y', `${y}px`);
    if (spotlightColor) {
      elementRef.current.style.setProperty('--spotlight-color', spotlightColor);
    }
  };

  return (
    <Component 
      ref={elementRef} 
      onMouseMove={handleMouseMove} 
      className={`card-spotlight ${className}`} 
      {...props}
    >
      <span className="card-spotlight-content">
        {children}
      </span>
    </Component>
  );
};

export default SpotlightCard;
