'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Fixed: changed import from "motion/react" to "framer-motion" for consistent resolution
// Fixed: removed explicit TargetAndTransition type — framer-motion infers it correctly

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialProps: any = {
  pathLength: 0,
  opacity: 0,
  scale: 0.7,
  rotateY: -15,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const animateProps: any = {
  pathLength: 1,
  opacity: 1,
  scale: 1,
  rotateY: 0,
};

type Props = React.ComponentProps<typeof motion.svg> & {
  speed?: number;
  onAnimationComplete?: () => void;
};

// "Qmap" brand text draw-on animation — adapted from Samsung Hello style
function QmapTextEffect({ className, speed = 1, onAnimationComplete, ...props }: Props) {
  const c = (x: number) => x * speed;

  return (
    <motion.svg
      className={cn('h-28', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 700 250"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      initial={{ opacity: 1, scale: 0.85, rotateX: 8 }}
      exit={{ opacity: 0, scale: 0.6, rotateX: -8 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 140, damping: 18 }}
      {...props}
    >
      <title>Qmap</title>

      {/* Q — circle with tail */}
      <motion.g>
        <motion.path
          d="M80 70 A45 45 0 1 0 80.001 70"
          style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
          initial={initialProps}
          animate={animateProps}
          transition={{
            duration: c(1.2),
            ease: 'easeInOut',
            type: 'spring',
            stiffness: 120,
            damping: 14,
            opacity: { duration: 0.4 },
            scale: { duration: 0.7 },
          }}
        />
        <motion.path
          d="M105 135L130 165"
          style={{ strokeLinecap: 'round' }}
          initial={initialProps}
          animate={animateProps}
          transition={{
            duration: c(0.4),
            delay: c(1.1),
            type: 'spring',
            stiffness: 300,
            damping: 20,
            opacity: { duration: 0.25, delay: c(1.1) },
          }}
        />
      </motion.g>

      {/* m */}
      <motion.g>
        <motion.path
          d="M165 170L165 100"
          style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }}
          initial={initialProps}
          animate={animateProps}
          transition={{
            duration: c(0.5),
            delay: c(1.6),
            type: 'spring',
            stiffness: 280,
            damping: 20,
            opacity: { duration: 0.3, delay: c(1.6) },
          }}
        />
        <motion.path
          d="M165 115L195 100L225 115L225 170"
          style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }}
          initial={initialProps}
          animate={animateProps}
          transition={{
            duration: c(0.7),
            delay: c(2.0),
            type: 'spring',
            stiffness: 200,
            damping: 16,
            opacity: { duration: 0.4, delay: c(2.0) },
          }}
        />
      </motion.g>

      {/* a */}
      <motion.g>
        <motion.path
          d="M290 115C280 100 255 100 255 130C255 165 295 170 295 170L255 170"
          style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
          initial={initialProps}
          animate={animateProps}
          transition={{
            duration: c(0.9),
            delay: c(2.8),
            type: 'spring',
            stiffness: 160,
            damping: 14,
            opacity: { duration: 0.4, delay: c(2.8) },
          }}
        />
        <motion.path
          d="M295 115L295 170"
          style={{ strokeLinecap: 'square' }}
          initial={initialProps}
          animate={animateProps}
          transition={{
            duration: c(0.5),
            delay: c(2.6),
            type: 'spring',
            stiffness: 260,
            damping: 18,
            opacity: { duration: 0.3, delay: c(2.6) },
          }}
        />
      </motion.g>

      {/* p */}
      <motion.g>
        <motion.path
          d="M340 200L340 110"
          style={{ strokeLinecap: 'square' }}
          initial={initialProps}
          animate={animateProps}
          transition={{
            duration: c(0.6),
            delay: c(3.5),
            type: 'spring',
            stiffness: 240,
            damping: 18,
            opacity: { duration: 0.35, delay: c(3.5) },
          }}
        />
        <motion.path
          d="M340 110C375 100 390 130 375 150C360 170 340 160 340 150"
          style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
          initial={initialProps}
          animate={animateProps}
          transition={{
            duration: c(0.9),
            delay: c(3.8),
            type: 'spring',
            stiffness: 160,
            damping: 14,
            opacity: { duration: 0.4, delay: c(3.8) },
          }}
          onAnimationComplete={onAnimationComplete}
        />
      </motion.g>

      {/* Brand accent lines */}
      <motion.g className="stroke-purple-400" style={{ opacity: 0.5 }}>
        <motion.path
          d="M30 45L670 45"
          strokeWidth="2"
          style={{ strokeLinecap: 'square' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: c(1.8), delay: c(4.8), ease: 'easeOut' }}
        />
        <motion.path
          d="M30 215L670 215"
          strokeWidth="2"
          style={{ strokeLinecap: 'square' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: c(1.8), delay: c(5.0), ease: 'easeOut' }}
        />
      </motion.g>
    </motion.svg>
  );
}

