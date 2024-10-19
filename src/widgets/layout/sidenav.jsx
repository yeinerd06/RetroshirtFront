// Importaciones necesarias
import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

// Función auxiliar para manejar el click en los ListItem
function handleListItemClick(dispatch, layout, path, navigate) {
  setOpenSidenav(dispatch, false);
  navigate(`/${layout}${path}`);
}

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg",
    white: "",
    transparent: "bg-transparent shadow-none",
  };
  const modulo = localStorage.getItem("modulo");

  // Hook de navegación
  const navigate = useNavigate();

  return (
    <aside
      className={`border-r border-gray-900  bg-white ${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0 " : "-translate-x-80"
      } fixed inset-0 z-50 h-100vh w-72 transition-transform duration-300 xl:translate-x-0`}
    >
      <div className="relative">
        <Link to="/admin/home" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            RETRO SHIRT
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
                    <ListItem
                      key={name}
                      type="button"
                      onClick={() =>
                        handleListItemClick(dispatch, layout, path, navigate)
                      }
                    >
                      <NavLink to={`/${layout}${path}`}>
                        {({ isActive }) => (
                          <div
                            className={`flex items-center gap-2 px-4 capitalize ${
                              isActive
                                ? "text-green-900 border-l-4 border-green-600"
                                : "text-gray-900"
                            }`}
                          >
                            <ListItemPrefix>{icon}</ListItemPrefix>
                            <Typography
                              color="inherit"
                              className="font-medium capitalize"
                            >
                              {name}
                            </Typography>
                          </div>
                        )}
                      </NavLink>
                    </ListItem>
                  ))}
              </List>
            </ul>
          ))}
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
