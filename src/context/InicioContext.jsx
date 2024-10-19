
import { apiListadoArticulosInicio } from "@/Api/Inicio/Inicio";

import React, { createContext, useContext, useEffect, useState } from "react";


const InicioContext = createContext();

export const useInicioContext = () => useContext(InicioContext);

export const InicioProvider = ({ children }) => {
  const [articulos, setArticulos] = useState([])
  const listadoArticulos = async () => {
    try {
      const response = await apiListadoArticulosInicio();
      const data = await response.json();
      console.log(data)
      setArticulos(data.data);
    } catch (error) {
      console.log(error);
    }
  };
 
  useEffect(() => {
    listadoArticulos()


  }, [])

  return (
    <InicioContext.Provider

      value={{
        articulos, setArticulos, 
        


      }}
    >
      {children}
    </InicioContext.Provider>
  );
};