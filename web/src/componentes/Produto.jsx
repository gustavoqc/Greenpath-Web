import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useContext } from "react";
import { Loja } from "../Loja";

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
    <Card className="produto-card">
      <Link to={`/produto/${produto.categoria_prod}/${produto.link_url}`}>
        <img
          src={produto.imagem_prod_path}
          className="card-img-top"
          alt={produto.nome_produto}
        />
      </Link>
      <Card.Body>
        <Link to={`/produto/${produto.categoria_prod}/${produto.link_url}`}>
          <Card.Title>{produto.nome_produto}</Card.Title>
        </Link>
        <Card.Text>
          <h5 className="product-name">Valor: R${produto.valor_prod} </h5>
        </Card.Text>
        {produto.estoque_prod === 0 ? (
          <Button disabled className="btnEstoqueDisponivel">
            Produto indisponivel
          </Button>
        ) : (
          <Button
            onClick={() => adicionarAoCarrinho(produto)}
            className="btnEstoqueDisponivel"
          >
            Adicionar ao carrinho
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Produto;
