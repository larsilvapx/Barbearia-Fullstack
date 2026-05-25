💈 BarberPro

Sistema completo de gerenciamento para barbearias desenvolvido com React + TypeScript no frontend e Django REST Framework no backend.

O projeto permite controlar clientes, barbeiros, serviços e agendamentos, além de possuir dashboard financeiro, calendário inteligente e interface moderna responsiva.

🚀 Tecnologias Utilizadas

Frontend

React
TypeScript
Vite
TailwindCSS
React Router DOM
Axios
React Hot Toast
FullCalendar
Recharts
Lucide React


Backend

Python
Django
Django REST Framework
Simple JWT
SQLite


✨ Funcionalidades Implementadas

🔐 Autenticação
Login com JWT
Proteção de rotas
Logout seguro


👥 Clientes
Cadastro de clientes
Edição de clientes
Exclusão de clientes
Listagem dinâmica
Busca em tempo real


👨‍💼 Barbeiros
Cadastro de barbeiros
Percentual de comissão
Edição e exclusão
Integração financeira


✂️ Serviços
Cadastro de serviços
Valor dos serviços
Atualização dinâmica
Remoção de serviços

📅 Agendamentos
Criação de agendamentos
Seleção de cliente
Seleção de barbeiro
Seleção de serviço
Seleção de horário
Controle de horários disponíveis
Exclusão de agendamentos
Edição de agendamentos


🗓️ Calendário Inteligente
Visualização mensal
Visualização semanal
Visualização diária
Agenda por barbeiro
Filtro individual de profissionais
Eventos coloridos
Clique em eventos
Responsividade mobile


📊 Dashboard Financeiro
Total de agendamentos
Agendamentos do dia
Próximos atendimentos
Faturamento total
Controle de comissões
Gráfico de faturamento por serviço
Serviços mais vendidos
Busca dinâmica
Filtros inteligentes


📱 Responsividade
O sistema foi totalmente adaptado para:

Desktop
Tablet
Smartphones

Incluindo:

Sidebar mobile
Menu hamburguer
Layout adaptativo
Gráficos responsivos
Cards responsivos

🎨 Interface
Design moderno
Tema dark profissional
Animações suaves
Feedback visual
Modais customizados
UX otimizada

🧠 Estrutura Inteligente do Sistema
Backend

O backend foi estruturado utilizando:

Models
Serializers
ViewSets
Rotas REST
JWT Authentication
Frontend

O frontend utiliza:

Componentização
Hooks
Tipagem forte com TypeScript
Organização por páginas
Serviços centralizados de API

📂 Estrutura do Projeto
frontend/
 ├── src/
 │   ├── pages/
 │   ├── components/
 │   ├── services/
 │   ├── routes/
 │   └── types/

backend/
 ├── agendamento/
 ├── barberpro/
 ├── manage.py
⚙️ Como Rodar o Projeto
Backend
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver

Servidor:

http://127.0.0.1:8000
Frontend
cd frontend

npm install

npm run dev

Aplicação:

http://localhost:5173
🔑 Credenciais JWT

Endpoint:

/api/token/


📈 Próximos Upgrades
🟣 Nível Profissional
Controle financeiro avançado
Relatórios PDF
Dashboard administrativo
Multiusuário
Níveis de acesso
Confirmação por WhatsApp
Notificações automáticas
Deploy em produção
Integração com IA
PWA
Tema customizável

👨‍💻 Desenvolvedor

Projeto desenvolvido por Luciano Rodrigues com foco em:

Backend Python
Frontend React
APIs REST
UX/UI moderna
Sistemas profissionais completos


📌 Status do Projeto

🚧 Em desenvolvimento contínuo
✅ Estrutura principal finalizada
✅ Dashboard profissional implementado
✅ Calendário inteligente implementado
✅ Responsividade mobile implementada
✅ Controle financeiro implementado
