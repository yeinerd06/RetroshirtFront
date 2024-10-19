import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Button,
  Input,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  EllipsisVerticalIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import AlertaInventario from "@/pages/Admin/Inventario/Components/Alerta";
import { Bell, Search } from "lucide-react";

export function DashboardNavbar() {
  const usuario = JSON.parse(localStorage.getItem("data"))
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const navigate = useNavigate();
  const handleSalir = () => {
    localStorage.clear()
    navigate("/inicio/login")
  }

  return (
    <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
            <div className="capitalize">
         
         <Typography variant="h6" color="blue-gray" >
           {page.toUpperCase()}
         </Typography>
       </div>
            </div>
            <div className="flex items-center space-x-4">
            <div className="mr-auto md:mr-4 md:w-56">
            <p className="text-black text-end">{usuario?.nombre}</p>
          </div>
          <div className="mr-auto ">
            {usuario?.imagen && (
              <Avatar src={usuario?.imagen} alt={"Imagen de perfil"} size="sm" />
            )}
          </div><AlertaInventario />
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
            </div>
          </div>
        </header>
    
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
