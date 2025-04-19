import React, { useState, useEffect } from "react";
import {
  Accordion,
  Card,
  Button,
  Form,
  InputGroup,
  Dropdown,
  Nav,
} from "react-bootstrap";
import { Search, Plus, Clock } from "react-bootstrap-icons";
import axios from "axios";
import AgregarClienteModal from "./AgregarClienteModal"; // Asegúrate de importar el modal
import "./NuevoPedido.css"; // Asegúrate de importar el archivo CSS en tu componente

const NuevoPedido = () => {
  const [selectedSeccion, setSelectedSeccion] = useState("");
  const [cliente, setCliente] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para el Modal

  // Función para obtener las secciones desde la base de datos (API)
  const fetchSecciones = async () => {
    try {
      const response = await axios.get("http://localhost:8000/secciones/");
      setSecciones(response.data);
    } catch (error) {
      console.error("Error al obtener las secciones:", error);
    }
  };

  // Función para obtener los productos por sección (y activos)
  const fetchProductos = (seccionId) => {
    axios
      .get(
        `http://localhost:8000/productos/?seccion_id=${seccionId}&activo=true`
      )
      .then((response) => {
        setProductos(response.data); // Actualiza el estado de productos
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  };

  // Llamada a la API cuando el componente se monta
  useEffect(() => {
    fetchSecciones();
  }, []);

  // Efecto para obtener productos cuando se selecciona una sección
  useEffect(() => {
    if (selectedSeccion) {
      fetchProductos(selectedSeccion); // Obtener productos cuando cambia la sección
    }
  }, [selectedSeccion]);

  const handleSeccionChange = (id) => {
    setSelectedSeccion(id);
  };

  // Manejar el evento de abrir el modal
  const handleOpenModal = () => setShowModal(true);

  // Manejar el evento de cerrar el modal
  const handleCloseModal = () => setShowModal(false);

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

        {/* Mostrar productos en tarjetas - Estilo Grid */}
        <div className="productos-cards">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <Card
                key={producto.id}
                style={{ width: "100%", marginBottom: "10px" }} // Ajusta el margen de cada tarjeta
              >
                {/* Si no hay imagen, usar una imagen predeterminada */}
                <Card.Img
                  variant="top"
                  src={producto.imagen || "/path/to/default-image.jpg"}
                />
                <Card.Body>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Text>Precio: ${producto.precio}</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No hay productos disponibles para esta sección.</p>
          )}
        </div>
      </div>

      {/* Parte Derecha */}
      <div className="right-section" style={{ width: "30%" }}>
        <Accordion defaultActiveKey="0">
          {/* Sección Cliente */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>Seleccionar Cliente</Accordion.Header>
            <Accordion.Body>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar Cliente"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={handleOpenModal} // Abre el modal al hacer clic
                >
                  <Plus />
                </Button>
              </InputGroup>
              <div className="mt-3">
                <label>Fecha de Hoy</label>
                <InputGroup>
                  <Form.Control
                    type="date"
                    value={new Date().toISOString().split("T")[0]}
                    readOnly
                  />
                  <Button variant="outline-secondary">
                    <Clock />
                  </Button>
                </InputGroup>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* Sección Pago */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>Configurar Pago</Accordion.Header>
            <Accordion.Body>
              <Form>
                <Form.Group controlId="formaPago">
                  <Form.Label>Forma de Pago</Form.Label>
                  <Dropdown onSelect={(e) => setFormaPago(e)}>
                    <Dropdown.Toggle variant="outline-primary">
                      {formaPago || "Seleccionar Forma de Pago"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Efectivo">
                        Efectivo
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Tarjeta">Tarjeta</Dropdown.Item>
                      <Dropdown.Item eventKey="Transferencia">
                        Transferencia
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>

                <Form.Group controlId="subtotal">
                  <Form.Label>Subtotal</Form.Label>
                  <Form.Control type="number" value="100" readOnly />
                </Form.Group>

                <Form.Group controlId="descuento">
                  <Form.Label>Descuento</Form.Label>
                  <Form.Control type="number" value="0" readOnly />
                </Form.Group>

                <Form.Group controlId="costoEnvio">
                  <Form.Label>Costo de Envío</Form.Label>
                  <Form.Control type="number" value="0" readOnly />
                </Form.Group>

                <Form.Group controlId="impuesto">
                  <Form.Label>Impuesto</Form.Label>
                  <Form.Control type="number" value="0" readOnly />
                </Form.Group>

                <Form.Group controlId="total">
                  <Form.Label>Total</Form.Label>
                  <Form.Control type="number" value="100" readOnly />
                </Form.Group>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Modal de Agregar Cliente */}
      <AgregarClienteModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

// Estilo para las tarjetas de productos en un grid
const styles = {
  productosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", // Ajusta la cantidad de productos por fila
    gap: "20px",
  },
};

export default NuevoPedido;
