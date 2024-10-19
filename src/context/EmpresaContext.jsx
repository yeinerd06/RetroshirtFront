import { apiInformationEmpresa } from "@/Api/Empresa/Empresa";

import React, { createContext, useContext, useEffect, useState } from "react";

const EmpresaContext = createContext();

export const useEmpresaContext = () => useContext(EmpresaContext);

export const EmpresaProvider = ({ children }) => {
  const [empresa, setEmpresa] = useState([]);

  const findEmpresa = async () => {
    try {
      const response = await apiInformationEmpresa();
      const data = await response.json();
      console.log(data);
      setEmpresa(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findEmpresa();
  }, []);

  return (
    <EmpresaContext.Provider
      value={{
        empresa,
        setEmpresa,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
};
