CATEGORIES = [
    "Cafés",
    "Bebidas Geladas",
    "Chás",
    "Doces",
    "Salgados",
    "Combos",
]

PRODUCTS = [
    # Cafés
    {
        "name": "Espresso",
        "description": "Café espresso tradicional.",
        "price": 6.50,
        "category": "Cafés",
        "barcode": "100001"
    },
    {
        "name": "Espresso Duplo",
        "description": "Dose dupla de espresso.",
        "price": 8.50,
        "category": "Cafés",
        "barcode": "100002"
    },
    {
        "name": "Americano",
        "description": "Espresso com água quente.",
        "price": 7.50,
        "category": "Cafés",
        "barcode": "100003"
    },
    {
        "name": "Cappuccino",
        "description": "Espresso com leite vaporizado.",
        "price": 12.90,
        "category": "Cafés",
        "barcode": "100004"
    },
    {
        "name": "Latte",
        "description": "Leite vaporizado e espresso.",
        "price": 13.90,
        "category": "Cafés",
        "barcode": "100005"
    },
    {
        "name": "Mocha",
        "description": "Chocolate e espresso.",
        "price": 15.90,
        "category": "Cafés",
        "barcode": "100006"
    },
    {
        "name": "Macchiato",
        "description": "Espresso com espuma de leite.",
        "price": 11.90,
        "category": "Cafés",
        "barcode": "100007"
    },

    # Bebidas
    {
        "name": "Chocolate Quente",
        "description": "Chocolate quente cremoso.",
        "price": 14.90,
        "category": "Bebidas Geladas",
        "barcode": "100008"
    },
    {
        "name": "Frappuccino",
        "description": "Café gelado batido.",
        "price": 17.90,
        "category": "Bebidas Geladas",
        "barcode": "100009"
    },
    {
        "name": "Café Gelado",
        "description": "Cold Brew.",
        "price": 13.90,
        "category": "Bebidas Geladas",
        "barcode": "100010"
    },

    # Chás
    {
        "name": "Chá Verde",
        "description": "Chá verde natural.",
        "price": 8.90,
        "category": "Chás",
        "barcode": "100011"
    },
    {
        "name": "Chá Preto",
        "description": "Chá preto.",
        "price": 8.90,
        "category": "Chás",
        "barcode": "100012"
    },
    {
        "name": "Chá de Camomila",
        "description": "Infusão de camomila.",
        "price": 8.90,
        "category": "Chás",
        "barcode": "100013"
    },

    # Doces
    {
        "name": "Brownie",
        "description": "Brownie de chocolate.",
        "price": 9.90,
        "category": "Doces",
        "barcode": "100014"
    },
    {
        "name": "Cookie",
        "description": "Cookie artesanal.",
        "price": 7.90,
        "category": "Doces",
        "barcode": "100015"
    },
    {
        "name": "Cheesecake",
        "description": "Cheesecake tradicional.",
        "price": 15.90,
        "category": "Doces",
        "barcode": "100016"
    },
    {
        "name": "Donut",
        "description": "Donut recheado.",
        "price": 8.90,
        "category": "Doces",
        "barcode": "100017"
    },
    {
        "name": "Croissant Doce",
        "description": "Croissant doce.",
        "price": 10.90,
        "category": "Doces",
        "barcode": "100018"
    },

    # Salgados
    {
        "name": "Pão de Queijo",
        "description": "Tradicional mineiro.",
        "price": 6.90,
        "category": "Salgados",
        "barcode": "100019"
    },
    {
        "name": "Croissant de Presunto",
        "description": "Croissant recheado.",
        "price": 12.90,
        "category": "Salgados",
        "barcode": "100020"
    },
    {
        "name": "Sanduíche Natural",
        "description": "Sanduíche de frango.",
        "price": 16.90,
        "category": "Salgados",
        "barcode": "100021"
    },
    {
        "name": "Empada",
        "description": "Empada de frango.",
        "price": 8.90,
        "category": "Salgados",
        "barcode": "100022"
    },
    {
        "name": "Quiche",
        "description": "Quiche de queijo.",
        "price": 11.90,
        "category": "Salgados",
        "barcode": "100023"
    },

    # Combos
    {
        "name": "Combo Café + Cookie",
        "description": "Espresso + Cookie.",
        "price": 13.90,
        "category": "Combos",
        "barcode": "100024"
    },
    {
        "name": "Combo Cappuccino + Brownie",
        "description": "Cappuccino + Brownie.",
        "price": 21.90,
        "category": "Combos",
        "barcode": "100025"
    },
]

