#  Barber Francis API

API RESTful para gerenciamento de uma barbearia, permitindo controle de clientes, barbeiros, serviços e agendamentos.

---

##  Tecnologias utilizadas

* Python
* Django
* Django REST Framework
* SQLite

---

##  Funcionalidades

* Cadastro de clientes, barbeiros e serviços
* Criação de agendamentos
* Validação de conflito de horários (evita overbooking)
* Filtro de agendamentos por barbeiro e data
* Ordenação automática por horário
* API estruturada com ViewSets

---

##  Diferenciais

* Regra de negócio implementada (validação de horário)
* Filtros dinâmicos via query params
* Serializers com dados enriquecidos (nomes ao invés de IDs)
* Estrutura pronta para escalar (padrão DRF)

---

##  Endpoints principais

| Método | Endpoint                           |
| ------ | ---------------------------------- |
| GET    | /api/agendamentos/                 |
| POST   | /api/agendamentos/                 |
| GET    | /api/agendamentos/?barbeiro=1      |
| GET    | /api/agendamentos/?data=2026-04-15 |

---

##  Como rodar o projeto

```bash
git clone <repo>
cd barber_francis
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

##  Exemplo de resposta

```json
{
  "cliente": 1,
  "cliente_nome": "Luciano",
  "barbeiro": 1,
  "barbeiro_nome": "João",
  "servico": 1,
  "servico_nome": "Corte",
  "data_hora": "2026-04-15T14:00:00"
}
```

---

##  Autor

Desenvolvido por Luciano Rodrigues
