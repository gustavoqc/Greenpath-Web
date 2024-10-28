import React from "react";
import { useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Carregamento from "../componentes/Carregamento";
import ErroCarregamento from "../componentes/ErroCarregamento";
import { getError } from "../utils";
import { Loja } from "../Loja";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, produto: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function PaginaProduto() {
  const params = useParams();
  const { link } = params;
  const [{ loading, error, produto }, dispatch] = useReducer(reducer, {
    produto: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const buscarDados = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const resultado = await axios.post(
          `http://localhost:3001/selectProduto/${link}`,
          {
            link: link,
          }
        );
        console.log({ link });
        dispatch({ type: "FETCH_SUCCESS", payload: resultado.data });
      } catch (erro) {
        dispatch({ type: "FETCH_FAIL", payload: getError(erro) });
      }
    };
    buscarDados();
  }, [link]);

  const { state, dispatch: ctxDispatch } = useContext(Loja);
  const {
    carrinho: { carrinhoItems },
  } = state;

  const adicionarAoCarrinho = async (item) => {
    const itemExistente = carrinhoItems.find(
      (x) => x.id_prod === produto.id_prod
    );

    const quantidade = itemExistente ? itemExistente.quantidade + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:3001/selectProduto/${item.id_prod}`,
      { id: item.id_prod }
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

  return loading ? (
    <Carregamento />
  ) : error ? (
    <ErroCarregamento variant="danger">{error}</ErroCarregamento>
  ) : (
    <div>
      {produto.map((produto) => (
        <Row key={produto.id}>
          <Col md={6}>
            <img
              className="img-large"
              src={produto.imagem_prod_path}
              alt={produto.nome_produto}
            />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{produto.nome_produto}</title>
                </Helmet>
                <h1>{produto.nome_produto}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <h3>Preço: R$ {produto.valor_prod}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <p>{produto.descricao_prod}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Preço:</Col>
                      <Col>R${produto.valor_prod}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {produto.estoque_prod > 0 ? (
                          <Badge bg="success">Em estoque</Badge>
                        ) : (
                          <Badge bg="danger">Indisponível</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {produto.estoque_prod > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          onClick={() => adicionarAoCarrinho(produto)}
                          className="btnEstoqueDisponivel"
                        >
                          Adicionar ao carrinho
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </div>
  );
}

export default PaginaProduto;
