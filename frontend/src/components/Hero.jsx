import {motion} from "framer-motion";
function Hero(){
    return(
<section className="relative w-full h-[550px] overflow-hidden">
  <img
  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c"
  alt="Shopping collection"
  className="absolute inset-0 w-full h-full object-cover"
/>
         {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
<div className="relative z-10 flex items-center justify-center h-full text-center px-6">
            <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-3xl"
        >

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm md:text-base uppercase tracking-[4px] mb-4"
          >
            New Collection
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            Discover Amazing Products
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-5 text-base md:text-xl"
          >
            Shop the latest collection
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              mt-8
              px-8
              py-3
              bg-white
              text-black
              rounded-full
              font-semibold
              transition-shadow
              duration-300
              hover:shadow-2xl
            "
          >
            SHOP NOW
          </motion.button>

        </motion.div>


</div>
</section>
    );
}
export default Hero;