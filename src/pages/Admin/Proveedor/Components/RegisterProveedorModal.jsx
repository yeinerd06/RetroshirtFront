import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { useUserContext } from "@/context/UserContext";
import { Loader } from "@/Components/Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { apiSaveProveedor } from "@/Api/Proveedor/Proveedor";
const RegisterProveedorModal = ({ open, handleOpen }) => {


  const {  setProveedores,proveedores } = useUserContext();

  const [loading, setloading] = useState(false)
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState(null);
  const [formData, setFormData] = useState({
   
    nombre: "",
    apellido: "",
    email: "",
  });
  useEffect(() => {
    if (!open) {
      setMensaje("")
      setImagen(null)
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
      })
    }
  }, [open])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    setMensaje("");
   
   
    setloading(true)
    apiSaveProveedor(formData)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.success) {
          setProveedores((prevUsuarios) => [...prevUsuarios, data.data]);
          handleOpen();
          setFormData({
            nombre: "",
            apellido: "",
            correo: "",
          });
          alertify.success("Proveedor Registrado");
        } else {
          setMensaje(data.mensaje)
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setloading(false);
      });

    // Cerrar el modal después de registrar (opcional)


  };

  return (
    <Dialog open={open} handler={handleOpen} dismiss={{ outsidePress: false }}>
      <Loader  loading={loading}/>
      <DialogHeader className="bg-blue-900 text-white uppercase">Registrar Proveedor</DialogHeader>
      <form onSubmit={handleRegister}>
        <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
         
          <div className="mb-4">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Correo"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Barrio"
              name="barrio"
              value={formData.barrio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>
          
          
          {/* <div className="mb-4">
            <Input
              label="Imagen"
              type="file"
              onChange={handleImageChange}
            />
          </div>
          {imagen && (
            <div className="mb-4">
              <img src={imagen} alt="Previsualización" className="w-full h-auto" />
            </div>
          )} */}

        </DialogBody>
        <div className="mb-4">
          <p className="text-center mt-3 text-red-700">{mensaje}</p>
        </div>
        <DialogFooter>


          <Button  onClick={handleOpen} className="mr-1 bg-red-900 text-white">
            <span>Cancelar</span>
          </Button>
          <Button type="submit" className="bg-blue-900 text-white">
            <span>Registrar</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default RegisterProveedorModal;
