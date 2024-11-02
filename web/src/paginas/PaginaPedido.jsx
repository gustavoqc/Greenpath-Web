import React from "react";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import ErroCarregamento from "../componentes/ErroCarregamento";

export default function PaginaPedido() {
  const lastTransactionData = JSON.parse(
    localStorage.getItem("ultimaTransacao")
  );

  const aprovado = localStorage.getItem("aprovado");
  const stringEndereco = `${lastTransactionData.address} - ${lastTransactionData.city} - CEP: ${lastTransactionData.cep} - ${lastTransactionData.pais}`;

  return (
    <div>
      <Helmet>
        <title>Ultimo Pedido</title>
      </Helmet>
      <h1 className="my-3">Pedido</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Envio</Card.Title>
              <Card.Text>
                <strong>Nome:</strong> {lastTransactionData.fullname} <br />
                <strong>Endereço: </strong> {stringEndereco}
                &nbsp; &nbsp;
                <br />
                {
                  <a
                    target="_new"
                    href={`https://maps.google.com?q=${stringEndereco}`}
                  >
                    Mostrar no mapa
                  </a>
                }
              </Card.Text>
              {aprovado === "1" ? (
                <ErroCarregamento variant="danger">
                  Aguardando Entrega
                </ErroCarregamento>
              ) : (
                <ErroCarregamento variant="danger">
                  Aguardando confirmação
                </ErroCarregamento>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pagamento</Card.Title>
              <Card.Text>
                <strong>Método:</strong> {lastTransactionData.metodoPagamento}
              </Card.Text>
              {aprovado === "1" ? (
                <ErroCarregamento variant="success">Aprovado</ErroCarregamento>
              ) : (
                <ErroCarregamento variant="danger">
                  Aguardando aprovação da loja
                </ErroCarregamento>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {lastTransactionData.carrinhoitems2.carrinhoItems.map(
                  (item) => (
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
                  )
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Resumo do pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${lastTransactionData.carrinhoitems2.valor_prod}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Frete</Col>
                    <Col>
                      {lastTransactionData.pais === "Brasil"
                        ? "R$ 15.00"
                        : "R$ 100.00"}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      <strong>${lastTransactionData.valor_total}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