INGREDIENTS = [
    {
        "name": "Café em grãos",
        "stock_quantity": 500000,
        "unit": "g",
        "minimum_stock": 500
    },
    {
        "name": "Leite Integral",
        "stock_quantity": 2000,
        "unit": "l",
        "minimum_stock": 5
    },
    {
        "name": "Leite Desnatado",
        "stock_quantity": 1000,
        "unit": "l",
        "minimum_stock": 2
    },
    {
        "name": "Leite Vegetal",
        "stock_quantity": 1000,
        "unit": "l",
        "minimum_stock": 2
    },
    {
        "name": "Chocolate em pó",
        "stock_quantity": 300000,
        "unit": "g",
        "minimum_stock": 300
    },
    {
        "name": "Chocolate meio amargo",
        "stock_quantity": 200000,
        "unit": "g",
        "minimum_stock": 200
    },
    {
        "name": "Açúcar",
        "stock_quantity": 500000,
        "unit": "g",
        "minimum_stock": 500
    },
    {
        "name": "Adoçante",
        "stock_quantity": 150000,
        "unit": "ml",
        "minimum_stock": 200
    },
    {
        "name": "Canela",
        "stock_quantity": 100000,
        "unit": "g",
        "minimum_stock": 100
    },
    {
        "name": "Chantilly",
        "stock_quantity": 500,
        "unit": "l",
        "minimum_stock": 1
    },
    {
        "name": "Calda de Chocolate",
        "stock_quantity": 300000,
        "unit": "ml",
        "minimum_stock": 300
    },
    {
        "name": "Calda de Caramelo",
        "stock_quantity": 300000,
        "unit": "ml",
        "minimum_stock": 300
    },
    {
        "name": "Baunilha",
        "stock_quantity": 100000,
        "unit": "ml",
        "minimum_stock": 100
    },
    {
        "name": "Água Filtrada",
        "stock_quantity": 5000,
        "unit": "l",
        "minimum_stock": 10
    },
    {
        "name": "Gelo",
        "stock_quantity": 100000,
        "unit": "g",
        "minimum_stock": 10000
    },
    {
        "name": "Chá Preto",
        "stock_quantity": 100000,
        "unit": "g",
        "minimum_stock": 1000
    },
    {
        "name": "Chá Verde",
        "stock_quantity": 10000,
        "unit": "g",
        "minimum_stock": 1000
    },
    {
        "name": "Camomila",
        "stock_quantity": 10000,
        "unit": "g",
        "minimum_stock": 1000
    },
    {
        "name": "Pão de Queijo (massa)",
        "stock_quantity": 30000,
        "unit": "g",
        "minimum_stock": 5000
    },
    {
        "name": "Farinha de Trigo",
        "stock_quantity": 50000,
        "unit": "g",
        "minimum_stock": 5000
    },
    {
        "name": "Manteiga",
        "stock_quantity": 20000,
        "unit": "g",
        "minimum_stock": 3000
    },
    {
        "name": "Queijo Mussarela",
        "stock_quantity": 30000,
        "unit": "g",
        "minimum_stock": 5000
    },
    {
        "name": "Presunto",
        "stock_quantity": 30000,
        "unit": "g",
        "minimum_stock": 5000
    },
    {
        "name": "Frango Desfiado",
        "stock_quantity": 30000,
        "unit": "g",
        "minimum_stock": 5000
    },
]

