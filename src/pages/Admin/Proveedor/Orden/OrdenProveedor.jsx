// imports
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Typography,
  Input,
  IconButton,
  Textarea,
} from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SelectReact from "react-select";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Loader } from "@/Components/Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import DatosProveedor from "../Components/DatosProveedor";
import { useProductoContext } from "@/context/ProductoContext";
import { apiSavePedidoProveedor } from "@/Api/Pedido/PedidoProveedor";
import { useProveedorContext } from "@/context/ProveedorContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import RegisterArticuloModal from "../../Inventario/Components/RegisterArticuloModal";

// Subcomponente para el manejo de la tabla de tallas por color
const TallasTable = ({
  tallasOptions,
  prodIndex,
  colorIndex,
  colorObj,
  handleTallaCantidadChange,
}) => {
  return (
    <div className="border-t mt-2 pt-2">
      <Typography variant="h6">Color: {colorObj.color.label}</Typography>
      <div className="flex items-center space-x-4">
        {tallasOptions.map((talla) => (
          <div key={talla.value} className="flex items-center space-x-2">
            <Typography variant="small" className="font-bold">
              {talla.label}:
            </Typography>
            <Input
              type="number"
              min="0"
              value={colorObj.tallas[talla.value] || 0}
              onChange={(e) =>
                handleTallaCantidadChange(
                  prodIndex,
                  colorIndex,
                  talla.value,
                  e.target.value
                )
              }
              containerProps={{
                className: "!min-w-0 !w-20 !shrink-0",
              }}
              className="p-1 text-center  rounded"
             
            />
          </div>
        ))}
      </div>
    </div>
  );
};



