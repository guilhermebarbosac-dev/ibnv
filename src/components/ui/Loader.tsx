import { motion } from 'framer-motion';

interface LoaderProps {
  size?: number;
  color?: string;
}

export function Loader({ size = 40, color = '#383434' }: LoaderProps) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        border: `4px solid ${color}`,
        borderBottomColor: 'transparent',
        borderRadius: '50%',
        display: 'inline-block',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}