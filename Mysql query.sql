CREATE DATABASE `uninove-02-2024`;
USE `uninove-02-2024`;

CREATE TABLE Cargo_Func(
id_cargo INT AUTO_INCREMENT PRIMARY KEY,
nome_cargo VARCHAR(100) NOT NULL
);

CREATE TABLE Funcionario(
id_func INT AUTO_INCREMENT PRIMARY KEY,
nome_func VARCHAR(255) NOT NULL,
cargo_func INT NOT NULL,
cpf_func VARCHAR(11) NOT NULL UNIQUE,
dt_admissao DATE NOT NULL,
senha_func VARCHAR(255) NOT NULL,
email_func VARCHAR(255) NOT NULL,
CONSTRAINT fk_cargo_func FOREIGN KEY(cargo_func) REFERENCES Cargo_Func(id_cargo)
);

CREATE TABLE Cliente(
id_cliente INT AUTO_INCREMENT PRIMARY KEY,
nome_cliente VARCHAR(255) NOT NULL,
cpf_cliente Varchar(11) NOT NULL UNIQUE,
sexo_cliente VARCHAR(9) NOT NULL,
telefone_cliente DOUBLE NOT NULL,
ano_nasc DATE NOT NULL,
email_cliente VARCHAR(255) NOT NULL,
cidade_cliente VARCHAR(255) NOT NULL,
endereco_cliente VARCHAR(255) NOT NULL,
cep_cliente varchar(8) NOT NULL,
senha_cliente VARCHAR(255) NOT NULL
);

CREATE TABLE Categoria_Produto(
id_categ INT AUTO_INCREMENT PRIMARY KEY,
nome_categ VARCHAR(50) NOT NULL
);

CREATE TABLE Produto(
id_prod INT AUTO_INCREMENT PRIMARY KEY,
nome_prod VARCHAR(150) NOT NULL,
categoria_prod INT NOT NULL,
valor_prod FLOAT NOT NULL,
estoque_prod INT NOT NULL,
descricao_prod VARCHAR(255),
imagem_prod_path VARCHAR(255) NOT NULL,
link_url VARCHAR(255) NOT NULL,
CONSTRAINT fk_categoria FOREIGN KEY(categoria_prod) REFERENCES Categoria_Produto(id_categ)
);

CREATE TABLE Pagamento(
tipo_pagamento INT AUTO_INCREMENT PRIMARY KEY,
nome_pagamento VARCHAR(50) NOT NULL
);

CREATE TABLE Transacao(
id_transacao INT AUTO_INCREMENT PRIMARY KEY,
status_transacao BOOLEAN DEFAULT 0,
valor_total FLOAT NOT NULL,
dt_transacao DATE NOT NULL,
descricao_transacao VARCHAR(255) NOT NULL,
id_func_selecionado INT,
id_cliente_selecionado INT NOT NULL,
tipo_pagamento_selecionado INT NOT NULL,
transacao_valida BOOLEAN DEFAULT 0,
CONSTRAINT fk_cliente FOREIGN KEY(id_cliente_selecionado) REFERENCES Cliente(id_cliente),
CONSTRAINT fk_tipopagamento FOREIGN KEY(tipo_pagamento_selecionado) REFERENCES Pagamento(tipo_pagamento)
);

/*
INSERT INTO cliente(nome_cliente, cpf_cliente, sexo_cliente, telefone_cliente, ano_nasc, email_cliente, cidade_cliente, endereco_cliente, cep_cliente, senha_cliente)
VALUES('Cliente1', '12345678900', 'Masculino', 11900000000, '2024-01-01', 'Cliente@email.com', 'São Paulo', 'Rua São Paulo', '00000000', md5('12345'));

INSERT INTO cargo_func(nome_cargo) VALUES('Gerente');

INSERT INTO funcionario(nome_func, cargo_func, cpf_func, dt_admissao, senha_func, email_func)
VALUES('Gerente1', 1, '1', '2024-01-01', md5('1234'), 'Gerente@email.com');

INSERT INTO categoria_produto(nome_categ) VALUES('Frutas');
INSERT INTO categoria_produto(nome_categ) VALUES('Verduras');

INSERT INTO produto(nome_prod, categoria_prod, valor_prod, estoque_prod, descricao_prod, imagem_prod_path, link_url) 
VALUES('Maçã', 2, 3.99, 25, 'Maçã', '\\imagens\\maca_1.webp', 'maca_01');

INSERT INTO produto(nome_prod, categoria_prod, valor_prod, estoque_prod, descricao_prod, imagem_prod_path, link_url) 
VALUES('Refrigerante', 1, 6.99, 30, 'Refrigerante 01', '\\imagens\\refrigerante-1.jpg', 'refrigerante_01');

INSERT INTO produto(nome_prod, categoria_prod, valor_prod, estoque_prod, descricao_prod, imagem_prod_path, link_url) 
VALUES('Suco de Laranja', 1, 1.99, 10, 'Suco de Laranja', '\\imagens\\suco_laranja.png', 'suco-laranja');


INSERT INTO pagamento(nome_pagamento) VALUES("Dinheiro");
INSERT INTO pagamento(nome_pagamento) VALUES("Pix");

INSERT INTO transacao(valor_total, dt_transacao, descricao_transacao, id_func_selecionado, id_cliente_selecionado, tipo_pagamento_selecionado) 
VALUES (19.98, "2024-01-01", "Banana Nanica x2", 1, 1, 1); 
*/