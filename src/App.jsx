import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap 5 CSS
import "./App.css";

// Páginas
import NuevoPedido from "./pages/NuevoPedido";
import EnProceso from "./pages/EnProceso";
import Listo from "./pages/Listo";
import Entregado from "./pages/Entregado";
import ProductosAdmin from "./pages/ProductosAdmin";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/nuevo" element={<NuevoPedido />} />
          <Route path="/en-proceso" element={<EnProceso />} />
          <Route path="/listo" element={<Listo />} />
          <Route path="/entregado" element={<Entregado />} />
          <Route path="/productos_admin" element={<ProductosAdmin />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
