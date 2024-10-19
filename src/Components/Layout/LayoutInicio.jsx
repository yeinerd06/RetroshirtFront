import React, { useEffect, useState } from "react";
import { useAnimate } from "framer-motion";

export const LayoutInicio = () => {
  const [scope, animate] = useAnimate();
  const [size, setSize] = useState({ columns: 0, rows: 0 });

  useEffect(() => {
    generateGridCount();
    window.addEventListener("resize", generateGridCount);

    return () => window.removeEventListener("resize", generateGridCount);
  }, []);

  const generateGridCount = () => {
    const columns = Math.floor(document.body.clientWidth / 75);
    const rows = Math.floor(document.body.clientHeight / 75);

    setSize({
      columns,
      rows,
    });
  };

  const handleMouseLeave = (e) => {
    const id = `#${e.target.id}`;
    animate(id, { background: "rgba(129, 140, 248, 0)" }, { duration: 1.5 });
  };

  const handleMouseEnter = (e) => {
    const id = `#${e.target.id}`;
    animate(id, { background: "rgba(129, 140, 248, 1)" }, { duration: 0.15 });
  };

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none grid h-screen w-full grid-cols-[repeat(auto-fit,_minmax(75px,_1fr))] grid-rows-[repeat(auto-fit,_minmax(75px,_1fr))]"
      ref={scope}
    >
      {[...Array(size.rows * size.columns)].map((_, i) => (
        <div
          key={i}
          id={`square-${i}`}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          className="h-full w-full border-[1px] border-neutral-900"
        />
      ))}
    </div>
  );
};
