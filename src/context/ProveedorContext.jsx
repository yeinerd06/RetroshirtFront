
import { apiListadoArticulosInicio } from "@/Api/Inicio/Inicio";
import { apiListadoPedidoProveedor } from "@/Api/Pedido/PedidoProveedor";

import React, { createContext, useContext, useEffect, useState } from "react";


const ProveedorContext = createContext();

export const useProveedorContext = () => useContext(ProveedorContext);

export const ProveedorProvider = ({ children }) => {
  const [proveedoresPedidos, setProveedoresPedidos] = useState([])
 
  const listadoProveedoresPedidos = async () => {
    try {
      const response = await apiListadoPedidoProveedor();
      const data = await response.json();
      console.log(data)
      setProveedoresPedidos(data.data);
    } catch (error) {
      console.log(error);
    }
  };

 
 
  useEffect(() => {
    listadoProveedoresPedidos()


  }, [])

  return (
    <ProveedorContext.Provider

      value={{
        proveedoresPedidos,
        setProveedoresPedidos,
        listadoProveedoresPedidos
        


      }}
    >
      {children}
    </ProveedorContext.Provider>
  );
};