import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IconButton } from "@material-tailwind/react";
import ColorSmall from "@/Global/ColorSmall";

const ArticuloDetailView = () => {
  const { id } = useParams();
  const { articulos } = useUserContext();
  const [articulo, setArticulo] = useState(null);

  useEffect(() => {
    const foundArticulo = articulos.find((art) => art.id === parseInt(id));
    setArticulo(foundArticulo);
  }, [id, articulos]);

  const formattedFechaRegistro = useMemo(
    () => (articulo ? new Date(articulo.fechaResgistro).toLocaleDateString() : ""),
    [articulo]
  );

  if (!articulo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-xl">Artículo no encontrado</p>
      </div>
    );
  }

  const {
    nombre,
    marca,
    precio,
    categoria,
    estado,
    imagen,
    descripcion,
    genero,
    codigo,
    colores,
  } = articulo;

  return (
    <div>
      <div className="max-w-4xl mx-auto md:flex p-6">
        {/* Imagen del artículo */}
        <div className="md:w-1/2 mb-4 md:mb-0">
          <img
            src={imagen || "/default-image.jpg"}
            alt={nombre}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Información del artículo */}
        <div className="md:w-1/2 md:pl-8">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold text-gray-900">{nombre}</h2>
            <IconButton
              className="bg-red-900 hover:bg-red-700 text-xl"
              onClick={() => window.history.back()}
            >
              <IoMdArrowRoundBack />
            </IconButton>
          </div>

          {/* Datos del artículo en formato de lista */}
          <div className="space-y-4">
            {/* Marca y categoría */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-lg font-semibold text-gray-700">Categoría:</p>
              <p className="text-lg text-gray-600">
                {categoria?.nombre || "Sin Categoría"}
              </p>
            </div>

            {/* Género */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-700">Género:</p>
              <p className="text-lg text-gray-600">
                {genero || "No especificado"}
              </p>
            </div>

            {/* Código */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-700">Código:</p>
              <p className="text-lg text-gray-600">{codigo || "N/A"}</p>
            </div>

            {/* Precio */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-700">Precio:</p>
              <p className="text-lg text-green-600 font-bold">
                ${precio?.toFixed(2)}
              </p>
            </div>

            {/* Estado */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-700">Estado:</p>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  estado
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {estado ? "Disponible" : "No Disponible"}
              </span>
            </div>

            {/* Fecha de Registro */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-700">
                Fecha de Registro:
              </p>
              <p className="text-lg text-gray-600">{formattedFechaRegistro}</p>
            </div>

            {/* Descripción */}
            <div>
              <p className="text-lg text-gray-600">
                <strong>Descripción:</strong> {descripcion || "No disponible"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Colores Disponibles */}
      {colores?.length > 0 && (
        <div className="w-full mt-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Colores Disponibles:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {colores.map((articuloColor, index) => (
              <div key={index} className=" p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <ColorSmall color={articuloColor.color.color} />
                  <span className="font-medium text-gray-700">
                    {articuloColor.color.nombre}
                  </span>
                </div>
                {articuloColor?.tallas?.length > 0 && (
                  <table className="min-w-full table-auto border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border-b font-medium text-gray-700">Talla</th>
                        <th className="py-2 px-4 border-b font-medium text-gray-700">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {articuloColor?.tallas?.map((talla) => (
                        <tr key={talla.id} className="hover:bg-gray-50">
                          <td className="py-1 px-3 border-b text-gray-600">
                            {talla.talla.nombre}
                          </td>
                          <td className="py-1 px-3 border-b text-gray-600">
                            {talla.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticuloDetailView;