
import { Loader } from "@/Components/Loader";
import React, { createContext, useContext, useState } from "react";


const LayoutContext = createContext();

export const useLayoutContext = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
 const [loading, setLoading] = useState(false)


  return (
    <LayoutContext.Provider

      value={{
        loading, setLoading


      }}
    >
        {loading && <Loader />}
      {children}
    </LayoutContext.Provider>
  );
};