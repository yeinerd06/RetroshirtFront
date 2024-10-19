import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../Context/UseContext";
import Loader from "../Loader/Loader";
import { useAnimation, useInView, motion } from "framer-motion";

const Carrusel = ({ admin }) => {
  const { noticias, noticiasAdmin, loading } = useUserContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const selectedNoticias = admin ? noticiasAdmin : noticias;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedNoticias?.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedNoticias?.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedNoticias?.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + selectedNoticias?.length) % selectedNoticias?.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="w-full">
      {loading && (
        <div className="min-h-screen">
          <Loader />
        </div>
      )}
      <div id="default-carousel" className="relative w-full" data-carousel="slide">
        <div className="relative h-96 md:h-[600px] overflow-hidden">
          {selectedNoticias?.map((slide, index) => (
            <div
              key={"slide" + slide.id}
              className={`${index === currentIndex ? 'block' : 'hidden'} duration-700 ease-in-out relative w-full h-full`}
              data-carousel-item
            >
              {slide?.fields?.imagen?.length > 0 ? (
                <img
                  className="absolute w-full h-full object-cover"
                  src={slide?.fields?.imagen[0]?.url}
                  alt={slide?.fields?.titulo}
                />
              ) : slide?.fields?.imagen2 && (
                <img
                  className="absolute w-full h-full object-cover"
                  src={slide?.fields?.imagen2}
                  alt={slide?.fields?.titulo}
                />
              )}
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-start p-6">
                <Reveal key={index}>
                  <h1 className="sm:ml-12 pointer-events-auto text-4xl text-white font-black text-xl md:text-4xl lg:text-6xl font-bold text-white">
                    {slide?.fields?.titulo}
                  </h1>
                </Reveal>
                <Reveal key={index}>
                  <p className="sm:ml-12 mt-1 lg:text-xl font-bold text-white pointer-events-auto max-w-3xl text-dark mt-6">
                    {slide?.fields?.descripcion}
                  </p>
                </Reveal>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute z-30 flex -translate-x-1/2 bottom-12 left-1/2 space-x-3 rtl:space-x-reverse">
          {selectedNoticias?.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-500'}`}
              aria-current={currentIndex === index ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              data-carousel-slide-to={index}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>

        <button
          type="button"
          className="absolute top-1/2 left-4 z-30 flex items-center justify-center h-10 px-4 cursor-pointer group focus:outline-none transform -translate-y-1/2"
          data-carousel-prev
          onClick={prevSlide}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-100 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-1/2 right-4 z-30 flex items-center justify-center h-10 px-4 cursor-pointer group focus:outline-none transform -translate-y-1/2"
          data-carousel-next
          onClick={nextSlide}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-100 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </section>
  );
};

export const Reveal = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} className="relative w-fit overflow-hidden">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn" }}
        className="absolute bottom-1 left-0 right-0 top-1 z-20 bg-white"
      />
    </div>
  );
};

export default Carrusel;
