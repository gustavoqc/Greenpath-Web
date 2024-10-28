import React from "react";
import Spinner from "react-bootstrap/Spinner";

export default function Carregamento() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Carregando...</span>
    </Spinner>
  );
}
