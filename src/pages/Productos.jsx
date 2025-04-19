import React, { useState, useEffect } from "react";
import { Table, Button, Nav, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { X, Check } from "react-bootstrap-icons";

const Productos = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [productos, setProductos] = useState([]); // Lista de productos filtrados por sección

  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    precio: "",
    precioExpress: "",
    tipo: "Peso",
    seccionId: "",
  });

  // Obtener las secciones del backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/secciones")
      .then((response) => {
        const seccionesData = response.data;
        seccionesData.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setSecciones(seccionesData);

        if (seccionesData.length > 0) {
          const firstSeccionId = seccionesData[0].id;
          setSelectedCategory(firstSeccionId);
          fetchProductos(firstSeccionId); // Obtener los productos de la primera sección
        }
      })
      .catch((error) => {
        console.error("Hubo un error al obtener las secciones:", error);
      });
  }, []);

  // Obtener los productos activos de la sección seleccionada
  const fetchProductos = (seccionId) => {
    axios
      .get(
        `http://localhost:8000/productos/?seccion_id=${seccionId}&activo=true`
      ) // Filtrar por sección y productos activos
      .then((response) => {
        setProductos(response.data); // Actualizar el estado de productos
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  };

  // Función que maneja el cambio de sección
  const handleCategoryChange = (seccionId) => {
    setSelectedCategory(seccionId); // Establecer la nueva categoría seleccionada
    setNewProduct((prev) => ({
      ...prev,
      seccionId: seccionId,
    }));
    fetchProductos(seccionId); // Llamar a fetchProductos para actualizar los productos según la sección
  };

  const handleAddProduct = () => {
    // Limpiar el estado de newProduct cuando se abre el modal
    setNewProduct({
      nombre: "",
      precio: "",
      precioExpress: "",
      tipo: "Peso",
      seccionId: "",
    });
    setShowModal(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgregarProducto = () => {
    const productToAdd = {
      ...newProduct,
      seccion_id: newProduct.seccionId,
    };

    axios
      .post("http://localhost:8000/productos/", productToAdd)
      .then((response) => {
        alert("Producto agregado con éxito!");
        setShowModal(false);
        fetchProductos(selectedCategory); // Actualiza los productos de la sección seleccionada
      })
      .catch((error) => {
        console.error("Hubo un error al agregar el producto:", error);
      });
  };

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
            defaultActiveKey={selectedCategory}
            className="nav-tabs-custom"
          >
            {secciones.map((seccion) => (
              <Nav.Item key={seccion.id}>
                <Nav.Link
                  eventKey={seccion.id}
                  onClick={() => handleCategoryChange(seccion.id)}
                  active={selectedCategory === seccion.id}
                >
                  {seccion.nombre}
                </Nav.Link>
              </Nav.Item>
            ))}
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
              {productos.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.nombre}</td>
                  <td>{producto.precio.toFixed(2)}</td>
                  <td>{producto.precioExpress.toFixed(2)}</td>
                  <td>{producto.tipo}</td>
                  <td>
                    {producto.esActivo ? (
                      <Check color="green" /> // Icono de check para activo
                    ) : (
                      <X color="red" /> // Icono de X para inactivo
                    )}
                  </td>
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

      {/* Modal para agregar un producto */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Agregar Producto</Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={handleCloseModal}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
              color: "#000",
            }}
          >
            <X />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del producto"
                name="nombre"
                value={newProduct.nombre}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formPrecio" className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Ingrese el precio"
                name="precio"
                value={newProduct.precio}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formPrecioExpress" className="mb-3">
              <Form.Label>Precio Express</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Ingrese el precio express"
                name="precioExpress"
                value={newProduct.precioExpress}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formTipo" className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                as="select"
                name="tipo"
                value={newProduct.tipo}
                onChange={handleInputChange}
              >
                <option value="Peso">Peso</option>
                <option value="Pieza">Pieza</option>
              </Form.Control>
            </Form.Group>

            {/* Dropdown de Secciones */}
            <Form.Group controlId="formSeccion" className="mb-3">
              <Form.Label>Sección</Form.Label>
              <Form.Control
                as="select"
                name="seccionId"
                value={newProduct.seccionId}
                onChange={handleInputChange}
              >
                <option value="">--Seleccionar sección--</option>
                {secciones.map((seccion) => (
                  <option key={seccion.id} value={seccion.id}>
                    {seccion.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAgregarProducto}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Productos;
