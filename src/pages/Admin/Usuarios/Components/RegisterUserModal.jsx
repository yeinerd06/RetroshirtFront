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
import { apiSaveUsuario } from "@/Api/Usuarios/Usuarios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
const RegisterUserModal = ({ open, handleOpen }) => {


  const { roles, setUsuarios } = useUserContext();

  const [loading, setloading] = useState(false)
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState(null);
  const [formData, setFormData] = useState({
    roles: "",
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: ""
  });
  useEffect(() => {
    if (!open) {
      setMensaje("")
      setImagen(null)
      setFormData({
        roles: "",
        nombre: "",
        apellido: "",
        correo: "",
        contraseña: ""
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

  const handleSelectChange = (value) => {
    const selectedRol = roles.find((rol) => rol.id === parseInt(value));
    setFormData((prevData) => ({
      ...prevData,
      roles: selectedRol
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      imagen: file
    }));
    setImagen(URL.createObjectURL(file));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    console.log("Imegen:", imagen);
    setMensaje("");
    if (formData?.roles === "") {
      setMensaje("Seleccione un rol");
      return;
    }
    if (imagen === null) {
      setMensaje("Selecione una imagen")
      return;
    }
    const data = new FormData();
    data.append(
      "usuario",
      new Blob(
        [
          JSON.stringify({
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.correo,
            password: formData.contraseña,
            rol: formData.roles
          }),
        ],
        { type: "application/json" }
      )
    );
    data.append("file", formData.imagen);
    setloading(true)
    apiSaveUsuario(data)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.success) {
          setUsuarios((prevUsuarios) => [...prevUsuarios, data.data]);
          handleOpen();
          setFormData({
            roles: "",
            nombre: "",
            apellido: "",
            correo: "",
            contraseña: ""
          });
          setImagen(null);
          alertify.success("Usuario Registrado");
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
      {loading && (
        <Loader />
      )}
      <DialogHeader className="bg-blue-900 text-white">NUEVO USUARIO</DialogHeader>
      <form onSubmit={handleRegister}>
        <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="mb-4">
            <Select
              label="Rol"
              name="roles"
              value={formData.rol}
              onChange={handleSelectChange}
              required
            >
              {roles?.filter(rol => rol.id !== 1)
              ?.map((rol) => (
                <Option key={rol.id} value={rol.id}>
                  {rol.nombre.split("_")[1]}
                </Option>
              ))}
            </Select>
          </div>
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
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Contraseña"
              name="contraseña"
              type="password"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
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
          )}

        </DialogBody>
        <div className="mb-4">
          <p className="text-center mt-3 text-red-700">{mensaje}</p>
        </div>
        <DialogFooter>


          <Button   onClick={handleOpen} className="mr-1 bg-red-900 text-white">
            <span>Cancelar</span>
          </Button>
          <Button  type="submit"  className="bg-blue-900 text-white">
            <span>Registrar</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default RegisterUserModal;
