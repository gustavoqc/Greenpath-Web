import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { AuthContext } from "../autenticacao/auth";
import { useContext } from "react";
import CryptoJS from "crypto-js";

export default function PaginaRegistrar() {
  const [errorMessageValue, setErrorMessageValue] = useState("");
  const [name, setName] = useState("");
  const [email_form, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf_form, setCpf] = useState(0);
  const [sexo_form, setSexo] = useState("");
  const [telefone_form, setTelefone] = useState(0);
  const [ano_nasc_form, setAnoNasc] = useState({ varOne: new Date() });
  const [cidade_form, setCidade] = useState("");
  const [endereco_form, setEndereco] = useState("");
  const [cep_form, setCep] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login, loginWithRedirect } = useContext(AuthContext);
  var queryString1 = "";

  const submitHandler = async (e) => {
    e.preventDefault();
    const queryString = window.location.search;
    (async () => {
      let md5Pass = CryptoJS.MD5(password).toString();

      if (password !== confirmPassword) {
        setErrorMessageValue("Senhas não coincidem. Tente novamente.");
        console.log("Erro, senhas diferentes");
      } else {
        await axios.post(`http://localhost:3001/insertNovoCliente`, {
          nome: name,
          email: email_form,
          senha: md5Pass,
          cpf: cpf_form,
          sexo: sexo_form,
          telefone: telefone_form,
          ano_nasc: ano_nasc_form,
          cidade: cidade_form,
          endereco: endereco_form,
          cep: cep_form,
        });
      }
    })();
    if (queryString === "?redirect=conferirEndereco") {
      await loginWithRedirect(name, email_form, password);
    } else {
      await login(name, email_form, password);
    }
  };

  useEffect(() => {
    queryString1 = window.location.pathName;
  });

  return (
    <Container className="small-container">
      <Helmet>
        <title>Registrar</title>
      </Helmet>
      <h1 className="my-3">Registrar novo usuario</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nome Completo</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email_form">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirmar Senha</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="mb-3" controlId="cpf_form">
          <Form.Label>CPF</Form.Label>
          <Form.Control onChange={(e) => setCpf(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="sexo_form">
          <Form.Label>Sexo</Form.Label>
          <Form.Select onChange={(e) => setSexo(e.target.value)} required>
            <option></option>
            <option>Masculino</option>
            <option>Feminino</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="telefone_cep">
          <Form.Label>Telefone/Celular</Form.Label>
          <Form.Control
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="ano_nasc_form">
          <Form.Label>Data de Nascimento</Form.Label>
          <Form.Control onChange={(e) => setAnoNasc(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="cidade_form">
          <Form.Label>Cidade</Form.Label>
          <Form.Control onChange={(e) => setCidade(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="endereco_form">
          <Form.Label>Endereço Completo</Form.Label>
          <Form.Control
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="cep_form">
          <Form.Label>CEP</Form.Label>
          <Form.Control onChange={(e) => setCep(e.target.value)} required />
        </Form.Group>
        <div
          className={
            errorMessageValue === ""
              ? "mensagemErroLogin-false"
              : "mensagemErroLogin"
          }
        >
          {errorMessageValue === "Senhas não coincidem. Tente novamente."
            ? errorMessageValue
            : errorMessageValue === "Email ja existente no banco de dados."
            ? errorMessageValue
            : ""}
        </div>
        <div className="mb-3">
          <Button type="submit">Registrar</Button>
        </div>
        <div className="mb-3">
          Já possui uma conta?
          {queryString1 === "/registrar" ? (
            <Link to={`/entrar`}>Entrar</Link>
          ) : (
            <Link to={`/entrar?redirect=conferirEndereco`}>Entrar</Link>
          )}
        </div>
      </Form>
    </Container>
  );
}
