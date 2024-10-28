import React from "react";
import axios from "axios";
import { useEffect, useReducer } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet-async";
import Carregamento from "../componentes/Carregamento";
import ErroCarregamento from "../componentes/ErroCarregamento";
import Produto from "../componentes/Produto";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, produtos: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function PaginaPrincipal() {
  const [{ loading, error, produtos }, dispatch] = useReducer(reducer, {
    produtos: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const buscarDados = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const resultado = await axios.get(
          "http://localhost:3001/selectProduto"
        );
        dispatch({ type: "FETCH_SUCCESS", payload: resultado.data });
      } catch (erro) {
        dispatch({ type: "FETCH_FAIL", payload: erro.message });
      }
    };
    buscarDados();
  }, []);

  return (
    <div>
      <Helmet>
        <title>webproject</title>
      </Helmet>
      <h1 className="titulo">Produtos em destaque</h1>
      <div className="produtos">
        {loading ? (
          <Carregamento />
        ) : error ? (
          <ErroCarregamento variant="danger">{error}</ErroCarregamento>
        ) : (
          <Row>
            {produtos.map((produto) => (
              <Col key={produto.link_url} sm={6} md={4} lg={3} className="mb-3">
                <Produto produto={produto}></Produto>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default PaginaPrincipal;
