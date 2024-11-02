import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Loja } from "../Loja";
import ErroCarregamento from "../componentes/ErroCarregamento";
import { AuthContext } from "../autenticacao/auth";

export default function PaginaCarrinho() {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  const { state, dispatch: ctxDispatch } = useContext(Loja);
  const {
    carrinho: { carrinhoItems },
  } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const atualizarCarrinho = async (item, quantidade) => {
    const { data } = await axios.get(
      `http://localhost:3001/selectProduto/${item.id_prod}`,
      {
        id: item.id_prod,
      }
    );

    if (data.estoque_prod < quantidade) {
      window.alert("Nos desculpe. O produto está sem estoque :(");
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantidade },
    });
  };

  const removerItem = async (item) => {
    ctxDispatch({
      type: "CART_REMOVE_ITEM",
      payload: { ...item },
    });
  };

  const finalizarCompra = () => {
    if (authenticated) {
      const queryString = window.location.pathname;
      if (queryString === "/alterarCarrinho") {
        navigate("/finalizarCompra");
      } else {
        navigate("/conferirEndereco");
      }
    } else {
      navigate("/entrar?redirect=conferirEndereco");
    }
  };

  return (
    <div>
      <Helmet>
        <title>Carrinho</title>
      </Helmet>
      <h1>Carrinho</h1>
      <Row>
        <Col md={8}>
          {carrinhoItems.length === 0 ? (
            <ErroCarregamento>
              O Carrinho está vazio. <Link to="/">Continuar Comprando</Link>
            </ErroCarregamento>
          ) : (
            <ListGroup>
              {carrinhoItems.map((item) => (
                <ListGroup.Item key={item.id_prod}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <img
                        src={item.imagem_prod_path}
                        alt={item.nome_prod}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{" "}
                    </Col>
                    <Col md={6}>
                      <Link
                        to={`/produto/${item.categoria_prod}/${item.link_url}`}
                      >
                        {item.nome_prod}
                      </Link>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        disabled={item.quantidade === 1}
                        onClick={() =>
                          atualizarCarrinho(item, item.quantidade - 1)
                        }
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{" "}
                      <span>{item.quantidade}</span>{" "}
                      <Button
                        variant="light"
                        onClick={() =>
                          atualizarCarrinho(item, item.quantidade + 1)
                        }
                        disabled={item.quantidade === item.estoque_prod}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={1}>R${item.valor_prod}</Col>
                    <Col md={1}>
                      <Button variant="light" onClick={() => removerItem(item)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Sub-total (
                    {carrinhoItems.reduce((a, c) => a + c.quantidade, 0)} items)
                    : R$
                    {round2(
                      carrinhoItems.reduce(
                        (a, c) => a + c.valor_prod * c.quantidade,
                        0
                      )
                    )}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      onClick={finalizarCompra}
                      disabled={carrinhoItems.length === 0}
                    >
                      Finalizar Compra
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
