import { ReactNode, useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';

interface StatBoxProps {
  icon: ReactNode;
  value: string;
  label: string;
  animationDuration?: number;
  // animationDelay?: number;
  valuePrefix?: string;
  valueSuffix?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ 
  icon, 
  value, 
  label,
  animationDuration = 2.5,
  // animationDelay = 0.3,
  valuePrefix = '',
  valueSuffix = '+'
}) => {

  const [isVisible, setIsVisible] = useState(false);
  // Reference to the component's DOM element
  const statBoxRef = useRef<HTMLDivElement>(null);
  
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));

  useEffect(() => {
    // Create the IntersectionObserver instance
    const observer = new IntersectionObserver(
      (entries) => {
        // We're only observing one element, so we can use the first entry
        const entry = entries[0];
        
        // If the element is in the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once we've started the animation, we can stop observing
          if (statBoxRef.current) {
            observer.unobserve(statBoxRef.current);
          }
        }
      },
      {
        // Root is the viewport
        root: null,
        // Start animation when element is 10% visible
        threshold: 0.1,
        // Start a bit before the element enters the viewport
        rootMargin: '0px 0px -50px 0px'
      }
    );
    // Start observing our element
    if (statBoxRef.current) {
      observer.observe(statBoxRef.current);
    }
    
    // Clean up the observer when component unmounts
    return () => {
      if (statBoxRef.current) {
        observer.unobserve(statBoxRef.current);
      }
    };
  }, []);

  return (
    <div 
    ref={statBoxRef}
    className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center w-[90%] mx-auto text-center font-text">
      <div className="mb-3">
        {icon}
      </div>
      <div className="text-gold text-3xl font-bold mb-1">
      {valuePrefix}
      {isVisible ? (
          <CountUp 
            start={0}
            end={numericValue} 
            duration={animationDuration}
            separator=","
            useEasing={true}
            enableScrollSpy={false}
          />
        ) : '0'}
        {valueSuffix}
      </div>
      <div className="text-primary">
        {label}
      </div>
    </div>
  );
};
