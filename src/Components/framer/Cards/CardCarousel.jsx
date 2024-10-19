import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useMeasure from "react-use-measure";
import { useUserContext } from "../../Context/UseContext";
import { FaCheck } from "react-icons/fa";
import Link from "next/link";

const CARD_WIDTH = 350;
const CARD_HEIGHT = 350;
const MARGIN = 20;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};
const isBrowser = typeof window !== "undefined";

const getInitialWidth = () => {
  return isBrowser ? window.innerWidth : 0;
};

const CardCarousel = () => {
  // Dentro del componente
  const [windowWidth, setWindowWidth] = useState(getInitialWidth());
  const [limitRight, setLimitRight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Suscribirse al evento de cambio de tamaño de la ventana
    window.addEventListener("resize", handleResize);
    // console.log("width", windowWidth);
    // Calcula el número de tarjetas visibles en la pantalla
    const visibleCards = Math.floor(windowWidth / CARD_SIZE);
    const limite = servicios?.length - visibleCards;
    //console.log("limite rigth", limite);
    setLimitRight(limite);

    // Limpiar el efecto al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const { servicios } = useUserContext();

  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);

  const CARD_BUFFER =
    width > BREAKPOINTS.lg ? 3 : width > BREAKPOINTS.sm ? 2 : 1;

  const CAN_SHIFT_LEFT = offset < 0;

  const CAN_SHIFT_RIGHT =
    Math.abs(offset) < CARD_SIZE * (servicios?.length - CARD_BUFFER);

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) {
      return;
    }
    let limite = limitRight + 1;
    setLimitRight(limite);
    setOffset((pv) => (pv += CARD_SIZE));
  };

  const shiftRight = () => {
    console.log(limitRight);
    // Si la última tarjeta está completamente visible, detén el desplazamiento hacia la derecha
    if (!CAN_SHIFT_RIGHT || limitRight == 0) {
      return;
    }
    let limite = limitRight - 1;
    setLimitRight(limite);

    // Si no se ha alcanzado el final, realiza el desplazamiento
    setOffset((pv) => (pv -= CARD_SIZE));
  };

  const Card = ({ id, img, nombre, desc }) => {
    // Función para llevar al usuario al final de la sección
    // Crea una referencia para la sección
    const sectionRef = useRef(null);
    const scrollToBottom = () => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    const [showMoreButton, setShowMoreButton] = useState(false);

    return (
      <div
        className="relative shrink-0 cursor-pointer  bg-white shadow-md transition-all hover:scale-[1.015] hover:shadow-xl"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          marginRight: MARGIN,
          backgroundImage: `url(${img})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        onMouseEnter={() => setShowMoreButton(true)}
        onMouseLeave={() => setShowMoreButton(false)}
      >
        {/* CLASE PARA AGREGAR SOMBRA A LA IMAGEN */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-black/65 via-black/80 to-black/60 p-6 text-white transition-[backdrop-filter]">
          <div className="text-3xl font-bold text-center ">
            {nombre}

            <p className=" text-lg">
              {" "}
              {desc?.slice(0, 78)}
            </p>
          </div>
          {showMoreButton && (
            <Link href={"/servicio/" + id}>
              <button
                className="absolute  hover:bg-white hover:text-black  border bottom-4 right-4 px-6 py-2 font-medium bg-blue-partners hover:bg-purple-partners active:bg-gray-900 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                onClick={scrollToBottom}
              >
                Más información
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="mt-3">
      <div className="relative overflow-hidden p-4">
        <div>
          <h1 className="my-2 text-4xl md:text-6xl font-bold text-center ">
            Servicios
          </h1>
          <p className="text-base md:text-lg text-gray-900 text-center mb-4 mt-3">
          Explora nuestros servicios y descubre cómo VIA PARTNERS puede ayudarte con un mundo de posibilidades
          </p>
          <motion.div
            animate={{
              x: offset,
            }}
            className="flex mt-3"
          >
            {servicios.map((item) => (
              <Card key={item.id} {...item} />
            ))}
          </motion.div>
        </div>

        <>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_LEFT ? "0%" : "-100%",
            }}
            className="absolute left-0 top-[60%] z-30 rounded-r-xl bg-slate-100/30 p-3 pl-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pl-3"
            onClick={shiftLeft}
          >
            <FiChevronLeft />
          </motion.button>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_RIGHT ? "0%" : "100%",
            }}
            className="absolute right-0 top-[60%] z-30 rounded-l-xl bg-slate-100/30 p-3 pr-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pr-3"
            onClick={shiftRight}
          >
            <FiChevronRight />
          </motion.button>
        </>
      </div>
    </section>
  );
};

export default CardCarousel;
