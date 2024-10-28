import React from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { useState } from "react";

export default function PaginaHistorico() {
  const navigate = useNavigate();
  const [pedidos, setdadosPedido] = useState([]);
  const id_cliente = localStorage.getItem("userID");

  useEffect(() => {
    (async () => {
      const resultado = await axios.post(
        `http://localhost:3001/selectTransacoes/${id_cliente}`,
        {
          id_cliente: id_cliente,
        }
      );
      setdadosPedido(resultado.data);
    })();
  });

  return (
    <div>
      <Helmet>
        <title>Historico de Pedidos</title>
      </Helmet>
      <h1>Historico de Pedidos</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>DATA DA COMPRA</th>
            <th>TOTAL</th>
            <th>PAGO</th>
            <th>APROVADO</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido._id}>
              <td>{pedido.id_transacao}</td>
              <td>{pedido.dt_transacao.substring(0, 10)}</td>
              <td>R$ {pedido.valor_total}</td>
              <td>Sim</td>
              <td>{pedido.status_transacao === 1 ? "Sim" : "Não"}</td>
              <td>
                <Button
                  type="button"
                  variant="light"
                  onClick={() => {
                    navigate(
                      `/pedido/${pedido.id_cliente_selecionado}/${pedido.valor_total}`
                    );
                    localStorage.setItem("aprovado", pedido.status_transacao);
                  }}
                >
                  Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
