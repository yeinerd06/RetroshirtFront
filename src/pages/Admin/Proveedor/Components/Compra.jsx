import { SquaresPlusIcon, PlusIcon, DeviceTabletIcon, MinusIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    Button, Card, CardHeader, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, Typography, Input,
    Option,
    Select,
} from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SelectReact from "react-select";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Loader } from "@/Components/Loader";
import { apiSaveFactura } from "@/Api/Factura/Factura";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import RegisterArticuloModal from "../../Inventario/Components/RegisterArticuloModal";
const Compra = () => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false)
    const { articulos, setFacturas, usuario, modulo, proveedores,listadoArticulos } = useUserContext();
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [listaProductos, setListaProductos] = useState([]);
    const [total, setTotal] = useState(0);
    const [mensaje, setMensaje] = useState([]);
    const navigate = useNavigate()
    const [valorFactura, setValorFactura] = useState([])
    const [codigoFactura, setCodigoFactura] = useState([])
    const [proveedor, setProveedor] = useState([])
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
    useEffect(() => {
        if (proveedores) {
            const proveedor = proveedores.find(p => p.id === Number(id));
            console.log(proveedor)
            setProveedor(proveedor)
        }

    }, [proveedores, id])
    const handleProductoChange = (selectedOption) => {
        setSelectedProducto(selectedOption);
    };

    const handleCantidadChange = (e) => {
        const nuevaCantidad = Number(e.target.value);
        setCantidad(nuevaCantidad);
        // if (selectedProducto && nuevaCantidad > selectedProducto.articulo.stock) {
        //     setCantidad(selectedProducto.articulo.stock);
        // } else {
        //     setCantidad(nuevaCantidad);
        // }
    };

    const handleAgregarProducto = () => {
        if (selectedProducto && cantidad > 0) {
            setListaProductos((prevLista) => {
                const productoExistente = prevLista.find(
                    (p) => p.value === selectedProducto.value
                );
                if (productoExistente) {
                    const nuevaCantidad = productoExistente.cantidad + cantidad;
                    return prevLista.map((p) =>
                        p.value === selectedProducto.value
                            ? { ...p, cantidad: nuevaCantidad }
                            : p
                    );
                    // if (nuevaCantidad >= selectedProducto.articulo.stock) {
                    //     return prevLista.map((p) =>
                    //         p.value === selectedProducto.value
                    //             ? { ...p, cantidad: nuevaCantidad }
                    //             : p
                    //     );
                    // } else {
                    //     return prevLista;
                    // }
                } else {
                    return [...prevLista, { ...selectedProducto, cantidad }];
                }
            });
            setSelectedProducto(null);
            setCantidad(1);
            // if (cantidad <= selectedProducto.articulo.stock) {

            // }
        }
    };

    const handleEliminarProducto = (productoId) => {
        setListaProductos((prevLista) =>
            prevLista.filter((p) => p.value !== productoId)
        );
    };



    const handleIncrement = (productoId) => {
        setListaProductos((prevLista) =>
            prevLista.map((p) =>
                p.value === productoId
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
    
        setTotal(valorFactura);
    }, [valorFactura]);

    const productosOptions = articulos
        //.filter((producto) => producto.estado && producto.stock>0)
        .map((producto) => ({
            value: producto.id,
            label: `${producto.codigo}- ${producto.nombre} - $${producto.precio.toFixed(2)}`,
            precio: producto.precio,
            articulo: producto,
        }));

    const handleSaveFactura = (e) => {
        e.preventDefault();
        setMensaje("");
        const factura = {
            usuario,
            precioTotal: total,
            productos: listaProductos,
            proveedor: proveedor,
            codigoFactura:"F-"+codigoFactura,
            tipoFactura:{
                id:2,
                nombre:"COMPRA"
            }

        };

        const productosConCantidadCero = listaProductos.filter(
            (producto) => producto.cantidad === 0
        );
        if (codigoFactura.length <= 0) {
            setMensaje(
                "Ingrese el codigo de la factura de compra"
            );

            return;
        }
        if (total <= 0) {
            setMensaje(
                "Ingrese el total de la factura de compra"
            );

            return;
        }
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
                    navigate("/" + modulo + "/proveedores")


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




    const DatosProveedor = () => {
        return (
            <div className="p-1 bg-white shadow-md rounded-md">
                <Typography className=" text-2xl font-bold text-gray-900">
                    Datos Proveedor:
                </Typography>

                <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div>
                        <Typography className="font-medium text-gray-700">Nombre:</Typography>
                        <Typography className="text-lg text-gray-900">{proveedor?.nombre || 'N/A'}</Typography>
                    </div>
                    <div>
                        <Typography className="font-medium text-gray-700">Documento:</Typography>
                        <Typography className="text-lg text-gray-900">{proveedor?.documento || 'N/A'}</Typography>
                    </div>
                    <div>
                        <Typography className="font-medium text-gray-700">Email:</Typography>
                        <Typography className="text-lg text-gray-900">{proveedor?.email || 'N/A'}</Typography>
                    </div>
                    <div>
                        <Typography className="font-medium text-gray-700">Teléfono:</Typography>
                        <Typography className="text-lg text-gray-900">{proveedor?.telefono || 'N/A'}</Typography>
                    </div>
                </div>

            </div>
        );
    };


    return (
        <div className="mb-4 mt-6">
            {loading && <Loader />}
            <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm mb-6">
                <DialogHeader className="bg-gray-800 text-white flex items-center justify-between">
                    <Typography variant="h2" className="text-lg sm:text-2xl">
                        Registrar Factura de compra
                    </Typography>
                    <Link to={"/" + modulo + "/proveedores"}>
                        <Button variant="text" color="red" className="ml-auto">
                            <i className="fa fa-times-circle" aria-hidden="true"></i>
                        </Button>
                    </Link>
                </DialogHeader>
                <form onSubmit={handleSaveFactura}>
                    <DialogBody divider>
                        <CardBody>
                            <DatosProveedor />
                            <hr />
                            <br />
                            <div className="flex flex-col sm:flex-row items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center w-full sm:w-1/2">
                                    <label className="mr-2 w-1/4 sm:w-auto">Producto</label>
                                    <SelectReact
                                        options={productosOptions}
                                        value={selectedProducto}
                                        onChange={handleProductoChange}
                                        placeholder="Buscar por codigo"
                                        className="w-full"
                                        noOptionsMessage={() => <Button type="button" onClick={handleOpen} color="green" size="sm" className="text-white">Registrar Articulo</Button>}
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
                                            <th className="p-2">Imagen</th>
                                            <th className="p-2">Producto</th>
                                            <th className="p-2">Cantidad</th>
                                            <th className="p-2">Nueva Cantidad</th>
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
                                                </td>
                                                <td className="p-2">

                                                    {producto.articulo.codigo} - {producto.articulo.nombre}</td>
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
                                                    nuevo
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
                                    IVA: {formatCurrency(total * 0.19)}
                                </Typography>
                            </div>
                            <div className="flex w-2/1 justify-end items-center mt-4">
                           
                                <div>
                                    <label className="mr-2 w-1/3 sm:w-auto"> Código Factura</label>
                                    <Input
                                        type="number"
                                        value={codigoFactura}
                                        onChange={(e) => setCodigoFactura(e.target.value)}
                                        min="1"
                                        className="w-full"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="flex w-2/1 justify-end items-center mt-4">
                           
                                <div>
                                    <label className="mr-2 w-1/3 sm:w-auto"> Precio Factura</label>
                                    <Input
                                        type="number"
                                        value={valorFactura}
                                        onChange={(e) => setValorFactura(e.target.value)}
                                        min="1"
                                        className="w-full"
                                        required
                                    />
                                </div>
                            </div>



                        </CardBody>
                    </DialogBody>
                    <DialogFooter className="flex justify-end">
                        <Button variant="gradient" color="green" type="submit">
                            GUARDAR
                        </Button>
                    </DialogFooter>
                </form>
            </Card>
            <RegisterArticuloModal open={open} handleOpen={handleOpen} />
        </div>
    );
};

export default Compra;
