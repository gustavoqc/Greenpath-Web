const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
require("axios");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "uninove-02-2024",
});

app.use(express.json());
app.use(cors());

app.get("/selectCategoria", (req, res) => {
  let mysql = "SELECT * FROM Categoria_produto";
  db.query(mysql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/selectProduto", (req, res) => {
  let mysql = "SELECT * FROM Produto";
  db.query(mysql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/selectProduto/:id_prod", (req, res) => {
  const { id } = req.body;
  let mysql = "SELECT * FROM Produto WHERE nome_prod = ?";
  db.query(mysql, [id], (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.get("/selectCliente", (req, res) => {
  let mysql = "SELECT * FROM Cliente";
  db.query(mysql, (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.post("/selectCurrentClient", (req, res) => {
  const { id } = req.body;
  let mysql = "SELECT * FROM Cliente WHERE id_cliente = ?";
  db.query(mysql, [id], (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.get("/selectEmailList", (req, res) => {
  let mysql = "SELECT email_cliente FROM Cliente";
  db.query(mysql, (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.post("/selectEnderecoCliente", (req, res) => {
  const { id } = req.body;
  let mysql =
    "SELECT nome_cliente, endereco_cliente, cep_cliente, cidade_cliente FROM Cliente WHERE id_cliente = ?";
  db.query(mysql, [id], (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.post("/selectProduto/:link", (req, res) => {
  const { link } = req.body;
  let mysql = "SELECT * FROM Produto WHERE link_url = ?";
  db.query(mysql, [link], (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.post("/selectTransacao/:id_cliente/:valor_total", (req, res) => {
  const { id_cliente } = req.body;
  const { valor_total } = req.body;
  let mysql =
    "select * from Transacao where id_cliente_selecionado = ? and valor_total LIKE ?  ";
  db.query(mysql, [id_cliente, valor_total], (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.post("/selectTransacoes/:id_cliente", (req, res) => {
  const { id_cliente } = req.body;
  let mysql = "select * from Transacao where id_cliente_selecionado = ?";
  db.query(mysql, [id_cliente], (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.post("/insertNovoCliente", (req, res) => {
  const { nome } = req.body;
  const { cpf } = req.body;
  const { sexo } = req.body;
  const { telefone } = req.body;
  const { ano_nasc } = req.body;
  const { email } = req.body;
  const { cidade } = req.body;
  const { endereco } = req.body;
  const { cep } = req.body;
  const { senha } = req.body;

  let mysql =
    "INSERT INTO Cliente (nome_cliente, cpf_cliente, sexo_cliente, telefone_cliente, ano_nasc, email_cliente, cidade_cliente, endereco_cliente, cep_cliente, senha_cliente)values(?,?,?,?,?,?,?,?,?,?)";
  db.query(
    mysql,
    [nome, cpf, sexo, telefone, ano_nasc, email, cidade, endereco, cep, senha],
    (err) => {
      if (err) res.send(err);
    }
  );
});

app.post("/atualizarEnderecoCliente", (req, res) => {
  const { nome } = req.body;
  const { cidade } = req.body;
  const { endereco } = req.body;
  const { cep } = req.body;
  const { id } = req.body;

  let mysql =
    "UPDATE Cliente SET nome_cliente = ?, endereco_cliente = ?, cep_cliente = ?, cidade_cliente = ? WHERE id_cliente = ?";

  db.query(mysql, [nome, endereco, cep, cidade, id], (err) => {
    if (err) res.send(err);
  });
});

app.post("/atualizarClienteAtual", (req, res) => {
  const {
    nome,
    cpf,
    sexo,
    telefone,
    ano_nasc,
    email,
    cidade,
    endereco,
    cep,
    senha,
    id,
  } = req.body;

  let mysql =
    "UPDATE CLIENTE SET nome_cliente = ?, cpf_cliente = ?, sexo_cliente = ?, telefone_cliente = ?, ano_nasc = ?, email_cliente = ?, cidade_cliente = ?, endereco_cliente = ?, cep_cliente = ?, senha_cliente = ? WHERE id_cliente = ?";

  db.query(
    mysql,
    [
      nome,
      cpf,
      sexo,
      telefone,
      ano_nasc,
      email,
      cidade,
      endereco,
      cep,
      senha,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Database update error:", err); // Log the error details
        return res
          .status(500)
          .send({ message: "Database update error", error: err });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .send({ message: "Client not found or no changes made." });
      }

      res.status(200).send({ message: "Client updated successfully." });
    }
  );
});

app.post("/registrarTransacao", (req, res) => {
  const { valor_total } = req.body;
  const { status_transacao } = req.body;
  const { dt_transacao } = req.body;
  const { descricao_transacao } = req.body;
  const { id_cliente_selecionado } = req.body;
  const { tipo_pagamento_selecionado } = req.body;

  let mysql =
    "INSERT INTO Transacao (valor_total, status_transacao, dt_transacao, descricao_transacao, id_cliente_selecionado, tipo_pagamento_selecionado) VALUES (?,?,?,?,?,?)";
  db.query(
    mysql,
    [
      valor_total,
      status_transacao,
      dt_transacao,
      descricao_transacao,
      id_cliente_selecionado,
      tipo_pagamento_selecionado,
    ],
    (err) => {
      res.send(err);
    }
  );
});

app.use((err, res) => {
  res.status(500).send({ message: err.message });
});

app.listen(3001, () => {
  console.log("rodando na porta 3001");
});
