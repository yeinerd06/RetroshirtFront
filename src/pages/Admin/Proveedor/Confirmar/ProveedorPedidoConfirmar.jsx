import React, { useState, useEffect } from "react";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader } from "@/Components/Loader";
import { useProveedorContext } from "@/context/ProveedorContext";
import DatosProveedor from "../Components/DatosProveedor";
import TablaProductos from "./TablaProductos/TablaProductos";
import { IoMdArrowRoundBack } from "react-icons/io";
import { apiConfirmarPedidoProveedor } from "@/Api/Pedido/PedidoProveedor";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { useUserContext } from "@/context/UserContext";
const ProveedorPedidoConfirmar = () => {
  const { idPedido } = useParams();

  const [loading, setLoading] = useState(false);
  const { proveedoresPedidos ,listadoProveedoresPedidos} = useProveedorContext();
  const {listadoArticulos}=useUserContext()
  const [pedidoPendiente, setPedidoPendiente] = useState({});
  const [codigoFactura, setCodigoFactura] = useState("");
  const [valorFactura, setValorFactura] = useState(null);
  const [proveedor, setProveedor] = useState({});
  const [fechaPedido, setFechaPedido] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (proveedoresPedidos) {
      const pedidoEncontrado = proveedoresPedidos.find(
        (p) => p.id === Number(idPedido)
      );
      setProveedor(pedidoEncontrado?.proveedor);
      setPedidoPendiente(pedidoEncontrado);
      setCodigoFactura(pedidoEncontrado?.codigoFactura);
      setValorFactura(pedidoEncontrado?.total);
      setFechaPedido(pedidoEncontrado?.fechaPedido.split("T")[0]);
      setFechaEntrega(pedidoEncontrado?.fechaEntrega.split("T")[0]);
      setNota(pedidoEncontrado?.nota);
    }
  }, [proveedoresPedidos, idPedido]);

  const handleSaveFactura = (e) => {
    e.preventDefault();

    // Validar si todos los productos están confirmados
    const todosConfirmados = pedidoPendiente?.productos?.every(
      (producto) => producto.confirmado === true
    );

    if (!todosConfirmados) {
      setError(
        "Todos los productos deben estar confirmados para guardar la factura."
      );
      return;
    }

    // Validar devoluciones
    const devolucionInvalida = pedidoPendiente?.productos?.some((producto) => {
      if (producto.devolucion) {
        // Verificar que si hay devoluciones, se haya ingresado cantidad y motivo
        return (
          producto.cantidadDevolucion <= 0 ||
          producto.motivoDevolucion.length === 0
        );
      }
      return false;
    });

    if (devolucionInvalida) {
      setError(
        "Debe ingresar la cantidad y el motivo para todos los productos con devolución."
      );
      return;
    }

    // Verificar si algún producto tiene devolución
    const huboDevolucion = pedidoPendiente?.productos?.some(
      (producto) => producto.devolucion === true
    );

    // Actualizar el pedido con el campo "devolucion" si hubo una devolución
    const pedidoActualizado = {
      ...pedidoPendiente,
      devolucion: huboDevolucion ? true : false, // Añadir el campo devolucion
    };

    // Mostrar el pedido actualizado en consola
    console.log("Pedido actualizado:", pedidoActualizado);

    setError("");
    apiConfirmarPedidoProveedor(pedidoActualizado)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          listadoProveedoresPedidos()
          listadoArticulos()
          alertify.success("Pedido confirmado con éxito");
          navigate(-1);
        }else{
          alertify.error(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleProductoUpdate = (productoId, productoData) => {
    const productosActualizados = pedidoPendiente.productos.map((producto) => {
      if (producto.id === productoId) {
        return {
          ...producto,
          ...productoData, // Solo actualizamos los campos confirmados y devolución sin modificar la estructura original
        };
      }
      return producto;
    });

    setPedidoPendiente({
      ...pedidoPendiente,
      productos: productosActualizados,
    });
  };

  return (
    <>
      <Loader loading={loading} />
      <div className="flex justify-between p-3">
        <Typography variant="h2" className="text-lg sm:text-2xl uppercase">
          CONFIRMAR PEDIDO
        </Typography>
        <Link onClick={() => navigate(-1)}>
        <IoMdArrowRoundBack   className="text-2xl mr-3 text-red-900" aria-hidden="true" />
        </Link>
      </div>
      <DatosProveedor proveedor={proveedor} />
      <form onSubmit={handleSaveFactura}>
      <strong className="p-3">Productos a confirmar:</strong>
        {pedidoPendiente?.productos?.length > 0 && (
          <TablaProductos
            productos={pedidoPendiente?.productos}
            onProductoUpdate={handleProductoUpdate}
          />
        )}
        <br />
        
         <strong className="p-3 ">Información del pedido:</strong>
        <div className="grid sm:grid-cols-2 gap-6 mt-1">
          <div>
            <Input
              label="N° Factura"
              type="text"
              value={codigoFactura}
              onChange={(e) => setCodigoFactura(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Precio Factura"
              type="number"
              value={valorFactura}
              onChange={(e) => setValorFactura(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="mt-4">
            <label className="mr-2">Fecha de Pedido</label>
            <Input
              type="date"
              value={fechaPedido}
              onChange={(e) => setFechaPedido(e.target.value)}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="mr-2">Fecha de Entrega</label>
            <Input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              disabled
            />
          </div>
        </div>
        <div className="mt-4">
          <Textarea
            label="Nota"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            disabled
          />
        </div>
        
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}{" "}
        {/* Mostrar error si no todos los productos están confirmados */}
        <div className="flex justify-end items-center mt-4">
          <Button className="bg-green-900 text-white" type="submit">
            CONFIRMAR PEDIDO
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProveedorPedidoConfirmar;
