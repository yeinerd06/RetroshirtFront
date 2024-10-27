import { IconButton } from "@material-tailwind/react";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaTruckRampBox } from "react-icons/fa6";
import { Link } from "react-router-dom";

// Componente de la tabla
export  const  TablaPedidos = ({
    pedidos,
    toggleExpandPedido,
    expandedPedidoId,
    modulo,
  }) => (
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
            pedidos
              .slice()
              .reverse()
              .map((pedido) => (
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
  const PedidoRow = ({ pedido, expanded, toggleExpandPedido, modulo }) => (
    <tr className="text-center">
      <td className="py-2 px-4 border-b">{pedido.codigoFactura}</td>
      <td className="py-2 px-4 border-b">
        {pedido.proveedor.nombre} {pedido.proveedor.apellido}
      </td>
      <td className="py-2 px-4 border-b">
        {new Date(pedido.fechaPedido).toLocaleDateString()}
      </td>
      <td className="py-2 px-4 border-b">
        {pedido.fechaRegistro
          ? new Date(pedido.fechaRegistro).toLocaleDateString()
          : "N/A"}
      </td>
      <td className="py-2 px-4 border-b">{pedido.total}</td>
      <td className="py-2 px-4 border-b">
        {pedido.estadoPedido ? "Completado" : "Pendiente"}
        <p>{pedido.devolucion === true && "Con Devolución"}</p>
      </td>
      <td className="py-2 px-4 border-b ">
        <IconButton
          className={
            expanded
              ? "bg-yellow-900 hover:bg-yellow-700"
              : "bg-blue-900 hover:bg-blue-700"
          }
          onClick={() => toggleExpandPedido(pedido.id)}
        >
          {expanded ? (
            <FaEyeSlash
              className="text-xl"
              title="Ocultar información de pedido"
            />
          ) : (
            <FaEye className="text-xl" title="Ver información de pedido" />
          )}
        </IconButton>
        {!pedido.estadoPedido && (
          <Link
            to={`/${modulo}/proveedor/${pedido.proveedor.id}/pedido/${pedido.id}/confirmar`}
          >
            <IconButton
              title="Recibir Pedido"
              className="ml-3 bg-orange-900 hover:bg-orange-700 text-xl"
              onClick={() => console.log(pedido)}
            >
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
                  <td className="py-2 px-4 border-b ">{producto.cantidad}</td>
                  <td className="py-2 px-4 border-b">
                    {producto?.devolucionProveedor !== null && (
                      <>
                        <div className="flex justify-between">
                          <p>Cantidad :</p>
                          <p>{producto?.devolucionProveedor?.cantidad}</p>
                        </div>
                        <p className="text-start text-xs">
                          {producto?.devolucionProveedor?.motivo}
                        </p>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );