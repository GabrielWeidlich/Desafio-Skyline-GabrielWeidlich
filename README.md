# Node.js TypeScript Prisma Project

Projeto Full Stack com Node.js, TypeScript, PostgreSQL e Prisma ORM, configurado com Docker para desenvolvimento e produção.

## 🏗️ Arquitetura dos Containers

```
┌─────────────────┐    ┌─────────────────┐
│   Docker Host   │    │   Docker Host   │
│                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │
│  │    App    │  │    │  │     DB    │  │
│  │  Node.js  │◄─┼────┼──►│PostgreSQL │  │
│  │ :3000     │  │    │  │ :5432     │  │
│  └───────────┘  │    │  └───────────┘  │
│                 │    │                 │
└─────────────────┘    └─────────────────┘
```

## 🚀 Comandos para Subir o Ambiente

### Desenvolvimento
```bash
# Subir todos os serviços
docker compose up

# Subir em modo detached
docker compose up -d

# Parar os serviços
docker compose down

# Ver logs
docker compose logs -f app
docker compose logs -f db
```

### Produção
```bash
# Build e executar em produção
docker compose --profile production up --build
```

## 📊 Dicionário de Dados

### Tabela: Users
| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| id | String | ID único do usuário | Primary Key, CUID |
| email | String | Email do usuário | Unique, Not Null |
| name | String | Nome do usuário | Not Null |
| createdAt | DateTime | Data de criação | Default: now() |
| updatedAt | DateTime | Última atualização | Auto-update |

### Tabela: Tasks
| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| id | String | ID único da tarefa | Primary Key, CUID |
| title | String | Título da tarefa | Not Null |
| description | String | Descrição detalhada | Optional |
| completed | Boolean | Status de conclusão | Default: false |
| priority | Priority | Nível de prioridade | Enum: LOW, MEDIUM, HIGH, URGENT |
| createdAt | DateTime | Data de criação | Default: now() |
| updatedAt | DateTime | Última atualização | Auto-update |
| userId | String | ID do usuário proprietário | Foreign Key → Users.id |

### Enum: Priority
- **LOW**: Baixa prioridade
- **MEDIUM**: Prioridade média (padrão)
- **HIGH**: Alta prioridade
- **URGENT**: Urgente

## 🔧 Estrutura do Projeto

```
src/
├── config/
│   └── settings.ts      # Centralizador de configurações com Zod
├── controllers/         # Controllers da API
├── services/           # Lógica de negócio
├── repositories/       # Camada de acesso a dados
├── index.ts           # Ponto de entrada da aplicação
└── healthcheck.ts     # Health check para Docker

prisma/
├── schema.prisma      # Schema do banco de dados
└── migrations/        # Migrações do Prisma
```

## ⚙️ Configuração

### Variáveis de Ambiente
O projeto utiliza validação de variáveis de ambiente com Zod. As variáveis obrigatórias são:

- **NODE_ENV**: Ambiente (development/production/test)
- **PORT**: Porta da aplicação (default: 3000)
- **DATABASE_URL**: URL de conexão com PostgreSQL
- **JWT_SECRET**: Chave secreta para JWT (mínimo 32 caracteres)
- **CORS_ORIGIN**: Origem permitida para CORS (opcional)
- **LOG_LEVEL**: Nível de log (error/warn/info/debug)

### Docker Configuration
- **Multi-stage builds**: Estágios de development e production
- **Hot-reload**: Suporte a live-reload no desenvolvimento
- **Health checks**: Verificação de saúde dos containers
- **Volumes persistência**: Dados do PostgreSQL persistidos
- **Wait-for-it**: Script para aguardar o banco estar pronto

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar com hot-reload
npm run build            # Compilar TypeScript
npm run start            # Iniciar produção

# Banco de Dados
npm run db:generate      # Gerar client Prisma
npm run db:migrate       # Rodar migrações
npm run db:push          # Push schema para DB
npm run db:studio        # Abrir Prisma Studio

# Testes
npm test                 # Rodar testes
```

## 📝 Exemplo de Uso

### Criar Usuário
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});
```

### Criar Tarefa
```typescript
const task = await prisma.task.create({
  data: {
    title: 'Minha primeira tarefa',
    description: 'Descrição detalhada',
    priority: 'HIGH',
    userId: user.id,
  },
});
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Porta 3000 em uso**
   ```bash
   # Verificar processo na porta
   netstat -tulpn | grep :3000
   
   # Matar processo
   kill -9 <PID>
   ```

2. **Erro de conexão com banco**
   ```bash
   # Verificar status do container
   docker compose ps
   
   # Verificar logs do banco
   docker compose logs db
   ```

3. **Permissões do wait-for-it.sh**
   ```bash
   # No Windows, o script funciona nativamente
   # No Linux/Mac:
   chmod +x wait-for-it.sh
   ```

## 📚 Tecnologias Utilizadas

- **Node.js 18+**: Runtime JavaScript
- **TypeScript**: Tipagem estática
- **Express**: Framework web
- **Prisma**: ORM moderno
- **PostgreSQL 15**: Banco de dados relacional
- **Docker**: Containerização
- **Zod**: Validação de schemas
- **tsx**: Execução TypeScript com hot-reload

# Prisma Models Organization

## 📁 Estrutura de Arquivos

Este diretório contém a documentação organizada dos modelos Prisma. 

**Importante:** Prisma não suporta nativamente importação de modelos de arquivos separados. Os modelos reais permanecem no `schema.prisma` principal, mas esta estrutura serve como:

- 📖 **Documentação separada** para cada modelo
- 🎯 **Referência rápida** durante o desenvolvimento  
- 🏗️ **Organização visual** da estrutura do banco

## 📂 Arquivos Disponíveis

- **`User.prisma`** - Documentação do modelo User
- **`Task.prisma`** - Documentação do modelo Task  
- **`Priority.prisma`** - Documentação do enum Priority

## 🔗 Como Funciona

1. **Schema Principal**: `prisma/schema.prisma` contém os modelos ativos
2. **Documentação**: Arquivos aqui servem como referência e organização
3. **Desenvolvimento**: Use estes arquivos para entender a estrutura sem precisar navegar pelo schema completo

## 💡 Dica

Ao adicionar novos modelos:
1. Adicione ao `schema.prisma` principal
2. Crie arquivo correspondente aqui para documentação
3. Mantenha ambos sincronizados


## 📄 Licença

MIT License
