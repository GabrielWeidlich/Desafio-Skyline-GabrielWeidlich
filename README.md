# 🚀 Skyline Tasks

**Sistema completo de gerenciamento de tarefas com agendamento, desenvolvido para desafio de estágio.**

---

## 📋 Visão Geral

Skyline Tasks é uma aplicação full-stack moderna que permite criar, gerenciar e agendar tarefas com prioridades e datas de vencimento. Inspirado no Google Tasks, oferece uma interface intuitiva com feedback visual inteligente baseado na proximidade dos prazos.

---

## ✨ Funcionalidades Principais

### 🎯 Core Features
- ✅ **CRUD Completo**: Criar, ler, atualizar e deletar tarefas
- 📅 **Agendamento**: Definir datas de vencimento para tarefas
- 🎨 **Prioridades**: 4 níveis (Baixa, Média, Alta, Urgente)
- 📝 **Descrições**: Campos opcionais para detalhes
- ✏️ **Edição Inline**: Editar tarefas diretamente na lista

### 🎨 Interface & UX
- 🌙 **Tema Escuro**: Interface moderna e profissional
- 🎯 **Cores Dinâmicas**: Feedback visual baseado na urgência
  - 🔴 Vermelho: Tarefas vencidas
  - 🟠 Laranja: Vence hoje
  - 🟡 Amarelo: Vence amanhã
  - ⚪ Neutro: Longo prazo
- 📱 **Design Responsivo**: Adaptável a diferentes dispositivos
- ⚡ **Feedback Visual**: Loading states e animações suaves

### 🧠 Inteligência
- 📊 **Formatação Inteligente**: "Hoje", "Amanhã", "Em X dias"
- 🔍 **Busca e Filtros**: Por prioridade e status
- 📈 **Ordenação**: Por data de criação

---

## 🏗️ Arquitetura

### 📁 Estrutura do Projeto
```
Desafio-Skyline-GabrielWeidlich/
├── src/                    # Backend Node.js
│   ├── controllers/        # Lógica de negócio
│   ├── repositories/       # Acesso a dados
│   ├── validators/         # Validação Zod
│   ├── db/                # Schema e migrations
│   └── routes/            # Endpoints API
├── frontend/              # Frontend React
│   ├── src/
│   │   ├── App.tsx       # Componente principal
│   │   └── index.css     # Estilos globais
│   └── package.json
├── docker-compose.yml     # Orquestração
└── README.md
```

### 🗄️ Banco de Dados
**PostgreSQL** com schema otimizado:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  priority VARCHAR DEFAULT 'MEDIUM',
  dueDate TIMESTAMP,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

**Índices** para performance:
- `tasks_due_date_idx` para consultas de agendamento

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Drizzle ORM** - Query builder type-safe
- **PostgreSQL** - Banco de dados
- **Zod** - Validação de schemas
- **Docker** - Containerização

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Styling utility-first
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones modernos

### DevOps
- **Docker Compose** - Orquestração
- **Hot Reload** - Desenvolvimento rápido
- **Type Safety** - End-to-end TypeScript

---

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose
- Node.js (para desenvolvimento local)

### 1. Ambiente Docker (Recomendado)
```bash
# Clonar repositório
git clone <repository-url>
cd Desafio-Skyline-GabrielWeidlich

# Configurar ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Iniciar todos os serviços
docker-compose up --build

# Acessar aplicação
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Banco: localhost:5432
```

### 2. Desenvolvimento Local
```bash
# Backend
cd src
npm install
npm run dev

# Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### Tasks
- `GET /api/tasks` - Listar todas as tarefas
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Payload Examples
```typescript
// Criar tarefa
POST /api/tasks
{
  "title": "Estudar React",
  "description": "Completar tutorial oficial",
  "priority": "HIGH",
  "dueDate": "2024-03-10T14:30:00.000Z"
}

// Atualizar tarefa
PUT /api/tasks/uuid
{
  "completed": true,
  "dueDate": "2024-03-15T10:00:00.000Z"
}
```

---

## 🎯 Destaques Técnicos

### 🔒 Type Safety
- **End-to-end TypeScript**: Do frontend ao backend
- **Zod Schemas**: Validação runtime com inferência de tipos
- **Drizzle ORM**: Queries type-safe e autocompletar

### 🚀 Performance
- **Índices otimizados** para consultas de data
- **Lazy loading** de componentes
- **Hot reload** para desenvolvimento rápido

### 🎨 Design Patterns
- **Repository Pattern**: Separação de responsabilidades
- **Controller Pattern**: Lógica de negócio organizada
- **Schema-First**: Validação como fonte da verdade

### 🐳 Docker
- **Multi-stage builds** para imagens otimizadas
- **Health checks** para dependências
- **Volume mounts** para desenvolvimento

---

## 🧪 Testes

```bash
# Backend
cd src
npm test

# Frontend
cd frontend
npm run lint
```

---

## 📈 Roadmap

- [ ] Autenticação de usuários
- [ ] Notificações de vencimento
- [ ] Categorias e tags
- [ ] Dashboard analytics
- [ ] Mobile app (React Native)

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie feature branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para branch (`git push origin feature/amazing-feature`)
5. Abra Pull Request

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Gabriel Weidlich**  
Desenvolvedor Full Stack | TypeScript | React | Node.js

*Desenvolvido como parte do desafio de estágio Skyline* 🚀

---

## 🎉 Demonstração

### Tarefas com Agendamento
![Tasks with due dates](docs/tasks-demo.png)

### Interface Responsiva
![Mobile view](docs/mobile-view.png)

---

**"A simplicidade é o último grau de sofisticação."** - Leonardo da Vinci
