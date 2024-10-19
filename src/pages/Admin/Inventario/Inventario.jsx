import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useUserContext } from "@/context/UserContext";
import { InformationCircleIcon, PencilSquareIcon, SquaresPlusIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Loader } from "@/Components/Loader";
import RegisterArticuloModal from "./Components/RegisterArticuloModal";
import UpdateArticuloModal from "./Components/UpdateArticuloModal";
import AlertaInventario from "./Components/Alerta";
import { Link, useNavigate } from "react-router-dom";
import { useProductoContext } from "@/context/ProductoContext";
import { FaEdit, FaInfoCircle } from "react-icons/fa";

const AdminInventario = () => {
  const { articulos, usuario ,modulo,setLoading} = useUserContext();
  const {categorias}=useProductoContext()
  const [open, setOpen] = useState(false);
  const [articuloSelect, setArticuloSelect] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [filterValue, setFilterValue] = useState("");

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleOpenUpdate = (articulo) => {
    console.log(articulo);
    setArticuloSelect(articulo);
    setOpenUpdate(!openUpdate);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setFilterValue("");
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filterArticulos = (articulos) => {
    switch (filter) {
      case "nombre":
        return articulos.filter((articulo) =>
          articulo?.nombre.toLowerCase().includes(filterValue.toLowerCase())
        );
    
      case "categoria":
        return articulos.filter((articulo) =>
          articulo?.categoria?.nombre?.toLowerCase().includes(filterValue.toLowerCase())
        );
     
      case "disponible":
        return articulos.filter((articulo) => articulo?.estado);
      case "no-disponible":
        return articulos.filter((articulo) => !articulo?.estado);
 
      default:
        return articulos;
    }
  };

  const filteredArticulos =filterArticulos(articulos);
   

  const navigate = useNavigate();

  const handleViewArticulo = (articulo) => {
    navigate(`/${modulo}/inventario/articulo/${articulo.id}`);
  };
  return (
    <div>
      
      <div
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex flex-col sm:flex-col lg:flex-row items-center justify-between p-6"
        >
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 w-full lg:w-auto">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="mb-4 sm:mb-0 p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
            >
              <option value="all">Todos</option>
              <option value="categoria">Categoria</option>
              <option value="nombre">Nombre</option>
              <option value="disponible">Disponible</option>
              <option value="no-disponible">No Disponible</option>
            </select>
            {(filter === "nombre" || filter === "marca") && (
              <input
                type="text"
                value={filterValue}
                onChange={handleFilterValueChange}
                placeholder={`Buscar por ${filter}`}
                className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
              />
            )}
            {filter ==="stock" && (
              <input
              type="number"
              value={filterValue}
              onChange={handleFilterValueChange}
              placeholder={`Buscar por ${filter}`}
              className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
            />
            )}
            {filter === "categoria" && (
              <select
                className="mb-4 sm:mb-0 p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
                label="Categoría"
                name="categoria"
                value={filterValue}
                onChange={handleFilterValueChange}
                required
              >
                {categorias?.map((categoria) => (
                  <option key={categoria.id} value={categoria.valor}>
                    {categoria.nombre}
                  </option>
                ))}
                {/* <option value="LUBRICANTES">LUBRICANTES</option>
                <option value="FILTROS">FILTROS</option>
                <option value="REFRIGERANTES">REFRIGERANTES</option>
                <option value="LIQUIDOS DE FRENO">LIQUIDOS DE FRENO</option> */}
              </select>
            )}
          </div>
          <Button
            className="flex ml-0 lg:ml-auto mt-4 sm:mt-0"
            variant="text"
            size="sm"
            color="success"
            onClick={handleOpen}
          >
            <SquaresPlusIcon className="h-5 w-5 mr-2" />
            Registrar Producto
          </Button>
        </div>


          <div className="relative px-0 pt-0 pb-2">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[640px] table-auto border-collapse">
            <thead className="bg-blue-900 text-white">
              <tr>
                {["Nombre", "Categoria", "Min", "Stock", "Precio de venta", "Disponible", "Acciones"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-6 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-medium font-bold uppercase "
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {filteredArticulos?.slice().reverse().map((articulo) => (
                <tr key={articulo?.id}
                 
                  >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-4">
                      {articulo?.imagen && (
                        <img
                          src={articulo?.imagen}
                          alt={"Imagen del articulo"}
                          size="sm"
                          className="rounded-none w-16 h-16 object-cover"
                        />
                      )}
                      <Typography
                        variant="small"
                        className="text-xs font-medium text-blue-gray-900"
                      >
                         
                       <p> {articulo?.nombre}</p>
                      </Typography>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    {articulo?.categoria?.nombre}
                  <p className="text-sm">  {articulo?.genero}</p>
                  </td>
                  <td className="py-3 px-5">
                    {articulo?.cantidadMinima}
                  </td>
                  <td className="py-3 px-5">
                    {articulo?.colorTalla?.map((ct) =>(
                      <div className="flex justify-between text-sm">
                        <p >{ct.color.nombre}</p> : <p>{ct.talla.nombre}</p>:<p>{ct.cantidad}</p>

                        </div>
                    ) )}
                  </td>
                  <td className="py-3 px-5">
                    {articulo?.precio}
                  </td>
                  <td className="py-3 px-5">
                    {articulo?.estado ? "Si" : "No"}
                  </td>
                  <td className="py-3 px-5">
                    <div className="w-10/12 flex items-center justify-start">
                      <Typography
                        variant="small"
                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                      >
                        <div className="flex space-x-2">
                      <IconButton className="bg-yellow-900 hover:bg-yellow-700 text-xl" title="Editar"
                            onClick={() => handleOpenUpdate(articulo)}>
                            <FaEdit />
                          </IconButton>
                         
                          <IconButton className="bg-blue-900 hover:bg-blue-700 text-xl" title="Informacion"
                            onClick={() => handleViewArticulo(articulo)}>
                          <FaInfoCircle />
                          </IconButton>
                          
                        </div>
                      </Typography>
                    </div>
                  </td> 
                  {/* 
                 
                  */}


                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      <RegisterArticuloModal open={open} handleOpen={handleOpen} />
      <UpdateArticuloModal open={openUpdate} handleOpen={handleOpenUpdate} articulo={articuloSelect} />
    </div>
  );
};

export default AdminInventario;
