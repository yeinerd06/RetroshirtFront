import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ButtonBorders from "../../framer/Button/ButtonBorders"

const FuzzyOverlayExample = () => {
  return (
    // NOTE: An overflow of hidden will be required on a wrapping
    // element to see expected results
    <div className="relative overflow-hidden" >
      <ExampleContent />
      <FuzzyOverlay />
    </div>
  );
};

const FuzzyOverlay = () => {
  return (
    <motion.div
      
      
      // You can download these PNGs here:
      // https://www.hover.dev/black-noise.png
      // https://www.hover.dev/noise.png
      style={{
        backgroundImage: "url(/img/trabaja-con-nosotros.jpg)",
        backgroundSize: "cover"
      }}
      className="pointer-events-none bg-blue-partners absolute -inset-[100%] opacity-[35%]"
    />
  );
};

const ExampleContent = () => {
  return (
    <div className="relative grid h-screen place-content-center space-y-6 bg-neutral-950 p-8" >
      <p className="text-center bg-neutral-950 text-6xl font-black text-white " style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.8)" }}>
        Trabaja con nosotros
      </p>
      <div className="flex items-center justify-center gap-3">
        {/* <button className="text-neutral-20 w-fit px-4 py-2 font-semibold text-neutral-200 transition-colors hover:bg-neutral-800">
          Pricing
        </button> */}
        <ButtonBorders  texto={"Contacto"} url={"/trabaja-con-nosotros"}/>
       
      </div>
    </div>
  );
};

export default FuzzyOverlayExample;
