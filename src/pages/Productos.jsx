import React, { useState } from "react";
import { Table, Button, Nav } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Productos = () => {
  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState("Tintorería");

  // Datos de productos por sección
  const productosPorSeccion = {
    Tintorería: [
      {
        producto: "Blusa",
        precio: 5.0,
        precioExpress: 6.0,
        tipo: "Pieza",
        activo: true,
      },
      {
        producto: "Camisa",
        precio: 6.0,
        precioExpress: 6.0,
        tipo: "Peso",
        activo: true,
      },
    ],
    Lavandería: [
      {
        producto: "Pantalón",
        precio: 4.0,
        precioExpress: 5.0,
        tipo: "Pieza",
        activo: true,
      },
      {
        producto: "Chaqueta",
        precio: 7.0,
        precioExpress: 8.0,
        tipo: "Pieza",
        activo: true,
      },
    ],
    Planchado: [
      {
        producto: "Sábanas",
        precio: 3.0,
        precioExpress: 4.0,
        tipo: "Pieza",
        activo: true,
      },
      {
        producto: "Toalla",
        precio: 2.5,
        precioExpress: 3.5,
        tipo: "Pieza",
        activo: true,
      },
    ],
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddProduct = () => {
    alert("Agregar Producto");
  };

  const productosSeleccionados = productosPorSeccion[selectedCategory];

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Productos</h1>
        <Button variant="primary" className="btn-sm" onClick={handleAddProduct}>
          <i className="fas fa-plus"></i> Agregar Producto
        </Button>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <Nav
            variant="tabs"
            defaultActiveKey="Tintorería"
            className="nav-tabs-custom"
          >
            <Nav.Item>
              <Nav.Link
                eventKey="Tintorería"
                onClick={() => handleCategoryChange("Tintorería")}
                active={selectedCategory === "Tintorería"}
              >
                Tintorería
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="Lavandería"
                onClick={() => handleCategoryChange("Lavandería")}
                active={selectedCategory === "Lavandería"}
              >
                Lavandería
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="Planchado"
                onClick={() => handleCategoryChange("Planchado")}
                active={selectedCategory === "Planchado"}
              >
                Planchado
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <div className="card-body">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Precio Express</th>
                <th>Tipo</th>
                <th>Activo</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {productosSeleccionados.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.producto}</td>
                  <td>{producto.precio.toFixed(2)}</td>
                  <td>{producto.precioExpress.toFixed(2)}</td>
                  <td>{producto.tipo}</td>
                  <td>{producto.activo ? "Sí" : "No"}</td>
                  <td>
                    <Button variant="warning" size="sm">
                      <FaEdit /> Editar
                    </Button>
                  </td>
                  <td>
                    <Button variant="danger" size="sm">
                      <FaTrashAlt /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Productos;
