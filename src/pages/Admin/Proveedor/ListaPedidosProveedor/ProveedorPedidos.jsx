import React, { useState, useMemo } from "react";
import { useProveedorContext } from "@/context/ProveedorContext";
import { useUserContext } from "@/context/UserContext";
import MenuProveedor from "../Menu/MenuProveedor";
import Select from "react-select";
import { IconButton, Button } from "@material-tailwind/react";
import { GrClearOption } from "react-icons/gr";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaTruckRampBox } from "react-icons/fa6";
import { Link } from "react-router-dom";
// Componente de Filtros
const Filtros = ({
  codigoFactura,
  setCodigoFactura,
  selectedProveedor,
  setSelectedProveedor,
  proveedorOptions,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  estadoPedido,
  setEstadoPedido,
  clearFilters,
  estadoOptions,
}) => (
  <div className="my-4">
    <div className="flex gap-4 ml-3">
      <Filtro
        label="N° Factura"
        value={codigoFactura}
        onChange={setCodigoFactura}
        placeholder=" N° Factura"
      />
      <SelectFilter
        label="Proveedor"
        options={proveedorOptions}
        value={selectedProveedor}
        onChange={setSelectedProveedor}
      />
      <Filtro
        label="Fecha Pedido"
        value={fechaInicio}
        type="date"
        onChange={setFechaInicio}
      />
      <Filtro
        label="Fecha Entrega"
        value={fechaFin}
        type="date"
        onChange={setFechaFin}
      />
      <SelectFilter
        label="Estado"
        options={estadoOptions}
        value={estadoPedido}
        onChange={setEstadoPedido}
      />
      <div className="w-1/6">
        <IconButton
          className="bg-red-900 hover:bg-red-700 mt-6"
          onClick={clearFilters}
        >
          <GrClearOption className="text-xl" />
        </IconButton>
      </div>
    </div>
  </div>
);

// Filtro básico
const Filtro = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div className="w-1/6">
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 p-2 rounded"
      placeholder={placeholder}
    />
  </div>
);

// Select personalizado
const SelectFilter = ({ label, options, value, onChange }) => (
  <div className="w-1/4">
    <label className="block text-gray-700">{label}</label>
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={` ${label.toLowerCase()}`}
    />
  </div>
);

