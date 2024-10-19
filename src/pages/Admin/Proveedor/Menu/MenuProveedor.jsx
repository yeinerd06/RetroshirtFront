import { useUserContext } from "@/context/UserContext";
import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MenuProveedor() {
  const { modulo } = useUserContext(); // Obtenemos el módulo del contexto
  const navigate = useNavigate();

  // Determina el valor inicial del tab basado en la URL
  const [value, setValue] = useState(
    window.location.pathname.includes("pedidos") 
      ? "pedidos-proveedores" 
      : "proveedores"
  );

  // Manejador de cambio de tab
  const handleTabChange = (newValue) => {
    setValue(newValue);

    // Ruta basada en el valor seleccionado
    const targetPath = newValue === "proveedores"
      ? `/${modulo}/proveedores`
      : `/${modulo}/proveedores/pedidos`;

    // Navega a la nueva ruta
    navigate(targetPath);
  };

  return (
    <div>
      <Tabs value={value}>
        <TabsHeader>
          <Tab
            key="proveedores"
            value="proveedores"
            onClick={() => handleTabChange("proveedores")}
          >
            PROVEEDORES
          </Tab>
          <Tab
            key="pedidos-proveedores"
            value="pedidos-proveedores"
            onClick={() => handleTabChange("pedidos-proveedores")}
          >
            PEDIDOS PROVEEDORES
          </Tab>
        </TabsHeader>
      </Tabs>
    </div>
  );
}

export default MenuProveedor;