const OrdenProveedor = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { listadoProveedoresPedidos } = useProveedorContext();
  const { colores, tallas } = useProductoContext();
  const {
    articulos,
    usuario,
    modulo,
    proveedores,
    listadoArticulos,
  } = useUserContext();
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [listaProductos, setListaProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [codigoFactura, setCodigoFactura] = useState("");
  const [valorFactura, setValorFactura] = useState(null);
  const [proveedor, setProveedor] = useState({});
  const [pedidoPendiente, setPedidoPendiente] = useState(true); // Estado del pedido pendiente
  const [fechaPedido, setFechaPedido] = useState(""); // Estado de la fecha de pedido
  const [fechaEntrega, setFechaEntrega] = useState(""); // Estado de la fecha de entrega
  const [nota, setNota] = useState(""); // Estado de la nota
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
  useEffect(() => {
    if (proveedores) {
      const proveedorEncontrado = proveedores.find((p) => p.id === Number(id));
      setProveedor(proveedorEncontrado);
    }
  }, [proveedores, id]);

  const productosOptions = useMemo(
    () =>
      proveedor?.productos?.map((producto) => ({
        id: producto.id,
        label: ` ${producto.articulo.nombre} - ${
          producto.articulo.categoria?.nombre
        } - $${producto.articulo.precio.toFixed(2)}`,
        precio: producto.articulo.precio,
        articulo: producto.articulo,
      })),
    [proveedor]
  );

  const tallasOptions = useMemo(
    () =>
      tallas?.map((talla) => ({
        value: talla.id,
        label: talla.nombre,
      })),
    [tallas]
  );

  const handleProductoChange = (selectedOption) => {
    setSelectedProducto(selectedOption);
  };

  const handleColorSelectChange = useCallback((index, selectedColors) => {
    setListaProductos((prevLista) =>
      prevLista.map((producto, i) => {
        if (i === index) {
          const updatedColores = selectedColors.map((color) => {
            // Buscar si ya existe este color en el producto y conservar las tallas existentes
            const existingColor = producto.colores.find(
              (col) => col.color.value === color.value
            );
            return {
              color: color,
              tallas: existingColor ? existingColor.tallas : {}, // Preservar las tallas si el color ya existía
            };
          });
          return { ...producto, colores: updatedColores };
        }
        return producto;
      })
    );
  }, []);
  

  const handleTallaCantidadChange = useCallback(
    (prodIndex, colorIndex, tallaId, cantidad) => {
      setListaProductos((prevLista) =>
        prevLista.map((producto, i) => {
          if (i === prodIndex) {
            const updatedColores = producto.colores.map((color, j) => {
              if (j === colorIndex) {
                const updatedTallas = { ...color.tallas, [tallaId]: cantidad };
                return { ...color, tallas: updatedTallas };
              }
              return color;
            });
            return { ...producto, colores: updatedColores };
          }
          return producto;
        })
      );
    },
    []
  );

  const handleAgregarProducto = () => {
    if (selectedProducto) {
      const existeProducto = listaProductos.find(
        (producto) => producto.id === selectedProducto.id
      );
      if (existeProducto) {
        alertify.error("Ya existe un producto con ese código");
        return;
      }
      setListaProductos((prevLista) => [
        ...prevLista,
        {
          ...selectedProducto,
          cantidad: 0,
          colores: [],
        },
      ]);
      setSelectedProducto(null);
    }
  };

  const handleEliminarProducto = (index) => {
    setListaProductos((prevLista) => prevLista.filter((_, i) => i !== index));
  };

  const handleSaveFactura = (e) => {
    e.preventDefault();
     // Verificar si la fecha del pedido es mayor a la fecha actual
  const hoy = new Date();
  const fechaPedidoObj = new Date(fechaPedido);
  if (fechaPedido && fechaPedidoObj > hoy) {
    alertify.error("La fecha del pedido no puede ser mayor a la fecha actual.");
    return; // Detener el flujo si la fecha es inválida
  }

    if (listaProductos.length === 0) {
      alertify.error("Debe selecionar un producto del proveedor");
      return;
    }

    // Validar que cada producto tenga al menos una talla con cantidad mayor a 1
    const hasValidProducts = listaProductos.every((producto) =>
      producto.colores.some((colorObj) =>
        Object.values(colorObj.tallas).some(
          (cantidad) => parseInt(cantidad) > 0
        )
      )
    );

    if (!hasValidProducts) {
      alertify.error(
        "Cada producto debe tener al menos una talla con cantidad mayor a 1."
      );
      return; // No permite continuar si la validación falla
    }

    // Crear la estructura correcta para ProveedorPedidoArticulo
    const productosPedido = listaProductos.flatMap((producto) =>
      producto.colores.flatMap((colorObj) =>
        Object.entries(colorObj.tallas).map(([tallaId, cantidad]) => ({
          proveedorArticulo: { id: producto.id }, // referencia al artículo
          color: { id: colorObj.color.value }, // referencia al color
          talla: { id: parseInt(tallaId) }, // referencia a la talla
          cantidad: parseInt(cantidad), // la cantidad de la talla para ese color
        }))
      )
    );

    const pedido = {
      usuario,
      precioTotal: total,
      productos: productosPedido,
      proveedor,
      codigoFactura,
      pedidoPendiente,
      total: valorFactura,
      fechaPedido: pedidoPendiente ? fechaPedido : null, // Solo si el pedido está pendiente
      fechaEntrega: pedidoPendiente ? fechaEntrega : null, // Solo si el pedido está pendiente
      nota,
    };

    setLoading(true);
    apiSavePedidoProveedor(pedido)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          listadoProveedoresPedidos();
          alertify.success("Pedido enviado con éxito");
          navigate(-1);
        }else{
          alertify.error(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Loader loading={loading} />
      <div className="flex justify-between p-3">
        <Typography variant="h2" className="text-lg sm:text-2xl uppercase">
          PEDIDO PROVEEDOR
        </Typography>
        <Link to={"/" + modulo + "/proveedores"}>
        <IoMdArrowRoundBack className="text-2xl mr-3 text-red-900" />
        </Link>
      </div>
      <DatosProveedor proveedor={proveedor} />
      <form onSubmit={handleSaveFactura}>
        <div className="flex flex-col sm:flex-row items-center mb-4 space-y-4 p-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center w-full sm:w-1/2">
            <label className="mr-2 w-1/4 sm:w-auto">Producto</label>
            <SelectReact
              options={productosOptions}
              value={selectedProducto}
              onChange={handleProductoChange}
              placeholder="Buscar por código"
              className="w-full"
              noOptionsMessage={() => <Button type="button" onClick={handleOpen} color="green" size="sm" className="text-white">Registrar Articulo</Button>}
            />
          </div>
          <IconButton
            className="bg-green-900 hover:bg-green-700"
            onClick={handleAgregarProducto}
          >
            <PlusIcon className="h-5 w-5" />
          </IconButton>
        </div>

        <div className="border shadow-lg rounded-lg p-4 mt-4">
          {listaProductos?.map((producto, prodIndex) => (
            <div key={prodIndex} className="border-b mb-4 pb-4">
              <div className="grid grid-cols-4 items-center ">
                <div>
                  {producto?.articulo?.imagen && (
                    <img
                      src={producto?.articulo?.imagen}
                      alt="Imagen del artículo"
                      size="sm"
                      className="rounded-none w-16 h-16 object-cover"
                    />
                  )}
                </div>
                <div>{producto.articulo.nombre}</div>
                <div className="flex gap-4">
                  <SelectReact
                    isMulti
                    options={producto.articulo.colores?.map(
                      (articuloColor) => ({
                        value: articuloColor.color.id,
                        label: articuloColor.color.nombre,
                      })
                    )}
                    value={producto.colores.map((c) => c.color)}
                    onChange={(selectedColors) =>
                      handleColorSelectChange(prodIndex, selectedColors)
                    }
                    placeholder="Seleccionar colores"
                  />
                </div>
                <IconButton
                  variant="text"
                  color="red"
                  onClick={() => handleEliminarProducto(prodIndex)}
                >
                  <TrashIcon className="h-5 w-5" />
                </IconButton>
              </div>

              {producto.colores.map((colorObj, colorIndex) => (
                <TallasTable
                  key={colorIndex}
                  tallasOptions={tallasOptions}
                  prodIndex={prodIndex}
                  colorIndex={colorIndex}
                  colorObj={colorObj}
                  handleTallaCantidadChange={handleTallaCantidadChange}
                />
              ))}
            </div>
          ))}
        </div>
          <br />
        <strong>Informacíon del Pedido :</strong>
       

        {/* Mostrar campos si Pedido Pendiente es true */}
        <div className="grid sm:grid-cols-2 gap-6">
            <div className="mt-4">
              <label className="mr-2">Fecha de Pedido</label>
              <Input
                type="date"
                value={fechaPedido}
                onChange={(e) => setFechaPedido(e.target.value)}
                required={pedidoPendiente}
              />
            </div>
         
          </div>

        {/* Nota */}
        <div className="mt-4">
          <Textarea
            label="Nota (Opcional)"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </div>
        <div className="flex justify-end items-center mt-4">
          <Button className="bg-green-900 text-white" type="submit">
            GUARDAR PEDIDO
          </Button>
        </div>
      </form>
      <RegisterArticuloModal open={open} handleOpen={handleOpen} />
    </>
  );
};

export default OrdenProveedor;
