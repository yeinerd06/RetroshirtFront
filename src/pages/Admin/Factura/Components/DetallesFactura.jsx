import React, { useEffect, useState } from 'react';
import './styles.css'; // Import the styles
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';
import { Button, Card, CardBody, CardHeader, Input } from '@material-tailwind/react';
import { Loader } from '@/Components/Loader';
import { BackspaceIcon } from '@heroicons/react/24/solid';
import { apiSaveDevolucionFactura } from '@/Api/Factura/Factura';

const DetallesFactura = () => {
    const { id } = useParams();
    const { facturas, modulo, usuario, setFacturas, listadoArticulos,listadoFacturas } = useUserContext();
    const factura = facturas.find(f => f.id === Number(id));
    const [loading, setLoading] = useState(false);
    const [devoluciones, setDevoluciones] = useState(factura?.productos.map(() => ({ devolver: false, cantidad: 0 })) || []);
    const [mensaje, setMensaje] = useState([]);
    const navigate=useNavigate()
    useEffect(() => {
        if (factura) {
            console.log(factura)
            setNuevoTotal(factura?.precioTotal)
            setDevoluciones(factura.productos.map(() => ({ devolver: false, cantidad: null })));
        }
    }, [factura]);

    if (!factura) {
        return <p className="text-center text-red-500">Factura no registrada</p>;
    }

    const handleCheckboxChange = (index) => {
        const newDevoluciones = [...devoluciones];
        newDevoluciones[index].devolver = !newDevoluciones[index]?.devolver;
        setDevoluciones(newDevoluciones);
    };

    const handleCantidadChange = (index, cantidad) => {
        const newDevoluciones = [...devoluciones];
        newDevoluciones[index].cantidad = Number(cantidad);
        setDevoluciones(newDevoluciones);
    };

    const [motivo,setMotivo]=useState("")
    const [nuevoTotal,setNuevoTotal]=useState([])
    const handleDevolucion = (e) => {
        e.preventDefault();

        setMensaje("")
        const productosConDevolucion = factura.productos
            .map((producto, index) => ({
                usuario: usuario.id,
                facturaProducto: producto,
                cantidadDevolucion: devoluciones[index].cantidad,
                precio: producto.precio,
                devolver: devoluciones[index].devolver,
                motivo
            }))
            .filter(item => item.devolver && item.cantidadDevolucion > 0 && item.cantidadDevolucion <= item.facturaProducto.cantidad);

        if(productosConDevolucion.length<=0){
            setMensaje("No hay ningun producto seleccionado")
            return
        }
        console.log(productosConDevolucion);
        setLoading(true)
        apiSaveDevolucionFactura(factura.id, productosConDevolucion,nuevoTotal)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    //agregar la factura nueva
                    //buscar laa lista de productos
                    navigate("/"+modulo+"/facturacion")
                    listadoFacturas()
                    listadoArticulos();
                }
            }).catch(e => {
                console.log(e)
            })
            .finally(f => {
                setLoading(false)
            })
    };
    return (
        <div className="mb-4 mt-6">
            {loading && <Loader />}
            <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm mb-6">
                <CardHeader
                    floated={false}
                    shadow={false}
                    color="transparent"
                    className="m-0 flex flex-col sm:flex-col lg:flex-row items-center justify-between p-6"
                >
                    <h1 className="text-2xl font-bold">Factura de {factura.tipoFactura.nombre}</h1>
                    <Link to={`/${modulo}/facturacion`}>
                        <Button
                            className="flex ml-0 lg:ml-auto mt-4 sm:mt-0"
                            variant="text"
                            size="sm"
                            color="success"
                        >
                            <BackspaceIcon className="h-5 w-5 mr-2" />
                            Volver
                        </Button>
                    </Link>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-0">
                    <div id="invoice-details" className="p-5">
                        <div className="header text-center mb-6">

                            <div className="factura-info flex justify-between items-center ">
                                <h2 className="text-2xl"># {factura.id}</h2>
                                <span className="fecha text-lg">{new Date(factura.fechaRegistro).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {factura.cliente ? (
                            <div className="cliente-info grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p><strong>Cliente:</strong> {factura?.cliente?.nombre}</p>
                                    <p><strong>Documento:</strong> {factura?.cliente?.documento}</p>
                                </div>
                                <div>
                                    <p><strong>Teléfono:</strong> {factura?.cliente?.telefono}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="cliente-info grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p><strong>Proveedor:</strong> {factura?.proveedor?.nombre}</p>
                                    <p><strong>Documento:</strong> {factura?.proveedor?.documento}</p>
                                </div>
                                <div>
                                    <p><strong>Teléfono:</strong> {factura?.proveedor?.telefono}</p>
                                </div>
                            </div>
                        )}

                        <h3 className="text-xl mb-4">Productos</h3>
                        <form onSubmit={handleDevolucion}>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b p-2 text-left">Imagen</th>
                                        <th className="border-b p-2 text-left">Nombre</th>
                                        <th className="border-b p-2 text-left">Marca</th>
                                        <th className="border-b p-2 text-left">Precio de venta</th>
                                        <th className="border-b p-2 text-left">Cantidad</th>
                                        <th className="border-b p-2 text-left">Total de venta</th>
                                        <th className="border-b p-2 text-left">Devoluciones</th>
                                        <th className="border-b p-2 text-left">Devolución</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {factura?.productos?.map((producto, index) => {
                                        const devolucionesPrevias = producto.devoluciones?.reduce((sum, devolucion) => sum + devolucion.cantidadDevolucion, 0) || 0;
                                        const cantidadRestante = producto.cantidad - devolucionesPrevias;

                                        return (
                                            <tr key={index}>
                                                <td className="border-b p-2">
                                                    <img
                                                        src={producto.articulo.imagen}
                                                        alt={producto.articulo.nombre}
                                                        className="product-image w-16 h-16 object-cover"
                                                    />
                                                </td>
                                                <td className="border-b p-2">{producto.articulo.nombre}</td>
                                                <td className="border-b p-2">{producto.articulo.marca}</td>
                                                <td className="border-b p-2">{producto.precio.toFixed(2)}</td>
                                                <td className="border-b p-2">{producto.cantidad}</td>
                                                <td className="border-b p-2">{(producto.precio * producto.cantidad).toFixed(2)}</td>
                                                <td className="border-b p-2">
                                                    {producto?.devoluciones?.length > 0 && (
                                                        <ul>
                                                            {producto.devoluciones.map((devolucion, index) => (
                                                                <li key={index}><small className='bg-default'>items: {devolucion.cantidadDevolucion} - {factura.tipoFactura.id === 1 ? devolucion.precio: null}  </small>
                                                                <p className='text-xs'>{devolucion.motivo} </p> </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </td>
                                                <td className="border-b p-2">
                                                    {cantidadRestante > 0 && (
                                                        <>
                                                            <input
                                                                type="checkbox"
                                                                checked={devoluciones[index]?.devolver}
                                                                onChange={() => handleCheckboxChange(index)}
                                                            />
                                                            {devoluciones[index]?.devolver && (
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max={cantidadRestante}
                                                                    value={devoluciones[index].cantidad}
                                                                    onChange={(e) => handleCantidadChange(index, e.target.value)}
                                                                    className="ml-2 p-1 border border-3 border-black rounded"
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div id="precios" className="mt-6 text-right">
                                {factura.tipoFactura.id === 2 ? (
                                          <p><strong>Total: $ </strong> {factura?.precioTotal?.toFixed(2)}</p>
                                ):(
                                   <>
                                    <p><strong>Precio Base: $ </strong> {factura?.precioBase?.toFixed(2)}</p>
                                    <p><strong>IVA: $ </strong> {factura.iva.toFixed(2)}</p>
                                    {factura.devolucion  ? (
                                        <>
                                            <p><strong>Devoluciones: $ </strong>- {factura.devolucionTotal.toFixed(2)}</p>
                                            <p><strong>Total: $ </strong> {(factura.precioTotal - factura.devolucionTotal).toFixed(2)}</p>
                                        </>
    
                                    ) : (
                                        <p><strong>Total: $ </strong> {factura.precioTotal.toFixed(2)}</p>
                                    )}
                                   </>
                                )}
                              


                            </div>
                            <div>
                                <div className="w-full p-3">
                                    <Input type="textarea" onChange={(e)=>setMotivo(e.target.value)} required color="black" label="Motivo devolución" />
                                </div>
                            </div>
                            {factura.tipoFactura.id==2 &&(
                                <div>
                                <div className="w-full p-3">
                                    <Input type="number" value={nuevoTotal} onChange={(e)=>setNuevoTotal(e.target.value)} required={factura.tipoFactura.id==2 ?true:false} color="black" label="Nuevo Total factura" />
                                </div>
                            </div>
                            )}


                             <p className="text-center text-red-700">{mensaje}</p>

                             {factura.tipoFactura.id==2 ?(
                                <>
                                 <div className="text-right mt-4">
                                    <Button type='submit' color="red" size="sm">
                                        Hacer Devolución
                                    </Button>
                                </div>
                                </>

                             ):(
                                <>
                                 {(factura.precioTotal - factura.devolucionTotal) > 0 && (
                                <div className="text-right mt-4">
                                    <Button type='submit' color="red" size="sm">
                                        Hacer Devolución
                                    </Button>
                                </div>
                            )}</>

                             )}
                           

                        </form>

                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default DetallesFactura;