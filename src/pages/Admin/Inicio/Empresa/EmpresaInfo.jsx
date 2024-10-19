import React, { useState } from "react";
import { Button, Input, Textarea, Card, CardBody, CardFooter, IconButton } from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useEmpresaContext } from "@/context/EmpresaContext";
import { useUserContext } from "@/context/UserContext";
import { apiUpdateEmpresa } from "@/Api/Empresa/Empresa";
import alertify from "alertifyjs"; // Asumiendo que usas alertify para las alertas
import "alertifyjs/build/css/alertify.css";
const EmpresaInfo = () => {
  // Información de la empresa desde el contexto
  const { empresa, setEmpresa } = useEmpresaContext();
  const { setLoading } = useUserContext();

  // Estado para controlar el modal
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleOpen = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value,
    });
  };

  const handleSave = () => {
    setLoading(true);

    const empresaData = {
      nombre: empresa.nombre,
      direccion: empresa.direccion,
      celular: empresa.celular,
      whatsapp: empresa.whatsapp
    };
    console.log(empresaData)
    apiUpdateEmpresa(empresaData)  // Aquí se envía el objeto JSON en lugar de FormData
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          setEmpresa(data.data);
          handleOpen();
          alertify.success("Empresa actualizada correctamente");
        } else {
          setMensaje(data.mensaje || "Error al actualizar la empresa");
          alertify.error(mensaje);
        }
      })
      .catch((e) => {
        console.error(e);
        alertify.error("Error en el servidor");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full mx-auto">
      {/* Card que muestra la información de la empresa */}
      <Card className="flex-row items-center p-4 shadow-lg bg-blue-900 text-white">
        <img
          src={empresa.logo || "/img/retro-shirt.png"}
          alt="Logo de la empresa"
          className="w-32 h-32 object-cover mr-4"
        />
        <CardBody className="flex-1">
          <h2 className="text-xl font-bold">{empresa.nombre}</h2>
          <p className="mt-2">{empresa.direccion}</p>
          <p>{empresa.celular}</p>
          <p>{empresa.whatsapp}</p>
        </CardBody>
        <CardFooter>
          {/* Botón para abrir el modal */}
          <IconButton className="bg-yellow-900 hover:bg-yellow-700" onClick={handleOpen}>
            <FaEdit className="text-xl" />
          </IconButton>
        </CardFooter>
      </Card>

      {/* Modal para editar la información */}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader className="bg-blue-900 text-white uppercase">
          Actualizar Información de la Empresa
        </DialogHeader>
        <DialogBody>
          {/* Formulario dentro del modal */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nombre de la Empresa</label>
            <Input
              type="text"
              name="nombre"
              value={empresa.nombre}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre de la empresa"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Dirección</label>
            <Textarea
              name="direccion"
              value={empresa.direccion}
              onChange={handleInputChange}
              placeholder="Ingrese la dirección de la empresa"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Celular</label>
            <Input
              type="text"
              name="celular"
              value={empresa.celular}
              onChange={handleInputChange}
              placeholder="Ingrese el número de celular"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">WhatsApp</label>
            <Input
              type="text"
              name="whatsapp"
              value={empresa.whatsapp}
              onChange={handleInputChange}
              placeholder="Ingrese el número de WhatsApp"
              className="w-full"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleOpen} className="mr-2 bg-red-900 text-white">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-900 text-white">
            Guardar Cambios
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default EmpresaInfo;
