import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AgregarProductoModal = ({
  show,
  handleClose,
  producto,
  onAdd,
  editarItem,
}) => {
  const [usarPreferencial, setUsarPreferencial] = useState(false);
  const [precio, setPrecio] = useState(producto?.precio || 0);
  const [cantidad, setCantidad] = useState(1);

  /* reinicia cuando cambie el producto */
  useEffect(() => {
    if (producto) {
      setUsarPreferencial(editarItem?.usarPreferencial || false);
      setPrecio(editarItem?.precio || producto.precio);
      setCantidad(editarItem?.piezas || 1);
    }
  }, [producto, editarItem]);

  const handleAgregar = (e) => {
    e.preventDefault(); // evita recarga
    if (cantidad < 1) return alert("La cantidad debe ser 1 o mayor");

    onAdd({
      id: producto.id,
      piezas: cantidad,
      nombre: producto.nombre,
      precio,
      usarPreferencial,
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar producto</Modal.Title>
      </Modal.Header>

      {/* ----- FORMULARIO COMPLETO ----- */}
      <Form onSubmit={handleAgregar}>
        <Modal.Body>
          <h5>{producto?.nombre}</h5>

          <Form.Check
            type="checkbox"
            label="Precio preferencial"
            checked={usarPreferencial}
            onChange={(e) => setUsarPreferencial(e.target.checked)}
            className="my-3"
          />

          <Form.Group className="mb-3">
            <Form.Label>Precio:</Form.Label>
            <Form.Control
              type="number"
              value={precio ?? 0}
              disabled={!usarPreferencial}
              min={0}
              step="0.01"
              onChange={(e) => setPrecio(parseFloat(e.target.value))}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Cantidad | KGs:</Form.Label>
            <Form.Control
              type="number"
              value={cantidad ?? 1}
              min={1}
              step={1}
              onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>

          {/* type="submit" dispara handleAgregar con Enter o clic */}
          <Button variant="primary" type="submit">
            Agregar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AgregarProductoModal;
