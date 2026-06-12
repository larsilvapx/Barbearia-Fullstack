# Francis Farmer Barber - Sistema de Agendamento para Barbearia

## Sobre o Projeto

O Francis Farmer Barber é uma aplicação Full Stack desenvolvida para gerenciamento de agendamentos em uma barbearia.

O sistema permite o cadastro e gerenciamento de clientes, barbeiros, serviços e agendamentos, oferecendo uma interface moderna e responsiva para facilitar o controle dos atendimentos.

O projeto foi desenvolvido como parte do meu processo de transição de carreira para a área de Desenvolvimento de Software e Dados, aplicando conceitos de desenvolvimento web, APIs REST, bancos de dados relacionais e deploy em produção.

---

## Tecnologias Utilizadas

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Recharts

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT
* CORS Headers
* WhiteNoise

### Banco de Dados

* PostgreSQL

### Deploy

* Render

---

## Funcionalidades

### Clientes

* Cadastro de clientes
* Listagem de clientes
* Edição de clientes
* Exclusão de clientes

### Barbeiros

* Cadastro de barbeiros
* Listagem de barbeiros
* Edição de barbeiros
* Exclusão de barbeiros

### Serviços

* Cadastro de serviços
* Listagem de serviços
* Edição de serviços
* Exclusão de serviços

### Agendamentos

* Cadastro de agendamentos
* Visualização dos agendamentos
* Atualização de agendamentos
* Exclusão de agendamentos
* Integração entre clientes, barbeiros e serviços

### Segurança

* Autenticação JWT
* Proteção de rotas
* Controle de acesso por token

### Relatórios

* Geração de relatório PDF dos agendamentos

---

## Estrutura do Projeto

frontend/
├── src/
├── components/
├── pages/
├── services/
└── types/

backend/
├── agendamento/
├── core/
├── serializers/
├── models/
├── views/
└── urls/

---

## Como Executar Localmente

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Melhorias Futuras

* Dashboard administrativo
* Controle de horários disponíveis em tempo real
* Notificações de agendamento
* Integração com WhatsApp
* Histórico de atendimentos
* Painel financeiro
* Deploy automatizado com CI/CD

---

## Autor

Luciano Rodrigues

Estudante de Análise e Desenvolvimento de Sistemas.

Atualmente em transição de carreira para Desenvolvimento de Software e Dados, buscando oportunidades para aprendizado, crescimento profissional e contribuição em projetos de tecnologia.
