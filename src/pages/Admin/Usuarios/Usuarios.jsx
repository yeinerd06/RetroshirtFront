import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import RegisterUserModal from "./Components/RegisterUserModal";
import { useUserContext } from "@/context/UserContext";
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import UpdateUserModal from "./Components/UpdateUserModal";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { apiDeleteUsuario } from "@/Api/Usuarios/Usuarios";
import { Loader } from "@/Components/Loader";

const AdminUsuarios = () => {
  const { usuarios, setUsuarios, roles } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [user, setUser] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null); // Estado para manejar el rol seleccionado

  const handleOpen = () => setOpen(!open);

  const handleOpenUpdate = (usuario) => {
    setUser(usuario);
    setOpenUpdate(!openUpdate);
  };

  const handleOpenDelete = (usuario) => {
    setUser(usuario);
    alertify.confirm(
      "Eliminar usuario?",
      "Dicho proceso no se puede revertir",
      function () {
        deleteUser(usuario);
      },
      function () {
        alertify.error("Operación cancelada");
      }
    ).set({
      labels: { ok: "Confirmar", cancel: "Cancelar" },
      reverseButtons: true,
      transition: "pulse",
    });

    const okButton = document.querySelector(".ajs-ok");
    const cancelButton = document.querySelector(".ajs-cancel");

    if (okButton && cancelButton) {
      okButton.style.backgroundColor = "green";
      okButton.style.color = "white";
      cancelButton.style.backgroundColor = "red";
      cancelButton.style.color = "white";
    }
  };

  const handleRolSelectChange = (value) => {
    const selectedRol = roles?.find((rol) => rol?.id === parseInt(value));
    setSelectedRole(selectedRol);
  };
  
  const deleteUser = (usuario) => {
    setLoading(true);
    apiDeleteUsuario(usuario.id)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsuarios((prevUsuarios) =>
            prevUsuarios.filter((prevUsuario) => prevUsuario?.id !== usuario?.id)
          );
          alertify.success("Usuario eliminado");
        } else {
          alertify.error("Error al eliminar el usuario");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    console.log(roles);
    console.log(selectedRole);
    console.log(usuarios);
  }, [selectedRole]);
  // Filtrar usuarios por rol
  const filteredUsuarios =
    selectedRole === null
      ? usuarios
      : usuarios.filter((usuario) => usuario?.roles[0]?.id === parseInt(selectedRole?.id));

    
  return (
    <div className="mb-4 grid grid-cols-1 gap-6 mt-6 ">
      {loading && <Loader />}

      <div className="overflow-hidden h-[70vh] bg-white">
        <div
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
     
          <div className="mb-4">
         
            <Select
              label="Rol"
              name="roles"
              value={selectedRole?.id}
              onChange={e=>handleRolSelectChange(e)}
              required
            >
              {roles?.map((rol) => (
                <Option key={rol.id} value={rol.id}>
                  {rol.nombre.split("_")[1]}
                </Option>
              ))}
            </Select>
          </div>
          <Button className="text-left flex" variant="text" size="sm" color="success" onClick={handleOpen}>
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <div className="relative px-0 pt-0 pb-2">
  <div className="overflow-x-auto scrollbar-hide">
    <table className="w-full min-w-[640px] table-auto border-collapse">
      <thead className="bg-green-900 text-white">
        <tr>
          {["Nombre", "Correo", "Estado", "Rol", "Acciones"].map((el) => (
            <th key={el} className="border-b border-gray-200 py-3 px-6 text-left">
              <Typography variant="small" className="text-sm font-bold uppercase">
                {el}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredUsuarios?.map((usuario, index) => (
          <tr key={usuario?.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
            <td className="py-3 px-5">
              <div className="flex items-center gap-4">
                {usuario?.imagen && (
                  <Avatar src={usuario?.imagen} alt="Imagen de perfil" size="sm" />
                )}
                <Typography variant="small" className="text-xs font-medium text-gray-700">
                  {usuario?.nombre} {usuario?.apellido}
                </Typography>
              </div>
            </td>
            <td className="py-3 px-5">
              <Typography variant="small" className="text-xs font-medium text-gray-700">
                {usuario?.email}
              </Typography>
            </td>
            <td className="py-3 px-5">
              <Typography variant="small" className="text-xs font-medium text-gray-700">
                {usuario?.estado ? "ACTIVO" : "INACTIVO"}
              </Typography>
            </td>
            <td className="py-3 px-5">
              <Typography variant="small" className="text-xs font-medium text-gray-700">
                {usuario?.roles[0]?.nombre?.split("_")[1]}
              </Typography>
            </td>
            <td className="py-3 px-5">
              <div className="flex space-x-2">
                <Button size="sm" color="white" onClick={() => handleOpenUpdate(usuario)}>
                  <PencilSquareIcon className="w-5 h-5 text-yellow-900" />
                </Button>
                {/* Uncomment if needed */}
                {/* <Button size="sm" color="white" onClick={() => handleOpenDelete(usuario)}>
                  <TrashIcon className="w-5 h-5 text-red-900" />
                </Button> */}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>

      <RegisterUserModal open={open} handleOpen={handleOpen} />
      <UpdateUserModal openUpdate={openUpdate} handleOpenUpdate={handleOpenUpdate} user={user} />
    </div>
  );
};

export default AdminUsuarios;