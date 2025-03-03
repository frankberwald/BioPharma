# BioPharma API  (README ESTÁ EM REVISÃO )

BioPharma é uma API desenvolvida em **Node.js** utilizando **Express**, **JWT**, **bcrypt** e **TypeORM** para gerenciamento de usuários, produtos e movimentações entre filiais.

## 📌 Tecnologias Utilizadas
- **Node.js**
- **Express**
- **TypeORM**
- **PostgreSQL**
- **JWT (JSON Web Token)**
- **bcrypt**

## 🔧 Configuração do Projeto
1. Clone este repositório:
   ```sh
   git clone https://github.com/seu-repositorio.git
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo **.env**:
   ```env
   DB_HOST=seu host, se usar localment usar o localhost
   DB_PORT= a porta da sua database, para postgres o padrão é: 5432
   DB_USERNAME= nome de usuário sua database
   DB_PASSWORD= senha da sua database
   DB_NAME= nome da database ex: BioPharma, MinhaDatabase....
   NODE_ENV=development   
   JWT_SECRET=seu segredo
   LOG_LEVEL=
   PORT= porta que sua API ira rodar

PORT=
   ```
4. Execute as migrations do TypeORM:
   ```sh
   npm run migration:run
   ```
5. Inicie o servidor:
   ```sh
   npm run start
   ```

## 📍 Endpoints
### 🔹 Autenticação
#### 🔹 Cadastro de Usuário (Apenas ADMIN)
- **Rota:** `POST /users`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "profile": "ADMIN",
    "email": "john@example.com",
    "password": "senha123",
    "document": "12345678900",
    "full_address": "Rua Exemplo, 123"
  }
  ```
- **Retornos:**
  - `201 Created`: Usuário cadastrado com sucesso.
  - `409 Conflict`: E-mail já cadastrado.
  - `400 Bad Request`: Dados inválidos.

#### 🔹 Login
- **Rota:** `POST /login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "senha123"
  }
  ```
- **Retornos:**
  - `200 OK`: Retorna o token JWT.
  - `401 Unauthorized`: Credenciais inválidas.

### 🔹 Usuários
#### 🔹 Listar Todos Usuários (Apenas ADMIN)
- **Rota:** `GET /users`
- **Query Params:** `?profile=DRIVER`
- **Retorno:** Lista de usuários.

#### 🔹 Listar Usuário por ID
- **Rota:** `GET /users/:id`
- **Acesso:** ADMIN ou o próprio motorista dono do ID.

#### 🔹 Atualizar Usuário
- **Rota:** `PUT /users/:id`
- **Acesso:** ADMIN ou o próprio motorista.
- **Campos permitidos:** `name`, `email`, `password`, `full_address`.

#### 🔹 Atualizar Status do Usuário (Apenas ADMIN)
- **Rota:** `PATCH /users/:id/status`
- **Retorno:** Confirmação da atualização.

### 🔹 Produtos
#### 🔹 Cadastro de Produto (Apenas FILIAL)
- **Rota:** `POST /products`
- **Body:**
  ```json
  {
    "name": "Vacina XYZ",
    "amount": 100,
    "description": "Vacina contra XYZ",
    "url_cover": "https://imagem.com"
  }
  ```
- **Retorno:** Produto cadastrado.

#### 🔹 Listagem de Produtos (Apenas FILIAL)
- **Rota:** `GET /products`
- **Retorno:** Lista de produtos cadastrados.

### 🔹 Movimentações
#### 🔹 Criar Movimentação (Apenas FILIAL)
- **Rota:** `POST /movements`
- **Body:**
  ```json
  {
    "destination_branch_id": "2",
    "product_id": "10",
    "quantity": 50
  }
  ```
- **Retorno:** Confirmação da movimentação.

#### 🔹 Listar Movimentações (FILIAL e MOTORISTA)
- **Rota:** `GET /movements`
- **Retorno:** Lista das movimentações.

#### 🔹 Iniciar Transporte (Apenas MOTORISTA)
- **Rota:** `PATCH /movements/:id/start`
- **Ação:** Associa a movimentação ao motorista.

#### 🔹 Finalizar Transporte (MOTORISTA Responsável)
- **Rota:** `PATCH /movements/:id/end`
- **Ação:** Marca como entregue e atualiza o estoque da filial de destino.

## 🛡️ Middleware de Autenticação
- Todas as rotas privadas requerem **Bearer Token** no cabeçalho `Authorization`.
- O middleware verifica se o usuário tem permissão para acessar a rota.

## 🏗️ Estrutura do Banco de Dados
A API utiliza **TypeORM** e PostgreSQL. As principais tabelas são:
### 🔹 Users
| Campo         | Tipo                        |
|--------------|----------------------------|
| id           | UUID (PK)                   |
| name         | VARCHAR(200) NOT NULL       |
| profile      | ENUM('DRIVER', 'BRANCH', 'ADMIN') |
| email        | VARCHAR(150) UNIQUE NOT NULL |
| password_hash | VARCHAR(150) NOT NULL      |
| status       | BOOLEAN (DEFAULT TRUE)      |
| created_at   | TIMESTAMP                   |
| updated_at   | TIMESTAMP                   |

### 🔹 Branches (Filiais)
| Campo         | Tipo                 |
|--------------|----------------------|
| id           | UUID (PK)            |
| full_address | VARCHAR(255)         |
| document     | VARCHAR(30) NOT NULL |
| user_id      | UUID (FK) NOT NULL   |
| created_at   | TIMESTAMP            |
| updated_at   | TIMESTAMP            |

### 🔹 Drivers (Motoristas)
| Campo         | Tipo                 |
|--------------|----------------------|
| id           | UUID (PK)            |
| full_address | VARCHAR(255)         |
| document     | VARCHAR(30) NOT NULL |
| user_id      | UUID (FK) NOT NULL   |
| created_at   | TIMESTAMP            |
| updated_at   | TIMESTAMP            |

### 🔹 Products
| Campo         | Tipo                 |
|--------------|----------------------|
| id           | UUID (PK)            |
| name         | VARCHAR(200) NOT NULL |
| amount       | INT NOT NULL         |
| description  | VARCHAR(200) NOT NULL |
| url_cover    | VARCHAR(200)         |
| branch_id    | UUID (FK) NOT NULL   |
| created_at   | TIMESTAMP            |
| updated_at   | TIMESTAMP            |

## 🚀 Contribuição
1. Faça um fork do repositório.
2. Crie uma branch: `git checkout -b minha-feature`.
3. Commit suas alterações: `git commit -m 'Minha nova feature'`.
4. Envie para o repositório remoto: `git push origin minha-feature`.
5. Abra um Pull Request.

## 📜 Licença
Este projeto está licenciado sob a **MIT License**.

👨‍💻 Desenvolvido por
   https://github.com/frankberwald
<br/>
📢 Conecte-se
   https://www.linkedin.com/in/franklin-berwald-751a8220a/
