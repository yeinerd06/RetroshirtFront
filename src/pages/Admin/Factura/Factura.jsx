import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { useUserContext } from "@/context/UserContext";
import {
  ArchiveBoxXMarkIcon,
  BanknotesIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PlusCircleIcon,
  PrinterIcon,
} from "@heroicons/react/24/solid";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Loader } from "@/Components/Loader";
import { Link, useNavigate } from "react-router-dom";
import ImprimirFactura from "./Components/ImprimirFactura";
import ReactToPrint from 'react-to-print';
import { apiPagoFactura } from "@/Api/Factura/Factura";

const FilterForm = ({ filters, onFilterChange }) => {
  const {modulo}=useUserContext()
  return (
    <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 w-full lg:w-auto">
      <select
        value={filters.filter}
        onChange={(e) => onFilterChange({ filter: e.target.value })}
        className="mb-4 sm:mb-0 p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
      >
        <option value="all">Todos</option>
        <option value="id"># Factura</option>
        <option value="fecha">Fecha</option>
        <option value="tipoFactura">Tipo de Factura</option>
        <option value="pagoPendiente">Estado de  Pago</option>
        <option value="cliente">Cliente</option>
        <option value="proveedor">Proveedor</option>
      </select>
      {filters.filter === "id" && (
        <input
          type="number"
          value={filters.filterId}
          onChange={(e) => onFilterChange({ filterId: e.target.value })}
          className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
        />
      )}
      {filters.filter === "fecha" && (
        <input
          type="date"
          value={filters.filterFecha}
          onChange={(e) => onFilterChange({ filterFecha: e.target.value })}
          className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
        />
      )}
      {filters.filter === "tipoFactura" && (
        <select
          value={filters.filterTipoFactura}
          onChange={(e) => onFilterChange({ filterTipoFactura: e.target.value })}
          className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
        >
          <option value="">Tipo de factura</option>
          {modulo !== "almacenista" && <option value="venta">Venta</option>}
          {modulo !== "vendedor" && <option value="compra">Compra</option>}
        </select>
      )}
      {filters.filter === "cliente" && (
        <input
          type="text"
          value={filters.filterCliente}
          onChange={(e) => onFilterChange({ filterCliente: e.target.value })}
          placeholder="Buscar por cliente"
          className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
        />
      )}
       {filters.filter === "proveedor" && (
        <input
          type="text"
          value={filters.filterProveedor}
          onChange={(e) => onFilterChange({ filterProveedor: e.target.value })}
          placeholder="Buscar por proveedor"
          className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
        />
      )}
      {filters.filter === "pagoPendiente" && (
  <select
    value={filters.filterPagoPendiente}
    onChange={(e) => onFilterChange({ filterPagoPendiente: e.target.value })}
    className="p-2 border border-blue-gray-200 rounded w-full sm:w-auto"
  >
    <option value="">Seleccione</option>
    <option value="pendiente">Pendiente</option>
    <option value="completado">Completado</option>
    <option value="cancelado">Cancelado</option>
    <option value="proveedor">Proveedor</option>
  </select>
)}

  
    </div>
  );
};