// Keep original Samsung effects exported for reference
function SamsungHelloVietnameseEffect({ className, speed = 1, onAnimationComplete, ...props }: Props) {
  const calc = (x: number) => x * speed;

  return (
    <motion.svg
      className={cn('h-32', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1400 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      initial={{ opacity: 1, scale: 0.8, rotateX: 10 }}
      exit={{ opacity: 0, scale: 0.6, rotateX: -10 }}
      transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 15 }}
      {...props}
    >
      <title>xin chào</title>
      {/* x */}
      <motion.g>
        <motion.path d="M40 80L90 130L140 180" style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.6), ease: [0.25, 0.46, 0.45, 0.94], type: 'spring', stiffness: 300, damping: 20, opacity: { duration: 0.3 }, scale: { duration: 0.5, type: 'spring', stiffness: 200 } }} />
        <motion.path d="M140 80L90 130L40 180" style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.6), ease: [0.25, 0.46, 0.45, 0.94], delay: calc(0.2), type: 'spring', stiffness: 300, damping: 20, opacity: { duration: 0.3, delay: calc(0.2) }, scale: { duration: 0.5, delay: calc(0.2), type: 'spring', stiffness: 200 } }} />
      </motion.g>
      {/* Accent lines */}
      <motion.g className="stroke-cyan-400" style={{ opacity: 0.6 }}>
        <motion.path d="M50 50L1350 50" strokeWidth="2" style={{ strokeLinecap: 'square' }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }} transition={{ duration: calc(2.0), delay: calc(6.0), ease: 'easeOut' }} />
        <motion.path d="M50 220L1350 220" strokeWidth="2" style={{ strokeLinecap: 'square' }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }} transition={{ duration: calc(2.0), delay: calc(6.2), ease: 'easeOut' }} onAnimationComplete={onAnimationComplete} />
      </motion.g>
    </motion.svg>
  );
}

function SamsungHelloEnglishEffect({ className, speed = 1, onAnimationComplete, ...props }: Props) {
  const calc = (x: number) => x * speed;

  return (
    <motion.svg
      className={cn('h-28', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 250"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      initial={{ opacity: 1, scale: 0.8, rotateX: 8 }}
      exit={{ opacity: 0, scale: 0.6, rotateX: -8 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 140, damping: 18 }}
      {...props}
    >
      <title>hello</title>
      {/* h */}
      <motion.g>
        <motion.path d="M40 60L40 190" style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.5), ease: 'easeOut', type: 'spring', stiffness: 280, damping: 20, opacity: { duration: 0.3 }, scale: { duration: 0.4 } }} />
        <motion.path d="M40 125L100 125" style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.4), ease: 'easeInOut', delay: calc(0.3), type: 'spring', stiffness: 320, damping: 22, opacity: { duration: 0.25, delay: calc(0.3) }, scale: { duration: 0.35, delay: calc(0.3) } }} />
        <motion.path d="M100 60L100 190" style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.5), ease: 'easeOut', delay: calc(0.6), type: 'spring', stiffness: 280, damping: 20, opacity: { duration: 0.3, delay: calc(0.6) }, scale: { duration: 0.4, delay: calc(0.6) } }} />
      </motion.g>
      {/* o */}
      <motion.path
        d="M450 90L490 110L490 170L450 190L420 170L420 110L450 90"
        style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }}
        initial={initialProps}
        animate={animateProps}
        transition={{ duration: calc(0.8), ease: 'easeInOut', delay: calc(3.3), type: 'spring', stiffness: 180, damping: 16, opacity: { duration: 0.4, delay: calc(3.3) }, scale: { duration: 0.6, delay: calc(3.3) } }}
        onAnimationComplete={onAnimationComplete}
      />
      {/* Corner brackets */}
      <motion.g className="stroke-blue-500" style={{ opacity: 0.7 }}>
        <motion.path d="M20 40L20 20L40 20" strokeWidth="3" style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: calc(0.5), delay: calc(4.0), ease: 'easeOut' }} />
        <motion.path d="M500 40L520 20L520 40" strokeWidth="3" style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: calc(0.5), delay: calc(4.2), ease: 'easeOut' }} />
        <motion.path d="M20 210L20 230L40 230" strokeWidth="3" style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: calc(0.5), delay: calc(4.4), ease: 'easeOut' }} />
        <motion.path d="M500 210L520 230L520 210" strokeWidth="3" style={{ strokeLinecap: 'square', strokeLinejoin: 'miter' }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: calc(0.5), delay: calc(4.6), ease: 'easeOut' }} />
      </motion.g>
    </motion.svg>
  );
}

export { QmapTextEffect, SamsungHelloEnglishEffect, SamsungHelloVietnameseEffect };
