import React, { useState } from "react";
import { Button, IconButton, Input, Textarea } from "@material-tailwind/react";
import { FaReply } from "react-icons/fa";

// Componente para mostrar los productos y gestionar las devoluciones
const TablaProductos = ({ productos, onProductoUpdate }) => {
  const [checkedProducts, setCheckedProducts] = useState({});
  const [devoluciones, setDevoluciones] = useState({});

  const handleCheckChange = (productoId) => {
    const newCheckedState = !checkedProducts[productoId];
    setCheckedProducts({
      ...checkedProducts,
      [productoId]: newCheckedState,
    });

    // Actualizar el estado del producto con "estadoDevolucion"
    onProductoUpdate(productoId, {
      confirmado: newCheckedState,
      devolucionProveedor: {
        ...productos.find((producto) => producto.id === productoId)
          .devolucionProveedor,
        estadoDevolucion: newCheckedState,
      },
    });
  };

  const handleDevolucionChange = (productoId, field, value) => {
    const updatedDevolucion = {
      ...devoluciones[productoId],
      [field]: value,
    };

    setDevoluciones({
      ...devoluciones,
      [productoId]: updatedDevolucion,
    });

    // Actualizar el estado del producto con los datos de devolución
    onProductoUpdate(productoId, {
      devolucionProveedor: {
        ...productos.find((producto) => producto.id === productoId)
          .devolucionProveedor,
        [field]: value,
      },
    });
  };

  const handleDevolverClick = (productoId) => {
    const isDevolucionActive = !devoluciones[productoId]?.devolucion;

    setDevoluciones({
      ...devoluciones,
      [productoId]: {
        ...devoluciones[productoId],
        devolucion: isDevolucionActive,
      },
    });

    // Actualizar el estado del producto con "devolucion"
    onProductoUpdate(productoId, {
      devolucionProveedor: {
        ...productos.find((producto) => producto.id === productoId)
          .devolucionProveedor,
        devolucion: isDevolucionActive,
      },
    });
  };

  return (
    <table className="w-full table-auto border border-gray-300">
      <thead className="bg-blue-900 text-white">
        <tr>
          <th className="py-2 px-4 border-b">Verificar</th>
          <th className="py-2 px-4 border-b">Nombre</th>
          <th className="py-2 px-4 border-b">Color</th>
          <th className="py-2 px-4 border-b">Talla</th>
          <th className="py-2 px-4 border-b">Cantidad</th>
          <th className="py-2 px-4 border-b">Devolucion</th>
          <th className="py-2 px-4 border-b">Devolución</th>
        </tr>
      </thead>
      <tbody>
        {productos
          ?.filter((producto) => producto.devolucionProveedor) // Filtra los productos que tienen devolucionProveedor
          .map((producto, index) => (
            <React.Fragment key={index}>
              <tr className="text-center">
                <td className="py-2 px-4 border-b">
                  <input
                    type="checkbox"
                    checked={checkedProducts[producto.id] || false}
                    onChange={() => handleCheckChange(producto.id)}
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  {producto.proveedorArticulo.articulo.nombre}
                </td>
                <td className="py-2 px-4 border-b">{producto.color.nombre}</td>
                <td className="py-2 px-4 border-b">{producto.talla.nombre}</td>
                <td className="py-2 px-4 border-b">{producto.cantidad}</td>
                <td className="py-2 px-4 border-b">
                  {producto?.devolucionProveedor?.cantidad}
                </td>
                <td className="py-2 px-4 border-b">
                  <IconButton
                    className="bg-red-500 hover:bg-red-700 text-white"
                    title="Devolución"
                    onClick={() => handleDevolverClick(producto.id)}
                  >
                    <FaReply />
                  </IconButton>
                </td>
              </tr>

              {devoluciones[producto.id]?.devolucion && (
                <tr key={`devolucion-${index}`} className="text-center">
                  <td colSpan="6" className="py-2 px-4 border-b">
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                        label="Cantidad de Devolución"
                        type="number"
                        value={
                          devoluciones[producto.id]?.cantidadDevolucion || ""
                        }
                        min={1}
                        max={producto?.devolucionProveedor?.cantidad}
                        onChange={(e) =>
                          handleDevolucionChange(
                            producto.id,
                            "cantidadDevolucion",
                            e.target.value
                          )
                        }
                      />
                      <Textarea
                        label="Motivo de Devolución"
                        value={
                          devoluciones[producto.id]?.motivoDevolucion || ""
                        }
                        onChange={(e) =>
                          handleDevolucionChange(
                            producto.id,
                            "motivoDevolucion",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
      </tbody>
    </table>
  );
};

export default TablaProductos;
