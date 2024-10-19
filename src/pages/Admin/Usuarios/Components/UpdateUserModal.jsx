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
const UpdateUserModal = ({ openUpdate, handleOpenUpdate, user }) => {


  const { roles, setUsuarios,facturas } = useUserContext();

  const [loading, setloading] = useState(false)
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState(null);
  const [admin,setAdmin]=useState(false)
  const [tieneFacturas,setTieneFacturas]=useState(false)
  const [formData, setFormData] = useState({
    roles: "",
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: ""
  });
  useEffect(() => {
    if (!openUpdate) {
      setMensaje("")
      setImagen(null)
      setFormData({
        roles: "",
        nombre: "",
        apellido: "",
        correo: "",
        contraseña: ""
      })
    } else {
      setFormData({
        roles: user?.roles[0],
        nombre: user?.nombre,
        apellido: user?.apellido,
        correo: user?.email,
        estado:user?.estado,
        contraseña: ""
      })
      setAdmin(user?.roles[0]?.nombre?.split("_")[1] === "ADMIN" ? true :false )
      setImagen(user?.imagen)
      setTieneFacturas(buscarSiTieneFacturas())
    }
    
  }, [openUpdate])

  const buscarSiTieneFacturas = () => {
    return facturas.some(factura => factura.usuario.id === user.id);
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value
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
    console.log("User:", user);
    console.log("Datos del formulario:", formData);
    console.log("Imegen:", imagen);
    setMensaje("");
    if (formData?.roles === "") {
      setMensaje("Seleccione un rol");
      return;
    }

    const data = new FormData();
    data.append(
      "usuario",
      new Blob(
        [
          JSON.stringify({
            id: user?.id,
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.correo,
            estado:formData.estado,
            rol: formData.roles,


          }),
        ],
        { type: "application/json" }
      )
    );
    data.append("file", formData?.imagen);


    setloading(true)
    apiUpdateUsuario(data)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.success) {
          setUsuarios(prevUsuarios => {
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
      <Loader  loading={loading}/>
      <DialogHeader className="bg-blue-900 text-white">EDITAR USUARIO</DialogHeader>
      <form onSubmit={handleRegister}>
        <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          
          <div className="mb-4">
            <Select
              label="Rol"
              name="roles"
              value={formData?.roles?.id}
              onChange={handleSelectChange}
              required
              disabled={formData?.roles?.id == 1 ? true: false}
            >
              {roles?.filter(rol => rol.id !== 1)
              .map((rol) => (
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
              name="correo"
              value={formData.correo}
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
        <DialogFooter className="border-0">


          <Button  onClick={handleOpenUpdate} className="mr-1 bg-red-900 text-white">
            <span>CANCELAR</span>
          </Button>
          <Button  type="submit" className="bg-blue-900 text-white">
            <span>GUARDAR CAMBIOS</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default UpdateUserModal;
