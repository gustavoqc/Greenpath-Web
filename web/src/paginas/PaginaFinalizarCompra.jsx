import React from "react";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Loja } from "../Loja";
import axios from "axios";

export default function PaginaFinalizarCompra() {
  const navigate = useNavigate();
  const { state } = useContext(Loja);
  const { carrinho } = state;
  const shipping = JSON.parse(localStorage.getItem("shippingData"));
  const pagamento = JSON.parse(localStorage.getItem("paymentData"));
  var descricao = new Array();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  carrinho.valor_prod = round2(
    carrinho.carrinhoItems.reduce((a, c) => a + c.quantidade * c.valor_prod, 0)
  );
  if (shipping.pais === "Brasil") {
    carrinho.preco_total = round2(carrinho.valor_prod + 15);
  } else {
    carrinho.preco_total = round2(carrinho.valor_prod + 100);
  }

  const registrarTransacao = async () => {
    for (let i = 0; i < carrinho.carrinhoItems.length; i++) {
      let nome = carrinho.carrinhoItems[i].nome_prod;
      let quantidade = carrinho.carrinhoItems[i].quantidade;
      let id = carrinho.carrinhoItems[i].id_prod;
      descricao[i] =
        "IDProduto: " + id + "- Nome: " + nome + " - Quantidade: " + quantidade;
    }

    await axios.post(`http://localhost:3001/registrarTransacao`, {
      valor_total: carrinho.preco_total,
      status_transacao: false,
      dt_transacao: new Date().toISOString().slice(0, 19).replace("T", " "),
      descricao_transacao: descricao.join(" |-| "),
      id_cliente_selecionado: localStorage.getItem("userID"),
      tipo_pagamento_selecionado: pagamento.paymentMethodName === "PIX" ? 2 : 1,
    });

    const id_cliente = localStorage.getItem("userID");
    const valor_total = carrinho.preco_total;
    const metodoPagamento = pagamento.paymentMethodName;
    const address = shipping.address;
    const city = shipping.city;
    const pais = shipping.pais;
    const cep = shipping.cep;
    const fullname = shipping.fullName;
    const descricao_transacao = descricao.join(" |-| ");
    const carrinhoitems2 = carrinho;

    const ultimaTransacao = {
      id_cliente,
      valor_total,
      metodoPagamento,
      address,
      city,
      pais,
      cep,
      fullname,
      descricao_transacao,
      carrinhoitems2,
    };
    localStorage.setItem("aprovado", 0);
    localStorage.setItem("ultimaTransacao", JSON.stringify(ultimaTransacao));
    localStorage.removeItem("paymentData");
    localStorage.removeItem("shippingData");
    localStorage.removeItem("carrinhoItems");
    navigate(`/pedido/${id_cliente}/${valor_total}`);
    window.location.reload(1);
  };

  return (
    <div>
      <Helmet>
        <title>Conferir Pedido</title>
      </Helmet>
      <h1 className="my-3">Conferir Pedido</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Envio</Card.Title>
              <Card.Text>
                <strong>Nome:</strong> {shipping.fullName} <br />
                <strong>Endereço: </strong> {shipping.address} - {shipping.city}{" "}
                - CEP {shipping.cep} - {shipping.pais}
              </Card.Text>
              <Link to="/editarEndereco">Alterar</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pagamento</Card.Title>
              <Card.Text>
                <strong>Método:</strong> {pagamento.paymentMethodName}
              </Card.Text>
              <Link to="/editarPagamento">Alterar</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {carrinho.carrinhoItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.imagem_prod_path}
                          alt={item.nome_prod}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <Link
                          to={`/produto/${item.categoria_prod}/${item.link_url}`}
                        >
                          {item.nome_prod}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantidade}</span>
                      </Col>
                      <Col md={3}>${item.valor_prod}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/alterarCarrinho">Alterar</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Resumo do pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>R$ {carrinho.valor_prod}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Taxa de entrega</Col>
                    <Col>
                      {shipping.pais === "Brasil" ? "R$ 15.00" : "R$ 100.00"}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      <strong>R$ {carrinho.preco_total}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={registrarTransacao}
                      disabled={carrinho.carrinhoItems.length === 0}
                    >
                      Realizar Pedido
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
