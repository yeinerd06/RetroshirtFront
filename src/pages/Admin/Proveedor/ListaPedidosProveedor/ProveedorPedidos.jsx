import React, { useState, useMemo } from "react";
import { useProveedorContext } from "@/context/ProveedorContext";
import { useUserContext } from "@/context/UserContext";
import MenuProveedor from "../Menu/MenuProveedor";
import Select from "react-select";
import { IconButton } from "@material-tailwind/react";
import { GrClearOption } from "react-icons/gr";

import { TablaPedidos } from "./TablaPedidos/TablaPedidos";
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
const Filtro = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => (
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

const ProveedorPedidos = () => {
  const { proveedores, modulo } = useUserContext();
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
          !codigoFactura ||
          pedido.codigoFactura.toString().includes(codigoFactura);
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
    [
      proveedoresPedidos,
      selectedProveedor,
      codigoFactura,
      fechaInicio,
      fechaFin,
      estadoPedido,
    ]
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
