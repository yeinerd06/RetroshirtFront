import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Select,
  Option
} from "@material-tailwind/react";
import { useUserContext } from "@/context/UserContext";
import { Loader } from "@/Components/Loader";
import { apiSaveUsuario, apiUpdateUsuario } from "@/Api/Usuarios/Usuarios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { apiUpdateProveedor } from "@/Api/Proveedor/Proveedor";
const UpdateUserModal = ({ openUpdate, handleOpenUpdate, user }) => {


  const { setProveedores,facturas } = useUserContext();
  const [loading, setloading] = useState(false)
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState(null);
  const [admin,setAdmin]=useState(false)
  const [tieneFacturas,setTieneFacturas]=useState(false)
  const [formData, setFormData] = useState({

    nombre: "",
    apellido: "",
    email: "",
  });
  useEffect(() => {
    if (!openUpdate) {
      setMensaje("")
      setImagen(null)
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
      })
    } else {
      setFormData({
        id:user?.id,
        nombre: user?.nombre,
        apellido: user?.apellido,
        email: user?.email,
        estado:user?.estado,
        documento:user?.documento,
        direccion:user?.direccion,
        barrio:user?.barrio,
        telefono:user?.telefono
      })
      setTieneFacturas(buscarSiTieneFacturas())
    }

    
  }, [openUpdate])

  const buscarSiTieneFacturas = () => {
    return facturas.some(factura => factura?.proveedor?.id === user.id);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value
    }));
};

 

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("User:", user);
    console.log("Datos del formulario:", formData);
    


    setloading(true)
    apiUpdateProveedor(formData)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.success) {
          setProveedores(prevUsuarios => {
            // Actualiza la lista de semestres con el semestre actualizado
            return prevUsuarios.map(prevUsuario => {
              // Si el semestre actualizado tiene el mismo ID que el semestre existente, devolver el semestre actualizado
              if (prevUsuario.id === data?.data?.id) {
                return data.data;
              } else {
                return prevUsuario; // Devuelve el semestre existente sin cambios
              }
            });
          })

          handleOpenUpdate();
          setFormData({
            roles: "",
            nombre: "",
            apellido: "",
            correo: "",
            contraseña: ""
          });
          setImagen(null);
          alertify.success("Usuario actualizado");
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




  };

  return (
    <Dialog open={openUpdate} handler={handleOpenUpdate} dismiss={{ outsidePress: false }}>
      {loading && (
        <Loader />
      )}
      <DialogHeader>Actualizar Proveedor</DialogHeader>
      <form onSubmit={handleRegister}>
        <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          
         
          <div className="mb-4">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={tieneFacturas}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              disabled={tieneFacturas}
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
              label="Telefono"
              name="telefono"
              value={formData.telefono}
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
              label="Barrio"
              name="barrio"
              value={formData.barrio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
                disabled={admin}
              />
              <span className="ml-2">ACTIVO</span>
            </label>
          </div>
        

        </DialogBody>
        <div className="mb-4">
          <p className="text-center mt-3 text-red-700">{mensaje}</p>
        </div>
        <DialogFooter>


          <Button variant="text" color="red" onClick={handleOpenUpdate} className="mr-1">
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" type="submit" color="green">
            <span>Actualizar</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default UpdateUserModal;
