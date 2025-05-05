// PanelPedidoConfig.jsx – con DatePicker restringido a horarios válidos
import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  ListGroup,
  Accordion,
} from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PanelPedidoConfig = ({
  cliente,
  clienteSeleccionado,
  clientesEncontrados,
  onInputChange,
  onSelectCliente,
  onClearCliente,
  onAbrirAgregarCliente,
  itemsOrden,
  onEditar,
  onEliminar,
  onReset,
  onFinalizarVenta,
  fechaEntrega,
  setFechaEntrega,
  horaEntrega,
  setHoraEntrega,
  express,
  setExpress,
  nota,
  setNota,
  formaPago,
  setFormaPago,
  montoPagado,
  setMontoPagado,
  montoRecibido,
  setMontoRecibido,
}) => {
  const totalConIva = itemsOrden.reduce(
    (acc, it) => acc + it.piezas * it.precio,
    0
  );
  const subtotal = totalConIva / 1.16;
  const iva = totalConIva - subtotal;
  const total = totalConIva;

  const generarHorasPermitidas = () => {
    const lista = [];
    const dia = fechaEntrega.getDay();
    const horaInicio = dia === 6 ? 9 : 8;
    const horaFin = dia === 6 ? 16 : 18;
    const baseDate = new Date(0, 0, 0);

    for (let h = horaInicio; h < horaFin; h++) {
      for (let m = 0; m < 60; m += 15) {
        const time = new Date(baseDate);
        time.setHours(h);
        time.setMinutes(m);
        lista.push(time);
      }
    }
    return lista;
  };

  return (
    <div
      className="right-panel d-flex flex-column bg-white shadow rounded"
      style={{ height: "100vh", overflow: "hidden", padding: "1rem" }}
    >
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <div className="mb-3">
          <InputGroup className="mb-2 w-100">
            <Form.Control
              placeholder="Buscar cliente"
              className="form-control form-control-user"
              value={cliente}
              onChange={onInputChange}
            />
            {cliente && (
              <Button className="btn btn-danger" onClick={onClearCliente}>
                <i className="fas fa-times"></i>
              </Button>
            )}
            {clienteSeleccionado ? (
              <Button
                className="btn btn-primary"
                onClick={() => alert("Editar cliente")}
              >
                {" "}
                <i className="fas fa-pen"></i>{" "}
              </Button>
            ) : (
              <Button
                className="btn btn-secondary"
                onClick={onAbrirAgregarCliente}
              >
                {" "}
                <Plus />{" "}
              </Button>
            )}
          </InputGroup>

          {!clienteSeleccionado && clientesEncontrados.length > 0 && (
            <ListGroup>
              {clientesEncontrados.map((c) => (
                <ListGroup.Item
                  key={c.id}
                  action
                  onClick={() => onSelectCliente(c)}
                >
                  {c.nombre}, {c.email}, {c.telefono}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
        <Row className="align-items-end mb-3 gx-2">
          <Col xs={6}>
            <Form.Label className="small text-gray-600 mb-1">
              Fecha de entrega
            </Form.Label>
            <DatePicker
              selected={fechaEntrega}
              onChange={(date) => setFechaEntrega(date)}
              className="form-control form-control-user"
              portalId="root"
            />
          </Col>
          <Col xs={4}>
            <Form.Label className="small text-gray-600 mb-1">
              Hora de entrega
            </Form.Label>
            <DatePicker
              selected={horaEntrega}
              onChange={(date) => setHoraEntrega(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Hora"
              dateFormat="HH:mm"
              includeTimes={generarHorasPermitidas()}
              className="form-control form-control-user"
            />
          </Col>
          <Col xs={2} className="text-end">
            <Form.Label className="small text-gray-600 mb-1">
              Express
            </Form.Label>
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="expressSwitch"
                checked={express}
                onChange={() => setExpress(!express)}
              />
              <label className="custom-control-label" htmlFor="expressSwitch">
                {express ? "Sí" : "No"}
              </label>
            </div>
          </Col>
        </Row>

        <div className="mb-3 border rounded">
          <div className="d-flex fw-bold text-gray-700 small py-2 text-center border-bottom bg-light">
            <div style={{ width: "15%" }}>Cant.</div>
            <div style={{ width: "50%" }}>Producto</div>
            <div style={{ width: "15%" }}>Importe</div>
            <div style={{ width: "10%" }}></div>
            <div style={{ width: "10%" }}></div>
          </div>

          <div
            className="flex-grow-1 overflow-auto"
            style={{ maxHeight: "300px" }}
          >
            {itemsOrden.map((item) => (
              <div
                key={item.rowId}
                className="d-flex text-center py-1 border-bottom align-items-center small"
              >
                <div style={{ width: "15%" }}>{item.piezas}</div>
                <div style={{ width: "50%" }} className="text-start">
                  {item.nombre}
                </div>
                <div style={{ width: "15%" }}>
                  ${(item.piezas * item.precio).toFixed(2)}
                </div>
                <div style={{ width: "10%" }} className="text-center">
                  <Button
                    className="btn btn-primary btn-circle btn-sm"
                    onClick={() =>
                      onEditar({ id: item.id, nombre: item.nombre }, item)
                    }
                  >
                    <i className="fas fa-pen"></i>
                  </Button>
                </div>
                <div style={{ width: "10%" }} className="text-center">
                  <Button
                    className="btn btn-danger btn-circle btn-sm"
                    onClick={() => onEliminar(item.rowId)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center border-top bg-white">
            <Button
              className="btn btn-link text-danger small"
              onClick={onReset}
            >
              Limpiar pedido
            </Button>
          </div>
        </div>

        <div className="small mb-3 text-center text-gray-800">
          <div>Productos: {itemsOrden.length}</div>
          <div>Subtotal (sin IVA): ${subtotal.toFixed(2)}</div>
          <div>Descuento: $0.00</div>
          <div>IVA (16%): ${iva.toFixed(2)}</div>
          <div className="fw-bold">Total a pagar: ${total.toFixed(2)}</div>
        </div>

        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>PAGO</Accordion.Header>
            <Accordion.Body>
              <Row className="mb-2 align-items-center">
                <Col xs={5}>
                  <Form.Label className="small text-gray-600">
                    Forma de pago:
                  </Form.Label>
                </Col>
                <Col xs={7}>
                  <Form.Select
                    value={formaPago}
                    onChange={(e) => setFormaPago(e.target.value)}
                    className="form-control form-control-user"
                  >
                    <option value="">Selecciona</option>
                    <option>Efectivo</option>
                    <option>Tarjeta de Crédito</option>
                    <option>Tarjeta de Débito</option>
                    <option>Transferencia</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mb-2 align-items-center">
                <Col xs={5}>
                  <Form.Label className="small text-gray-600">
                    Adelanto:
                  </Form.Label>
                </Col>
                <Col xs={7}>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={montoPagado}
                      onChange={(e) =>
                        setMontoPagado(parseFloat(e.target.value) || 0)
                      }
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row className="mb-2 align-items-center">
                <Col xs={5}>
                  <Form.Label className="small text-gray-600">
                    Recibido:
                  </Form.Label>
                </Col>
                <Col xs={7}>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={montoRecibido}
                      onChange={(e) =>
                        setMontoRecibido(parseFloat(e.target.value) || 0)
                      }
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row className="mb-2 align-items-center">
                <Col xs={5}>
                  <Form.Label className="small text-gray-600">
                    Cambio:
                  </Form.Label>
                </Col>
                <Col xs={7}>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={Math.max(montoRecibido - montoPagado, 0).toFixed(
                        2
                      )}
                      readOnly
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>NOTAS</Accordion.Header>
            <Accordion.Body>
              <Row className="g-2 mb-3">
                <Col xs={12}>
                  <Form.Label className="small text-gray-600">
                    Notas:
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    className="form-control form-control-user"
                  />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Button
          className="btn btn-primary btn-user btn-block w-100"
          onClick={onFinalizarVenta}
        >
          Finalizar venta
        </Button>
      </div>
    </div>
  );
};

export default PanelPedidoConfig;
