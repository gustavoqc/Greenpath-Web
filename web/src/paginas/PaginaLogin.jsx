import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useState } from "react";
import { AuthContext } from "../autenticacao/auth";
import { useContext } from "react";
import { useEffect } from "react";
import CryptoJS from "crypto-js";

function PaginaLogin() {
  const navigate = useNavigate();
  const { authenticated, login, loginWithRedirect } = useContext(AuthContext);
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [usuarioInexistente, setUsuarioInexistente] = useState(null);
  const queryString1 = window.location.search;

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  });

  const redirecionarEReload = () => {
    navigate(`/registrar`);
    window.location.reload(1);
  };

  const handleSubmit = (e, name) => {
    e.preventDefault();
    console.log("Entrando no sistema.");
    login(name, email, pass);
  };

  const handleSubmitRedirected = (e, name) => {
    e.preventDefault();
    console.log("Entrando no sistema.");
    loginWithRedirect(name, email, pass);
  };

  const handleError = async (e) => {
    const queryString = window.location.search;
    const { data } = await axios.get(`http://localhost:3001/selectCliente`);
    {
      let md5Pass = CryptoJS.MD5(pass).toString();
      data.map((usuario) => {
        if (
          email === usuario.email_cliente &&
          md5Pass === usuario.senha_cliente
        ) {
          const name = usuario.nome_cliente;
          setUsuarioInexistente(false);
          if (queryString == "?redirect=conferirEndereco") {
            handleSubmitRedirected(e, name);
          } else {
            handleSubmit(e, name);
          }
        } else {
          console.log(usuario.email_cliente);
          console.log(usuario.senha_cliente);
          console.log("error");
          setUsuarioInexistente(true);
        }
      });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Entrar</title>
      </Helmet>
      <h1 className="my-3">Entrar</h1>
      <Form>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            required
          />
        </Form.Group>
        <h6
          className={
            usuarioInexistente === true
              ? "mensagemErroLogin"
              : "mensagemErroLogin-false"
          }
        >
          Email ou senha inválidos!
        </h6>
        <div className="mb-3">
          <Button onClick={handleError}>Entrar</Button>
        </div>
        <div className="mb-3">
          Ainda não possui cadastro? {""}
          {queryString1 === "?redirect=conferirEndereco" ? (
            <Link to={`/registrar?redirect=conferirEndereco`}>
              Crie uma conta
            </Link>
          ) : (
            <Link to={`/registrar`} onClick={redirecionarEReload}>
              Crie uma conta
            </Link>
          )}
        </div>
      </Form>
    </Container>
  );
}

export default PaginaLogin;