RECIPES = {
    # Cafés
    "Espresso": [
        ("Café em grãos", 18),
        ("Água Filtrada", 0.05),
    ],
    "Espresso Duplo": [
        ("Café em grãos", 36),
        ("Água Filtrada", 0.05),
    ],
    "Americano": [
        ("Café em grãos", 18),
        ("Água Filtrada", 0.15),
    ],
    "Cappuccino": [
        ("Café em grãos", 18),
        ("Leite Integral", 0.15),
    ],
    "Latte": [
        ("Café em grãos", 18),
        ("Leite Integral", 0.2),
    ],
    "Mocha": [
        ("Café em grãos", 18),
        ("Leite Integral", 0.15),
        ("Chocolate em pó", 20),
    ],
    "Macchiato": [
        ("Café em grãos", 18),
        ("Leite Integral", 0.03),
    ],

    # Bebidas
    "Chocolate Quente": [
        ("Leite Integral", 0.2),
        ("Chocolate em pó", 30),
        ("Chantilly", 0.02),
    ],
    "Frappuccino": [
        ("Café em grãos", 18),
        ("Leite Integral", 0.15),
        ("Gelo", 100),
        ("Chantilly", 0.02),
    ],
    "Café Gelado": [
        ("Café em grãos", 25),
        ("Água Filtrada", 0.2),
        ("Gelo", 100),
    ],

    # Chás
    "Chá Verde": [
        ("Chá Verde", 3),
        ("Água Filtrada", 0.2),
    ],
    "Chá Preto": [
        ("Chá Preto", 3),
        ("Água Filtrada", 0.2),
    ],
    "Chá de Camomila": [
        ("Camomila", 3),
        ("Água Filtrada", 0.2),
    ],

    # Doces
    "Brownie": [
        ("Chocolate meio amargo", 40),
        ("Farinha de Trigo", 30),
        ("Manteiga", 20),
        ("Açúcar", 20),
    ],
    "Cookie": [
        ("Farinha de Trigo", 25),
        ("Chocolate meio amargo", 15),
        ("Manteiga", 10),
        ("Açúcar", 10),
    ],
    "Cheesecake": [
        ("Farinha de Trigo", 20),
        ("Manteiga", 15),
        ("Açúcar", 25),
    ],
    "Donut": [
        ("Farinha de Trigo", 30),
        ("Açúcar", 15),
        ("Chocolate em pó", 10),
    ],
    "Croissant Doce": [
        ("Farinha de Trigo", 40),
        ("Manteiga", 25),
        ("Açúcar", 10),
    ],

    # Salgados
    "Pão de Queijo": [
        ("Pão de Queijo (massa)", 50),
        ("Queijo Mussarela", 20),
    ],
    "Croissant de Presunto": [
        ("Farinha de Trigo", 40),
        ("Manteiga", 20),
        ("Presunto", 30),
        ("Queijo Mussarela", 20),
    ],
    "Sanduíche Natural": [
        ("Frango Desfiado", 60),
        ("Queijo Mussarela", 15),
    ],
    "Empada": [
        ("Farinha de Trigo", 30),
        ("Frango Desfiado", 40),
    ],
    "Quiche": [
        ("Farinha de Trigo", 30),
        ("Queijo Mussarela", 30),
        ("Manteiga", 15),
    ],

    # Combos
    "Combo Café + Cookie": [
        ("Café em grãos", 18),
        ("Água Filtrada", 0.05),
        ("Farinha de Trigo", 25),
        ("Chocolate meio amargo", 15),
        ("Manteiga", 10),
        ("Açúcar", 10),
    ],
    "Combo Cappuccino + Brownie": [
        ("Café em grãos", 18),
        ("Leite Integral", 0.15),
        ("Chocolate meio amargo", 40),
        ("Farinha de Trigo", 30),
        ("Manteiga", 20),
        ("Açúcar", 20),
    ],
}

CUSTOMERS = [
    {
        "name": "João Silva",
        "cpf": "123.456.789-00",
        "phone": "11912345678",
        "email": ""
    },
    {
        "name": "Ana Beatriz Souza",
        "cpf": "234.567.890-11",
        "phone": "11923456789",
        "email": "ana.souza@example.com"
    },
    {
        "name": "Bruno Carvalho",
        "cpf": "345.678.901-22",
        "phone": "11934567890",
        "email": "bruno.carvalho@example.com"
    },
    {
        "name": "Carla Mendes",
        "cpf": "456.789.012-33",
        "phone": "11945678901",
        "email": ""
    },
    {
        "name": "Diego Fernandes",
        "cpf": "567.890.123-44",
        "phone": "11956789012",
        "email": "diego.fernandes@example.com"
    },
    {
        "name": "Elisa Ramos",
        "cpf": "",
        "phone": "11967890123",
        "email": "elisa.ramos@example.com"
    },
    {
        "name": "Consumidor Final",
        "cpf": "00000000000",
        "phone": "",
        "email": ""
    },
]

