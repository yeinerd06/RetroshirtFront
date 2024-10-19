import React, { forwardRef } from 'react';
import './styles.css'; // Import the styles

const ImprimirFactura = forwardRef(({ factura }, ref) => {
    return (
        <div id="invoice" ref={ref}>
            <div className="header">
                <div className="factura-info">
                    <h2>Factura de {factura?.tipoFactura?.nombre}</h2>
                    <span className="fecha">{new Date(factura?.fechaRegistro).toLocaleDateString()}</span>
                </div>
                <h1 className="titulo-principal">Wise Stock</h1>
            </div>
            
            {factura?.cliente ? (
                <div className="cliente-info">
                <div>
                    <p><strong>Cliente:</strong> {factura?.cliente?.nombre}</p>
                    <p><strong>Documento:</strong> {factura?.cliente?.documento}</p>
                </div>
                <div>
                    <p><strong>Teléfono:</strong> {factura?.cliente?.telefono}</p>
                </div>
            </div>
            ):(
                <div className="cliente-info">
                <div>
                    <p><strong>Proveedor:</strong> {factura?.proveedor?.nombre}</p>
                    <p><strong>Documento:</strong> {factura?.proveedor?.documento}</p>
                </div>
                <div>
                    <p><strong>Teléfono:</strong> {factura?.proveedor?.telefono}</p>
                </div>
            </div>
            )}
            
            <h3>Productos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Marca</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {factura?.productos?.map((producto, index) => (
                        <tr key={index}>
                            <td>
                                <img 
                                    src={producto?.articulo.imagen} 
                                    alt={producto?.articulo.nombre} 
                                    className="product-image" 
                                />
                            </td>
                            <td>{producto?.articulo.nombre}</td>
                            <td>{producto?.articulo.marca}</td>
                            <td>{producto?.precio.toFixed(2)}</td>
                            <td>{producto?.cantidad}</td>
                            <td>{(producto?.precio * producto?.cantidad).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div id="precios">
                <p><strong>Precio Base: $ </strong> {factura?.precioBase.toFixed(2)}</p>
                <p><strong>IVA: $ </strong> {factura?.iva.toFixed(2)}</p>
                <p><strong>Total: $ </strong> {factura?.precioTotal.toFixed(2)}</p>
            </div>
            <div className="agradecimiento">
                <p>¡Gracias por su compra!</p>
            </div>
            <div className="footer">
                <p>Wise Stock | San José de Cúcuta, Colombia | Teléfono: +317 456 7890 | Email: contacto@wisestock.com</p>
            </div>
        </div>
    );
});

export default ImprimirFactura;
