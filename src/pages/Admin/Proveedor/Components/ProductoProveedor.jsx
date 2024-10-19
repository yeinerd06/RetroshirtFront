import { PlusIcon, TrashIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import {
    Button, DialogBody, IconButton, Typography
} from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SelectReact from "react-select";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Loader } from "@/Components/Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import DatosProveedor from "./DatosProveedor";
import RegisterArticuloModal from "../../Inventario/Components/RegisterArticuloModal";
import { apiSaveProveedorArticulo } from "@/Api/Proveedor/Proveedor";

const ProductoProveedor = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const { articulos, proveedores, setProveedores } = useUserContext();
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [proveedor, setProveedor] = useState(null);
    const [productosProveedor, setProductosProveedor] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const navigate = useNavigate();
    useEffect(() => {
        if (proveedores) {
            const proveedor = proveedores.find((p) => p.id === Number(id));
            if (proveedor) {
                console.log(proveedor)
                setProveedor(proveedor);
                setProductosProveedor(proveedor.productos || []);
            }
        }
    }, [proveedores, id]);

    const handleProductoChange = (selectedOption) => {
        setSelectedProducto(selectedOption);
    };

    const handleAgregarProducto = () => {
        if (!selectedProducto) {
            setMensaje("Debes seleccionar un producto.");
            return;
        }

       
        setLoading(true)
        const proveedorArticulo={
            proveedor:proveedor.id,
            articulo:{
                id:selectedProducto.value,
            }

        }
        apiSaveProveedorArticulo(proveedorArticulo)
        .then(res => res.json())
        .then(data => {
            if(data.success){
            
        //setProductosProveedor((prev) => [...prev, data.data]);
        setSelectedProducto(null);  // Limpiar selección
        setMensaje("");

        const updatedProveedor = {
            ...proveedor,
            productos: [...productosProveedor, data.data],
        };
        console.log(updatedProveedor)
        setProveedores((prev) =>
            prev.map((p) => (p.id === proveedor.id ? updatedProveedor : p))
        );

        alertify.success("Producto agregado al proveedor");
            }else{
                setMensaje(data.mensaje)
            }

        })
        .catch((e) => {
            console.log(e);
        })
        .finally(() => {
            setLoading(false);
        });

    };

    const handleEliminarProducto = (productoId) => {
        const updatedProductos = productosProveedor.filter((p) => p.id !== productoId);
        setProductosProveedor(updatedProductos);

        const updatedProveedor = {
            ...proveedor,
            productos: updatedProductos,
        };

        setProveedores((prev) =>
            prev.map((p) => (p.id === proveedor.id ? updatedProveedor : p))
        );
    };

    const productosOptions = articulos.map((producto) => ({
        value: producto.id,
        label: ` ${producto.nombre} - ${producto.categoria?.nombre} - $${producto.precio.toFixed(2)}`,
        precio: producto.precio,
        articulo: producto,
    }));

    const formatCurrency = (value) => {
        return value?.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
        });
    };


    return (
        <div >
            <Loader loading={loading} />
            <div>
                <div className="flex justify-between">
                    <Typography variant="h2" className="text-lg sm:text-2xl uppercase ">
                        Productos Proveedor
                    </Typography>
                    <Link  onClick={() => navigate(-1)}>
                        <i className="fa fa-times-circle text-xl mr-3 text-red-900" aria-hidden="true"></i>
                    </Link>
                </div>
                <DatosProveedor proveedor={proveedor} />
                <DialogBody>
                    <div>
                        <div className="flex flex-col sm:flex-row items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="flex items-center w-full sm:w-1/2">
                                <label className="mr-2 w-1/4 sm:w-auto">Producto</label>
                                <SelectReact
                                    options={productosOptions}
                                    value={selectedProducto}
                                    onChange={handleProductoChange}
                                    placeholder="Buscar producto"
                                    className="w-full"
                                    
                                />
                            </div>
                                    <IconButton  className="bg-green-900 hover:bg-green-700"  onClick={handleAgregarProducto}>
                                    <PlusIcon className="h-5 w-5  text-white" />
                                    </IconButton>
                           
                        </div>

                        {mensaje && (
                            <div className="mt-1 mb-1">
                                <p className="text-center text-red-600">{mensaje}</p>
                            </div>
                        )}

                        <div className="mt-6">
                            <table className="w-full min-w-[640px] table-auto border-collapse">
                                <thead className="bg-blue-900 text-white">
                                    <tr>
                                        {["Imagen", "Nombre", "Categoría", "Min", "Stock", "Precio", "Disponible"].map((el) => (
                                            <th
                                                key={el}
                                                className="border-b border-blue-gray-50 py-3 px-6 text-left"
                                            >
                                                <Typography
                                                    variant="small"
                                                    className="text-[11px] font-medium font-bold uppercase"
                                                >
                                                    {el}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosProveedor.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="py-4 text-center text-gray-500">
                                                No hay productos agregados.
                                            </td>
                                        </tr>
                                    ) : (
                                        productosProveedor.map((producto) => (
                                            <tr key={producto.id}>
                                                <td className="py-3 px-5">
                                                    <div className="flex items-center">
                                                        {producto.articulo.imagen ? (
                                                            <img
                                                                src={producto.articulo.imagen}
                                                                alt={producto.articulo.nombre}
                                                                className="rounded-none w-16 h-16 object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400">Sin imagen</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-5">
                                                    <Typography className="text-xs font-medium text-blue-gray-900">
                                                   {producto.articulo.nombre}
                                                    </Typography>
                                                </td>
                                                <td className="py-3 px-5">
                                                    <Typography className="text-xs font-medium text-blue-gray-900">
                                                        {producto.articulo.categoria ? producto.articulo.categoria.nombre : "Sin categoría"}
                                                    </Typography>
                                                </td>
                                                <td className="py-3 px-5">
                                                    <Typography className="text-xs font-medium text-blue-gray-900">
                                                        {producto.articulo.cantidadMinima}
                                                    </Typography>
                                                </td>
                                                <td className="py-3 px-5">
                                                    <Typography className="text-xs font-medium text-blue-gray-900">
                                                        {producto.articulo.stock}
                                                    </Typography>
                                                </td>
                                                <td className="py-3 px-5">
                                                    <Typography className="text-xs font-medium text-blue-gray-900">
                                                        {formatCurrency(producto.articulo.precio)}
                                                    </Typography>
                                                </td>
                                                <td className="py-3 px-5">
                                                    <Typography className="text-xs font-medium text-blue-gray-900">
                                                        {producto.articulo.estado ? "Sí" : "No"}
                                                    </Typography>
                                                </td>
                                               
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </DialogBody>
            </div>
        </div>
    );
};

export default ProductoProveedor;
