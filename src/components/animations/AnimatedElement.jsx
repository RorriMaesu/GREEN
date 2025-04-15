import { motion } from 'framer-motion';

/**
 * AnimatedElement component for individual element animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Element type ('div', 'span', etc.)
 * @param {Object} props.initial - Initial animation state
 * @param {Object} props.animate - Target animation state
 * @param {Object} props.transition - Animation transition properties
 * @param {Object} props.whileHover - Animation state when hovered
 * @param {Object} props.whileTap - Animation state when tapped/clicked
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Animated element
 */
export default function AnimatedElement({
  type = 'div',
  initial,
  animate,
  transition,
  whileHover,
  whileTap,
  children,
  ...props
}) {
  const MotionComponent = motion[type];

  return (
    <MotionComponent
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

// Preset animations for common use cases
export const presets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  },
  slideInLeft: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5 }
  },
  slideInRight: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5 }
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 }
  },
  buttonHover: {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.98 }
  },
  cardHover: {
    whileHover: { y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' },
    transition: { duration: 0.3 }
  },
  pulse: {
    animate: { 
      scale: [1, 1.03, 1],
      transition: { 
        repeat: Infinity, 
        repeatType: "loop", 
        duration: 2 
      }
    }
  }
};
