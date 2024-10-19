// Importación necesaria
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Hook personalizado para enviar al inicio de la página cada vez que cambia la ruta
function useScrollToTop() {
  const location = useLocation();
  const [locationCurrent, setLocationCurrent] = useState("");
  useEffect(() => {
    if(location.pathname === locationCurrent) return;
    setLocationCurrent(location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname]);
}

export default useScrollToTop;
