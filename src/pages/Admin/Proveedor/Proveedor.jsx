import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import RegisterUserModal from "./Components/RegisterProveedorModal";
import { useUserContext } from "@/context/UserContext";
import { PencilSquareIcon, ShoppingCartIcon, SquaresPlusIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import UpdateUserModal from "./Components/UpdateProveedorModal";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Loader } from "@/Components/Loader";
import { Link } from "react-router-dom";
const AdminProveedor = () => {
  const { setProveedores, proveedores,modulo } = useUserContext()
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
          {modulo==="admin" && (
             <Button
             className="text-left flex"
             variant="text"
             size="sm"
             color="success"
             onClick={handleOpen}
           >
             <UserPlusIcon className="h-5 w-5 mr-2" />
             registrar proveedor
           </Button>
          )}
         
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre's", "Correo", "Telefono", "Estado", "Acciones"].map((el) => (
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
              {proveedores?.map((usuario) => (
                <tr key={usuario?.id}>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-4">

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
                      {usuario?.telefono}
                    </Typography>

                  </td>
                  <td className="py-3 px-5">

                    <Typography
                      variant="small"
                      className="text-xs font-medium text-blue-gray-600"
                    >
                      {usuario?.estado ? "ACTIVO" : "INACTIVO"}
                    </Typography>

                  </td>

                  <td className="py-3 px-5">
                    <div className="w-10/12">
                      <Typography
                        variant="small"
                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                      >
                        {modulo==="admin" && (
                             <Button size="sm" color="white"
                             onClick={() => handleOpenUpdate(usuario)}>
                             <PencilSquareIcon className="w-5 h-5 mr-2 text-yellow-900" />
                           </Button>
                        )}
                     
                        

                       {usuario.estado && (
                         <Link to={"/" + modulo + "/proveedor/compra/"+usuario.id}>
                         <Button size="sm" color="white" title="comprar proveedor"
                          >
                             
                           <ShoppingCartIcon className="w-5 h-5 mr-2 text-success-700 " />
                         </Button>
                         </Link>
                       )}

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

export default AdminProveedor;
