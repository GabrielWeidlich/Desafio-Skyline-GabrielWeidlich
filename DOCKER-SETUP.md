# 🐳 Docker Setup

## 📁 Estrutura de Arquivos

```
├── src/
│   ├── Dockerfile          # Backend container
│   └── ...                 # Código do backend
├── frontend/
│   ├── Dockerfile          # Frontend container
│   ├── nginx.conf          # Configuração nginx para produção
│   └── ...                 # Código do frontend
├── docker-compose.yml      # Ambiente de desenvolvimento
├── docker-compose.prod.yml # Ambiente de produção
└── .env                    # Variáveis de ambiente
```

## 🚀 Como Usar

### Desenvolvimento
```bash
# Iniciar todos os serviços (backend + frontend + db)
docker-compose up

# Ou em modo detached
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Produção
```bash
# Iniciar ambiente de produção
docker-compose -f docker-compose.prod.yml up -d

# Parar ambiente de produção
docker-compose -f docker-compose.prod.yml down
```

## 🌐 Portas

| Serviço | Desenvolvimento | Produção |
|---------|----------------|----------|
| Backend | 3000 | 3000 |
| Frontend | 5173 | 80 |
| Database | 5432 | 5432 |

## 🔧 Variáveis de Ambiente (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/skyline_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=skyline_db

# Backend
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info

# Frontend
VITE_API_URL=http://localhost:3000/api
```

## 🏗️ Build Containers

```bash
# Build backend
docker-compose build backend

# Build frontend
docker-compose build frontend

# Build todos
docker-compose build
```

## 📊 Acesso aos Serviços

### Desenvolvimento
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check Backend**: http://localhost:3000/health
- **Database**: localhost:5432

### Produção
- **Aplicação**: http://localhost:80 (frontend + proxy para backend)
- **Backend API**: http://localhost:3000/api (direto)
- **Health Check**: http://localhost/health

## 🔍 Comandos Úteis

```bash
# Entrar no container backend
docker-compose exec backend sh

# Entrar no container frontend
docker-compose exec frontend sh

# Entrar no database
docker-compose exec db psql -U postgres -d skyline_db

# Ver status dos containers
docker-compose ps

# Reiniciar serviço específico
docker-compose restart backend

# Logs de tempo real
docker-compose logs -f --tail=100 backend
```

## 🛠️ Desenvolvimento

### Backend
- Hot-reload ativado
- Volume montado: `./src:/app`
- Acessível em http://localhost:3000

### Frontend
- Hot-reload ativado
- Volume montado: `./frontend:/app`
- Acessível em http://localhost:5173
- Proxy configurado para `/api` → backend

## 🚀 Produção

### Backend
- Build otimizado
- Usuário não-root
- Health check configurado
- Cache de dependencies

### Frontend
- Build estático com Vite
- Servido por nginx
- Configuração de proxy para API
- Headers de segurança
- Gzip compression

## 🔧 Problemas Comuns

### Portas já em uso
```bash
# Verificar processos nas portas
netstat -tulpn | grep :3000
netstat -tulpn | grep :5173

# Matar processos
sudo kill -9 <PID>
```

### Permissões
```bash
# Se tiver problemas com permissões no Linux/Mac
sudo chown -R $USER:$USER .
```

### Rebuild necessário
```bash
# Se modificar Dockerfiles ou dependencies
docker-compose build --no-cache
```

## 📝 Notas

- O frontend em desenvolvimento usa proxy Vite para `/api`
- Em produção, nginx faz proxy para backend
- Database persiste dados em volume `postgres_data`
- Health checks garantem ordem correta de inicialização
