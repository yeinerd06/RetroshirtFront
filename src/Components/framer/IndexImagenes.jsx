import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const IndexImagenes = () => {
  // Crea una referencia para la sección
  const sectionRef = useRef(null);

  // Función para llevar al usuario al final de la sección
  const scrollToBottom = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="w-full    px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        <span className="block mb-4 text-center text-sm md:text-lg text-indigo-900 font-black">
          Libera el poder de SAP Ariba
        </span>
        <h3 className="text-4xl md:text-6xl text-center font-semibold">
        Experimenta la evolución 
        </h3>
        <h3 className="text-4xl px-16 md:text-6xl  font-semibold">
        {" "}
        </h3>
        <p className="text-base md:text-lg text-center text-black my-4 md:my-6">
        de tus procesos de abastecimiento, y aprovecha todo el potencial que SAP Ariba te ofrece, con un enfoque dinámico que sigue el ritmo de tu negocio.
        </p>

        <div className=" flex items-center justify-center">
        <button
            className="px-6 py-2 font-medium bg-blue-partners hover:bg-purple-partners active:bg-gray-900 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            onClick={scrollToBottom}
          >
            Encontrar un servicio
          </button>
        </div>
      </div>
      <ShuffleGrid />
       {/* Agrega un ref a la sección */}
       <div id="servicios"  ref={sectionRef}></div>
    </section>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "https://img.freepik.com/foto-gratis/interfaz-holografica-planificacion-recursos-empresariales_23-2149092251.jpg?t=st=1714926828~exp=1714930428~hmac=3287d62b90484f57ec93f82b3f5b0f04e275e0b9998e07666567a86580e56824&w=826",
    //"https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 2,
    src: "https://img.freepik.com/fotos-premium/fondo-forex-creativo_700248-13615.jpg?w=826",
    //"https://images.unsplash.com/photo-1510925758641-869d353cecc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 3,
    src: "https://img.freepik.com/foto-gratis/empresaria-comprando-acciones-linea-mujer-joven-hispana-que-trabaja-casa-su-negocio-comercial-computadora-portatil_662251-730.jpg?t=st=1714928426~exp=1714932026~hmac=ca699aaecacf4df65390aa78e4219ce90373c3f501e9b95e0fba4e55b1ec43bc&w=740",
    //"https://images.unsplash.com/photo-1629901925121-8a141c2a42f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 4,
    src: "https://as1.ftcdn.net/v2/jpg/04/40/28/76/1000_F_440287693_Ek7dDIa3m1XPnzTTAuJP6FKzy5ObZNld.jpg",
    //"https://images.unsplash.com/photo-1580238053495-b9720401fd45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 5,
    src: "https://img.freepik.com/fotos-premium/informe-financiero_253658-12355.jpg?w=740",
    //"https://images.unsplash.com/photo-1569074187119-c87815b476da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1325&q=80",
  },
  {
    id: 6,
    src: "/img/inicio/3.png",
    //"https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 7,
    src: "/img/inicio/4.png",
    //  "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 8,
    src: "https://img.freepik.com/foto-gratis/vista-superior-gerente-empleado-que-trabajan-equipo-oficina-negocios-mirando-graficos-pantalla-computadora-portatil_482257-2443.jpg?t=st=1714927592~exp=1714931192~hmac=de9f1d644f7c0f329036e0d6fefb2285a230dd0b11ed731c63bce00d50134bbb&w=740",
    //"https://plus.unsplash.com/premium_photo-1671436824833-91c0741e89c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 9,
    src: "https://as1.ftcdn.net/v2/jpg/06/35/00/52/1000_F_635005231_dRD5rpvX8qYLsJPcmTxJSpXojYqmxwPU.jpg",
    //"https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 10,
    src: "https://as2.ftcdn.net/v2/jpg/04/20/45/83/1000_F_420458302_RjM7k9swQj4YwfsK4IqJUIxmXE1l4iTL.jpg",
    //"https://images.unsplash.com/photo-1610768764270-790fbec18178?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 11,
    src: "https://img.freepik.com/foto-gratis/pautas-planificacion-plan-proceso-solucion-concept_53876-21153.jpg?t=st=1714927321~exp=1714930921~hmac=ce79598b288774f2f2f639a24f5f231143087a5885467606b677a04e62f20b5e&w=740",
    //"https://images.unsplash.com/photo-1507034589631-9433cc6bc453?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=684&q=80",
  },
  {
    id: 12,
    src: "https://img.freepik.com/foto-gratis/vista-superior-escritorio-oficina-tabla-crecimiento-manos-teclado_23-2148780617.jpg?t=st=1714927227~exp=1714930827~hmac=e88fe74f2d7ffc0ed8102246b9999075946f4fc87dce7159b796d50fc9f3af96&w=826",
    // "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=882&q=80",
  },
  {
    id: 13,
    src: "/img/inicio/5.png",
    // "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 14,
    src: "https://img.freepik.com/fotos-premium/sistema-software-erp-enterprise-resource-management-plan-recursos-empresariales_31965-7084.jpg?w=826",
    //"https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80",
  },
  {
    id: 15,
    src: "/img/inicio/6.png",
    // "https://images.unsplash.com/photo-1606244864456-8bee63fce472?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=681&q=80",
  },
  {
    id: 16,
    src: "https://img.freepik.com/foto-gratis/grupo-personas-trabajando-plan-negocios-oficina_1303-16056.jpg?t=st=1710615056~exp=1710618656~hmac=448fd1839391f303fe18487e202a7f2584214efc48358e1d85eaecddd2fd46ca&w=826",
    // "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1820&q=80",
  },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 3.5, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1 ">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default IndexImagenes;
