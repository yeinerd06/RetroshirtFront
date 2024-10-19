import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import RegisterUserModal from "./Components/RegisterProveedorModal";
import { useUserContext } from "@/context/UserContext";
import {
  PencilSquareIcon,
  ShoppingCartIcon,
  SquaresPlusIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import UpdateUserModal from "./Components/UpdateProveedorModal";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Loader } from "@/Components/Loader";
import { Link } from "react-router-dom";
import { AiFillProduct } from "react-icons/ai";
import MenuProveedor from "./Menu/MenuProveedor";
const AdminProveedor = () => {
  const { setProveedores, proveedores, modulo } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  const [openUpdate, setOpenUpdate] = useState(false);
  const [user, setUser] = useState([]);
  const handleOpenUpdate = (usuario) => {
    console.log(usuario);
    setUser(usuario);
    setOpenUpdate(!openUpdate);
  };

  return (
    <div>
      <MenuProveedor  />
      {loading && <Loader />}
      <div>
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 flex items-center justify-end p-6"
              >
                {(modulo === "admin" || modulo === "almacenista") && (
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
              <div>
                <table className="w-full min-w-[640px] table-auto">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      {["Nombre's", "Correo", "Telefono", "Estado", ""].map(
                        (el) => (
                          <th
                            key={el}
                            className="border-b border-blue-gray-50 py-3 px-6 text-left"
                          >
                            <Typography
                              variant="small"
                              className="text-[11px] font-medium font-bold uppercase "
                            >
                              {el}
                            </Typography>
                          </th>
                        )
                      )}
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
                              {usuario?.nombre} {usuario?.apellido}
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

                        <td className="py-3 px-5 gap-2">
                          <Menu>
                            <MenuHandler>
                              <Button variant="text">Opciones</Button>
                            </MenuHandler>
                            <MenuList>
                              {(modulo === "admin" ||
                                modulo === "almacenista") && (
                                <MenuItem
                                  className="flex items-center gap-2"
                                  onClick={() => handleOpenUpdate(usuario)}
                                >
                                  <PencilSquareIcon className="w-5 h-5 mr-2 text-yellow-900 " />
                                  Actualizar
                                </MenuItem>
                              )}

                              <Link
                                to={
                                  "/" +
                                  modulo +
                                  "/proveedor/productos/" +
                                  usuario.id
                                }
                              >
                                <MenuItem className="flex items-center gap-2">
                                  <AiFillProduct className="text-blue-900" />{" "}
                                  Productos
                                </MenuItem>
                              </Link>
                              {usuario.estado && (
                                <Link
                                  to={
                                    "/" +
                                    modulo +
                                    "/proveedor/compra/" +
                                    usuario.id
                                  }
                                >
                                  <MenuItem className="flex items-center gap-2">
                                    <ShoppingCartIcon className="w-5 h-5 mr-2 text-green-900 " />{" "}
                                    Pedido
                                  </MenuItem>
                                </Link>
                              )}
                            </MenuList>
                          </Menu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

      <RegisterUserModal open={open} handleOpen={handleOpen} />
      <UpdateUserModal
        openUpdate={openUpdate}
        handleOpenUpdate={handleOpenUpdate}
        user={user}
      />
    </div>
  );
};

export default AdminProveedor;
