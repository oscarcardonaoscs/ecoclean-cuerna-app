import React from "react";
import { Trash } from "react-bootstrap-icons";

const Secciones = () => {
  const secciones = ["Tintorería", "Lavandería", "Planchado"];

  return (
    <div className="card shadow">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">Editar Secciones</h6>
        <button className="btn btn-sm btn-outline-primary">
          Agregar Sección
        </button>
      </div>
      <div className="card-body">
        <div className="row font-weight-bold border-bottom pb-2 mb-2">
          <div className="col-10">Nombre</div>
          <div className="col-2">Eliminar</div>
        </div>

        {secciones.map((nombre, index) => (
          <div
            key={index}
            className="row align-items-center py-2 border-bottom"
          >
            <div className="col-10">{nombre}</div>
            <div className="col-2">
              <Trash style={{ cursor: "pointer" }} className="text-danger" />
            </div>
          </div>
        ))}

        <div className="text-end mt-4">
          <button className="btn btn-primary btn-sm">Actualizar</button>
        </div>
      </div>
    </div>
  );
};

export default Secciones;
