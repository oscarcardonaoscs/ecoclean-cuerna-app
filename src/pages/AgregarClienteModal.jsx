import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import axios from "axios";

const AgregarClienteModal = ({ show, handleClose }) => {
  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    email: "",
    notas: "",
    tipoPago: "Efectivo",
    requiereFactura: false,
    razonSocial: "",
    rfc: "",
    calle: "",
    numeroExterior: "",
    numeroInterior: "",
    colonia: "",
    municipio: "",
    estado: "",
    codigoPostal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = () => {
    setCliente((prev) => ({
      ...prev,
      requiereFactura: !prev.requiereFactura,
    }));
  };

  // Función para enviar los datos del cliente al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/clientes/",
        cliente
      );
      console.log("Cliente creado:", response.data);
      handleClose(); // Cerrar el modal después de guardar el cliente
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
    }
  };

  // Limpiar los datos del cliente cuando el modal se cierre
  useEffect(() => {
    if (!show) {
      setCliente({
        nombre: "",
        telefono: "",
        email: "",
        notas: "",
        tipo_pago: "Efectivo",
        requiereFactura: false,
        razonSocial: "",
        rfc: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        colonia: "",
        municipio: "",
        estado: "",
        codigoPostal: "",
      });
    }
  }, [show]); // Este useEffect se ejecuta cuando el estado 'show' cambia

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Agregar Cliente</Modal.Title>
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={handleClose}
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
        <Form onSubmit={handleSubmit}>
          {/* Datos del Cliente */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              required
              className="form-control-user"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Teléfono"
              name="telefono"
              value={cliente.telefono}
              onChange={handleChange}
              required
              className="form-control-user"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={cliente.email}
              onChange={handleChange}
              required
              className="form-control-user"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Pago</Form.Label>
            <Form.Control
              as="select"
              name="tipo_pago"
              value={cliente.tipo_pago}
              onChange={handleChange}
              className="form-control-user"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta de crédito">Tarjeta de crédito</option>
              <option value="Tarjeta de débito">Tarjeta de débito</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notas</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Notas"
              name="notas"
              value={cliente.notas}
              onChange={handleChange}
              className="form-control-user"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Requiere Factura</Form.Label>
            {/* Switch para controlar el estado */}
            <Form.Check
              type="switch"
              id="requiereFacturaSwitch"
              checked={cliente.requiereFactura} // Estado del switch
              onChange={handleSwitchChange} // Cambiar el estado cuando se hace click
              style={{ marginTop: "-10px", marginBottom: "30px" }}
            />
          </Form.Group>
          {/* Mostrar la línea solo si "requiereFactura" es true */}
          {cliente.requiereFactura && <div className="border-top mb-3"></div>}

          {/* Sección de CFDI (Solo visible si "requiereFactura" es verdadero) */}
          {cliente.requiereFactura && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Razón Social</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Razón Social"
                  name="razonSocial"
                  value={cliente.razonSocial}
                  onChange={handleChange}
                  className="form-control-user"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>RFC</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="RFC"
                  name="rfc"
                  value={cliente.rfc}
                  onChange={handleChange}
                  className="form-control-user"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Calle"
                  name="calle"
                  value={cliente.calle}
                  onChange={handleChange}
                  className="form-control-user"
                />
              </Form.Group>

              {/* Numeros Exterior e Interior en la misma fila */}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número Exterior</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Número Exterior"
                      name="numeroExterior"
                      value={cliente.numeroExterior}
                      onChange={handleChange}
                      className="form-control-user"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número Interior</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Número Interior"
                      name="numeroInterior"
                      value={cliente.numeroInterior}
                      onChange={handleChange}
                      className="form-control-user"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Colonia</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Colonia"
                  name="colonia"
                  value={cliente.colonia}
                  onChange={handleChange}
                  className="form-control-user"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Municipio</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Municipio"
                  name="municipio"
                  value={cliente.municipio}
                  onChange={handleChange}
                  className="form-control-user"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Estado"
                  name="estado"
                  value={cliente.estado}
                  onChange={handleChange}
                  className="form-control-user"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Código Postal</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Código Postal"
                  name="codigoPostal"
                  value={cliente.codigoPostal}
                  onChange={handleChange}
                  className="form-control-user"
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgregarClienteModal;