// Componente de la tabla
const TablaPedidos = ({ pedidos, toggleExpandPedido, expandedPedidoId ,modulo}) => (
  <div className="overflow-x-auto mt-6">
    <table className="table min-w-full border border-gray-300">
      <thead className="bg-blue-900 text-white">
        <tr>
          <th className="py-2 px-4 border-b">N° Factura</th>
          <th className="py-2 px-4 border-b">Proveedor</th>
          <th className="py-2 px-4 border-b">Fecha Pedido</th>
          <th className="py-2 px-4 border-b">Fecha Entrega</th>
          <th className="py-2 px-4 border-b">Total</th>
          <th className="py-2 px-4 border-b">Estado</th>
          <th className="py-2 px-4 border-b">Acción</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.length > 0 ? (
          pedidos.slice().reverse().map((pedido) => (
            <React.Fragment key={pedido.id}>
              <PedidoRow
                pedido={pedido}
                expanded={expandedPedidoId === pedido.id}
                toggleExpandPedido={toggleExpandPedido}
                modulo={modulo}
              />
              {expandedPedidoId === pedido.id && (
                <ProductosRow productos={pedido.productos} />
              )}
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="py-4 text-center">
              No se encontraron pedidos que coincidan con los filtros.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// Fila de pedido
const PedidoRow = ({ pedido, expanded, toggleExpandPedido,modulo }) => (
  <tr className="text-center">
    <td className="py-2 px-4 border-b">{pedido.codigoFactura}</td>
    <td className="py-2 px-4 border-b">
      {pedido.proveedor.nombre} {pedido.proveedor.apellido}
    </td>
    <td className="py-2 px-4 border-b">
      {new Date(pedido.fechaPedido).toLocaleDateString()}
    </td>
    <td className="py-2 px-4 border-b">
      {pedido.fechaEntrega
        ? new Date(pedido.fechaEntrega).toLocaleDateString()
        : "N/A"}
    </td>
    <td className="py-2 px-4 border-b">{pedido.total}</td>
    <td className="py-2 px-4 border-b">
      {pedido.estadoPedido ? "Completado" : "Pendiente"}
      <p>
      {pedido.devolucion === true && "Con Devolución"}
      </p>
    </td>
    <td className="py-2 px-4 border-b ">
      <IconButton
        className={
          expanded ? "bg-yellow-900 hover:bg-yellow-700" : "bg-blue-900 hover:bg-blue-700"
        }
        onClick={() => toggleExpandPedido(pedido.id)}
      >
        {expanded ? <FaEyeSlash className="text-xl" title="Ocultar información de pedido" /> : <FaEye className="text-xl" title="Ver información de pedido" />}
      </IconButton >
      {!pedido.estadoPedido && (
        <Link to={`/${modulo}/proveedor/${pedido.proveedor.id}/pedido/${pedido.id}/confirmar`}>
        <IconButton title="Recibir Pedido" className="ml-3 bg-orange-900 hover:bg-orange-700 text-xl" onClick={() => console.log(pedido)}>
        <FaTruckRampBox />
        </IconButton>
        </Link>
      )}
      
    </td>
  </tr>
);

// Fila de productos dentro de un pedido
const ProductosRow = ({ productos }) => (
  <tr>
    <td colSpan="7" className="p-4">
      <div className="  rounded-md">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b"></th>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Color</th>
              <th className="py-2 px-4 border-b">Talla</th>
              <th className="py-2 px-4 border-b">Cantidad</th>
              <th className="py-2 px-4 border-b">Devolución</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">
                  {producto.proveedorArticulo.articulo.imagen && (
                    <img
                      src={producto.proveedorArticulo.articulo?.imagen}
                      alt="Imagen del artículo"
                      className="rounded-none w-16 h-16 object-cover"
                    />
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {producto.proveedorArticulo.articulo.nombre}
                </td>
                <td className="py-2 px-4 border-b">{producto.color.nombre}</td>
                <td className="py-2 px-4 border-b">{producto.talla.nombre}</td>
                <td className="py-2 px-4 border-b ">
                {producto.cantidad} 
                  </td>
                  <td className="py-2 px-4 border-b">
                    {producto?.devolucion === true && "Cantidad:"}  {producto?.cantidadDevolucion}
                    <p>{producto?.motivoDevolucion}</p>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </td>
  </tr>
);

const ProveedorPedidos = () => {
  const { proveedores,modulo } = useUserContext();
  const { proveedoresPedidos } = useProveedorContext();

  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [codigoFactura, setCodigoFactura] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoPedido, setEstadoPedido] = useState(null);
  const [expandedPedidoId, setExpandedPedidoId] = useState(null);

  const estadoOptions = [
    { value: true, label: "Completado" },
    { value: false, label: "Pendiente" },
  ];

  const proveedorOptions = proveedores.map((proveedor) => ({
    value: proveedor.id,
    label: `${proveedor.nombre} ${proveedor.apellido}`,
  }));

  const clearFilters = () => {
    setSelectedProveedor(null);
    setCodigoFactura("");
    setFechaInicio("");
    setFechaFin("");
    setEstadoPedido(null);
  };

  const filteredPedidos = useMemo(
    () =>
      proveedoresPedidos.filter((pedido) => {
        const matchesProveedor =
          !selectedProveedor || pedido.proveedor.id === selectedProveedor.value;
        const matchesCodigoFactura =
          !codigoFactura || pedido.codigoFactura.toString().includes(codigoFactura);
        const matchesFechaInicio =
          !fechaInicio || new Date(pedido.fechaPedido) >= new Date(fechaInicio);
        const matchesFechaFin =
          !fechaFin || new Date(pedido.fechaEntrega) <= new Date(fechaFin);
        const matchesEstado =
          estadoPedido === null || pedido.estadoPedido === estadoPedido.value;

        return (
          matchesProveedor &&
          matchesCodigoFactura &&
          matchesFechaInicio &&
          matchesFechaFin &&
          matchesEstado
        );
      }),
    [proveedoresPedidos, selectedProveedor, codigoFactura, fechaInicio, fechaFin, estadoPedido]
  );

  const toggleExpandPedido = (id) => {
    setExpandedPedidoId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div>
      <MenuProveedor />
      <strong className="p-3">Filtros:</strong>
      <Filtros
        codigoFactura={codigoFactura}
        setCodigoFactura={setCodigoFactura}
        selectedProveedor={selectedProveedor}
        setSelectedProveedor={setSelectedProveedor}
        proveedorOptions={proveedorOptions}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        estadoPedido={estadoPedido}
        setEstadoPedido={setEstadoPedido}
        clearFilters={clearFilters}
        estadoOptions={estadoOptions}
      />
      <strong className="p-3">Listado de Pedidos a proveedores:</strong>
      <TablaPedidos
        pedidos={filteredPedidos}
        toggleExpandPedido={toggleExpandPedido}
        expandedPedidoId={expandedPedidoId}
        modulo={modulo}
      />
    </div>
  );
};

export default ProveedorPedidos;
