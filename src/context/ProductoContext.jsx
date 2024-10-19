
import { apiListadoCategorias } from "@/Api/Articulo/Categoria";
import { apiListadoColores } from "@/Api/Articulo/Color";
import { apiListadoTallas } from "@/Api/Articulo/Talla";
import { Loader } from "@/Components/Loader";
import { useApiData } from "@/Hook/useApiData";
import React, { createContext, useContext, useState } from "react";


const ProductoContext = createContext();

export const useProductoContext = () => useContext(ProductoContext);

export const ProductoProvider = ({ children }) => {

  const [categorias, setCategorias] = useState([])
  const [tallas, setTallas] = useState([])
  const [colores, setColores] = useState([])

  useApiData(apiListadoCategorias, setCategorias)
  useApiData(apiListadoColores, setColores)
  useApiData(apiListadoTallas, setTallas)
  // Arrays para opciones del select
  const categoriasCamisas = [
    { nombre: 'Camiseta', valor: 'CAMISETA' },
    { nombre: 'Camiseta sin mangas', valor: 'CAMISETA SIN MANGAS' },
    { nombre: 'Camiseta de tirantes', valor: 'CAMISETA DE TIRANTES' },
    { nombre: 'Camiseta de cuello en V', valor: 'CAMISETA DE CUELLO EN V' },
    { nombre: 'Polo', valor: 'POLO' },
    { nombre: 'Jersey', valor: 'JERSEY' },
    { nombre: 'Jersey de manga larga', valor: 'JERSEY DE MANGA LARGA' },
    { nombre: 'Sudadera', valor: 'SUDADERA' },
    { nombre: 'Cuello alto', valor: 'CUELLO ALTO' },
    { nombre: 'Sudadera con capucha', valor: 'SUDADERA CON CAPUCHA' },
    { nombre: 'Camisa hawaiana', valor: 'CAMISA HAWAIANA' },
    { nombre: 'Camisa de vestir', valor: 'CAMISA DE VESTIR' },
    { nombre: 'Esmoquin', valor: 'ESMOQUIN' },
    { nombre: 'Camisa de franela/de cuadros', valor: 'CAMISA DE FRANELA/DE CUADROS' },
    { nombre: 'Chaqueta', valor: 'CHAQUETA' }
  ];

  const generos = [
    { nombre: 'Hombre', valor: 'HOMBRE' },
    { nombre: 'Mujer', valor: 'MUJER' },
    { nombre: 'Unisex', valor: 'UNISEX' }
  ];

  const coloresCamisas = [
    { nombre: 'Blanco', valor: 'BLANCO', clase: 'text-white' },
    { nombre: 'Negro', valor: 'NEGRO', clase: 'text-black' },
    { nombre: 'Gris', valor: 'GRIS', clase: 'text-gray-500' },
    { nombre: 'Rojo', valor: 'ROJO', clase: 'text-red-500' },
    { nombre: 'Azul', valor: 'AZUL', clase: 'text-blue-500' },
    { nombre: 'Verde', valor: 'VERDE', clase: 'text-green-500' },
    { nombre: 'Amarillo', valor: 'AMARILLO', clase: 'text-yellow-500' },
    { nombre: 'Naranja', valor: 'NARANJA', clase: 'text-orange-500' },
    { nombre: 'Morado', valor: 'MORADO', clase: 'text-purple-500' },
    { nombre: 'Rosa', valor: 'ROSA', clase: 'text-pink-500' },
    { nombre: 'Café', valor: 'CAFÉ', clase: 'text-brown-500' }
  ];
  const tallasCamisas = [
    { nombre: "XS", valor: "XS" },
    { nombre: 'S', valor: 'S' },
    { nombre: 'M', valor: 'M' },
    { nombre: 'L', valor: 'L' },
    { nombre: 'XL', valor: 'XL' },
    { nombre: 'XXL', valor: 'XXL' },
    { nombre: 'XXXL', valor: 'XXXL' },

  ]



  return (
    <ProductoContext.Provider

      value={{
        categoriasCamisas,
        generos,
        coloresCamisas,
        tallasCamisas,
        categorias,
        setCategorias,
        colores, setColores
        , tallas, setTallas

      }}
    >

      {children}
    </ProductoContext.Provider>
  );
};