import React, { useState } from "react";
import Productos from "./Productos"; // Importa el componente de productos
import Secciones from "./Secciones"; // Importa el componente de secciones
import Inventario from "./Inventario"; // Importa el componente de inventario

const ProductosAdmin = () => {
  const [selectedOption, setSelectedOption] = useState("Productos");

  return (
    <div className="container-fluid">
      {/* Título principal */}
      <h1 className="h3 mb-4 text-gray-800">Productos</h1>

      <div className="row">
        {/* Sidebar - Opciones */}
        <div className="col-md-3 mb-4">
          <div className="list-group">
            <button
              onClick={() => setSelectedOption("Productos")}
              className={`list-group-item list-group-item-action ${
                selectedOption === "Productos" ? "active" : ""
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setSelectedOption("Secciones")}
              className={`list-group-item list-group-item-action ${
                selectedOption === "Secciones" ? "active" : ""
              }`}
            >
              Secciones
            </button>
            <button
              onClick={() => setSelectedOption("Inventario")}
              className={`list-group-item list-group-item-action ${
                selectedOption === "Inventario" ? "active" : ""
              }`}
            >
              Inventario
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="col-md-9">
          {selectedOption === "Productos" && <Productos />}
          {selectedOption === "Secciones" && <Secciones />}
          {selectedOption === "Inventario" && <Inventario />}
        </div>
      </div>
    </div>
  );
};

export default ProductosAdmin;
