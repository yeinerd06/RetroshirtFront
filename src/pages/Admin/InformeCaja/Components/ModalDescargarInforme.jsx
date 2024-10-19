import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import ImprimirFacturas from "./ImprimirFacturas";
import ReactToPrint from "react-to-print";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { Loader } from "@/Components/Loader";

const ModalDescargarInforme = ({ open, handleClose, filteredFacturas, informe,setInforme }) => {
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: ""});
    const [facturasInforme, setFacturasInforme] = useState([]);
    const [loading, setLoading] = useState(false);
    const [verInforme, setVerInforme] = useState(false)
    const componentRef = useRef();
    const { usuario } = useUserContext()
    useEffect(() => {
        if (!open) {
            setDateRange({ startDate: "", endDate: "" });
            setVerInforme(false)
         
            setInforme([])
            
        }
    }, [open]);

    useEffect(()=>{
        if(informe){
            setDateRange({ startDate: informe?.startDate, endDate: informe?.endDate})
        }
    },[informe])
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({ ...prev, [name]: value }));
    };
  
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const startDate = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
            const endDate = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

            const facturasFiltradas = filteredFacturas.filter((factura) => {
                const facturaDate = new Date(factura.fechaRegistro.split("T")[0]).getTime(); // Sumar 5 horas

                return (
                    // factura.pagoEfectivo &&
                    // factura.tipoFactura.id === 1 &&
                    facturaDate >= startDate &&
                    facturaDate <= endDate
                );
            });
            console.log(facturasFiltradas)
            setFacturasInforme(facturasFiltradas);
        } else {
            setFacturasInforme([]);
        }
    }, [dateRange, filteredFacturas,]);

    return (
        <Dialog open={open} handler={handleClose} size="lg" dismiss={{ enabled: false }}>
            {loading && <Loader />}
            <DialogHeader>Descagar Informe</DialogHeader>
            <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <ImprimirFacturas  ref={componentRef} saveReporte={false} facturas={facturasInforme} setLoading={setLoading}
                        dateRange={dateRange} />
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleClose} className="mr-2">
                    Cancelar
                </Button>
                <ReactToPrint
                        trigger={() => <Button variant="gradient" color="green">Imprimir Informe</Button>}
                        content={() => componentRef.current}
                    />
            </DialogFooter>
        </Dialog>
    );
};

export default ModalDescargarInforme;
