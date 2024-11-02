import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useContext } from "react";
import { Loja } from "../Loja";
import "../css/Produto.css";

function Produto(props) {
  const { produto } = props;
  const { state, dispatch: ctxDispatch } = useContext(Loja);
  const {
    carrinho: { carrinhoItems },
  } = state;

  const adicionarAoCarrinho = async (item) => {
    const itemExistente = carrinhoItems.find(
      (x) => x.id_prod === produto.id_prod
    );

    const quantidade = itemExistente ? itemExistente.quantidade + 1 : 1;

    try {
      const { data } = await axios.get(
        `http://localhost:3001/selectProduto/${item.id_prod}`
      );

      if (data.estoque_prod < quantidade) {
        window.alert("Nos desculpe. O produto está sem estoque :(");
        return;
      }

      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: { ...item, quantidade },
      });
    } catch (error) {
      window.alert("Houve um problema ao adicionar o produto ao carrinho.");
    }
  };

  return (
    <Card className="fixed-card-size">
      <Link to={`/produto/${produto.categoria_prod}/${produto.link_url}`}>
        <Card.Img
          variant="top"
          src={produto.imagem_prod_path}
          alt={produto.nome_prod}
          className="img-large"
        />
      </Link>
      <Card.Body className="card-body-content">
        <Card.Title className="product-name">
          <Link to={`/produto/${produto.categoria_prod}/${produto.link_url}`}>
            {produto.nome_prod}
          </Link>
        </Card.Title>
        <Card.Text className="product-price">
          Valor: R$ {produto.valor_prod}
        </Card.Text>
        {produto.estoque_prod === 0 ? (
          <Button disabled className="add-to-cart-button">
            Produto indisponivel
          </Button>
        ) : (
          <Button
            onClick={() => adicionarAoCarrinho(produto)}
            className="add-to-cart-button"
          >
            Adicionar ao carrinho
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Produto;
