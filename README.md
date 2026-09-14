# ☕ Cafeteria Inteligente

Sistema Full Stack para gerenciamento de uma cafeteria, desenvolvido com **Django REST Framework** e **Next.js**, com autenticação JWT, gerenciamento de produtos e pedidos, além de um módulo de **previsão de vendas utilizando Machine Learning**.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django-6.0-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Railway](https://img.shields.io/badge/Deploy-Railway-purple)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Visão geral

O **Cafeteria Inteligente** é um sistema Full Stack desenvolvido para simular a operação de uma cafeteria.

O projeto permite gerenciar produtos, clientes e pedidos, além de disponibilizar uma funcionalidade de **previsão de vendas** baseada no histórico de vendas da cafeteria.

### Principais funcionalidades

- Autenticação utilizando JWT
- Gerenciamento de produtos
- Gerenciamento de categorias
- Carrinho de compras
- Criação e gerenciamento de pedidos
- Histórico de pedidos
- Controle de estoque
- Sistema de caixa
- Cadastro de clientes
- Pagamentos
- API REST
- Documentação da API com Swagger
- Seed para popular o banco de dados
- Previsão de vendas com Machine Learning
- Interface administrativa
- Deploy em produção

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura separada entre frontend e backend:

```text
┌─────────────────────┐
│      Frontend       │
│      Next.js        │
│      React          │
│    TypeScript       │
└──────────┬──────────┘
           │
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│       Backend       │
│       Django        │
│   Django REST       │
│     Framework       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     PostgreSQL      │
└─────────────────────┘
```

O módulo de Machine Learning está integrado ao backend Django e utiliza os dados históricos armazenados no banco de dados.

---

## 🧱 Tecnologias

### Backend

- Python
- Django
- Django REST Framework
- SimpleJWT
- Django Filters
- PostgreSQL
- CORS Headers
- Scikit-Learn
- Pandas
- Joblib
- Gunicorn
- WhiteNoise

### Frontend

- Next.js
- React
- TypeScript
- TailwindCSS
- Sonner

### Infraestrutura

- Docker
- Docker Compose
- PostgreSQL
- Railway

---

## 🚀 Quick Start

### 1. Clone o projeto

```bash
git clone https://github.com/guilhermebatis/cafeteria-inteligente-api.git
```

Entre no diretório:

```bash
cd cafeteria-inteligente-api
```

### 2. Inicie os containers

```bash
docker compose up --build
```

O projeto será iniciado utilizando Docker.

---

## 🌱 Seeds

O projeto possui dois seeds principais.

### Seed principal

O seed principal popula o sistema com dados necessários para utilização da cafeteria:

```bash
docker compose exec backend python manage.py seed
```

Esse comando cria dados como:

- Categorias
- Produtos
- Usuário de demonstração
- Dados iniciais do sistema

### Seed do Machine Learning

Para utilizar o sistema de previsão de vendas, é necessário executar também:

```bash
docker compose exec backend python manage.py seed_ml
```

O `seed_ml` gera o histórico de vendas utilizado pelo módulo de Machine Learning.

> **Importante:** o `seed_ml` é necessário para que existam dados históricos suficientes para gerar as previsões de vendas.

### Ordem recomendada

Após iniciar o projeto, execute:

```bash
docker compose exec backend python manage.py seed
```

Depois:

```bash
docker compose exec backend python manage.py seed_ml
```

---

## 👤 Usuário de demonstração

Após executar o seed principal, será criado um usuário de demonstração:

```text
Usuário: caixa1
Senha: caixa123
```

Esse usuário pode ser utilizado para acessar o sistema.

---

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação.

São utilizados:

- `access token` para autenticar requisições
- `refresh token` para renovar o access token
- Armazenamento dos tokens no frontend

O header utilizado nas requisições autenticadas é:

```http
Authorization: Bearer <token>
```

### Endpoints de autenticação

```http
POST /api/token/
```

Login e obtenção dos tokens.

```http
POST /api/token/refresh/
```

Renovação do access token.

---

## 📡 API Endpoints principais

### Autenticação

```http
POST /api/token/
POST /api/token/refresh/
```

### Usuário

```http
GET /api/users/me/
```

### Produtos

```http
GET /api/products/
POST /api/products/
GET /api/products/<id>/
PUT /api/products/<id>/
DELETE /api/products/<id>/
```

### Pedidos

```http
POST /api/orders/
GET /api/orders/
GET /api/orders/<id>/
```

### Itens do pedido

```http
POST /api/orders/<id>/add_item/
```

---

## 🤖 Machine Learning

O sistema possui um módulo de **previsão de vendas** desenvolvido utilizando:

- Python
- Pandas
- Scikit-Learn
- Random Forest
- Joblib

O objetivo do modelo é utilizar o histórico de vendas da cafeteria para estimar a quantidade de vendas esperada para um produto.

### Preparação dos dados

O histórico de vendas é obtido diretamente do banco de dados através do Django ORM.

Os dados são transformados em uma estrutura de vendas diárias por produto.

O sistema também completa os dias sem vendas com quantidade `0`, permitindo que o modelo trabalhe com uma sequência temporal contínua.

### Features utilizadas

O modelo utiliza informações como:

- Produto
- Quantidade vendida no dia
- Dia da semana
- Dia do mês
- Dia do ano
- Vendas do dia anterior
- Vendas de 7 dias atrás
- Vendas de 14 dias atrás
- Média móvel de 7 dias
- Média móvel de 14 dias

As médias móveis utilizam apenas informações anteriores ao dia previsto para evitar vazamento de dados.

### Treinamento

O conjunto histórico é dividido temporalmente entre dados de treinamento e teste.

O modelo utilizado atualmente é:

```text
RandomForestRegressor
```

O modelo treinado é salvo utilizando Joblib:

```text
backend/ml_models/sales_model.joblib
```

Esse arquivo contém:

- Modelo treinado
- Encoder utilizado no treinamento

### Executando o seed do Machine Learning

Antes de utilizar a previsão de vendas, execute:

```bash
docker compose exec backend python manage.py seed_ml
```

O comando gera os dados históricos necessários para o treinamento e utilização do modelo.

---

## 🔮 Previsão de vendas

A previsão pode ser obtida através do endpoint:

```http
GET /api/ml/predict/<product_name>/
```

### Exemplo

```http
GET /api/ml/predict/Americano/
```

### Resposta

```json
{
    "product": "Americano",
    "prediction": 0.05
}
```

A propriedade `prediction` representa a quantidade estimada de vendas para o produto.

> **Observação:** como o modelo trabalha com dados históricos e utiliza um modelo de regressão, a previsão pode resultar em valores decimais.

---

## 📊 Avaliação do modelo

O modelo é avaliado utilizando **MAE (Mean Absolute Error)**.

Também é utilizado um baseline baseado na venda do dia anterior (`lag_1`) para comparar o desempenho do modelo.

Nos dados sintéticos utilizados durante o desenvolvimento:

```text
Random Forest MAE: 1.0826
Baseline MAE:      1.2856
```

O modelo apresentou uma redução aproximada de **15,8% no MAE em relação ao baseline** nesse conjunto de teste.

> Os resultados acima são referentes aos dados sintéticos utilizados no desenvolvimento e não representam necessariamente a performance esperada com dados reais.

---

## 🧠 Funcionalidades

### Usuário

- Login
- Logout
- Visualização de produtos
- Adição de produtos ao carrinho
- Finalização de pedidos
- Histórico de pedidos

### Administração

- Gerenciamento de produtos
- Gerenciamento de categorias
- Gerenciamento de pedidos
- Controle de estoque
- Gerenciamento de clientes
- Sistema de caixa
- Gerenciamento de pagamentos
- Dashboard administrativo

### Machine Learning

- Geração de histórico de vendas
- Preparação de dados
- Criação de features temporais
- Criação de lags
- Médias móveis
- Treinamento do modelo
- Avaliação utilizando MAE
- Persistência do modelo
- Previsão de vendas por produto

### Sistema

- API REST
- Autenticação JWT
- Seed do banco
- Seed específico para Machine Learning
- Documentação Swagger
- CORS configurado
- Docker
- PostgreSQL
- Deploy em produção

---

## 🌍 Deploy

O projeto está hospedado na Railway.

### Produção

**Frontend**

```text
Railway
```

**Backend**

```text
Railway
```

**Banco de dados**

```text
PostgreSQL
```

---

## ⚙️ Variáveis de ambiente

### Backend

Crie um arquivo `.env` contendo as variáveis necessárias:

```env
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=*
DATABASE_URL=
CORS_ALLOWED_ORIGINS=
```

### Frontend

Configure:

```env
NEXT_PUBLIC_API_URL=https://cafeteria-inteligente-api-backend.up.railway.app
```

---

## 🐳 Docker

O projeto possui suporte completo para Docker.

Para iniciar o sistema:

```bash
docker compose up --build
```

Para executar comandos dentro do container do backend:

```bash
docker compose exec backend python manage.py <comando>
```

### Exemplos

Executar migrations:

```bash
docker compose exec backend python manage.py migrate
```

Executar seed principal:

```bash
docker compose exec backend python manage.py seed
```

Executar seed do Machine Learning:

```bash
docker compose exec backend python manage.py seed_ml
```

Criar superusuário:

```bash
docker compose exec backend python manage.py createsuperuser
```

---

## 💻 Execução local

Também é possível executar o projeto sem Docker.

### Backend

Entre no diretório:

```bash
cd backend
```

Crie o ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual.

Linux/macOS:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute as migrations:

```bash
python manage.py migrate
```

Execute o seed principal:

```bash
python manage.py seed
```

Execute o seed do Machine Learning:

```bash
python manage.py seed_ml
```

Inicie o servidor:

```bash
python manage.py runserver
```

### Frontend

Em outro terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm run dev
```

---

## 📦 Estrutura do projeto

```text
cafeteria-inteligente/
│
├── backend/
│   ├── config/
│   ├── apps/
│   │   ├── users/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── payments/
│   │   ├── stock/
│   │   └── ml/
│   │       ├── services/
│   │       │   ├── sales_data.py
│   │       │   ├── features.py
│   │       │   ├── train.py
│   │       │   └── predict.py
│   │       ├── models.py
│   │       ├── serializers.py
│   │       ├── views.py
│   │       └── urls.py
│   │
│   ├── ml_models/
│   │   └── sales_model.joblib
│   │
│   ├── media/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── types/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 📚 Documentação da API

A API possui documentação interativa utilizando Swagger/OpenAPI.

### Swagger

https://cafeteria-inteligente-api-backend.up.railway.app/api/docs/

A documentação permite visualizar e testar os principais endpoints da API.

---

## 🏷️ Versão

### v1.0.0

Primeira versão estável do projeto.

Inclui:

- Login e autenticação JWT
- API REST
- Gerenciamento de produtos
- Gerenciamento de pedidos
- Carrinho
- Histórico de pedidos
- Controle de estoque
- Sistema de caixa
- Pagamentos
- Frontend integrado
- Deploy em produção
- Machine Learning para previsão de vendas

---

## ✨ Próximos passos

Algumas melhorias planejadas para futuras versões:

- Pagamento real com Stripe ou Mercado Pago
- Sistema de avaliações
- Cache de produtos
- Otimização de performance
- Melhorias no modelo de previsão de vendas
- Utilização de dados reais para treinamento
- Novas features para o modelo de Machine Learning
- Monitoramento da performance do modelo

---

## 🔗 Links

### 🌐 Frontend

https://cafeteria-inteligente-frontend-production.up.railway.app

### 🚀 Backend

https://cafeteria-inteligente-api-backend.up.railway.app

### 📖 Swagger

https://cafeteria-inteligente-api-backend.up.railway.app/api/docs/

### 💻 GitHub

https://github.com/guilhermebatis/cafeteria-inteligente-api

---

## 👨‍💻 Autor

Projeto desenvolvido por **Guilherme Batista**.

---

## 📄 Licença

Este projeto está sob a licença MIT.
