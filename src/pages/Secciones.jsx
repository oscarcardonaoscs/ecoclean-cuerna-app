import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Trash, X } from "react-bootstrap-icons";

const Secciones = () => {
  const [secciones, setSecciones] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [nuevaSeccion, setNuevaSeccion] = useState("");

  // Estados para la confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Función para obtener las secciones desde el backend
  const fetchSecciones = async () => {
    try {
      const response = await fetch("http://localhost:8000/secciones/");
      if (response.ok) {
        const data = await response.json();
        setSecciones(data);
      } else {
        console.error("Error al obtener las secciones:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la conexión al backend:", error);
    }
  };

  // Obtener las secciones al montar el componente
  useEffect(() => {
    fetchSecciones();
  }, []);

  // Función para agregar la sección a través del endpoint del backend
  const handleAgregar = async () => {
    if (nuevaSeccion.trim()) {
      try {
        const response = await fetch("http://localhost:8000/secciones/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre: nuevaSeccion }),
        });

        if (response.ok) {
          const data = await response.json();
          // Se espera que el backend retorne el objeto creado, ej: { id, nombre }
          setSecciones([...secciones, data]);
          setNuevaSeccion("");
          setShowAddModal(false);
        } else {
          console.error("Error al agregar la sección:", response.statusText);
        }
      } catch (error) {
        console.error("Error en la conexión al backend:", error);
      }
    }
  };

  // Función que prepara la eliminación: guarda el id y muestra el modal de confirmación
  const confirmarEliminar = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Función que elimina la sección seleccionada
  const handleEliminar = async () => {
    if (deleteId !== null) {
      try {
        // Realiza la petición DELETE al backend (suponiendo que este endpoint existe)
        const response = await fetch(
          `http://localhost:8000/secciones/${deleteId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Actualiza el estado removiendo la sección eliminada
          const nuevasSecciones = secciones.filter(
            (seccion) => seccion.id !== deleteId
          );
          setSecciones(nuevasSecciones);
        } else {
          console.error("Error al eliminar la sección:", response.statusText);
        }
      } catch (error) {
        console.error("Error en la conexión al backend:", error);
      }
      setDeleteId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="card shadow">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold text-primary">
            Editar Secciones
          </h6>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowAddModal(true)}
          >
            Agregar Sección
          </button>
        </div>
        <div className="card-body">
          <div className="row font-weight-bold border-bottom pb-2 mb-2">
            <div className="col-10">Nombre</div>
            <div className="col-2">Eliminar</div>
          </div>

          {secciones.map((seccion) => (
            <div
              key={seccion.id}
              className="row align-items-center py-2 border-bottom"
            >
              <div className="col-10">{seccion.nombre}</div>
              <div className="col-2">
                <Trash
                  style={{ cursor: "pointer" }}
                  className="text-danger"
                  onClick={() => confirmarEliminar(seccion.id)}
                />
              </div>
            </div>
          ))}

          <div className="text-end mt-4">
            {/* Botón Actualizar que vuelve a consultar las secciones */}
            <button className="btn btn-primary btn-sm" onClick={fetchSecciones}>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Modal para agregar una nueva sección */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header>
          <Modal.Title>Agregar Sección</Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => setShowAddModal(false)}
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
            <Form.Group controlId="nuevaSeccion">
              <Form.Label>Nombre de la Sección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la sección"
                value={nuevaSeccion}
                onChange={(e) => setNuevaSeccion(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAgregar}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para eliminar una sección */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => setShowDeleteModal(false)}
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
          <p>
            ¿Está seguro de que desea eliminar esta sección? Esto desactivará
            todos los productos en esta sección.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Secciones;
