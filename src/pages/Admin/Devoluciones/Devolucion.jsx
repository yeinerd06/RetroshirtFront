import React, { useRef, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useUserContext } from "@/context/UserContext";
import { InformationCircleIcon, PencilSquareIcon, PrinterIcon, SquaresPlusIcon,  } from "@heroicons/react/24/solid";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Loader } from "@/Components/Loader";
import { Link, useNavigate } from "react-router-dom";
import ReactToPrint from 'react-to-print';
import ImprimirFactura from "../Factura/Components/ImprimirFactura";

const AdminDevolucion = () => {
  const { articulos, facturas, modulo } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [filter, setFilter] = useState({
    type: "all",
    value: "",
    fecha: "",
    tipoFactura: "",
    cliente: "",
    numero: "",
  });
  const componentRef = useRef();
  const navigate = useNavigate();

  const handleFilterTypeChange = (e) => {
    const { value } = e.target;
    setFilter({
      type: value,
      value: "",
      fecha: "",
      tipoFactura: "",
      cliente: "",
      numero: "",
    });
  };

  const handleFilterValueChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filterFacturas = (facturas) => {
    return facturas.filter((factura) => {
      const fechaFactura = new Date(factura.fecha);
      const fechaFiltro = new Date(filter.fecha);
      const filtroTipoFactura = filter.tipoFactura.toLowerCase();
      return (
        (!filter.fecha || (fechaFactura.getFullYear() === fechaFiltro.getFullYear() && fechaFactura.getMonth() === fechaFiltro.getMonth() && fechaFactura.getDate() === fechaFiltro.getDate())) &&
        (!filtroTipoFactura || factura.tipoFactura.nombre.toLowerCase() === filtroTipoFactura) &&
        (!filter.numero || factura.id === Number(filter.numero)) &&
        (!filter.cliente || factura?.cliente?.nombre?.toLowerCase()?.includes(filter.cliente.toLowerCase()))
      );
    });
  };

  const filteredFacturas = filterFacturas(facturas);

  const formatCurrency = (value) => {
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  const handleOpenFactura = (factura) => {
    setSelectedFactura(factura);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFactura(null);
  };

  const handleViewFactura = (factura) => {
    navigate(`/${modulo}/facturacion/factura/${factura.id}`);
  };

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
              name="type"
              value={filter.type}
              onChange={handleFilterTypeChange}
              className="mb-4 sm:mb-0 p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
            >
              <option value="all">Todos</option>
              <option value="numero">Numero de Factura</option>
              <option value="tipoFactura">Tipo de Factura</option>
              <option value="cliente">Cliente</option>
            </select>
            {filter.type === "fecha" && (
              <input
                type="date"
                name="fecha"
                value={filter.fecha}
                onChange={handleFilterValueChange}
                className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
              />
            )}
            {filter.type === "tipoFactura" && (
              <select
                name="tipoFactura"
                value={filter.tipoFactura}
                onChange={handleFilterValueChange}
                className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
              >
                <option value="">Tipo de factura</option>
                <option value="venta">Venta</option>
                <option value="compra">Compra</option>
              </select>
            )}
            {filter.type === "cliente" && (
              <input
                type="text"
                name="cliente"
                value={filter.cliente}
                onChange={handleFilterValueChange}
                placeholder="Buscar por cliente"
                className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
              />
            )}
            {filter.type === "numero" && (
              <input
                type="text"
                name="numero"
                value={filter.numero}
                onChange={handleFilterValueChange}
                placeholder="Buscar por número"
                className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
              />
            )}
          </div>
         
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["#", "Tipo Factura",  "Cliente / Proveedor", "Total Inicial", "Devoluciónes","Total Devoluciónes","Total Final","Acciones"].map((el) => (
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
              {filteredFacturas?.filter(factura => factura.devolucion)?.map((factura) => (
                <tr key={factura?.id} className="border">
                  <td className="py-3 px-5">
                    <p>{factura.id}</p>
                  </td>
                  <td className="py-3 px-5">
                    <p>{factura.tipoFactura.nombre}</p>
                  </td>
                 
                  <td className="py-3 px-5">
                  {factura.cliente ? (
                        <>
                          <p>{factura?.cliente?.nombre}</p>
                          <p>{factura?.cliente?.documento}</p>
                        </>
                      ) : (
                        <>
                          <p>{factura?.proveedor?.nombre}</p>
                          <p>{factura?.proveedor?.documento}</p>
                        </>
                      )}
                  </td>
                 
                 
                  <td className="py-3 px-5">
                    {formatCurrency(factura.precioTotal)}
                  </td>
                  <td className="py-3 px-5">
                 
                   {factura.productos.map((producto)=>(
                    <ul key={producto.id}>
                      {producto?.devoluciones?.map((devolucion)=>(
                        <li key={devolucion.id}>
                          <small className='bg-default'>items: {devolucion.cantidadDevolucion} - $ {devolucion.precio} </small>
                        </li> 
                      ))}
                    
                   </ul>
                   ))}
                  </td>
                  <td className="py-3 px-5">
                  {factura.tipoFactura.id==1? (
                      <p>  {formatCurrency( factura.devolucionTotal)}</p>
                    ):(
                      <p>No aplica</p>
                    )}
                  </td>
                  <td className="py-3 px-5">
                    {factura.tipoFactura.id==1? (
                      <p>  {formatCurrency(factura.precioTotal- factura.devolucionTotal)}</p>
                    ):(
                      <p>  {formatCurrency(factura.precioTotal)}</p>
                    )}
                  
                  </td>
                  <td className="py-3 px-5">
                    <div className="w-10/12 flex items-center justify-start">
                      <Typography
                        variant="small"
                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                      >
                        <div className="flex space-x-2">
                        <Button size="sm" color="white" className="" title="Informacion"
                            onClick={() => handleViewFactura(factura)}
                          >
                          <PencilSquareIcon className="w-5 h-5 text-yellow-800" />
                          </Button>
                         
                        </div>
                      </Typography>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {selectedFactura && (
        <Dialog open={open} handler={handleClose} size="lg"   
        dismiss={{
          enabled: false, // Esto asegura que el modal no se cierre al hacer clic fuera
        }}>
          <DialogHeader>Factura de venta</DialogHeader>
          <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <ImprimirFactura ref={componentRef} factura={selectedFactura} />
          </DialogBody>
          <DialogFooter>
              <Button variant="text" color="red" onClick={handleClose} className="mr-2">
                  Cancelar
              </Button>
              <ReactToPrint
                  trigger={() => <Button variant="gradient" color="green">Imprimir Factura</Button>}
                  content={() => componentRef.current}
              />
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDevolucion;
