import React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function PaginaPagamento() {
  const navigate = useNavigate();
  const [paymentMethodName, setPaymentMethod] = useState("PIX");
  const submitHandler = () => {
    const paymentData = {
      paymentMethodName,
    };
    localStorage.setItem("paymentData", JSON.stringify(paymentData));
    const queryString = window.location.pathname;
    if (queryString === "/editarPagamento") {
      navigate("/finalizarCompra");
    } else {
      navigate("/finalizarCompra");
    }
  };
  return (
    <div>
      <div className="container small-container">
        <Helmet>
          <title>Metodo de Pagamento</title>
        </Helmet>
        <h1 className="my-3">Metodo de Pagamento</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PIX"
              label="PIX"
              value="PIX"
              checked={paymentMethodName === "PIX"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continuar</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
