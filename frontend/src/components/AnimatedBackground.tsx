import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020203] pointer-events-none">
      {/* Dynamic Blobs */}
      <motion.div 
        animate={{ 
          x: [0, 200, -150, 0],
          y: [0, -200, 150, 0],
          scale: [1, 1.5, 0.6, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-purple-600/30 blur-[150px] rounded-full"
      />
      <motion.div 
        animate={{ 
          x: [0, -150, 200, 0],
          y: [0, 200, -150, 0],
          scale: [1, 0.7, 1.6, 1],
          rotate: [0, -180, -360]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] -right-[20%] w-[70%] h-[70%] bg-blue-600/30 blur-[150px] rounded-full"
      />
      <motion.div 
        animate={{ 
          x: [0, 100, -200, 0],
          y: [0, 150, -250, 0],
          scale: [1, 1.8, 0.5, 1],
          rotate: [0, 360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] left-[10%] w-[75%] h-[75%] bg-pink-600/25 blur-[150px] rounded-full"
      />
      <motion.div 
        animate={{ 
          x: [0, -250, 150, 0],
          y: [0, -150, 200, 0],
          scale: [1, 0.6, 1.5, 1],
          rotate: [0, -360]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[0%] w-[60%] h-[60%] bg-indigo-600/30 blur-[150px] rounded-full"
      />
      
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,17,19,0)_0%,rgba(5,5,7,0.95)_100%)]" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
