'use client';

import { motion } from 'framer-motion';

const ScrollAnimation = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}) => {
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up':
        return { y: 30 };
      case 'down':
        return { y: -30 };
      case 'left':
        return { x: 30 };
      case 'right':
        return { x: -30 };
      default:
        return { y: 30 };
    }
  };

  const offset = getDirectionOffset();

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.5,
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1],
        }
      }}
      viewport={{
        once: true,
        margin: '0px',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation; 