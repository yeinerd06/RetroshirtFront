import { Routes, Route, Navigate } from "react-router-dom";
import DashboardAdmin from "./layouts/DashboardAdmin";
import DashboardAlmacenista from "./layouts/DashboardAlmacenista";
import DashboardVendendor from "./layouts/DashboardVendendor";
import { UserProvider } from "./context/UserContext";
import Inicio from "./layouts/Inicio";
import { ProductoProvider } from "./context/ProductoContext";
import DashboardEstampador from "./layouts/DashboardEstampador";
import DashboardAuxiliar from "./layouts/DashboardAuxiliar";
import { ProveedorProvider } from "./context/ProveedorContext";
import { EmpresaProvider } from "./context/EmpresaContext";

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <ProveedorProvider>
            <UserProvider>
              <ProductoProvider>
                <EmpresaProvider>
                  <DashboardAdmin />
                </EmpresaProvider>
              </ProductoProvider>
            </UserProvider>
          </ProveedorProvider>
        }
      />
      <Route
        path="/almacenista/*"
        element={
          <ProveedorProvider>
            <UserProvider>
              <ProductoProvider>
                <DashboardAlmacenista />
              </ProductoProvider>
            </UserProvider>
          </ProveedorProvider>
        }
      />
      <Route
        path="/vendedor/*"
        element={
          <UserProvider>
            <DashboardVendendor />
          </UserProvider>
        }
      />
      <Route
        path="/estampador/*"
        element={
          <UserProvider>
            <DashboardEstampador />
          </UserProvider>
        }
      />
      <Route
        path="/auxiliar/*"
        element={
          <UserProvider>
            <DashboardAuxiliar />
          </UserProvider>
        }
      />

      <Route
        path="/inicio/*"
        element={
          <UserProvider>
            <Inicio />
          </UserProvider>
        }
      />
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}

export default App;
