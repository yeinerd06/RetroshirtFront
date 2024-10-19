import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  UserGroupIcon,
  ArchiveBoxIcon,
  ArchiveBoxXMarkIcon,
  ArchiveBoxArrowDownIcon,
  InboxArrowDownIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { Password } from "@/pages/auth";
import Login from "./pages/auth/login";
import AdminUsuarios from "./pages/Admin/Usuarios/Usuarios";
import AdminInventario from "./pages/Admin/Inventario/Inventario";
import AdminFactura from "./pages/Admin/Factura/Factura";
import Venta from "./pages/Admin/Factura/Components/Venta";
import AlmacenistaInventario from "./pages/Almacenista/Inventario/Inventario";
import VendedorInventario from "./pages/Vendedor/Inventario/Inventario";
import ArticuloDetailView from "./pages/Admin/Inventario/Articulo/ArticuloDetailView";
import DetallesFactura from "./pages/Admin/Factura/Components/DetallesFactura";
import AdminDevolucion from "./pages/Admin/Devoluciones/Devolucion";
import AdminProveedor from "./pages/Admin/Proveedor/Proveedor";
import Compra from "./pages/Admin/Proveedor/Components/Compra";
import InformeCaja from "./pages/Admin/InformeCaja/InformeCaja";
import CompraUpdate from "./pages/Admin/Proveedor/Components/CompraUpdate";
import HomeRetroShirt from "./pages/Home/Home";
import { LoginFramer } from "./pages/auth/LoginFramer";
import { ResetPassword } from "./pages/auth/ResetPassword";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "admin",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,

      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "usuarios",
        path: "/usuarios",
        element: <AdminUsuarios />,

      },
      {
        icon: <ArchiveBoxIcon {...icon} />,
        name: "inventario",
        path: "/inventario",
        element: <AdminInventario />,

      },
      {
        icon: "",
        name: "inventario",
        path: "/inventario/articulo/:id",
        element: <ArticuloDetailView />,

      },
      {
        icon: <ArchiveBoxArrowDownIcon {...icon} />,
        name: "facturación",
        path: "/facturacion",
        element: <AdminFactura />,

      },
      {
        icon: <ArchiveBoxXMarkIcon {...icon} />,
        name: "devoluciones",
        path: "/devolcuiones",
        element: <AdminDevolucion />,

      },
      {
        icon: <InboxArrowDownIcon {...icon} />,
        name: "proveedores",
        path: "/proveedores",
        element: <AdminProveedor />,

      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "informe caja",
        path: "/informe-caja",
        element: <InformeCaja />,

      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/compra/:id",
        element: <Compra />,

      },
      {
        icon: "",
        name: "facturación",
        path: "/facturacion/factura/:id",
        element: <DetallesFactura />,

      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/compra/:id/actualizar",
        element: <CompraUpdate />,

      },
      {
        icon: "",
        name: "venta",
        path: "/facturacion/venta",
        element: <Venta />,

      }
    ]
  },
  {
    layout: "vendedor",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,

      }, {
        icon: <ArchiveBoxIcon {...icon} />,
        name: "inventario",
        path: "/inventario",
        element: <VendedorInventario />,

      }, {
        icon: <ArchiveBoxArrowDownIcon {...icon} />,
        name: "facturación",
        path: "/facturacion",
        element: <AdminFactura />,

      },
      {
        icon: "",
        name: "facturación",
        path: "/facturacion/factura/:id",
        element: <DetallesFactura />,

      },
      {
        icon: "",
        name: "venta",
        path: "/facturacion/venta",
        element: <Venta />,

      }
    ]
  },
  {
    layout: "almacenista",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,

      }, {
        icon: <ArchiveBoxIcon {...icon} />,
        name: "inventario",
        path: "/inventario",
        element: <AlmacenistaInventario />,

      }, {
        icon: <InboxArrowDownIcon {...icon} />,
        name: "proveedores",
        path: "/proveedores",
        element: <AdminProveedor />,

      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/compra/:id",
        element: <Compra />,

      },
      , {
        icon: <ArchiveBoxArrowDownIcon {...icon} />,
        name: "facturación",
        path: "/facturacion",
        element: <AdminFactura />,

      },
      {
        icon: "",
        name: "facturación",
        path: "/facturacion/factura/:id",
        element: <DetallesFactura />,

      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "informe caja",
        path: "/informe-caja",
        element: <InformeCaja />,

      },
      
    ]
  },
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "Inicio Retro Shirt",
    layout: "inicio",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Inicio",
        path: "/",
        element: <HomeRetroShirt />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "login",
        path: "/login",
        element: <LoginFramer />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Recuperar Contraseña",
        path: "/recuperar-contraseña",
        element: <ResetPassword />,
      },
    ],
  },
];

export default routes;
