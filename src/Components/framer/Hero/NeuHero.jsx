import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

import { motion } from "framer-motion";
import {
  SiNike,
  SiAdidas,
  SiPuma,
  SiUnderarmour,
  SiReebok,
  SiNewbalance,
  SiFila,
} from "react-icons/si";
import { ArrowRight } from "lucide-react";

export const NeuHero = () => {
  return (
    <section className="overflow-hidden ">
      <div className="relative flex flex-col items-center justify-center px-12 pb-24 pt-12 ">
        <Copy />
        <Logos />
      </div>
   
    </section>
  );
};

const Copy = () => {
  return (
    <>
      <div className="mb-1.5 rounded-full bg-zinc-600">
        <strong
          className="flex origin-top-left items-center border rounded-full border border-zinc-900 bg-white p-0.5 text-sm transition-transform hover:-rotate-2"
        >
          <span className="rounded-full bg-blue-900 px-2 py-0.5 font-medium text-white">
          Estilo retro
          </span>
          <span className="ml-1.5 mr-1 inline-block">
             en cada estampado
          </span>
          <FiArrowUpRight className="mr-2 inline-block" />
        </strong>
      </div>
      <h1 className="max-w-4xl  text-white text-center text-4xl font-black leading-[1.15] md:text-6xl md:leading-[1.15]">
        RETRO SHIRT
      </h1>
      <p className="mx-auto my-4 text-white  max-w-3xl text-center text-base leading-relaxed md:my-6 md:text-xl md:leading-relaxed">
        Personalizamos camisetas con diseños retro únicos. Calidad y estilo en cada prenda, hecha especialmente para ti.
      </p>
      <button className="rounded-lg flex bg-gray-100 p-3 uppercase text-gray-900 transition-colors hover:bg-gray-500">
        <span className="font-bold">Consigue la tuya ya </span><ArrowRight className="ml-2" size={20} />
      </button>
    </>
  );
};



const Logo = () => {
  return (
    <svg
      width="32"
      height="auto"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-fit fill-zinc-950"
    >
      <path
        d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        stopColor="#09090B"
      ></path>
      <path
        d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        stopColor="#09090B"
      ></path>
    </svg>
  );
};

const Logos = () => {
  return (
    <div className="relative mt-12 -rotate-1 scale-[1.01] border-y-2 border-zinc-900 bg-white">
      <div className="relative z-0 flex overflow-hidden border-b-2 border-zinc-900">
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
      </div>
      <div className="relative z-0 flex overflow-hidden">
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-white to-white/0" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-white to-white/0" />
    </div>
  );
};

const TranslateWrapper = ({ children, reverse }) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="flex px-2"
    >
      {children}
    </motion.div>
  );
};

const LogoItem = ({ Icon, name }) => {
  return (
    <span className="flex items-center justify-center gap-4 px-4 py-2 md:py-4">
      <Icon className="text-2xl text-blue-900 md:text-3xl" />
      <span className="whitespace-nowrap text-xl font-semibold uppercase md:text-2xl">
        {name}
      </span>
    </span>
  );
};

const LogoItemsTop = () => (
  <>
    <LogoItem Icon={SiNike} name="Nike" />
    <LogoItem Icon={SiAdidas} name="Adidas" />
    <LogoItem Icon={SiPuma} name="Puma" />
    <LogoItem Icon={SiUnderarmour} name="Under Armour" />
    <LogoItem Icon={SiReebok} name="Reebok" />
    <LogoItem Icon={SiNewbalance} name="New Balance" />
    <LogoItem Icon={SiFila} name="Fila" />
  </>
);

const LogoItemsBottom = () => (
  <>
 
    <LogoItem Icon={SiNike} name="Nike" />
    <LogoItem Icon={SiAdidas} name="Adidas" />
    <LogoItem Icon={SiPuma} name="Puma" />
    <LogoItem Icon={SiUnderarmour} name="Under Armour" />
    <LogoItem Icon={SiFila} name="Fila" />
    <LogoItem Icon={SiNewbalance} name="New Balance" />
    
   
  </>
);
