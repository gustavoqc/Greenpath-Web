import React, { useEffect, useReducer, useState, useRef } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Produto from "../componentes/Produto";
import { Helmet } from "react-helmet-async";
import Carregamento from "../componentes/Carregamento";
import ErroCarregamento from "../componentes/ErroCarregamento";
import { Link } from "react-router-dom";
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import "../css/Produtos.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        produtos: action.payload.produtos,
        categorias: action.payload.categorias,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function PaginaProdutos() {
  const [{ loading, error, produtos, categorias }, dispatch] = useReducer(
    reducer,
    {
      produtos: [],
      categorias: [],
      loading: true,
      error: "",
    }
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const sidebarRef = useRef(null);
  const startXRef = useRef(0);

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const buscarDados = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const [resultado, resultado2] = await Promise.all([
          axios.get("http://localhost:3001/selectProduto"),
          axios.get("http://localhost:3001/selectCategoria"),
        ]);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            produtos: resultado.data,
            categorias: resultado2.data,
          },
        });
      } catch (erro) {
        dispatch({ type: "FETCH_FAIL", payload: erro.message });
      }
    };

    buscarDados();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCategoryClick = (categoria) => {
    setSelectedCategory(categoria);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startXRef.current;

    if (diffX > 50 && !sidebarOpen) {
      setSidebarOpen(true);
    } else if (diffX < -50 && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const filteredProducts = selectedCategory
    ? produtos.filter(
        (produto) => produto.categoria_prod === selectedCategory.id_categ
      )
    : produtos;

  return (
    <div className="pagina-produtos">
      <Helmet>
        <title>Greenpath</title>
      </Helmet>

      <div
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        ref={sidebarRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <h2>Categorias</h2>
        <ul className="list-unstyled">
          {Array.isArray(categorias) && categorias.length > 0 ? (
            categorias.map((categoria) => (
              <li key={categoria.id_categ} className="mb-3">
                <Link
                  to="#"
                  onClick={() => handleCategoryClick(categoria)}
                  className="card text-center p-3 category-card"
                >
                  <h5>{categoria.nome_categ}</h5>
                </Link>
              </li>
            ))
          ) : (
            <li>Nenhuma categoria disponivel.</li>
          )}
          <li>
            <Link
              to="/produtos"
              onClick={() => {
                setSelectedCategory(null);
                if (window.innerWidth <= 768) setSidebarOpen(false);
              }}
              className="btn btn-primary mt-3"
            >
              Exibir todos os produtos
            </Link>
          </li>
        </ul>
      </div>

      {window.innerWidth <= 768 && (
        <div
          className={`sidebar-toggle-arrow ${sidebarOpen ? "open" : ""}`}
          onClick={handleSidebarToggle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {sidebarOpen ? (
            <FaAngleDoubleLeft style={{ color: "#000" }} />
          ) : (
            <FaAngleDoubleRight style={{ color: "#000" }} />
          )}
        </div>
      )}

      <div className={`main-content ${sidebarOpen ? "retracted" : ""}`}>
        {selectedCategory !== null ? (
          <h1 className="titulo">{selectedCategory.nome_categ}</h1>
        ) : (
          <h1 className="titulo">Todos os Produtos</h1>
        )}

        {loading ? (
          <Carregamento />
        ) : error ? (
          <ErroCarregamento variant="danger">{error}</ErroCarregamento>
        ) : (
          <Row>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((produto) => (
                <Col
                  key={produto.link_url}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-3"
                >
                  <Produto produto={produto} />
                </Col>
              ))
            ) : (
              <Col>
                <h5>Nenhum produto encontrado.</h5>
              </Col>
            )}
          </Row>
        )}
      </div>
    </div>
  );
}

export default PaginaProdutos;
