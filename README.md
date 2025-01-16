# Fauna - Sistema de Gerenciamento Veterinário

## 📋 Sobre o Projeto

Fauna é um sistema web moderno para gerenciamento de clínica veterinária, desenvolvido com React e TypeScript. O sistema oferece uma interface intuitiva para agendamento de consultas, gerenciamento de serviços e depoimentos, com área administrativa protegida.

## 🚀 Tecnologias Utilizadas

- **Frontend**:
  - React 18
  - TypeScript
  - TailwindCSS
  - Zustand (Gerenciamento de Estado)
  - React Router DOM
  - Lucide React (Ícones)
  - React Hook Form
  - Zod (Validação)

- **Backend**:
  - Node.js
  - Express
  - Mongoose (ODM)
  - MongoDB
  - JWT (Autenticação)
  - Bcrypt (Criptografia)

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

```
fauna/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Serviços de API
│   │   ├── types/         # Tipos TypeScript
│   │   └── utils/         # Funções utilitárias
│   └── public/            # Arquivos estáticos
│
└── server/                # Backend Node.js
    ├── src/
    │   ├── controllers/   # Controladores da API
    │   ├── models/        # Modelos do Mongoose
    │   ├── routes/        # Rotas da API
    │   ├── middleware/    # Middlewares
    │   └── utils/         # Funções utilitárias
    └── config/            # Configurações do MongoDB
```

## 🔒 Sistema de Autenticação

### Mecanismo de Login Admin

O sistema utiliza JWT (JSON Web Token) para autenticação segura:

1. **Login**:
   - Administrador fornece credenciais
   - Backend valida e retorna token JWT
   - Token é armazenado no localStorage
   - Estado global (Zustand) é atualizado

2. **Proteção de Rotas**:
   - Componente `PrivateRoute` verifica autenticação
   - Redireciona para login se não autenticado
   - Verifica validade do token

3. **Gerenciamento de Estado**:
   ```typescript
   interface AuthStore {
     isAuthenticated: boolean;
     token: string | null;
     login: (token: string) => void;
     logout: () => void;
   }
   ```

4. **Segurança**:
   - Tokens expiram em 24 horas
   - Senhas criptografadas com bcrypt
   - CORS configurado para segurança

## 🎯 Funcionalidades Principais

### 1. Área Pública

- **Home**: Apresentação da clínica
- **Sobre**: História e missão
- **Equipe**: Profissionais
- **Depoimentos**: Feedback de clientes
- **Serviços**: Serviços oferecidos
- **Contato**: Formulário de contato
- **Agendamento**: Modal de agendamento de consultas

### 2. Área Administrativa

- **Consultas**: Gerenciamento de agendamentos
  - Visualização de consultas
  - Confirmação/cancelamento
  - Histórico

- **Serviços**: Gestão de serviços
  - CRUD de serviços
  - Preços e descrições
  - Ativação/desativação

- **Depoimentos**: Moderação de depoimentos
  - Aprovação/rejeição
  - Destaque na home
  - Ordenação

### 3. Componentes Principais

#### Navbar
```typescript
interface MenuItem {
  label: string;
  href: string;
}

// Menu responsivo com:
// - Links de navegação
// - Dropdown administrativo
// - Autenticação integrada
// - Modal de agendamento
```

## 💻 Como Executar

1. **Pré-requisitos**:
   - Node.js >= 16
   - MongoDB Compass
   - npm ou yarn

2. **Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Variáveis de Ambiente**:
   ```env
   # .env
   MONGODB_URI="mongodb://localhost:27017/fauna"
   JWT_SECRET="seu_secret"
   ```

## 🔧 Configuração Inicial

1. **Banco de Dados**:
   - Instale o MongoDB Compass
   - Configure a conexão local
   - Execute o seed inicial de dados

2. **Admin**:
   - Usuário padrão criado no seed
   - Altere a senha no primeiro acesso

## 📱 Responsividade

- Design mobile-first
- Breakpoints customizados
- Menu hamburguer responsivo
- Layouts adaptáveis

## 🛠️ Manutenção

1. **Logs**:
   - Winston para logging
   - Rastreamento de erros

2. **Backups**:
   - Automáticos diários
   - Retenção de 30 dias

## 👥 Autor

- Henrique Terres de Oliveira