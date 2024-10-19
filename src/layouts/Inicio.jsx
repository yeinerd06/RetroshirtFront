import { Routes, Route } from "react-router-dom";

import routes from "@/routes";
import NavBarFlyOut from "@/Components/framer/Navbar/FlyoutNav";
import { InicioProvider } from "@/context/InicioContext";
import { FooterInicio } from "@/widgets/layout/footerInicio";
import useScrollToTop from "@/Hook/useScrollToTop";

export function Inicio() {
  useScrollToTop()

  return (
    <div className="relative min-h-screen w-full ">
      <InicioProvider>
        <NavBarFlyOut/> 
    
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "inicio" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
      </InicioProvider>
      <FooterInicio />
    </div>
  );
}

Inicio.displayName = "/src/layout/Inicio.jsx";

export default Inicio;
