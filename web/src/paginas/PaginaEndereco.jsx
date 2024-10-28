import React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

export default function PaginaEndereco() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [cep, setCep] = useState("");
  const [pais, setPais] = useState("");
  const [enderecoData, setEnderecoData] = useState();
  const item = JSON.parse(localStorage.getItem("user"));

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    const user = fullName;
    const email = item.email;

    (async () => {
      console.log(enderecoData[0]);
      const shippingData = {
        fullName,
        address,
        city,
        cep,
        pais,
      };
      localStorage.setItem("shippingData", JSON.stringify(shippingData));

      const loggedUser = {
        user,
        email,
      };
      localStorage.setItem("user", JSON.stringify(loggedUser));

      await axios.post(`http://localhost:3001/atualizarEnderecoCliente`, {
        nome: fullName,
        cidade: city,
        endereco: address,
        cep: cep,
        id: JSON.parse(localStorage.getItem("userID")),
      });
    })();

    const queryString = window.location.pathname;
    if (queryString === "/editarEndereco") {
      navigate("/finalizarCompra");
    } else {
      navigate("/tipoPagamento");
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.post(
        `http://localhost:3001/selectEnderecoCliente`,
        { id: localStorage.getItem("userID") }
      );

      console.log(data);
      setEnderecoData(data);
      setFullName(data[0].nome_cliente);
      setAddress(data[0].endereco_cliente);
      setCity(data[0].cidade_cliente);
      setCep(data[0].cep_cliente);
      setPais("Brasil");
    })();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Confirmar dados de endereço de envio</title>
      </Helmet>
      <div className="container small-container">
        <h1 className="my-3">Confirmar dados de envio</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Nome Completo</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Endereço completo</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Cidade</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cep">
            <Form.Label>CEP</Form.Label>
            <Form.Control
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cep">
            <Form.Label>País</Form.Label>
            <Form.Control
              value="Brasil"
              onChange={(e) => setPais(e.target.value)}
              required
            />
          </Form.Group>

          <div>
            <Button variant="primary" type="submit" onClick={handleClick}>
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
