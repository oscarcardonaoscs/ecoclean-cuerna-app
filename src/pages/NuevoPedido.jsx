import React, { useState, useEffect } from "react";
import {
  Accordion,
  Card,
  Button,
  Form,
  InputGroup,
  Nav,
  ListGroup,
} from "react-bootstrap";
import { Plus, Clock, X, Pencil } from "react-bootstrap-icons";
import axios from "axios";
import AgregarClienteModal from "./AgregarClienteModal";
import "./NuevoPedido.css";

const NuevoPedido = () => {
  /* ─────────── estados principales ─────────── */
  const [selectedSeccion, setSelectedSeccion] = useState("");
  const [cliente, setCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [formaPago, setFormaPago] = useState("");

  const [secciones, setSecciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  /* ─────────── utilidades API ─────────── */
  const fetchSecciones = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/secciones/");
      setSecciones(data);
    } catch (err) {
      console.error("Error al obtener secciones", err);
    }
  };

  const fetchProductos = (seccionId) => {
    axios
      .get(
        `http://localhost:8000/productos/?seccion_id=${seccionId}&activo=true`
      )
      .then(({ data }) => setProductos(data))
      .catch((err) => console.error("Error productos", err));
  };

  const buscarClientes = async (texto) => {
    try {
      const { data } = await axios.get("http://localhost:8000/clientes/", {
        params: { search: texto },
      });
      setClientesEncontrados(data);
    } catch (err) {
      console.error("Error al buscar clientes", err);
    }
  };

  /* ─────────── efectos ─────────── */
  useEffect(() => {
    // Llamamos a la función async aquí dentro
    fetchSecciones();
  }, []); // <- solo al montar

  useEffect(() => {
    if (selectedSeccion) fetchProductos(selectedSeccion);
  }, [selectedSeccion]);

  // Buscador: solo busca si NO hay cliente elegido
  useEffect(() => {
    if (clienteSeleccionado) {
      setClientesEncontrados([]);
      return;
    }
    if (cliente.trim()) {
      buscarClientes(cliente);
    } else {
      setClientesEncontrados([]);
    }
  }, [cliente, clienteSeleccionado]);

  /* ─────────── handlers ─────────── */
  const handleInputChange = (e) => {
    setCliente(e.target.value);
    setClienteSeleccionado(null); // al teclear se anula la selección
  };

  const handleSelectCliente = (cli) => {
    setCliente(cli.nombre);
    setClienteSeleccionado(cli);
    setClientesEncontrados([]); // ocultar lista
  };

  const handleClearCliente = () => {
    setCliente("");
    setClienteSeleccionado(null);
    setClientesEncontrados([]);
  };

  /* ─────────── UI ─────────── */
  return (
    <div className="container-fluid d-flex">
      {/* IZQUIERDA */}
      <div className="left-section" style={{ width: "70%" }}>
        <Nav variant="tabs" defaultActiveKey={selectedSeccion}>
          {secciones.map((s) => (
            <Nav.Item key={s.id}>
              <Nav.Link
                eventKey={s.id}
                onClick={() => setSelectedSeccion(s.id)}
                active={selectedSeccion === s.id}
              >
                {s.nombre}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <div className="productos-cards">
          {productos.length ? (
            productos.map((p) => (
              <Card key={p.id} className="mb-2">
                <Card.Img
                  variant="top"
                  src={p.imagen || "/path/to/default-image.jpg"}
                />
                <Card.Body>
                  <Card.Title>{p.nombre}</Card.Title>
                  <Card.Text>Precio: ${p.precio}</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </div>

      {/* DERECHA */}
      <div className="right-section" style={{ width: "30%" }}>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Seleccionar Cliente</Accordion.Header>
            <Accordion.Body>
              <InputGroup className="mb-2">
                {/* input de búsqueda */}
                <Form.Control
                  placeholder="Buscar cliente"
                  value={cliente}
                  onChange={handleInputChange}
                />

                {/* Botón X (solo si hay texto) */}
                {cliente && (
                  <Button
                    variant="outline-danger"
                    onClick={handleClearCliente}
                    className="ms-1"
                  >
                    <X />
                  </Button>
                )}

                {/* Botón +  ó  lápiz, según haya o no cliente elegido */}
                {clienteSeleccionado ? (
                  // ───── hay cliente → mostrar lápiz (editar)
                  <Button
                    variant="outline-primary"
                    onClick={() => alert("Editar cliente")}
                    className="ms-1"
                  >
                    <Pencil />
                  </Button>
                ) : (
                  // ───── no hay cliente → mostrar +
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowModal(true)}
                    className="ms-1"
                  >
                    <Plus />
                  </Button>
                )}
              </InputGroup>

              {/* Lista solo si NO hay cliente elegido */}
              {!clienteSeleccionado && clientesEncontrados.length > 0 && (
                <ListGroup>
                  {clientesEncontrados.map((c) => (
                    <ListGroup.Item
                      key={c.id}
                      action
                      onClick={() => handleSelectCliente(c)}
                    >
                      {c.nombre}, {c.email}, {c.telefono}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              <div className="mt-3">
                <label>Fecha de hoy</label>
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

          <Accordion.Item eventKey="1">
            <Accordion.Header>Configurar Pago</Accordion.Header>
            <Accordion.Body>{/* ...contenidos de pago... */}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* MODAL */}
      <AgregarClienteModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default NuevoPedido;
