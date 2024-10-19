import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
  Input,
} from "@material-tailwind/react";
import Select from "react-select";
import { useUserContext } from "@/context/UserContext";
import { DeviceTabletIcon, PlusIcon } from "@heroicons/react/24/solid";

const ModalSubirFactura = ({ modal, toggle, setLoading }) => {
  const { articulos, setFacturas, usuario, setProductos } = useUserContext();
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [listaProductos, setListaProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState([]);

  const handleProductoChange = (selectedOption) => {
    setSelectedProducto(selectedOption);
  };

  const handleCantidadChange = (e) => {
    const nuevaCantidad = Number(e.target.value);
    if (selectedProducto && nuevaCantidad > selectedProducto.producto.stock) {
      setCantidad(selectedProducto.producto.stock);
    } else {
      setCantidad(nuevaCantidad);
    }
  };

  const handleAgregarProducto = () => {
    if (selectedProducto && cantidad > 0) {
      if (cantidad <= selectedProducto.producto.stock) {
        setListaProductos((prevLista) => {
          const productoExistente = prevLista.find(
            (p) => p.value === selectedProducto.value
          );
          if (productoExistente) {
            const nuevaCantidad = productoExistente.cantidad + cantidad;
            if (nuevaCantidad <= selectedProducto.producto.stock) {
              return prevLista.map((p) =>
                p.value === selectedProducto.value
                  ? { ...p, cantidad: nuevaCantidad }
                  : p
              );
            } else {
              return prevLista;
            }
          } else {
            return [...prevLista, { ...selectedProducto, cantidad }];
          }
        });
        setSelectedProducto(null);
        setCantidad(1);
      }
    }
  };

  const handleEliminarProducto = (productoId) => {
    setListaProductos((prevLista) =>
      prevLista.filter((p) => p.value !== productoId)
    );
  };

  const handleCantidadModificar = (productoId, nuevaCantidad) => {
    setListaProductos((prevLista) =>
      prevLista.map((p) =>
        p.value === productoId ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  useEffect(() => {
    const nuevoTotal = listaProductos.reduce((acc, producto) => {
      return acc + producto.precio * producto.cantidad;
    }, 0);
    setTotal(nuevoTotal);
  }, [listaProductos]);

  const productosOptions = articulos
    .filter((producto) => producto.estado)
    .map((producto) => ({
      value: producto.id,
      label: `${producto.nombre} - $${producto.precio.toFixed(2)}`,
      precio: producto.precio,
      producto: producto,
    }));

  const handleSaveFactura = (e) => {
    e.preventDefault();
    setMensaje("");
    const factura = {
      usuario: usuario.id,
      precioTotal: total,
      productos: listaProductos,
    };

    const productosConCantidadCero = listaProductos.filter(
      (producto) => producto.cantidad === 0
    );

    if (productosConCantidadCero.length > 0) {
      setMensaje(
        "La cantidad de algunos productos es 0. Por favor, verifica antes de continuar."
      );

      return;
    }

    console.log(factura);
    setLoading(true);
    apiSaveFactura(factura)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setFacturas((prevProductos) => [...prevProductos, data.data]);
          toggle();
          listadoArticulos();
        } else {
          Swal.fire("Error", "Error en el servidor", "error");
        }
      })
      .catch((e) => {
        console.log(e);
        Swal.fire("Error", "Error en el servidor", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  return (
    <Dialog
      open={modal}
      handler={toggle}
      size="xl"
      dismiss={{
        enabled: false, // Esto asegura que el modal no se cierre al hacer clic fuera
      }}
    >
      <DialogHeader className="bg-blue-500 text-white flex items-center justify-between">
        <Typography variant="h2" className="text-lg sm:text-2xl">
          Registrar Factura de venta
        </Typography>
        <Button variant="text" color="red" onClick={toggle} className="ml-auto">
          <i className="fa fa-times-circle" aria-hidden="true"></i>
        </Button>
      </DialogHeader>
      <form onSubmit={handleSaveFactura}>
        <DialogBody divider>
          <CardBody>
            <div className="flex flex-col sm:flex-row items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center w-full sm:w-1/2">
                <label className="mr-2 w-1/4 sm:w-auto">Producto</label>
                <Select
                  options={productosOptions}
                  value={selectedProducto}
                  onChange={handleProductoChange}
                  placeholder="Buscar por nombre"
                  className="w-full"
                />
              </div>
              <div className="flex items-center w-full sm:w-1/3">
                <label className="mr-2 w-1/3 sm:w-auto">Cantidad</label>
                <Input
                  type="number"
                  value={cantidad}
                  onChange={handleCantidadChange}
                  min="1"
                  className="w-full"
                />
              </div>
              <Button
                variant="gradient"
                color="blue"
                onClick={handleAgregarProducto}
                className="w-full sm:w-auto"
              >
                <PlusIcon className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <div className="mt-1 mb-1">
              <p className="text-center text-red">{mensaje}</p>
            </div>

            {listaProductos.length > 0 && (
              <div className="overflow-auto">
                <table className="w-full mt-4">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="p-2">Stock</th>
                      <th className="p-2">Producto</th>
                      <th className="p-2">Cantidad</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaProductos.map((producto, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{producto.producto.stock}</td>
                        <td className="p-2">{producto.label}</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={producto.cantidad}
                            min="1"
                            max={producto.producto.stock}
                            onChange={(e) => {
                              const nuevaCantidad = Number(e.target.value);
                              if (nuevaCantidad <= producto.producto.stock) {
                                handleCantidadModificar(
                                  producto.value,
                                  nuevaCantidad
                                );
                              }
                            }}
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {formatCurrency(producto.precio * producto.cantidad)}
                        </td>
                        <td className="p-2">
                          <Button
                            variant="text"
                            color="red"
                            onClick={() =>
                              handleEliminarProducto(producto.value)
                            }
                          >
                            <DeviceTabletIcon className="h-5 w-5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end items-center mt-4">
              <Typography  color="blue-gray">
                Precio base: {formatCurrency(total * 0.81)}
              </Typography>
            </div>
            <div className="flex justify-end items-center mt-4">
              <Typography  color="blue-gray">
                IVA: {formatCurrency(total * 0.19)}
              </Typography>
            </div>
            <div className="flex justify-end items-center mt-4">
              <Typography  color="blue-gray">
                Precio Total: {formatCurrency(total)}
              </Typography>
            </div>
          </CardBody>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <Button variant="gradient" color="green" type="submit">
            GUARDAR
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default ModalSubirFactura;
