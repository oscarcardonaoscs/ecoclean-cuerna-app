import React, { useState } from "react";
import { Navbar, Container, NavDropdown, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { List } from "react-bootstrap-icons"; // icono de 3 líneas

function MainLayout({ children }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleClose = () => setShowMenu(false);
  const handleShow = () => setShowMenu(true);

  const linkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " active text-primary fw-bold" : "");

  return (
    <div>
      <header>
        <Navbar
          bg="white"
          expand="lg"
          className="navbar-light topbar mb-4 static-top shadow"
        >
          <Container className="d-flex justify-content-between align-items-center">
            {/* Botón del menú lateral */}
            <Dropdown align="start">
              <Dropdown.Toggle variant="outline-primary" id="menu-dropdown">
                <List size={20} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/factura">
                  Factura
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/productos_admin">
                  Productos
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/hardware">
                  Hardware
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/usuarios">
                  Usuarios
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/marketing">
                  Marketing
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/configuracion">
                  Configuración
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Navbar.Brand href="/" className="text-primary fw-bold mx-3">
              EcoClean App
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <nav className="me-auto navbar-nav">
                <NavLink to="/nuevo" className={linkClass}>
                  Nuevo Pedido
                </NavLink>
                <NavLink to="/en-proceso" className={linkClass}>
                  En Proceso
                </NavLink>
                <NavLink to="/listo" className={linkClass}>
                  Listo
                </NavLink>
                <NavLink to="/entregado" className={linkClass}>
                  Entregado
                </NavLink>
              </nav>

              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <span className="me-2 d-none d-lg-inline text-gray-600 small">
                      Oscar Cardona
                    </span>
                    <img
                      src="https://source.unsplash.com/QAB-WJcbgJk/60x60"
                      alt="user"
                      className="rounded-circle"
                      width="30"
                      height="30"
                    />
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item href="#">Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#">Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <hr className="m-0" />

      <main style={{ minHeight: "calc(100vh - 70px)" }}>
        <div className="max-w-screen-lg mx-auto px-1">{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;
