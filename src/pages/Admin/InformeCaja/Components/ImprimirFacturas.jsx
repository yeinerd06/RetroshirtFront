import React, { forwardRef, useState, useEffect } from 'react';
import './styles.css'; // Import the styles
import { useUserContext } from '@/context/UserContext';
import { Typography } from '@material-tailwind/react';
import { apiSaveInformeCaja } from '@/Api/Informe/InformeFactura';

const ImprimirFacturas = forwardRef(({ facturas, dateRange, setLoading, saveReporte }, ref) => {
    const formatCurrency = (value) => {
        return value.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
        });
    };

    const [total, setTotal] = useState(0);
    const [totalCompra, setTotalCompra] = useState(0);
    const { usuario, setInformesCaja } = useUserContext();
    const [generate, setGenerate] = useState(true);
    const [totalCalculated, setTotalCalculated] = useState(false);
    const [facturasVenta,setFacturasVenta]=useState([])
    const [facturasCompra,setFacturasCompra]=useState([])
    useEffect(() => {
       
        if (facturas.length > 0) { // Asegurar que hay facturas
            const filteredFacturasVenta = facturas.filter((factura) => factura.tipoFactura.id == 1 && factura.pagoEfectivo);
            const filteredFacturasCompra = facturas.filter((factura) => factura.tipoFactura.id == 2);
            console.log(filteredFacturasCompra)
            console.log(filteredFacturasVenta)
            setFacturasVenta(filteredFacturasVenta)
            setFacturasCompra(filteredFacturasCompra)
            const totalCalculadoCompra = filteredFacturasCompra?.reduce((acc, factura) => {
                return acc + (factura.precioTotal);
            }, 0);
            const totalCalculadoVenta = filteredFacturasVenta?.reduce((acc, factura) => {
                return acc + (factura.precioTotal - factura.devolucionTotal);
            }, 0);
            setTotal(totalCalculadoVenta);
            setTotalCompra(totalCalculadoCompra)
            setTotalCalculated(true);
        }
    }, [facturas]);

    useEffect(() => {
        if (totalCalculated && generate && saveReporte ) {
            handleGenerarInforme();
        }
    }, [totalCalculated, generate, ]);

    const handleGenerarInforme = () => {
        const newInforme = {
            usuario: {
                id: usuario.id,
            },
            numeroFacturas: facturas.length,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            total,
            totalCompra,
            iva: (total * 0.19).toFixed(2),
            precioBase: (total * 0.81).toFixed(2)
        };
        console.log(newInforme);
        setLoading(true);
        apiSaveInformeCaja(newInforme)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    setGenerate(false);
                    setInformesCaja((prevUsuarios) => [...prevUsuarios, data.data]);
                }
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div id="invoice" ref={ref}>
            <div className="header">
                <div className="factura-info">
                    <h2>Informe de facturas</h2>
                    <span className="fecha">{new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="titulo-principal">Wise Stock</h1>
            </div>
            <div>
                <Typography variant="p" color="blue-gray" className="mb-4 text-black">
                    <strong>Desde: {dateRange.startDate}</strong> -  <strong>{dateRange.endDate}</strong>
                </Typography>
            </div>
       
            <div>

                <div>
                    <Typography variant="p" color="blue-gray" className="mb-4 text-black">
                        <strong>Facturas Ventas : {facturasVenta?.length}</strong>
                    </Typography>
                    <div id="precios" className='text-black'>
                        <p><strong>Precio Base: $ </strong> {(total * 0.81).toFixed(2)}</p>
                        <p><strong>IVA: $ </strong> {(total * 0.19).toFixed(2)}</p>
                        <p><strong>Total: $ </strong> {total.toFixed(2)}</p>
                    </div>
                </div>
                <div>
                <Typography variant="p" color="blue-gray" className="mb-4 text-black">
                        <strong>Facturas Compra : {facturasCompra?.length}</strong>
                    </Typography>
                    <div id="precios" className='text-black'>
                        <p><strong>Precio Base: $ </strong> {(totalCompra * 0.81).toFixed(2)}</p>
                        <p><strong>IVA: $ </strong> {(totalCompra * 0.19).toFixed(2)}</p>
                        <p><strong>Total: $ </strong> {totalCompra.toFixed(2)}</p>
                    </div>
                    </div>
            </div>
            {/* <Typography variant="p" color="blue-gray" className="mb-4 text-black">
                        <strong>Facturas Ventas : {facturasVenta?.length}</strong>
                    </Typography>
            <table className="w-full min-w-[640px] table-auto">
                <thead>
                    <tr>
                        {["#", "Tipo Factura", "Vendedor", "Cliente ", "Total Inicial", "Total Devolucion", "Total Pago"].map((el) => (
                            <th
                                key={el}
                                className="border-b border-blue-gray-50 py-3 px-6 text-left"
                            >
                                <Typography
                                    variant="small"
                                    className="text-[11px] font-medium font-bold uppercase text-blue-gray-900"
                                >
                                    {el}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {facturasVenta?.map((factura) => (
                        <tr key={factura?.id}>
                            <td className="py-3 px-5">{factura.id}</td>
                            <td className="py-3 px-5">
                                <small>{factura.fechaRegistro.split("T")[0]}</small>
                                <p>{factura.tipoFactura.nombre}</p>
                            </td>
                            <td className="py-3 px-5">
                                <p>{factura.usuario.nombre}</p>
                            </td>
                            <td className="py-3 px-5">
                                {factura.cliente ? (
                                    <>
                                        <p>{factura?.cliente?.nombre}</p>
                                        <p>{factura?.cliente?.documento}</p>
                                    </>
                                ) : (
                                    <>
                                        <p>{factura?.proveedor?.nombre}</p>
                                        <p>{factura?.proveedor?.documento}</p>
                                    </>
                                )}
                            </td>
                            <td className="py-3 px-5">
                                {formatCurrency(factura.precioTotal)}
                            </td>
                            <td className="py-3 px-5">
                                {formatCurrency(factura.devolucionTotal)}
                            </td>
                            <td className="py-3 px-5">
                                {formatCurrency(factura.precioTotal - factura.devolucionTotal)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}

            <div className="footer">
                <p>Wise Stock | San José de Cúcuta, Colombia | Teléfono: +317 456 7890 | Email: contacto@wisestock.com</p>
            </div>
        </div>
    );
});

export default ImprimirFacturas;
