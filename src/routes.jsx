import {
  HomeIcon,
  ServerStackIcon,
  RectangleStackIcon,
  UserGroupIcon,
  ArchiveBoxIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard";
import AdminUsuarios from "./pages/Admin/Usuarios/Usuarios";
import AdminInventario from "./pages/Admin/Inventario/Inventario";
import ArticuloDetailView from "./pages/Admin/Inventario/Articulo/ArticuloDetailView";
import AdminProveedor from "./pages/Admin/Proveedor/Proveedor";
import Compra from "./pages/Admin/Proveedor/Orden/OrdenProveedor";
import HomeRetroShirt from "./pages/Home/Home";
import { LoginFramer } from "./pages/auth/LoginFramer";
import { ResetPassword } from "./pages/auth/ResetPassword";
import ProductGrid from "./pages/Home/Productos";
import Inicio from "./pages/Admin/Inicio/Inicio";
import ProductoProveedor from "./pages/Admin/Proveedor/PoductosProveedor/ProductoProveedor";
import ProveedorPedidos from "./pages/Admin/Proveedor/ListaPedidosProveedor/ProveedorPedidos";
import ProveedorPedidoConfirmar from "./pages/Admin/Proveedor/Confirmar/ProveedorPedidoConfirmar";
import ProveedorConfirmarDevolucion from "./pages/Admin/Proveedor/ConfirmarDevolucion/ProveedorConfirmarDevolucion";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "admin",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Inicio",
        path: "/inicio",
        element: <Inicio />,
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
        icon: <InboxArrowDownIcon {...icon} />,
        name: "proveedores",
        path: "/proveedores",
        element: <AdminProveedor />,
      },
      {
        icon: "",
        name: "proveedores",
        path: "/proveedores/pedidos",
        element: <ProveedorPedidos />,
      },

      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/:id/pedido",
        element: <Compra />,
      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/:id/pedido/:idPedido/confirmar",
        element: <ProveedorPedidoConfirmar />,
      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/:id/pedido/:idPedido/confirmar/devolucion",
        element: <ProveedorConfirmarDevolucion />,
      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/productos/:id",
        element: <ProductoProveedor />,
      },
    ],
  },
  {
    layout: "estampador",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "inicio",
        path: "/inicio",
        element: <Home />,
      },
    ],
  },
  {
    layout: "auxiliar",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "inicio",
        path: "/inicio",
        element: <Home />,
      },
    ],
  },

  {
    layout: "almacenista",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "inicio",
        path: "/inicio",
        element: <Home />,
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
        icon: <InboxArrowDownIcon {...icon} />,
        name: "proveedores",
        path: "/proveedores",
        element: <AdminProveedor />,
      },
      {
        icon: "",
        name: "proveedores",
        path: "/proveedores/pedidos",
        element: <ProveedorPedidos />,
      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/:id/pedido",
        element: <Compra />,
      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/:id/pedido/:idPedido/confirmar",
        element: <ProveedorPedidoConfirmar />,
      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/:id/pedido/:idPedido/confirmar/devolucion",
        element: <ProveedorConfirmarDevolucion />,
      },
      {
        icon: "",
        name: "proveedor",
        path: "/proveedor/productos/:id",
        element: <ProductoProveedor />,
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
        name: "productos",
        path: "/productos",
        element: <ProductGrid />,
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
