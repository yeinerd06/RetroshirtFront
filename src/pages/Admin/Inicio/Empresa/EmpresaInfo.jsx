import React, { useState } from "react";
import { Button, Input, Textarea, Card, CardBody, CardFooter, IconButton } from "@material-tailwind/react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

const EmpresaInfo = () => {
  // Información estática de la empresa
  const [empresa, setEmpresa] = useState({
    logo: "/img/retro-shirt.png", // Ruta de logo estático
    nombre: "RETRO SHIRT",
    direccion: "Cucuta , Norte de Santander",
    whatsapp: "3108183981",
    email: "retro@shirt.com",
  });

  // Estado para controlar el modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value,
    });
  };

  const handleLogoChange = (e) => {
    setEmpresa({
      ...empresa,
      logo: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleSave = () => {
    console.log("Información guardada:", empresa);
    alert("Información de la empresa actualizada correctamente.");
    setOpen(false); // Cerrar modal al guardar
  };

  return (
    <div className="w-full mx-auto ">
      {/* Card horizontal que muestra la información de la empresa */}
      <Card className="flex-row items-center p-4 shadow-lg bg-blue-900 text-white">
        <img
          src={empresa.logo}
          alt="Logo de la empresa"
          className="w-32 h-32 object-cover mr-4"
        />
        <CardBody className="flex-1">
          <h2 className="text-xl font-bold">{empresa.nombre}</h2>
          <p className=" mt-2">{empresa.direccion}</p>
          <p>{empresa.whatsapp}</p>
          <p>{empresa.email}</p>
        </CardBody>
        <CardFooter>
          {/* Botón para abrir el modal */}
          <IconButton className="bg-yellow-900 hover:bg-yellow-700" onClick={handleOpen}>
            <FaEdit  className="text-xl" /> 
          </IconButton>
          
        </CardFooter>
      </Card>

      {/* Modal para editar la información */}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader className="bg-blue-900 text-white uppercase"
        >Actualizar Información de la Empresa</DialogHeader>
        <DialogBody>
          {/* Formulario dentro del modal */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Logo de la Empresa</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mb-2"
            />
            {empresa.logo && (
              <img src={empresa.logo} alt="Logo de la Empresa" className="w-32 h-32 object-cover" />
            )}
          </div>

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
        </DialogBody>
        <DialogFooter>
          <Button  onClick={handleOpen} className="mr-2 bg-red-900 text-white">
            Cancelar
          </Button>
          <Button  onClick={handleSave} className="bg-blue-900 text-white">
            Guardar Cambios
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default EmpresaInfo;
