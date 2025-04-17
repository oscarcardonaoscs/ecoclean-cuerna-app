import React, { useState } from "react";
import { Nav } from "react-bootstrap";

const NuevoPedido = () => {
  const [selectedSeccion, setSelectedSeccion] = useState("");
  const secciones = [
    { id: 1, nombre: "Tintorería" },
    { id: 2, nombre: "Lavandería" },
    { id: 3, nombre: "Planchado" },
  ]; // Ejemplo de secciones

  const handleSeccionChange = (id) => {
    setSelectedSeccion(id);
  };

  return (
    <div className="container-fluid d-flex">
      {/* Parte Izquierda */}
      <div className="left-section" style={{ width: "70%" }}>
        <div className="navbar">
          <Nav
            variant="tabs"
            defaultActiveKey={selectedSeccion}
            className="nav-tabs-custom"
          >
            {secciones.map((seccion) => (
              <Nav.Item key={seccion.id}>
                <Nav.Link
                  eventKey={seccion.id}
                  onClick={() => handleSeccionChange(seccion.id)}
                  active={selectedSeccion === seccion.id}
                >
                  {seccion.nombre}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
      </div>

      {/* Parte Derecha */}
      <div className="right-section" style={{ width: "30%" }}>
        {/* Aquí puedes colocar la funcionalidad del Acordeón */}
      </div>
    </div>
  );
};

export default NuevoPedido;
