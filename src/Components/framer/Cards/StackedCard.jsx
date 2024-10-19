import { Dispatch, SetStateAction, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

import { MdLightbulb, MdOutlineSpeed, MdCheckCircleOutline, MdNewReleases, MdOutlineHandshake, MdOutlineSettings } from 'react-icons/md';
import { IoBusinessSharp } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";
import { GrTask } from "react-icons/gr";
import Link from "next/link";

const StackedCard = () => {
  const [selected, setSelected] = useState(0);
  const sectionRef = useRef(null);
  const scrollToBottom = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className=" py-24 px-4 lg:px-8 grid items-center grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 overflow-hidden">
      <div className="p-4">
        <h3 className=" text-1xl md:text-6xl font-semibold">¿Por qué elegir VIA PARTNERS?</h3>
        <p className="text-base md:text-lg text-gray-900 my-4 md:my-6">
        Somos la elección preferida de muchas empresas por las siguientes razones:
        </p>
        <SelectBtns
          numTracks={testimonials.length}
          setSelected={setSelected}
          selected={selected}
        />
        <div className=" mt-6  flex items-center justify-center">
          <Link href={"/contacto"}>
          <button
            className="px-6 py-2 font-medium bg-blue-partners hover:bg-purple-partners active:bg-gray-900 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            onClick={scrollToBottom}
          >
           Contacto
          </button>
          </Link>
        
        </div>
      </div>
      <Cards
        testimonials={testimonials}
        setSelected={setSelected}
        selected={selected}
      />
    </section>
  );
};

const SelectBtns = ({ numTracks, setSelected, selected }) => {
  return (
    <div className="flex gap-1 mt-8">
      {Array.from(Array(numTracks).keys()).map((n) => {
        return (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className="h-1.5 w-full bg-slate-300 relative"
          >
            {selected === n ? (
              <motion.span
                className="absolute top-0 left-0 bottom-0 bg-blue-partners"
                initial={{
                  width: "0%",
                }}
                animate={{
                  width: "100%",
                }}
                transition={{
                  duration: 5,
                }}
                onAnimationComplete={() => {
                  setSelected(selected === numTracks - 1 ? 0 : selected + 1);
                }}
              />
            ) : (
              <span
                className="absolute top-0 left-0 bottom-0 bg-blue-partners"
                style={{
                  width: selected > n ? "100%" : "0%",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

const Cards = ({ testimonials, selected, setSelected }) => {
  return (
    <div className="p-4 relative h-[450px] lg:h-[500px] shadow-xl">
      {testimonials.map((t, i) => {
        return (
          <Card
            {...t}
            key={i}
            position={i}
            selected={selected}
            setSelected={setSelected}
          />
        );
      })}
    </div>
  );
};

const Card = ({
  Icon,
  title,
  description,
  position,
  selected,
  setSelected,
}) => {
  const scale = position <= selected ? 1 : 1 + 0.015 * (position - selected);
  const offset = position <= selected ? 0 : 95 + (position - selected) * 3;
  const background = position % 2 ? "#0c4c75" : "#497399";
  const color = position % 2 ? "white" : "black";

  return (
    <motion.div
      initial={false}
      style={{
        zIndex: position,
        transformOrigin: "left bottom",
        background,
        color,
      }}
      animate={{
        x: `${offset}%`,
        scale,
      }}
      whileHover={{
        translateX: position === selected ? 0 : -3,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      onClick={() => setSelected(position)}
      className="absolute top-0 left-0 w-full min-h-full p-8 lg:p-12 cursor-pointer flex flex-col justify-between"
    >
      <Icon className="text-7xl mx-auto" />
      <p className="text-lg lg:text-4xl font-bold italic my-8">
      {title}
      </p>
        
        <p  className="text-lg lg:text-xl font-light italic my-4">
        {description}
        </p>
      <div>
      <span className="block font-semibold text-lg">VIA PARTNERS</span>
   
      </div>
    </motion.div>
  );
};

export default StackedCard;

const testimonials = [
  {
    Icon: IoBusinessSharp ,
    title: "Experiencia",
    description: "Contamos con un equipo de profesionales altamente calificados y con amplia experiencia en SAP Ariba y en las mejores prácticas del mercado.",
  },
  {
    Icon: BsGraphUpArrow,
    title: "Flexibilidad",
    description: "Adaptamos nuestros servicios a las cambiantes necesidades del mercado y de nuestros clientes, garantizando soluciones flexibles y ágiles.",
  },
 
  {
    Icon: MdLightbulb,
    title: "Innovación",
    description: "Estamos en sintonía con cada release de SAP Ariba, acompañando a nuestros clientes en la adopción e implementación de las mejoras y nuevas funcionalidades que dispone SAP.",
  },
  {
    Icon: MdOutlineHandshake,
    title: "Compromiso",
    description: "Nos comprometemos a brindar un servicio excepcional, manteniendo una comunicación transparente y una atención personalizada en todo momento.",
  },
  {
    Icon: MdCheckCircleOutline,
    title: "Resultados",
    description: "A través de la satisfacción de nuestros clientes, se ratifican nuestros excelentes resultados.",
  },
  
];




