import { useEffect, useRef, useState } from 'react';

export default function RevealOnScroll({ children, className = "", animationClass = "animate-fade-up", delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px"
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`${className} ${isVisible ? animationClass : 'opacity-0'}`}
      style={delay ? { animationDelay: `${delay}ms` } : {}}
    >
      {children}
    </div>
  );
}
