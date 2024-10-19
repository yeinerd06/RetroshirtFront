import { SquaresPlusIcon, PlusIcon, DeviceTabletIcon, MinusIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    Button, Card, CardHeader, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, Typography, Input,
    Option,
    Select,
    ListItem,
    List,
    ListItemPrefix,
    Checkbox,
    Radio,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import SelectReact from "react-select";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Loader } from "@/Components/Loader";
import { apiSaveFactura } from "@/Api/Factura/Factura";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
const Venta = () => {
    const [loading, setLoading] = useState(false)
    const { articulos, setFacturas, usuario, modulo, listadoArticulos } = useUserContext();
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [listaProductos, setListaProductos] = useState([]);
    const [total, setTotal] = useState(0);
    const [mensaje, setMensaje] = useState([]);
    const navigate = useNavigate()
    const handleProductoChange = (selectedOption) => {
        setSelectedProducto(selectedOption);
    };

    const handleCantidadChange = (e) => {
        const nuevaCantidad = Number(e.target.value);
        if (selectedProducto && nuevaCantidad > selectedProducto.articulo.stock) {
            setCantidad(selectedProducto.articulo.stock);
        } else {
            setCantidad(nuevaCantidad);
        }
    };

    const handleAgregarProducto = () => {
        if (selectedProducto && cantidad > 0) {
            if (cantidad <= selectedProducto.articulo.stock) {
                setListaProductos((prevLista) => {
                    const productoExistente = prevLista.find(
                        (p) => p.value === selectedProducto.value
                    );
                    if (productoExistente) {
                        const nuevaCantidad = productoExistente.cantidad + cantidad;
                        if (nuevaCantidad <= selectedProducto.articulo.stock) {
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

    const handleIncrement = (productoId) => {
        setListaProductos((prevLista) =>
            prevLista.map((p) =>
                p.value === productoId && p.cantidad < p.articulo.stock
                    ? { ...p, cantidad: p.cantidad + 1 }
                    : p
            )
        );
    };

    const handleDecrement = (productoId) => {
        setListaProductos((prevLista) =>
            prevLista.map((p) =>
                p.value === productoId && p.cantidad > 1
                    ? { ...p, cantidad: p.cantidad - 1 }
                    : p
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
        .filter((producto) => producto.estado && producto.stock > 0)
        .map((producto) => ({
            value: producto.id,
            label: `${producto.codigo} - ${producto.nombre} - $${producto.precio.toFixed(2)}`,
            precio: producto.precio,
            articulo: producto,
        }));

    const [pagoEfectivo, setPagoEfectivo] = useState(false)
    const [fechaPago, setFechaPago] = useState(null)
    const handleSaveFactura = (e) => {
        e.preventDefault();
        setMensaje("");
        const factura = {
            usuario,
            precioTotal: total,
            productos: listaProductos,
            cliente,
            tipoFactura: {
                id: 1,
                nombre: "VENTA"
            },
            pagoEfectivo,
            fechaPago
        };

        if(listaProductos.length<=0){
           
            setMensaje( "Ingresa productos a la factura" );

            return;
        }
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
                    setFacturas((prevUsuarios) => [...prevUsuarios, data.data]);
                    alertify.success("Factura creada correctamente")
                    listadoArticulos()
                    navigate("/" + modulo + "/facturacion")


                } else {
                    alertify.error("Error en el servidor")
                }
            })
            .catch((e) => {
                console.log(e);
                alertify.error("Error en el servidor")
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

    const [cliente, setCliente] = useState();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({
            ...cliente,
            [name]: value
        });
    };


    return (
        <div className="mb-4 mt-6">
            {loading && <Loader />}
            <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm mb-6">
                <DialogHeader className="bg-gray-800 text-white flex items-center justify-between">
                    <Typography variant="h2" className="text-lg sm:text-2xl">
                        Registrar Factura de venta
                    </Typography>
                    <Link to={"/" + modulo + "/facturacion"}>
                        <Button variant="text" color="red" className="ml-auto">
                            <i className="fa fa-times-circle" aria-hidden="true"></i>
                        </Button>
                    </Link>
                </DialogHeader>
                <form onSubmit={handleSaveFactura}>
                    <DialogBody divider>
                        <CardBody>

                            <div className="flex flex-col sm:flex-row items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center w-full sm:w-1/2">
                                    <label className="mr-2 w-1/4 sm:w-auto">Producto</label>
                                    <SelectReact
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
                                    color="black"
                                    onClick={handleAgregarProducto}
                                    className="w-full sm:w-auto"
                                >
                                    <PlusIcon className="h-5 w-5 ml-2" />
                                </Button>
                            </div>
                            <div className="mt-1 mb-1">
                                <p className="text-center text-red">{mensaje}</p>
                            </div>


                            <div className="overflow-auto">
                                <table className="w-full mt-4">
                                    <thead className="bg-gray-800 text-white">
                                        <tr>
                                            <th className="p-2">Stock</th>
                                            <th className="p-2">Producto</th>
                                            <th className="p-2">Precio</th>
                                            <th className="p-2">Cantidad</th>
                                            <th className="p-2">Total</th>
                                            <th className="p-2">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaProductos?.map((producto, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-2">{producto.articulo.stock}</td>
                                                <td className="p-2 flex">
                                                    {producto?.articulo?.imagen && (
                                                        <img
                                                            src={producto?.articulo?.imagen}
                                                            alt={"Imagen del articulo"}
                                                            size="sm"
                                                            className="rounded-none w-16 h-16 object-cover"
                                                        />
                                                    )}
                                                    {producto.articulo.nombre}</td>
                                                <td className="p-2">{formatCurrency(producto.articulo.precio)}</td>
                                                <td className="p-2">
                                                    <div className="flex items-center text-center" >
                                                        <Button
                                                            variant="text"
                                                            color="blue"
                                                            onClick={() => handleDecrement(producto.value)}
                                                        >
                                                            <MinusIcon className="h-5 w-5" />
                                                        </Button>
                                                        <p style={{ width: '60px', }}>{producto.cantidad}</p>
                                                        {/* <Input
                                                            className=""
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
                                                                disabled
                                                            /> */}
                                                        <Button
                                                            variant="text"
                                                            color="blue"
                                                            onClick={() => handleIncrement(producto.value)}
                                                        >
                                                            <PlusCircleIcon className="h-5 w-5" />
                                                        </Button>
                                                    </div>
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
                                                        <TrashIcon className="h-5 w-5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr />

                            <div className="flex justify-end items-center mt-4">
                                <Typography color="blue-gray">
                                    Precio base: {formatCurrency(total * 0.81)}
                                </Typography>
                            </div>
                            <div className="flex justify-end items-center mt-4">
                                <Typography color="blue-gray">
                                    IVA: {formatCurrency(total * 0.19)}
                                </Typography>
                            </div>
                            <div className="flex justify-end items-center mt-4">
                                <Typography color="blue-gray">
                                    Precio Total: {formatCurrency(total)}
                                </Typography>
                            </div>

                            <Typography className=" mb-3 text-xl font-bold text-gray-900">
                                Datos Cliente:
                            </Typography>

                            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div >
                                    <Select
                                        label="Tipo de Documento"
                                        name="TipoDocumento"
                                        value={cliente?.tipoDocumento}
                                        onChange={(value) =>
                                            setCliente({ ...cliente, tipoDocumento: value })
                                        }
                                        required
                                        className="w-full"
                                    >
                                        <Option value="CC" >Cédula de Ciudadanía</Option>
                                        <Option value="TI">Tarjeta de Identidad</Option>
                                        <Option value="CE">Cédula de Extranjería</Option>
                                        <Option value="PAS">Pasaporte</Option>
                                    </Select>
                                </div>
                                <div>
                                   
                                    <div className="relative flex w-full ">
                                        <Input
                                            type="number"
                                            label="Documento"
                                            name="documento"
                                            value={cliente?.documento}
                                            onChange={handleChange}
                                            className="w-full"
                                            required
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        type="text"
                                        name="nombre"
                                        label="Nombre"
                                        value={cliente?.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="number"
                                        name="telefono"
                                        label="Teléfono"
                                        value={cliente?.telefono}
                                        onChange={handleChange}
                                        required
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <Typography className=" mb-3 text-xl font-bold text-gray-900">
                                Metodo de pago:
                            </Typography>
                            <div className="flex gap-10">
                                <Radio name="type" value={pagoEfectivo} onChange={(e) => setPagoEfectivo(true)} label="Efectivo" />
                                <Radio name="type" value={pagoEfectivo}  onChange={(e) => setPagoEfectivo(false)} label="Pedido" defaultChecked />
                            </div>
                           
                            {!pagoEfectivo && (
                                    <div>
                                    <Input
                                        type="date"
                                        name="Fecha Pedido"
                                        label="fechaPago"
                                        value={fechaPago}
                                        onChange={(e) => setFechaPago(e.target.value)}
                                        required={!pagoEfectivo ?true:false}
                                        className="w-full"
                                    />
                                </div>
             
                                )}

                        </CardBody>
                    </DialogBody>
                    <p className="text-center text-red-700">{mensaje}</p>
                    <DialogFooter className="flex justify-end">
                        
                        <Button variant="gradient" color="green" type="submit">
                            GUARDAR
                        </Button>
                    </DialogFooter>
                </form>
            </Card>
        </div>
    );
};

export default Venta;
