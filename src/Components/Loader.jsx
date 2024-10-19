import React  from "react";

import "./Loader.css"; // Asegúrate de importar el archivo CSS

export const Loader = () => {
  return (
    <div className="overlay">
      <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      
    </div>
  );
};


