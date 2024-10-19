import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import ImprimirFacturas from "./ImprimirFacturas";
import ReactToPrint from "react-to-print";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { Loader } from "@/Components/Loader";

const ModalGenerarInforme = ({ open, handleClose, filteredFacturas,  }) => {
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
    const [facturasInforme, setFacturasInforme] = useState([]);
    const [loading, setLoading] = useState(false);
    const [verInforme, setVerInforme] = useState(false)
    const componentRef = useRef();
    const { usuario } = useUserContext()
    useEffect(() => {
        if (!open) {
            setDateRange({ startDate: "", endDate: "" });
            setVerInforme(false)
         
            
        }
    }, [open]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({ ...prev, [name]: value }));
    };
    const handleGenerarInforme = () => {
   
        if (dateRange.startDate != "" && dateRange.endDate != "" )
            setVerInforme(true)
      


    }

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const startDate = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
            const endDate = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

            
            const facturasFiltradas = filteredFacturas.filter((factura) => {
                const facturaDate = new Date(factura.fechaRegistro.split("T")[0]).getTime(); // Sumar 5 horas

                return (
                    facturaDate >= startDate &&
                    facturaDate <= endDate
                );
            });
        
         setFacturasInforme(facturasFiltradas);
        } else {
            setFacturasInforme([]);
        }
    }, [dateRange, filteredFacturas,]);

    return (
        <Dialog open={open} handler={handleClose} size="lg" dismiss={{ enabled: false }}>
            {loading && <Loader />}
            <DialogHeader>Generar Informe</DialogHeader>
            <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {verInforme ? (
                    
                    <ImprimirFacturas  ref={componentRef} saveReporte={true} facturas={facturasInforme} setLoading={setLoading}
                        dateRange={dateRange} />
                ) : (
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                            <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={dateRange.startDate}
                                onChange={handleDateChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
                            <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                value={dateRange.endDate}
                                onChange={handleDateChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                    </div>
                )}
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleClose} className="mr-2">
                    Cancelar
                </Button>
                {verInforme ? (
                    <ReactToPrint
                        trigger={() => <Button variant="gradient" color="green">Imprimir Informe</Button>}
                        content={() => componentRef.current}
                    />

                ) : (
                    <Button variant="text" color="green" onClick={handleGenerarInforme} className="mr-2">
                        Generar Informe
                    </Button>
                )}
            </DialogFooter>
        </Dialog>
    );
};

export default ModalGenerarInforme;
