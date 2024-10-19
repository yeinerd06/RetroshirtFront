import { NeuHero } from "@/Components/framer/Hero/NeuHero";
import CategoriasInicio from "./Inicio/Categorias";
import WhatsappButton from "./WhatsappButton/WhatsappButton";

const Home = () => {
  return (
    <div  >

      <NeuHero />
      <CategoriasInicio />
      <WhatsappButton/>
    </div>
  );
};

export default Home;