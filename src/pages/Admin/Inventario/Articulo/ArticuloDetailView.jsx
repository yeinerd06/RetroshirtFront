import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IconButton } from "@material-tailwind/react";

const ArticuloDetailView = () => {
  const { id } = useParams();
  const { articulos } = useUserContext();
  const [articulo, setArticulo] = useState(null);

  useEffect(() => {
    const foundArticulo = articulos.find((art) => art.id === parseInt(id));
    setArticulo(foundArticulo);
  }, [id, articulos]);

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
    cantidadMinima,
    stock,
    categoria,
    estado,
    imagen,
    descripcion,
    genero,
    codigo,
    fechaResgistro,
    colores,
  } = articulo;

  return (
    <div className="max-w-4xl mx-auto md:flex  p-6 ">
      {/* Imagen del artículo */}
      <div className="md:w-1/2 mb-4 md:mb-0">
        <img
          src={imagen || "/default-image.jpg"}
          alt={nombre}
          className="w-full h-auto object-cover rounded-md"
        />
          {/* Descripción */}
          <div className="">
         
            <p className="text-lg text-gray-600">
            <strong>Descripción:</strong> {descripcion || "No disponible"}
            </p>
          </div>
      </div>

      {/* Información del artículo */}
      <div className="md:w-1/2 md:pl-8">
        <div className="flex justify-between items-center ">
          <h2 className="text-4xl font-bold text-gray-900 ">{nombre}</h2>
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

          

          {/* Cantidad Mínima */}
          {/* <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-700">
              Cantidad Mínima:
            </p>
            <p className="text-lg text-gray-600">{cantidadMinima}</p>
          </div> */}

         

          
         

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
          {/* Stock Disponible */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-700">
              Stock Disponible:
            </p>
            <p
              className={`text-lg font-medium ${
                stock > 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              {stock > 0 ? stock : "Agotado"}
            </p>
          </div>

          {/* Colores Disponibles */}
          {colores?.length > 0 && (
            <div>
              <p className="text-lg font-semibold text-gray-700">
                Colores Disponibles:
              </p>
              <ul className="list-disc pl-5 text-gray-900">
                {colores.map((color, index) => (
                  <li key={index}>{color.color.nombre}</li>
                ))}
              </ul>
            </div>
          )}
           {/* Fecha de Registro */}
           <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-700">
              Fecha de Registro:
            </p>
            <p className="text-lg text-gray-600">
              {new Date(fechaResgistro).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticuloDetailView;
