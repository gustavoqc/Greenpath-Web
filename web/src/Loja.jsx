import React from "react";
import { createContext, useReducer } from "react";

export const Loja = createContext();

const estadoInicial = {
  carrinho: {
    carrinhoItems: localStorage.getItem("carrinhoItems")
      ? JSON.parse(localStorage.getItem("carrinhoItems"))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const novoItem = action.payload;
      const itemExistente = state.carrinho.carrinhoItems.find(
        (item) => item.id_prod === novoItem.id_prod
      );

      const carrinhoItems = itemExistente
        ? state.carrinho.carrinhoItems.map((item) =>
            item.id_prod === itemExistente.id_prod ? novoItem : item
          )
        : [...state.carrinho.carrinhoItems, novoItem];

      localStorage.setItem("carrinhoItems", JSON.stringify(carrinhoItems));
      return { ...state, carrinho: { ...state.carrinho, carrinhoItems } };
    }
    case "CART_REMOVE_ITEM": {
      const carrinhoItems = state.carrinho.carrinhoItems.filter(
        (item) => item.id_prod !== action.payload.id_prod
      );

      localStorage.setItem("carrinhoItems", JSON.stringify(carrinhoItems));

      return { ...state, carrinho: { ...state.carrinho, carrinhoItems } };
    }
    default:
      return state;
  }
}

export function ProvedorLoja(props) {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  const valor = { state, dispatch };
  return <Loja.Provider value={valor}>{props.children}</Loja.Provider>;
}
