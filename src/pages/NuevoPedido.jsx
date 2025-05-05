// NuevoPedido.jsx
import React, { useState, useEffect } from "react";
import { Nav, Card } from "react-bootstrap";
import axios from "axios";
import AgregarClienteModal from "./AgregarClienteModal";
import AgregarProductoModal from "./AgregarProductoModal";
import PanelPedidoConfig from "../components/PanelPedidoConfig";
import "./NuevoPedido.css";

const NuevoPedido = () => {
  const [selectedSeccion, setSelectedSeccion] = useState("");
  const [cliente, setCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [formaPago, setFormaPago] = useState("");
  const [montoPagado, setMontoPagado] = useState(0);
  const [montoRecibido, setMontoRecibido] = useState(0);

  const [fechaEntrega, setFechaEntrega] = useState(new Date());
  const [horaEntrega, setHoraEntrega] = useState(new Date());
  const [express, setExpress] = useState(false);
  const [nota, setNota] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoModal, setProductoModal] = useState(null);
  const [showProdModal, setShowProdModal] = useState(false);

  const [itemsOrden, setItemsOrden] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

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

  const fechaEntregaCompleta = () => {
    const fecha = new Date(fechaEntrega);
    const hora = new Date(horaEntrega);
    fecha.setHours(hora.getHours());
    fecha.setMinutes(hora.getMinutes());
    fecha.setSeconds(0);
    return fecha;
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  useEffect(() => {
    if (selectedSeccion) fetchProductos(selectedSeccion);
  }, [selectedSeccion]);

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

  const handleInputChange = (e) => {
    setCliente(e.target.value);
    setClienteSeleccionado(null);
  };

  const handleSelectCliente = (cli) => {
    setCliente(cli.nombre);
    setClienteSeleccionado(cli);
    setClientesEncontrados([]);
  };

  const handleClearCliente = () => {
    setCliente("");
    setClienteSeleccionado(null);
    setClientesEncontrados([]);
  };

  const redondear4 = (valor) => {
    return parseFloat(valor.toFixed(4));
  };

  const calcularTotal = () => {
    return redondear4(
      itemsOrden.reduce((sum, item) => sum + item.piezas * item.precio, 0)
    );
  };

  const calcularSubtotal = () => {
    return redondear4(calcularTotal() / 1.16);
  };

  const calcularIVA = () => {
    return redondear4(calcularTotal() - calcularSubtotal());
  };

  const resetFormulario = () => {
    setCliente("");
    setClienteSeleccionado(null);
    setItemsOrden([]);
    setFormaPago("");
    setNota("");
    setExpress(false);
    setMontoPagado(0);
    setMontoRecibido(0);
    const ahora = new Date();
    const manana = new Date(ahora);
    manana.setDate(ahora.getDate() + 1);
    setFechaEntrega(manana);
    setHoraEntrega(new Date());
  };
  const handleGuardarPedido = async () => {
    try {
      if (!clienteSeleccionado) {
        alert("Debe seleccionar un cliente antes de finalizar la venta.");
        return;
      }
      if (itemsOrden.length === 0) {
        alert("Debe agregar al menos un producto al pedido.");
        return;
      }

      const pedidoPayload = {
        cliente_id: clienteSeleccionado.id,
        fecha_entrega: fechaEntregaCompleta().toISOString(),
        subtotal: calcularSubtotal(),
        descuento: 0,
        envio: 0,
        iva: calcularIVA(),
        total: calcularTotal(),
        forma_pago: formaPago || "Efectivo",
        estatus: "Pendiente",
        es_express: express,
        notas: nota || "",
        partidas: itemsOrden.map((item) => ({
          producto_id: item.id,
          cantidad: item.piezas,
          precio_unitario: item.precio,
          importe: item.piezas * item.precio,
          notas: null,
        })),
        pagos: [
          {
            forma_pago: formaPago || "Efectivo",
            monto_pagado: montoPagado,
            monto_recibido: montoRecibido,
            monto_cambio: Math.max(montoRecibido - montoPagado, 0),
            referencia_pago: null,
          },
        ],
      };

      console.log(
        "Payload que se envía:",
        JSON.stringify(pedidoPayload, null, 2)
      );
      const { data } = await axios.post(
        "http://localhost:8000/pedidos/",
        pedidoPayload
      );

      alert(`Pedido guardado exitosamente. Folio: ${data.folio}`);
      resetFormulario();
    } catch (error) {
      console.error("Error guardando pedido:", error);
      alert("Error al finalizar la venta.");
    }
  };

  const abrirModalProducto = (producto, fila = null) => {
    setProductoModal(producto);
    setProductoEditando(fila);
    setShowProdModal(true);
  };

  const agregarOActualizarItem = (item) => {
    if (productoEditando) {
      setItemsOrden((prev) =>
        prev.map((fila) =>
          fila.rowId === productoEditando.rowId ? { ...fila, ...item } : fila
        )
      );
    } else {
      setItemsOrden((prev) => [...prev, { ...item, rowId: Date.now() }]);
    }
    setProductoEditando(null);
  };

  const handleEliminarItem = (rowId) => {
    setItemsOrden((prev) => prev.filter((item) => item.rowId !== rowId));
  };

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
              <Card
                key={p.id}
                className="mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => abrirModalProducto(p)}
              >
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
        <PanelPedidoConfig
          cliente={cliente}
          clienteSeleccionado={clienteSeleccionado}
          clientesEncontrados={clientesEncontrados}
          onInputChange={handleInputChange}
          onSelectCliente={handleSelectCliente}
          onClearCliente={handleClearCliente}
          onAbrirAgregarCliente={() => setShowModal(true)}
          itemsOrden={itemsOrden}
          onEditar={abrirModalProducto}
          onEliminar={handleEliminarItem}
          onReset={() => setItemsOrden([])}
          onFinalizarVenta={handleGuardarPedido}
          fechaEntrega={fechaEntrega}
          setFechaEntrega={setFechaEntrega}
          horaEntrega={horaEntrega}
          setHoraEntrega={setHoraEntrega}
          express={express}
          setExpress={setExpress}
          nota={nota}
          setNota={setNota}
          formaPago={formaPago}
          setFormaPago={setFormaPago}
          montoPagado={montoPagado}
          setMontoPagado={setMontoPagado}
          montoRecibido={montoRecibido}
          setMontoRecibido={setMontoRecibido}
        />
      </div>

      {/* MODALS */}
      <AgregarClienteModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />

      <AgregarProductoModal
        show={showProdModal}
        handleClose={() => {
          setShowProdModal(false);
          setProductoEditando(null);
        }}
        producto={productoModal}
        onAdd={agregarOActualizarItem}
        editarItem={productoEditando}
      />
    </div>
  );
};

export default NuevoPedido;
