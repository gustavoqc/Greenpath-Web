import React, { useContext, useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import NavDropDown from "react-bootstrap/NavDropDown";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { Loja } from "./Loja";
import { AuthProvider, AuthContext } from "./autenticacao/auth";
import PaginaPrincipal from "./paginas/PaginaPrincipal";
import PaginaProduto from "./paginas/PaginaProduto";
import PaginaCarrinho from "./paginas/PaginaCarrinho";
import PaginaLogin from "./paginas/PaginaLogin";
import PaginaFinalizarCompra from "./paginas/PaginaFinalizarCompra";
import PaginaEndereco from "./paginas/PaginaEndereco";
import PaginaRegistrar from "./paginas/PaginaRegistrar";
import PaginaPagamento from "./paginas/PaginaPagamento";
import PaginaPedido from "./paginas/PaginaPedido";
import PaginaHistorico from "./paginas/PaginaHistorico";
import PaginaPerfil from "./paginas/PaginaPerfil";
import PaginaProdutos from "./paginas/PaginaProdutos";
import "./css/App.css";

function App() {
  const navigate = useNavigate(); // Correctly using useNavigate
  const { state } = useContext(Loja);
  const { carrinho } = state;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const recoveredUser = localStorage.getItem("user");
    if (recoveredUser) {
      setUser(JSON.parse(recoveredUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("user");
    localStorage.removeItem("paymentData");
    localStorage.removeItem("shippingData");

    setUser(null); // Update user state
    navigate("/"); // Redirect using navigate
  };

  const Private = ({ children }) => {
    const { authenticated, loading } = useContext(AuthContext);
    if (loading) {
      return <div className="loading">Carregando...</div>;
    }

    if (authenticated === false) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <div className="d-flex flex-column site-container">
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>webproject</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto w-100 justify-content-end">
                <Link to="/produtos" className="nav-link">
                  Produtos
                </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Link to="/carrinho" className="nav-link">
                  Carrinho
                  {carrinho.carrinhoItems.length > 0 && (
                    <Badge pill bg="danger">
                      {carrinho.carrinhoItems.reduce(
                        (a, c) => a + c.quantidade,
                        0
                      )}
                    </Badge>
                  )}
                </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {user ? (
                  <NavDropDown title={user.user} id="basic-nav-dropdown">
                    <LinkContainer to="/perfil">
                      <NavDropDown.Item>Perfil</NavDropDown.Item>
                    </LinkContainer>
                    <LinkContainer to="/historico">
                      <NavDropDown.Item>Historico</NavDropDown.Item>
                    </LinkContainer>
                    <NavDropDown.Divider />
                    <LinkContainer to="/">
                      <NavDropDown.Item onClick={logout}>Sair</NavDropDown.Item>
                    </LinkContainer>
                  </NavDropDown>
                ) : (
                  <Link className="nav-link" to="/entrar">
                    Entrar
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container className="mt-3">
          <AuthProvider>
            <Routes>
              <Route
                path="/pedido/:id_cliente/:valor_total"
                element={
                  <Private>
                    <PaginaPedido />
                  </Private>
                }
              />
              <Route
                path="/produto/:categoria_prod/:link"
                element={<PaginaProduto />}
              />
              <Route path="/carrinho" element={<PaginaCarrinho />} />
              <Route path="/entrar" element={<PaginaLogin />} />
              <Route
                path="/entrar?redirect=conferirEndereco"
                element={<PaginaLogin />}
              />
              <Route path="/produtos" element={<PaginaProdutos />} />
              <Route path="/registrar" element={<PaginaRegistrar />} />
              <Route
                path="/registrar?redirect=conferirEndereco"
                element={<PaginaRegistrar />}
              />
              <Route
                path="/tipoPagamento?redirect=finalizarCompra"
                element={
                  <Private>
                    <PaginaPagamento />
                  </Private>
                }
              />
              <Route
                path="/finalizarCompra"
                element={
                  <Private>
                    <PaginaFinalizarCompra />
                  </Private>
                }
              />
              <Route
                path="/tipoPagamento"
                element={
                  <Private>
                    <PaginaPagamento />
                  </Private>
                }
              />
              <Route
                path="/editarPagamento"
                element={
                  <Private>
                    <PaginaPagamento />
                  </Private>
                }
              />
              <Route
                path="/editarEndereco"
                element={
                  <Private>
                    <PaginaEndereco />
                  </Private>
                }
              />
              <Route
                path="/alterarCarrinho"
                element={
                  <Private>
                    <PaginaCarrinho />
                  </Private>
                }
              />
              <Route
                path="/historico"
                element={
                  <Private>
                    <PaginaHistorico />
                  </Private>
                }
              />
              <Route
                path="/perfil"
                element={
                  <Private>
                    <PaginaPerfil />
                  </Private>
                }
              />
              <Route path="/" element={<PaginaPrincipal />} />
              <Route path="/conferirEndereco" element={<PaginaEndereco />} />
              <Route path="/produtos" element={<PaginaProdutos />} />
              <Route path="*" element={<PaginaPrincipal />}></Route>
            </Routes>
          </AuthProvider>
        </Container>
      </main>
      <footer>
        <div className="text-center">All rights reserved © webproject</div>
      </footer>
    </div>
  );
}

export default App;
