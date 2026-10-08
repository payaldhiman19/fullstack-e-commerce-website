import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Hero() {
  const images = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // Automatically change image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[550px] overflow-hidden">

      {/* Slideshow */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          alt="Fashion Collection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              currentImage === index
                ? "w-6 bg-black"
                : "bg-white"
            }`}
          />
        ))}
      </div>

    </section>
  );
}

export default Hero;