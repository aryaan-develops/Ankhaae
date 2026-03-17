import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 400, damping: 30 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* The Feather Cursor */}
      <motion.div
        className="fixed w-14 h-14 flex items-center justify-center"
        style={{
          left: springX,
          top: springY,
          x: "-30%",
          y: "-30%",
        }}
      >
        <motion.img
          src="/feather1.png"
          alt="Feather Cursor"
          className="w-full h-full object-contain"
          animate={{
            rotate: isPointer ? [15, 35, 15] : [15, 20, 15],
            scale: isPointer ? 1.4 : 1,
            y: [0, -5, 0]
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: isPointer ? 0.6 : 2.5,
              ease: "easeInOut"
            },
            y: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            },
            scale: { type: "spring", stiffness: 300, damping: 20 }
          }}
        />
      </motion.div>
      
      {/* Small dot follower for precision */}
      <motion.div
        className="fixed w-1 h-1 bg-blue-300 rounded-full mix-blend-difference"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
        }}
      />
    </div>
  );
};

export default CustomCursor;
