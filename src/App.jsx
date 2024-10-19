import { Routes, Route, Navigate } from "react-router-dom";
import DashboardAdmin from "./layouts/DashboardAdmin";
import DashboardAlmacenista from "./layouts/DashboardAlmacenista";
import DashboardVendendor from "./layouts/DashboardVendendor";
import { UserProvider } from "./context/UserContext";
import Inicio from "./layouts/Inicio";

function App() {
  return (
    <Routes>
      
        <Route path="/admin/*" element={  <UserProvider><DashboardAdmin /></UserProvider> } />
        <Route path="/almacenista/*" element={ <UserProvider><DashboardAlmacenista /></UserProvider>} />
        <Route path="/vendedor/*" element={<UserProvider><DashboardVendendor /></UserProvider>} />
      

        <Route path="/inicio/*" element={<Inicio />} />
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}

export default App;