const FacturaTable = ({ facturas, onFacturaSelect, onFacturaPay, onFacturaView ,handleUpdateFactura }) => {
  const formatCurrency = (value) => value.toLocaleString("es-CO", { style: "currency", currency: "COP" });

  return (
    <table className="w-full min-w-[640px] table-auto">
      <thead>
        <tr>
          {["#", "Tipo Factura", "Vendedor", "Cliente / Proveedor", "Estado Pago", "Devolucion", "Precio Total", "Acciones"].map((el) => (
            <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-left">
              <Typography variant="small" className="text-[11px] font-medium font-bold uppercase text-blue-gray-900">{el}</Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {facturas.map((factura) => (
          <tr key={factura.id}>
            <td className="py-3 px-5">{factura.id}</td>
            <td className="py-3 px-5">
              <small>{factura.fechaRegistro.split("T")[0]}</small>
              <p>{factura.tipoFactura.nombre}</p>
            </td>
            <td className="py-3 px-5">
              <p>{factura.usuario.nombre}</p>
            </td>
            <td className="py-3 px-5">
              {factura.cliente ? (
                <>
                  <p>{factura.cliente.nombre}</p>
                  <p>{factura.cliente.documento}</p>
                </>
              ) : (
                <>
                  <p>{factura.proveedor.nombre}</p>
                  <p>{factura.proveedor.documento}</p>
                </>
              )}
            </td>
            <td className="py-3 px-5">
              {factura.tipoFactura.id == 1 ? (
                (factura.precioTotal - factura.devolucionTotal) > 0 ? (
                  <p>{factura.pagoEfectivo ? "Completado" : "Pendiente"}</p>
                ) : (
                  <p>Cancelado</p>
                )
              ) : (
                "Proveedor"
              )}
            </td>
            <td className="py-3 px-5 text-center">{factura.devolucion ? "SI" : "NO"}</td>
            <td className="py-3 px-5"> {factura.tipoFactura.id === 1 ? formatCurrency(factura.precioTotal - factura.devolucionTotal) :formatCurrency(factura.precioTotal ) }</td>
            <td className="py-3 px-5 flex ">
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray">
                    <EllipsisVerticalIcon strokeWidth={3} fill="currenColor" className="h-6 w-6" />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={() => onFacturaSelect(factura)} className="text-black flex">
                    <PrinterIcon className="w-4 h-4 text-yellow-700 mr-2" /> Imprimir
                  </MenuItem>
                  <MenuItem onClick={() => onFacturaView(factura)} className="flex text-black" title="Devolución">
                    <ArchiveBoxXMarkIcon className="w-4 h-4 mr-2 text-red-700" /> Devolución
                  </MenuItem>
                 {factura.tipoFactura.id==2  ? (
                  <>
                  {!factura.devolucion && (
                    <MenuItem onClick={() => handleUpdateFactura(factura)} className="flex text-black" title="Devolución">
                    <PencilIcon className="w-4 h-4 mr-2 text-orange-700" /> Update
                  </MenuItem>
                  )}
                  </>
                 ):(
                  <>
                  {!factura.devolucion && !factura.pagoEfectivo && (
                    <MenuItem onClick={() => handleUpdateFactura(factura)} className="flex text-black" title="Devolución">
                    <PencilIcon className="w-4 h-4 mr-2 text-orange-700" /> Update
                  </MenuItem>
                  )}
                  </>
                 ) }
                </MenuList>
              </Menu>
              {factura.tipoFactura.id == 1 && !factura.pagoEfectivo && (factura.precioTotal - factura.devolucionTotal) > 0 && (
                    <MenuItem onClick={() => onFacturaPay(factura)} className="flex text-black" title="Pagar">
                      <BanknotesIcon className="w-4 h-4 text-green-700" /> Pagar
                    </MenuItem>
                  )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AdminFactura = () => {
  const { articulos, facturas, setFacturas, modulo } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [filters, setFilters] = useState({
    filter: "all",
    filterId:"",
    filterValue: "",
    filterFecha: "",
    filterTipoFactura: "",
    filterCliente: "",
    filterProveedor:"",
    filterPagoPendiente:"",
  });
  const componentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    let tipoFactura = "";
    switch (modulo) {
      case "almacenista":
        tipoFactura = "COMPRA";
        break;
      case "vendedor":
        tipoFactura = "VENTA";
        break;
      default:
        break;
    }
    console.log(tipoFactura)
  
    setFilters((prev) => ({ ...prev, tipoFactura }));
  }, [modulo,facturas,setFacturas,setFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filterFacturas = useCallback((facturas) => {
    return facturas.filter((factura) => {
      const filtroTipoFactura = filters.filterTipoFactura.toLowerCase();
  
      // Si el filtro es "all", devolver todas las facturas
      if (filters.filter === "all") {
        return true;
      }
  
      return (
        (!filters.filterId || (factura.id === Number(filters.filterId))) &&
        (!filters.filterPagoPendiente || 
          (filters.filterPagoPendiente === "cancelado" &&  (factura.precioTotal - factura.devolucionTotal) <= 0) ||
          (filters.filterPagoPendiente === "pendiente" && !factura.pagoEfectivo && (factura.precioTotal - factura.devolucionTotal) > 0 && factura.tipoFactura.id === 1 ) ||
          (filters.filterPagoPendiente === "completado" && factura.pagoEfectivo && factura.tipoFactura.id == 1 ) ||
          (filters.filterPagoPendiente === "proveedor"  && factura.tipoFactura.id == 2 )

        ) &&
        (!filters.filterFecha || (factura.fechaRegistro?.split("T")[0] === filters.filterFecha)) &&
        (!filters.filterTipoFactura || factura.tipoFactura.nombre.toLowerCase() === filtroTipoFactura) &&
        (!filters.filterCliente || factura?.cliente?.nombre?.toLowerCase()?.includes(filters.filterCliente.toLowerCase())) &&
        (!filters.filterProveedor || factura?.proveedor?.nombre?.toLowerCase()?.includes(filters.filterProveedor.toLowerCase()))
      );
    });
  }, [filters]);
  
  

  const filteredFacturas = useMemo(() => filterFacturas(facturas), [facturas, filterFacturas]);

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
  const handleUpdateFactura = (factura) => {
    navigate(`/${modulo}/proveedor/compra/${factura.id}/actualizar`);
  };


  const handlePagarFactura = (factura) => {
    const content = `
      <div>
        <h3>Factura #${factura.id}</h3>
        <p>Cliente : ${factura.cliente.nombre}</p>
        <p style="text-align: right;">Precio de Venta: $ ${factura.precioTotal}</p>
        ${factura.devolucion ? `
          <p style="text-align: right;">Devolución: - $ ${factura.devolucionTotal}</p>
          <p style="text-align: right;">Total a pagar: $ ${factura.precioTotal - factura.devolucionTotal}</p>
        ` : ''}
      </div>
    `;

    alertify.confirm('Pagar factura de venta', content,
      () => {
        setLoading(true);
        apiPagoFactura(factura.id)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setFacturas((prev) => prev.map((item) => (item.id === data.data.id ? data.data : item)));
              alertify.success('Pago confirmado');
            } else {
              alertify.error('Error Pago cancelado');
            }
          })
          .catch((e) => {
            console.error(e);
            alertify.error('Error en el pago');
          })
          .finally(() => {
            setLoading(false);
          });
      },
      () => alertify.error('Pago cancelado')
    ).set('labels', { ok: 'Pagar', cancel: 'Cancelar' }).set('closable', false);

    // Cambiar colores de botones
    document.querySelector('.ajs-ok').style.backgroundColor = '#4CAF50'; // Verde para Pagar
    document.querySelector('.ajs-cancel').style.backgroundColor = '#f44336'; // Rojo para Cancelar
  };

  return (
    <div className="mb-4 mt-6">
      {loading && <Loader />}
      <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm mb-6">
        <CardHeader floated={false} shadow={false} color="transparent" className="m-0 flex flex-col sm:flex-col lg:flex-row items-center justify-between p-6">
          <FilterForm filters={filters} onFilterChange={handleFilterChange} />
          <Link to={`/${modulo}/facturacion/venta`}>
            <Button className="flex ml-0 lg:ml-auto mt-4 sm:mt-0" variant="text" size="sm" color="success">
              Registrar Factura
            </Button>
          </Link>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <FacturaTable handleUpdateFactura={handleUpdateFactura} facturas={filteredFacturas} onFacturaSelect={handleOpenFactura} onFacturaPay={handlePagarFactura} onFacturaView={handleViewFactura} />
        </CardBody>
      </Card>
      {selectedFactura && (
        <Dialog open={open} handler={handleClose} size="lg" dismiss={{ enabled: false }}>
          <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <ImprimirFactura ref={componentRef} factura={selectedFactura} />
          </DialogBody>
          <DialogFooter>
            <Button variant="text" color="red" onClick={handleClose} className="mr-2">Cancelar</Button>
            <ReactToPrint trigger={() => <Button variant="gradient" color="green">Imprimir Factura</Button>} content={() => componentRef.current} />
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default AdminFactura;
