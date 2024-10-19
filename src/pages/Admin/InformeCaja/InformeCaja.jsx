import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useUserContext } from "@/context/UserContext";
import { ArrowDownLeftIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, InformationCircleIcon, PencilSquareIcon, PrinterIcon, SquaresPlusIcon, TrashIcon, } from "@heroicons/react/24/solid";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Loader } from "@/Components/Loader";
import { Link, useNavigate } from "react-router-dom";
import ReactToPrint from 'react-to-print';
import ImprimirFactura from "../Factura/Components/ImprimirFactura";
import ImprimirFacturas from "./Components/ImprimirFacturas";
import ModalGenerarInforme from "./Components/ModalGenerarInforme";
import { apiDeleteInformeFactura } from "@/Api/Informe/InformeFactura";
import ModalDescargarInforme from "./Components/ModalDescargarInforme";

const InformeCaja = () => {
  const {  facturas, informesCaja, setInformesCaja,modulo } = useUserContext();
  const [loading, setLoading] = useState(false);

 

  useEffect(() => {

  }, [informesCaja])

  const [open, setOpen] = useState(false);
  const handleOpenFactura = (factura) => {

    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openDownload, setOpenDownload] = useState(false);
  const handleOpenFacturaDownload = (factura) => {
    
    setOpenDownload(true);
  };
  const handleCloseDownload = () => {
    setOpenDownload(false);
  };



 // const filteredFacturas = facturas.filter((factura) => factura.pagoEfectivo && factura.tipoFactura.id == 1);

  const formatCurrency = (value) => {
    if(value!=null)
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };


  

  const handleEliminarInforme = (informe) => {
    const content = `
        <div>
            <h3>Informe #${informe.id}</h3>
            <p style="text-align: right;">Total : $ ${informe.total}</p>
        </div>
    `;

    alertify.confirm('Eliminar Informe de caja?', content,
      function () {
        // Pagar factura
        setLoading(true)
        apiDeleteInformeFactura(informe.id)
          .then(res => res.json())
          .then(data => {
            console.log(data)
            if (data.success) {
              setInformesCaja(prevInformes => {
                // Filtrar la lista de informes eliminando el informe con el ID correspondiente
                return prevInformes.filter(prevInforme => prevInforme.id !== informe.id);
              });
              alertify.success('Informe  eliminado')
            } else {
              alertify.error('Error ')
            }

          })
          .catch(e => {
            console.log(e)
          })
          .finally(f => {
            setLoading(false)
          })

      },
      function () {
      }
    ).set('labels', { ok: 'Eliminar', cancel: 'Cancelar' }).set('closable', false);

    // Cambiar colores de botones
    document.querySelector('.ajs-ok').style.backgroundColor = '#4CAF50'; // Verde para Pagar
    document.querySelector('.ajs-cancel').style.backgroundColor = '#f44336'; // Rojo para Cancelar
  }

  const [download, setDownload] = useState(false)
  const [informe, setInforme] = useState([])
  const handleDownloadInforme = (informe) => {
    setInforme(informe)
    handleOpenFacturaDownload()
  }


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

          {modulo==="admin" && (
            <Button
            className="flex ml-0 lg:ml-auto mt-4 sm:mt-0"
            variant="text"
            size="sm"
            color="success"
            onClick={handleOpenFactura}
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Generar Informe
          </Button>
          )}
          
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["#", "Fecha Inicio", "Fecha Fin", "N° Facturas", "Total Ventas", "Total Compras","Fecha Registro", "Acciones"].map((el) => (
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
              {informesCaja?.map((informe) => (
                <tr key={informe?.id} className="border">
                  <td className="py-3 px-5">
                    <p>{informe.id}</p>
                  </td>
                  <td className="py-3 px-5">

                    <p>{informe.startDate}</p>
                  </td>




                  <td className="py-3 px-5">
                    <p>{informe.endDate}</p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-center ">{informe.numeroFacturas}</p>
                  </td>
                  <td className="py-3 px-5">
                    {formatCurrency(informe?.total)}
                  </td>
                  <td className="py-3 px-5">
                    {formatCurrency(informe?.totalCompra)}
                  </td>
                  <td className="py-3 px-5">
                    <p>{informe.fechaRegistro?.split( 'T' )[0]}</p>

                  </td>
                  <td className="py-3 px-5">
                    <Button size="sm" color="white" className="" title="Informacion"
                      onClick={() => handleDownloadInforme(informe)}
                    >
                      <DocumentArrowDownIcon className="w-5 h-5 text-green-800" />
                    </Button>
                    {modulo==="admin" && (
                      <Button size="sm" color="white" className="" title="Informacion"
                      onClick={() => handleEliminarInforme(informe)}
                    >
                      <TrashIcon className="w-5 h-5 text-red-800" />
                    </Button>
                    )}
                    
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <ModalGenerarInforme open={open} handleClose={handleClose} filteredFacturas={facturas} />
        <ModalDescargarInforme  open={openDownload} handleClose={handleCloseDownload} filteredFacturas={facturas} 
         informe={informe} setInforme={setInforme}/> 
    </div>
  );
};

export default InformeCaja;
