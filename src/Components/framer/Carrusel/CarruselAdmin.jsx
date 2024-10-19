import { useEffect, useState } from "react";
import { useUserContext } from "../../Context/UseContext";
import Loader from "../Loader/Loader";

const CarruselAdmin = () => {
  const { noticiasAdmin,loading } = useUserContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % noticiasAdmin?.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [noticiasAdmin?.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % noticiasAdmin?.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + noticiasAdmin?.length) % noticiasAdmin?.length);
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
          {noticiasAdmin?.map((slide, index) => (
            <div
              key={index}
              className={`${index === currentIndex ? 'block' : 'hidden'} duration-700 ease-in-out`}
              data-carousel-item
            >
              {slide?.fields?.imagen?.length>0 ? (
                <img
                className="absolute block w-full h-full object-cover"
                src={slide?.fields?.imagen[0]?.url}
                alt={slide?.fields?.titulo}
              />
              ): slide?.fields?.imagen2 && (
                <img
                className="absolute block w-full h-full object-cover"
                src={slide?.fields?.imagen2}
                alt={slide?.fields?.titulo}
              />
              )}
              
              <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white p-4 w-full">
                <h3 className="text-xl lg:text-4xl font-bold text-center mt-3 lg:mt-9">{slide?.fields?.titulo}</h3>
                <p className="lg:text-xl font-bold text-center mt-1 lg:mt-6">{slide?.fields?.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute z-30 flex -translate-x-1/2 bottom-12 left-1/2 space-x-3 rtl:space-x-reverse">
          {noticiasAdmin?.map((_, index) => (
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
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
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
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
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

export default CarruselAdmin;



