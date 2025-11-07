import { motion } from 'framer-motion';

const variants = {
  initial: {
    opacity: 0,
    y: 24,
    filter: 'blur(12px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -24,
    filter: 'blur(12px)',
    transition: {
      duration: 0.45,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const PageTransition = ({ children, ...props }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={variants}
    {...props}
  >
    {children}
  </motion.div>
);

export default PageTransition;
