# 💈 Barbearia Fullstack

Sistema completo de agendamento para barbearias, permitindo gerenciar clientes, barbeiros, serviços e horários de forma eficiente.

---

##  Sobre o projeto

Este projeto foi desenvolvido com o objetivo de simular um sistema real de gestão de barbearia, aplicando conceitos de desenvolvimento fullstack,
integração entre API e interface web, além de boas práticas de organização de código.

---

##  Arquitetura

O sistema é dividido em duas partes principais:

* **Backend:** responsável pelas regras de negócio e API
* **Frontend:** responsável pela interface do usuário

```
/backend  → API REST (Django)
/frontend → Interface (React)
```

---

##  Tecnologias utilizadas

###  Backend

* Python
* Django
* Django REST Framework

###  Frontend

* React
* Vite
* TypeScript
* Tailwind CSS

---

##  Funcionalidades

* ✅ Cadastro de clientes
* ✅ Cadastro de barbeiros
* ✅ Cadastro de serviços
* ✅ Criação de agendamentos
* ✅ Edição de agendamentos
* ✅ Exclusão de agendamentos
* ✅ Listagem com filtros
* ✅ Integração completa com API REST

---

##  Demonstração

> <img width="1546" height="482" alt="image" src="https://github.com/user-attachments/assets/c04ddb0f-95f6-419f-bbcf-a48eb66c9c0f" />
<img width="368" height="262" alt="image" src="https://github.com/user-attachments/assets/52a1a15e-9c76-40d7-be42-c059ddf01291" />



##  Como executar o projeto

###  Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

Servidor disponível em:

```
http://127.0.0.1:8000/
```

---

###  Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em:

```
http://localhost:5173/
```

---

##  Integração

O frontend consome a API do backend através de requisições HTTP, utilizando serviços centralizados para comunicação com os endpoints.

---

##  Aprendizados

Durante o desenvolvimento deste projeto, foram aplicados conceitos como:

* Estruturação de projetos fullstack
* Criação de APIs REST com Django
* Consumo de APIs com React
* Organização de código em camadas
* Integração entre frontend e backend
* Boas práticas com Git e versionamento

---

##  Próximas melhorias

* 🔐 Autenticação de usuários (login)
* 📅 Validação avançada de horários
* 📱 Responsividade completa
* ☁️ Deploy em produção
* 🧪 Testes automatizados

---

##  Autor

Desenvolvido por Luciano Rodrigues

---

##  Licença

Este projeto está sob a licença MIT.
