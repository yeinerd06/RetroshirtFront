import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import {
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Items de menú con sus iconos y rutas
const menuItems = [
  { icon: LayoutDashboard, name: "Dashboard", href: "/admin/dashboard" },
  { icon: ShoppingBag, name: "Productos", href: "/admin/products" },
  { icon: Users, name: "Usuarios", href: "/admin/users" },
  { icon: FileText, name: "Pedidos", href: "/admin/orders" },
  { icon: Settings, name: "Configuración", href: "/admin/settings" },
];

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg",
    white: "",
    transparent: "bg-transparent shadow-none",
  };
  const modulo = localStorage.getItem("modulo");
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/inicio/login");
  };

  return (
    <aside
      className={`border-r border-blue-900 bg-blue-900 text-white ${
        sidenavTypes[sidenavType]
      } ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 h-screen ${
        expanded ? "w-64" : "w-20"
      } transition-transform duration-300 xl:translate-x-0`}
    >
      <div className="relative">
        <Link to="/admin/home" className="py-6 px-8 text-center">
          <Typography variant="h6" color="white">
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes
          .filter(({ layout }) => layout === modulo)
          .map(({ layout, title, pages }, key) => (
            <ul key={key} className="mb-4 flex flex-col gap-1">
              {title && (
                <li className="mx-3.5 mt-4 mb-2">
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </li>
              )}
              <List>
                {pages
                  .filter(({ icon }) => icon !== "")
                  .map(({ icon, name, path }) => (
                    <NavLink
                      key={name}
                      to={`/${layout}${path}`}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded ${
                          isActive
                            ? "text-gray-100 font-bold bg-gray-800"
                            : "text-gray-300 hover:bg-gray-700"
                        }`
                      }
                    >
                      <ListItemPrefix>{icon}</ListItemPrefix>
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </NavLink>
                  ))}
              </List>
            </ul>
          ))}
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          className="flex items-center w-full mt-2 py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
          onClick={cerrarSesion}
        >
          <LogOut size={20} />
          {expanded && <span className="ml-4">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "RETRO SHIRT",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
