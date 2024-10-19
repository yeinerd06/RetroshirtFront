import { Routes, Route } from "react-router-dom";
import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController,  } from "@/context";
import { useUserContext } from "@/context/UserContext";
import LayoutRoutes from "@/Components/LayoutRoutes/LayoutRoutes";

const  DashboardAdmin=()=> {
  const {modulo}=useUserContext()
  const [controller, ] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-64">
        <DashboardNavbar />
       <LayoutRoutes>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === modulo &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        </LayoutRoutes>
        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
    </div>
  );
}


export default DashboardAdmin;
