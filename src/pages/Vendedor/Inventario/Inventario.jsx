import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useUserContext } from "@/context/UserContext";
import { PencilSquareIcon, SquaresPlusIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Loader } from "@/Components/Loader";
import RegisterArticuloModal from "./Components/RegisterArticuloModal";
import UpdateArticuloModal from "./Components/UpdateArticuloModal";
import AlertaInventario from "./Components/Alerta";

const VendedorInventario = () => {
  const { articulos, usuario } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [articuloSelect, setArticuloSelect] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [filter, setFilter] = useState("disponible");
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
          articulo.nombre.toLowerCase().includes(filterValue.toLowerCase())
        );
      case "marca":
        return articulos.filter((articulo) =>
          articulo.marca.toLowerCase().includes(filterValue.toLowerCase())
        );
        case "categoria":
        return articulos.filter((articulo) =>
          articulo.categoria.toLowerCase().includes(filterValue.toLowerCase())
        );
        case "stock":
          return articulos.filter((articulo) =>
            articulo.stock == (filterValue)
        );
      case "disponible":
        return articulos.filter((articulo) => articulo.estado);
        case "no-disponible":
          return articulos.filter((articulo) => !articulo.estado);
      case "stockBajo":
        return articulos.filter((articulo) => articulo.stock < articulo.cantidadMinima);
      default:
        return articulos;
    }
  };

  const filteredArticulos = filterArticulos(articulos);

  return (
    <div className="mb-4 mt-6">
      {loading && <Loader />}
      <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm mb-6">
      <CardHeader
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
              <option value="marca">Marca</option>
              <option value="stock">Stock</option>
              <option value="disponible">Disponible</option>
              <option value="no-disponible">No Disponible</option>
              <option value="stockBajo">Stock Bajo</option>
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
            {filter ==="categoria" && (
                  <select
                  className="mb-4 sm:mb-0 p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
                  label="Categoría"
                  name="categoria"
                  value={filterValue}
                  onChange={handleFilterValueChange}
                  required
              >
                  <option value="LUBRICANTES">LUBRICANTES</option>
                  <option value="FILTROS">FILTROS</option>
                  <option value="REFRIGERANTES">REFRIGERANTES</option>
                  <option value="LIQUIDOS DE FRENO">LIQUIDOS DE FRENO</option>
              </select>
            )}
          </div>
          {/* <Button
            className="flex ml-0 lg:ml-auto mt-4 sm:mt-0"
            variant="text"
            size="sm"
            color="success"
            onClick={handleOpen}
          >
            <SquaresPlusIcon className="h-5 w-5 mr-2" />
            Registrar Producto
          </Button> */}
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre", "Categoria", "Marca", "Min", "Stock", "Precio", "Disponible"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-6 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-medium font-bold uppercase text-blue-gray-900"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredArticulos?.map((articulo) => (
                <tr key={articulo?.id}
                  className={
                    articulo.estado ? articulo.stock < articulo.cantidadMinima ? "border border-red-500 bg-red-200 text-gray-900" : "" : "border border-gray-500 bg-gray-200 text-gray-900"
                  }>
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
                        {articulo?.nombre}
                      </Typography>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    {articulo?.categoria}
                  </td>
                  <td className="py-3 px-5">
                    {articulo.marca}
                  </td>
                  <td className="py-3 px-5">
                    {articulo.cantidadMinima}
                  </td>
                  <td className="py-3 px-5">
                    {articulo.stock}
                  </td>
                  <td className="py-3 px-5">
                    {articulo.precio}
                  </td>
                  <td className="py-3 px-5">
                    {articulo.estado ? "Si" : "No"}
                  </td>
                  {/* <td className="py-3 px-5">
                    <div className="w-10/12">
                      <Typography
                        variant="small"
                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                      >
                        <Button size="sm" color="white" className="mr-2"
                          onClick={() => handleOpenUpdate(articulo)}
                        >
                          <PencilSquareIcon className="w-5 h-5 mr-2 text-yellow-900" />
                        </Button>
                      </Typography>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {/* <RegisterArticuloModal open={open} handleOpen={handleOpen} />
      <UpdateArticuloModal open={openUpdate} handleOpen={handleOpenUpdate} articulo={articuloSelect} />
    */}
    </div>
  );
};

export default VendedorInventario;
