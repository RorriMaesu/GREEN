import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants for different animation types
const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  },
  slideUp: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  },
  slideInLeft: {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  },
  slideInRight: {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  },
  scale: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
  },
  staggered: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
};

// Child variants for staggered animations
export const childVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

/**
 * AnimatedSection component that animates its children when they come into view
 * 
 * @param {Object} props - Component props
 * @param {string} props.animation - Animation type: 'fadeIn', 'slideUp', 'slideInLeft', 'slideInRight', 'scale', 'staggered'
 * @param {number} props.delay - Delay before animation starts (in seconds)
 * @param {number} props.threshold - Threshold for when the animation should trigger (0-1)
 * @param {Object} props.style - Additional styles to apply to the container
 * @param {React.ReactNode} props.children - Child components to animate
 * @returns {JSX.Element} Animated section component
 */
export default function AnimatedSection({ 
  animation = 'fadeIn', 
  delay = 0, 
  threshold = 0.1,
  style = {},
  children,
  ...props
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold
  });

  const selectedVariant = variants[animation] || variants.fadeIn;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={selectedVariant}
      transition={{ delay }}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
