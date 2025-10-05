import * as motion from "motion/react-client";

// Complex path with many twists and turns - like a scenic walking route
const routePath = "M 60 350 C 80 330, 95 315, 110 290 C 125 265, 115 240, 95 220 C 75 200, 85 180, 110 165 C 135 150, 160 155, 180 175 C 200 195, 215 185, 230 165 C 245 145, 240 120, 220 100 C 200 80, 220 65, 250 60 C 280 55, 305 70, 325 90 C 345 110, 360 100, 380 80 C 400 60, 420 55, 445 65 C 470 75, 485 95, 490 120 C 495 145, 510 155, 530 150 C 550 145, 565 130, 570 110 C 575 90, 590 85, 600 95";

const pathTransition = {
  duration: 12,
  repeat: Infinity,
  ease: "easeInOut",
  repeatDelay: 0.5,
};

export default function MotionPathHero() {
  return (
    <div className="route-animation-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 400"
        className="route-svg"
        style={{ filter: 'drop-shadow(0 4px 20px rgba(252, 76, 2, 0.1))' }}
      >
        <defs>
          {/* 3D Gradient for path */}
          <linearGradient id="pathGradient3D" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FC4C02" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ff8555" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffa577" stopOpacity="0.5" />
          </linearGradient>

          {/* Soft glow filter */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Circular glow filter for markers */}
          <filter id="circularGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur"/>
            <feOffset in="blur" dx="0" dy="0" result="offsetBlur"/>
            <feFlood floodColor="currentColor" floodOpacity="0.5" result="color"/>
            <feComposite in="color" in2="offsetBlur" operator="in" result="shadow"/>
            <feMerge>
              <feMergeNode in="shadow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Shadow for 3D effect */}
          <filter id="shadow3D" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background subtle path */}
        <motion.path
          d={routePath}
          fill="transparent"
          strokeWidth="20"
          stroke="rgba(252, 76, 2, 0.08)"
          strokeLinecap="round"
          filter="url(#shadow3D)"
        />

        {/* Main animated path with 3D effect */}
        <motion.path
          d={routePath}
          fill="transparent"
          strokeWidth="12"
          stroke="url(#pathGradient3D)"
          strokeLinecap="round"
          filter="url(#softGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={pathTransition}
        />

        {/* Subtle highlight line */}
        <motion.path
          d={routePath}
          fill="transparent"
          strokeWidth="4"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={pathTransition}
          style={{ transform: 'translateY(-2px)' }}
        />

        {/* Start point marker */}
        <g filter="url(#circularGlow)">
          <motion.circle
            cx="60"
            cy="350"
            r="12"
            fill="url(#pathGradient3D)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          />
        </g>
        <circle cx="60" cy="350" r="6" fill="white" opacity="0.8" />

        {/* End point marker */}
        <g filter="url(#circularGlow)">
          <motion.circle
            cx="600"
            cy="95"
            r="12"
            fill="#10b981"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          />
        </g>
        <circle cx="600" cy="95" r="6" fill="white" opacity="0.8" />
      </svg>

      {/* Animated walker dot with 3D effect */}
      <motion.div
        className="walker-dot"
        style={{
          offsetPath: `path("${routePath}")`,
        }}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={pathTransition}
      >
        {/* Main dot with 3D styling */}
        <div className="walker-core" />
        
        {/* Smooth pulse effect */}
        <motion.div
          className="walker-pulse"
          animate={{
            scale: [1, 2.5],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>

      <style jsx>{`
        .route-animation-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          height: 400px;
          background: transparent;
          overflow: visible;
        }

        .route-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .walker-dot {
          position: absolute;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          pointer-events: none;
          filter: drop-shadow(0 4px 12px rgba(252, 76, 2, 0.4));
        }

        .walker-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: linear-gradient(145deg, #ff6b35, #FC4C02);
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.9);
          box-shadow: 
            0 2px 8px rgba(252, 76, 2, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.5),
            inset 0 -1px 2px rgba(0, 0, 0, 0.2);
          z-index: 2;
        }

        .walker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: radial-gradient(circle, rgba(252, 76, 2, 0.6) 0%, rgba(252, 76, 2, 0) 70%);
          border-radius: 50%;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .route-animation-container {
            max-width: 100%;
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