USERS = [
    {
        "username": "caixa1",
        "email": "caixa1@example.com",
        "password": "caixa123",
        "is_staff": True,
        "is_superuser": False
    },
    {
        "username": "caixa2",
        "email": "caixa2@example.com",
        "password": "caixa123",
        "is_staff": True,
        "is_superuser": False
    },
]

PAYMENTS = [
    {
        "order_index": 0,   # João Silva - Espresso x2, Brownie x1
        "method": "PIX",
        "status": "APPROVED",
        "external_id": "PIX-8F3A1C2D",
    },
    {
        "order_index": 1,   # Ana Beatriz Souza - Cappuccino, Croissant Doce
        "method": "CREDIT_CARD",
        "status": "APPROVED",
        "external_id": "TXN-4471829",
    },
    {
        "order_index": 2,   # Bruno Carvalho - Latte, Cookie x2 (não concluído)
        "method": "DEBIT_CARD",
        "status": "PENDING",
        "external_id": None,
    },
    {
        "order_index": 3,   # Carla Mendes - Chá Verde, Pão de Queijo x3
        "method": "CASH",
        "status": "APPROVED",
        "external_id": None,
    },
    {
        "order_index": 4,   # Diego Fernandes - Frappuccino, Donut (não concluído)
        "method": "PIX",
        "status": "REJECTED",
        "external_id": "PIX-9B2E7A11",
    },
    {
        "order_index": 5,   # Elisa Ramos - Mocha, Cheesecake
        "method": "CREDIT_CARD",
        "status": "APPROVED",
        "external_id": "TXN-5528931",
    },
    {
        "order_index": 6,   # João Silva - Sanduíche Natural, Café Gelado
        "method": "PIX",
        "status": "APPROVED",
        "external_id": "PIX-3C6D9F02",
    },
    {
        "order_index": 7,   # sem customer - Combo Café + Cookie (não concluído)
        "method": "CASH",
        "status": "PENDING",
        "external_id": None,
    },
    {
        "order_index": 8,   # Ana Beatriz Souza - Combo Cappuccino + Brownie x2
        "method": "DEBIT_CARD",
        "status": "APPROVED",
        "external_id": "TXN-6693047",
    },
    {
        "order_index": 9,   # Bruno Carvalho - Empada x2, Chá Preto, Quiche
        "method": "PIX",
        "status": "APPROVED",
        "external_id": "PIX-1A4B7E55",
    },
]

STOCK_MOVEMENTS = [
    # Entradas iniciais (compra/reposição do estoque inicial de cada ingrediente)
    {
        "ingredient": "Café em grãos",
        "quantity": 5000,
        "movement_type": "IN",
        "reason": "Compra inicial de fornecedor",
    },
    {
        "ingredient": "Leite Integral",
        "quantity": 20,
        "movement_type": "IN",
        "reason": "Compra inicial de fornecedor",
    },
    {
        "ingredient": "Leite Vegetal",
        "quantity": 10,
        "movement_type": "IN",
        "reason": "Compra inicial de fornecedor",
    },
    {
        "ingredient": "Chocolate em pó",
        "quantity": 3000,
        "movement_type": "IN",
        "reason": "Compra inicial de fornecedor",
    },
    {
        "ingredient": "Farinha de Trigo",
        "quantity": 5000,
        "movement_type": "IN",
        "reason": "Compra inicial de fornecedor",
    },
    {
        "ingredient": "Queijo Mussarela",
        "quantity": 3000,
        "movement_type": "IN",
        "reason": "Compra inicial de fornecedor",
    },
    {
        "ingredient": "Leite Vegetal",
        "quantity": 1,
        "movement_type": "OUT",
        "reason": "Produto vencido - descarte",
    },
    {
        "ingredient": "Gelo",
        "quantity": 500,
        "movement_type": "OUT",
        "reason": "Ajuste de inventário",
    },
    {
        "ingredient": "Chá Verde",
        "quantity": 50,
        "movement_type": "IN",
        "reason": "Reposição de estoque",
    },
]
