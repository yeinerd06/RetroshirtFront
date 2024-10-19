import { SquaresPlusIcon, PlusIcon, DeviceTabletIcon, MinusIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    Button, Card, CardHeader, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, Typography, Input,
} from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SelectReact from "react-select";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Loader } from "@/Components/Loader";
import { apiUpdateFactura } from "@/Api/Factura/Factura";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import RegisterArticuloModal from "../../Inventario/Components/RegisterArticuloModal";

const CompraUpdate = () => {
    const { id } = useParams();
    const { articulos, setFacturas, usuario, modulo, facturas,listadoArticulos } = useUserContext();
    const [state, setState] = useState({
        loading: false,
        selectedProducto: null,
        cantidad: 1,
        listaProductos: [],
        total: 0,
        mensaje: '',
        valorFactura: '',
        codigoFactura: '',
        factura: null,
        open: false
    });
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const handleOpen = useCallback(() => {
        setState(prevState => ({ ...prevState, open: !prevState.open }));
    }, [state.open]);

    useEffect(() => {
        if (facturas) {
            const facturaCurrent = facturas.find(p => p.id === Number(id));
            if (facturaCurrent) {
                setState(prevState => ({
                    ...prevState,
                    factura: facturaCurrent,
                    codigoFactura: facturaCurrent?.codigoFactura?.split("-")[1] || '',
                    valorFactura: facturaCurrent?.precioTotal || '',
                    listaProductos: facturaCurrent?.productos.map(producto => ({
                        value: producto.articulo.id,
                        label: `${producto.articulo.codigo}- ${producto.articulo.nombre} - $${producto.articulo.precio.toFixed(2)}`,
                        precio: producto.articulo.precio,
                        articulo: producto.articulo,
                        cantidad: producto.cantidad,
                    })) || []
                }));
            }
        }
    }, [facturas, id]);

    useEffect(() => {
        const nuevoTotal = state.listaProductos.reduce((acc, producto) => {
            return acc + producto.precio * producto.cantidad;
        }, 0);
        setTotal(nuevoTotal);
    }, [state.listaProductos]);

    const handleProductoChange = useCallback((selectedOption) => {
        setState(prevState => ({ ...prevState, selectedProducto: selectedOption }));
    }, []);

    const handleCantidadChange = useCallback((e) => {
        const nuevaCantidad = Number(e.target.value);
        setState(prevState => ({ ...prevState, cantidad: nuevaCantidad }));
    }, []);

    const handleAgregarProducto = useCallback(() => {
        const { selectedProducto, cantidad, listaProductos } = state;
        if (selectedProducto && cantidad > 0) {
            const productoExistente = listaProductos.find(p => p.value === selectedProducto.value);
            if (productoExistente) {
                const nuevaCantidad = productoExistente.cantidad + cantidad;
                setState(prevState => ({
                    ...prevState,
                    listaProductos: prevState.listaProductos.map(p =>
                        p.value === selectedProducto.value ? { ...p, cantidad: nuevaCantidad } : p
                    ),
                    selectedProducto: null,
                    cantidad: 1
                }));
            } else {
                setState(prevState => ({
                    ...prevState,
                    listaProductos: [...prevState.listaProductos, { ...selectedProducto, cantidad }],
                    selectedProducto: null,
                    cantidad: 1
                }));
            }
        }
    }, [state.selectedProducto, state.cantidad, state.listaProductos]);

    const handleEliminarProducto = useCallback((productoId) => {
        setState(prevState => ({
            ...prevState,
            listaProductos: prevState.listaProductos.filter(p => p.value !== productoId)
        }));
    }, []);

    const handleIncrement = useCallback((productoId) => {
        setState(prevState => ({
            ...prevState,
            listaProductos: prevState.listaProductos.map(p =>
                p.value === productoId ? { ...p, cantidad: p.cantidad + 1 } : p
            )
        }));
    }, []);

    const handleDecrement = useCallback((productoId) => {
        setState(prevState => ({
            ...prevState,
            listaProductos: prevState.listaProductos.map(p =>
                p.value === productoId && p.cantidad > 1 ? { ...p, cantidad: p.cantidad - 1 } : p
            )
        }));
    }, []);

    useEffect(() => {
        setState(prevState => ({ ...prevState, total: prevState.valorFactura }));
    }, [state.valorFactura]);

    const productosOptions = useMemo(() => articulos.map(producto => ({
        value: producto.id,
        label: `${producto.codigo}- ${producto.nombre} - $${producto.precio.toFixed(2)}`,
        precio: producto.precio,
        articulo: producto,
    })), [articulos]);

    const handleSaveFactura = useCallback((e) => {
        e.preventDefault();
        const { factura, listaProductos, total, codigoFactura } = state;
        const facturaNew = {
            id: factura.id,
            usuario,
            precioTotal: total,
            productos: listaProductos,
            codigoFactura: "F-" + codigoFactura,
        };

        const productosConCantidadCero = listaProductos.filter(
            (producto) => producto.cantidad === 0
        );
        if(listaProductos.length<=0){
            setState(prevState => ({ ...prevState, mensaje:  "Ingresa productos a la factura"}));
           
       

            return;
        }
        if (total <= 0) {
            setState(prevState => ({ ...prevState, mensaje:       "Ingrese el total de la factura de compra" }));
           

            return;
        }

        if (productosConCantidadCero.length > 0) {
            setState(prevState => ({ ...prevState, mensaje:  "La cantidad de algunos productos es 0. Por favor, verifica antes de continuar." }));
             
          

            return;
        }
       
           
            if (codigoFactura.length <= 0 && factura.tipoFactura.id==2) {
                setState(prevState => ({ ...prevState, mensaje: "Ingrese el codigo de la factura de compra" }));
             
    
                return;
            }
         
         
        
       

        setState(prevState => ({ ...prevState, loading: true }));
        console.log(facturaNew)
        apiUpdateFactura(facturaNew)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    listadoArticulos()
                    setFacturas(prevUsuarios => prevUsuarios.map(prevUsuario => prevUsuario.id === data?.data?.id ? data.data : prevUsuario));
                    alertify.success("Factura actualizada correctamente");
                    navigate("/" + modulo + "/proveedores");
                } else {
                    alertify.error("Error en el servidor");
                }
            })
            .catch(() => alertify.error("Error en el servidor"))
            .finally(() => setState(prevState => ({ ...prevState, loading: false })));
    }, [state, usuario, modulo, setFacturas, navigate]);

    const formatCurrency = useCallback((value) => {
        return value.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
        });
    }, []);

    const DatosProveedor = useCallback(() => (
        <div className="p-1 bg-white shadow-md rounded-md">
            {state.factura?.tipoFactura?.id === 1 ? (
                <div>
                    <Typography className=" text-2xl font-bold text-gray-900">Datos Cliente:</Typography>
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
                        <div>
                            <Typography className="font-medium text-gray-700">Nombre:</Typography>
                            <Typography className="text-lg text-gray-900">{state.factura?.cliente?.nombre || 'N/A'}</Typography>
                        </div>
                        <div>
                            <Typography className="font-medium text-gray-700">Documento:</Typography>
                            <Typography className="text-lg text-gray-900">{state.factura?.cliente?.documento || 'N/A'}</Typography>
                        </div>
                        <div>
                            <Typography className="font-medium text-gray-700">Teléfono:</Typography>
                            <Typography className="text-lg text-gray-900">{state.factura?.cliente?.telefono || 'N/A'}</Typography>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <Typography className=" text-2xl font-bold text-gray-900">Datos Proveedor:</Typography>
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
                        <div>
                            <Typography className="font-medium text-gray-700">Nombre:</Typography>
                            <Typography className="text-lg text-gray-900">{state.factura?.proveedor?.nombre || 'N/A'}</Typography>
                        </div>
                        <div>
                            <Typography className="font-medium text-gray-700">Documento:</Typography>
                            <Typography className="text-lg text-gray-900">{state.factura?.proveedor?.documento || 'N/A'}</Typography>
                        </div>
                        <div>
                            <Typography className="font-medium text-gray-700">Email:</Typography>
                            <Typography className="text-lg text-gray-900">{state.factura?.proveedor?.email || 'N/A'}</Typography>
                        </div>
                        <div>
                            <Typography className="font-medium text-gray-700">Teléfono:</Typography>
                            <Typography className="text-lg text-gray-900">{state.factura?.proveedor?.telefono || 'N/A'}</Typography>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ), [state.factura]);

    return (
        <div className="mb-4 mt-6">
            {state.loading && <Loader />}
            <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm mb-6">
                <DialogHeader className="bg-gray-800 text-white flex items-center justify-between">
                    <Typography variant="h2" className="text-lg sm:text-2xl">Actualizar Factura  # {state.factura?.id}</Typography>
                    <Link to={"/" + modulo + "/facturacion"}>
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
                                        value={state.selectedProducto}
                                        onChange={handleProductoChange}
                                        placeholder="Buscar por codigo"
                                        className="w-full"
                                        noOptionsMessage={() => (
                                            <Button type="button" onClick={handleOpen} color="green" size="sm" className="text-white">Registrar Articulo</Button>
                                        )}
                                    />
                                </div>
                                <div className="flex items-center w-full sm:w-1/3">
                                    <label className="mr-2 w-1/3 sm:w-auto">Cantidad</label>
                                    <Input
                                        type="number"
                                        value={state.cantidad}
                                        onChange={handleCantidadChange}
                                        min="1"
                                        className="w-full"
                                    />
                                </div>
                                <Button variant="gradient" color="black" onClick={handleAgregarProducto} className="w-full sm:w-auto">
                                    <PlusIcon className="h-5 w-5 ml-2" />
                                </Button>
                            </div>
                            <div className="mt-1 mb-1">
                                <p className="text-center h1 text-red-700">{state.mensaje}</p>
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
                                        {state.listaProductos.map((producto, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-2">{producto.articulo.stock}</td>
                                                <td className="p-2 flex">
                                                    {producto?.articulo?.imagen && (
                                                        <img src={producto?.articulo?.imagen} alt="Imagen del articulo" size="sm" className="rounded-none w-16 h-16 object-cover" />
                                                    )}
                                                </td>
                                                <td className="p-2">{producto.articulo.codigo} - {producto.articulo.nombre}</td>
                                                <td className="p-2">
                                                    <div className="flex items-center text-center">
                                                        <Button variant="text" color="blue" onClick={() => handleDecrement(producto.value)}>
                                                            <MinusIcon className="h-5 w-5" />
                                                        </Button>
                                                        <p style={{ width: '60px' }}>{producto.cantidad}</p>
                                                        <Button variant="text" color="blue" onClick={() => handleIncrement(producto.value)}>
                                                            <PlusCircleIcon className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td className="p-2">nuevo</td>
                                                <td className="p-2">
                                                    <Button variant="text" color="red" onClick={() => handleEliminarProducto(producto.value)}>
                                                        <TrashIcon className="h-5 w-5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr />


                            {state.factura?.tipoFactura?.id === 2 ? (
                                <>
                                    <div className="flex justify-end items-center mt-4">
                                        <Typography color="blue-gray">IVA: {formatCurrency(state.total * 0.19)}</Typography>
                                    </div>
                                    <div className="flex w-2/1 justify-end items-center mt-4">
                                        <div>
                                            <label className="mr-2 w-1/3 sm:w-auto">Código Factura</label>
                                            <Input type="text" value={state.codigoFactura} onChange={(e) => setState(prevState => ({ ...prevState, codigoFactura: e.target.value }))} min="1" className="w-full" required />
                                        </div>
                                    </div>
                                    <div className="flex w-2/1 justify-end items-center mt-4">
                                        <div>
                                            <label className="mr-2 w-1/3 sm:w-auto">Precio Factura</label>
                                            <Input type="number" value={state.valorFactura} onChange={(e) => setState(prevState => ({ ...prevState, valorFactura: e.target.value }))} min="1" className="w-full" required />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
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
                                </div>
                            )}


                        </CardBody>
                    </DialogBody>
                    <DialogFooter className="flex justify-end">
                        <Button variant="gradient" color="green" type="submit">ACTUALIZAR</Button>
                    </DialogFooter>
                </form>
            </Card>
            <RegisterArticuloModal open={state.open} handleOpen={handleOpen} />
        </div>
    );
};

export default CompraUpdate;
