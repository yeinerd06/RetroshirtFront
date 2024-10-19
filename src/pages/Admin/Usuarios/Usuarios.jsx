import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
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
  const { usuarios, setUsuarios } = useUserContext()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  const [openUpdate, setOpenUpdate] = useState(false);
  const [user, setUser] = useState([])
  const handleOpenUpdate = (usuario) => {
    console.log(usuario)
    setUser(usuario)
    setOpenUpdate(!openUpdate);
  };

  const handleOpenDelete = (usuario) => {
    setUser(usuario)
    alertify.confirm(
      "Eliminar usuario?",
      "Dicho proceso no se puede revertir",
      function () {
        deleteUser(usuario)

      },
      function () {
        alertify.error('Operación cancelada');
      }
    ).set({
      labels: { ok: 'Confirmar', cancel: 'Cancelar' },
      reverseButtons: true,
      transition: 'pulse',
    });

    // Personalizar colores de los botones utilizando CSS
    const okButton = document.querySelector('.ajs-ok');
    const cancelButton = document.querySelector('.ajs-cancel');

    if (okButton && cancelButton) {
      okButton.style.backgroundColor = 'green';
      okButton.style.color = 'white';
      cancelButton.style.backgroundColor = 'red';
      cancelButton.style.color = 'white';
    }
  };

  const deleteUser = (usuario) => {
    setLoading(true);
    apiDeleteUsuario(usuario.id)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsuarios(prevUsuarios => prevUsuarios.filter(prevUsuario => prevUsuario.id !== usuario.id));
          alertify.success('Usuario eliminado');
        } else {
          alertify.error("Error al eliminar el usuario");
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="mb-4 grid grid-cols-1 gap-6 mt-6">
      {loading && (
        <Loader />
      )}
      <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-end p-6"
        >
          <Button
            className="text-left flex"
            variant="text"
            size="sm"
            color="success"
            onClick={handleOpen}
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            registrar usuario
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre", "Correo","Estado", "Rol", "Acciones"].map((el) => (
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
              {usuarios?.map((usuario) => (
                <tr key={usuario?.id}>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-4">
                      {usuario?.imagen && (
                        <Avatar src={usuario?.imagen} alt={"Imagen de perfil"} size="sm" />
                      )}
                      {/* */}
                      <Typography
                        variant="small"
                        className="text-xs font-medium text-blue-gray-600"
                      >
                        {usuario?.nombre}  {usuario?.apellido}
                      </Typography>
                    </div>
                  </td>
                  <td className="py-3 px-5">

                    <Typography
                      variant="small"
                      className="text-xs font-medium text-blue-gray-600"
                    >
                      {usuario?.email}
                    </Typography>

                  </td>
                  <td className="py-3 px-5">

                    <Typography
                      variant="small"
                      className="text-xs font-medium text-blue-gray-600"
                    >
                      {usuario?.estado ? "ACTIVO" :"INACTIVO"}
                    </Typography>

                  </td>
                  <td className="py-3 px-5">
                    <Typography
                      variant="small"
                      className="text-xs font-medium text-blue-gray-600"
                    >

                      {usuario?.roles[0]?.nombre?.split("_")[1]}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <div className="w-10/12">
                      <Typography
                        variant="small"
                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                      >
                        <Button size="sm" color="white"
                          onClick={() => handleOpenUpdate(usuario)}>
                          <PencilSquareIcon className="w-5 h-5 mr-2 text-yellow-900" />
                        </Button>
                        {/* {usuario?.roles[0]?.nombre?.split("_")[1] !== "ADMIN" && (
                          <Button size="sm" color="white"
                            onClick={() => handleOpenDelete(usuario)}>
                            <TrashIcon className="w-5 h-5 text-red-900" />
                          </Button>
                        )} */}

                      </Typography>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <RegisterUserModal open={open} handleOpen={handleOpen} />
      <UpdateUserModal openUpdate={openUpdate} handleOpenUpdate={handleOpenUpdate} user={user} />
    </div>
  );
};

export default AdminUsuarios;
