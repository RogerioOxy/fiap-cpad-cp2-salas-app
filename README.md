# FIAP Salas — CP2

Aplicativo mobile para consulta e reserva de salas, laboratorios e auditorios da FIAP.
Evolucao direta do MVP entregue no [CP1](https://github.com/RogerioOxy/fiap-cpad-cp1-salas-app), com autenticacao, persistencia, estado global e interface refinada.

---

## a) Sobre o Projeto

**FIAP Salas** resolve um problema real do dia a dia na FIAP: a dificuldade de saber quais salas estao disponiveis para estudo, reunioes de grupo ou aulas extras — agora com cadastro de usuarios e reservas individuais persistidas no dispositivo.

### Operacao da FIAP escolhida

A consulta e reserva de salas e uma necessidade diaria de todos os alunos. O CP1 limitava-se a mostrar a disponibilidade; o CP2 permite ao aluno **reservar um horario** numa sala disponivel, ver suas reservas ativas e cancelar quando precisar — tudo persistido localmente, por usuario.

### O que mudou em relacao ao CP1

| Area | CP1 | CP2 |
|------|-----|-----|
| Autenticacao | nao havia | Cadastro + Login com AsyncStorage e sessao lembrada |
| Estado | `useState` local em cada tela | **Context API global** (Auth, AppData, Theme) |
| Dados funcionais | mock estatico em `data/rooms.js` | Reservas persistidas por usuario via AsyncStorage |
| Formularios | nao havia | Validacao inline em todos (cadastro, login, reserva) |
| Telas | 3 (Home, Salas, Sobre) | **5 rotas** (Login, Cadastro, Home, Salas, Reservas, Sobre) |
| Tema visual | claro fixo | **Tema dinamico** (claro / escuro) com preferencia salva |
| Busca | filtro por andar | Busca em **tempo real** + filtro por andar |
| Navegacao | livre | Rotas privadas — usuario nao logado e redirecionado |
| Componentes | RoomCard, StatusBadge | + Button, Input, EmptyState, Loading, SearchBar, ThemeToggle |

### Funcionalidades implementadas

- Cadastro com nome, e-mail (validacao de formato), senha (min. 6) e confirmacao
- Login com validacao contra credenciais persistidas
- Sessao persistida — usuario logado nao precisa fazer login ao reabrir
- Logout com limpeza completa da sessao
- Listagem de salas com filtro por andar e busca em tempo real
- Reserva de sala em horarios pre-definidos (CRUD completo, persistido por usuario)
- Visualizacao e cancelamento das reservas do proprio usuario
- Validacao inline de TODOS os formularios (sem `Alert`)
- Tema dinamico (claro/escuro) alternavel pelo usuario, com preferencia salva
- Loading spinner em operacoes assincronas, mensagens de erro/sucesso e estados vazios

---

## b) Integrantes do Grupo

| Nome | RM |
|------|-----|
| Rogerio Deligi Ferreira Filho | RM561942 |
| Maria Fernanda Garavelli Dantas | RM562686 |

---

## c) Como Rodar o Projeto

### Pre-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- [Expo Go](https://expo.dev/go) instalado no celular (Android ou iOS) **ou** emulador Android/iOS
- Expo SDK 54

### Passo a passo

```bash
# 1. Clone o repositorio
git clone https://github.com/RogerioOxy/fiap-cpad-cp2-salas-app.git

# 2. Entre na pasta do projeto
cd fiap-cpad-cp2-salas-app

# 3. Instale as dependencias (com --legacy-peer-deps por causa do React 19)
npm install --legacy-peer-deps

# 4. Rode o projeto
npx expo start
```

5. Escaneie o QR Code com o app **Expo Go** no celular
   - Android: abra o Expo Go e escaneie diretamente
   - iOS: use a camera nativa e clique no link

> **Importante:** o `--legacy-peer-deps` resolve um conflito conhecido entre React 19 e algumas dependencias internas do Expo Router (radix-ui/vaul). Sem essa flag, o npm aborta com `ERESOLVE`.

> Caso o app reclame da versao do AsyncStorage, rode `npx expo install @react-native-async-storage/async-storage` para alinhar com o SDK.

> **Importante (Windows + OneDrive):** se o caminho do projeto contiver espacos, `&`, ou estiver dentro de uma pasta sincronizada do OneDrive, o Metro Bundler pode nao subir. Mova o projeto para um caminho limpo (ex: `C:\dev\fiap-cpad-cp2-salas-app`) antes de rodar.

---

## d) Demonstração Visual

### Prints das telas

Capturas reais do app rodando em iPhone (iOS) com Expo Go.

#### Tela Início (Home)

| Tema claro | Tema escuro |
|---|---|
| ![Home Light](./assets/screenshots/02-home-light.jpeg) | ![Home Dark](./assets/screenshots/01-home-dark.jpeg) |

#### Tela Salas — filtros, busca e detalhes

| Filtro 1º Andar (Light) | Filtro 2º Andar (Dark) | Busca em tempo real (Dark) |
|---|---|---|
| ![Salas Light](./assets/screenshots/03-salas-light-filtro-1andar.jpeg) | ![Salas Dark](./assets/screenshots/04-salas-dark-filtro-2andar.jpeg) | ![Busca](./assets/screenshots/05-salas-dark-busca-tempo-real.jpeg) |

| Detalhes da sala expandido | Modal de reserva |
|---|---|
| ![Detalhes](./assets/screenshots/06-salas-dark-detalhes-sala.jpeg) | ![Modal](./assets/screenshots/07-modal-reserva-dark.jpeg) |

#### Tela Reservas

| Tema claro | Tema escuro |
|---|---|
| ![Reservas Light](./assets/screenshots/09-reservas-light.jpeg) | ![Reservas Dark](./assets/screenshots/08-reservas-dark.jpeg) |

#### Tela Sobre

| Topo (Light) | Topo (Dark) | Informações Acadêmicas |
|---|---|---|
| ![Sobre Light](./assets/screenshots/10-sobre-light-topo.jpeg) | ![Sobre Dark](./assets/screenshots/12-sobre-dark-topo.jpeg) | ![Info](./assets/screenshots/11-sobre-light-info-academicas.jpeg) |

> Telas de **Login** e **Cadastro** seguem o mesmo padrão visual da tela "Sobre" (campos com Input customizado, validação inline em vermelho abaixo de cada campo, botão desabilitado enquanto há erros). Estão implementadas em `app/(auth)/login.jsx` e `app/(auth)/cadastro.jsx`.

---

## e) Decisões Técnicas

### Estrutura de pastas

```
fiap-cpad-cp2-salas-app/
├── app/
│   ├── _layout.js          # Layout raiz: Providers + auth gate
│   ├── (auth)/             # Rotas publicas
│   │   ├── _layout.js
│   │   ├── login.jsx
│   │   └── cadastro.jsx
│   └── (tabs)/             # Rotas privadas (apenas autenticado)
│       ├── _layout.js
│       ├── index.jsx       # Home
│       ├── salas.jsx       # Listagem + reserva
│       ├── reservas.jsx    # Reservas do usuario
│       └── sobre.jsx       # Perfil + logout + info
├── components/             # Componentes reutilizaveis
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── EmptyState.jsx
│   ├── Loading.jsx
│   ├── SearchBar.jsx
│   ├── ThemeToggle.jsx
│   ├── RoomCard.js         # mantido do CP1, adaptado ao tema
│   └── StatusBadge.js      # mantido do CP1, adaptado ao tema
├── context/
│   ├── AuthContext.jsx     # usuario logado, login/registro/logout
│   ├── AppDataContext.jsx  # reservas (CRUD persistido por usuario)
│   └── ThemeContext.jsx    # tema dinamico (light/dark)
├── constants/
│   ├── theme.js            # tokens (cores, spacing, radius, typography)
│   └── storageKeys.js      # chaves do AsyncStorage centralizadas
├── data/
│   └── rooms.js            # seed de salas + slots de horario
└── assets/
```

### Contexts

| Context | Responsabilidade |
|---------|------------------|
| `AuthContext` | usuario logado, hidratacao da sessao, `login`, `register`, `logout` |
| `AppDataContext` | reservas do usuario corrente, `addReservation`, `removeReservation` |
| `ThemeContext` | tema atual (light/dark), `toggleTheme`, hidratacao da preferencia |

Todos os Contexts hidratam a partir do AsyncStorage ao montar e expoem flags `hydrated` para evitar flash de UI errada.

### Autenticacao

A senha do usuario e armazenada em texto puro no AsyncStorage **apenas para fins didaticos** (o enunciado do CP2 proibe explicitamente bibliotecas de auth como Firebase Auth ou Supabase). Em producao, seria substituido por hashing (bcrypt/argon2) + token JWT armazenado no Expo SecureStore.

Fluxo:

1. `app/_layout.js` monta `ThemeProvider → AuthProvider → AppDataProvider`.
2. `RootStack` observa `useSegments()` e `useAuth().user`. Se nao ha usuario e a rota nao e `(auth)`, redireciona para `/login`. Se ha usuario e a rota e `(auth)`, redireciona para `/(tabs)`.
3. No login/cadastro, as credenciais sao persistidas em `STORAGE_KEYS.USERS` e a sessao em `STORAGE_KEYS.SESSION`.
4. Ao reabrir o app, `AuthContext` le `STORAGE_KEYS.SESSION`, valida contra a lista de usuarios e restaura o estado.

### AsyncStorage — chaves e dados

| Chave | Conteudo |
|-------|----------|
| `@fiap-salas:users` | array de `{ name, email, password }` |
| `@fiap-salas:session` | email do usuario logado (string) |
| `@fiap-salas:reservas` | objeto `{ "<email>": [ { id, roomId, roomName, slot, createdAt }, ... ] }` |
| `@fiap-salas:theme` | `"light"` ou `"dark"` |

As reservas sao agrupadas por email para que o mesmo dispositivo possa ter mais de um usuario sem misturar dados. As chaves vivem em `constants/storageKeys.js`.

### Navegacao protegida

Implementada no `app/_layout.js` via `useEffect` + `useSegments`. Sem flicker (esperamos `authHydrated` antes de decidir) e sem dependencia de bibliotecas externas — apenas Expo Router + Context API.

---

## f) Diferencial Implementado

### 1. Tema dinamico (Light / Dark mode)

**Por que escolhemos:** dark mode e expectativa basica em qualquer app moderno e tem impacto visual imediato em qualquer demonstracao. Combina perfeitamente com a obrigatoriedade do Context API — o `ThemeContext` distribui o objeto de tema (cores) para todos os componentes via `useTheme()` e persiste a preferencia em `AsyncStorage`.

**Como foi implementado:**
- `constants/theme.js` define dois objetos (`lightTheme` e `darkTheme`) com a mesma estrutura de chaves de cor (`background`, `surface`, `text`, `primary`, etc.).
- `ThemeContext` mantem o `mode` atual e expoe `toggleTheme` que tambem grava em AsyncStorage.
- Todos os componentes consomem o tema via `useTheme()` e estilizam as cores **dinamicamente** (`backgroundColor: c.surface` em vez de cores hardcoded).
- Um `ThemeToggle` no header das tabs e nas telas de auth permite alternar a qualquer momento.

### 2. Busca em tempo real

**Por que escolhemos:** o filtro por andar do CP1 ja era util mas exigia toques. Numa lista de 10+ salas, uma busca textual instantanea (por nome, tipo ou aula) torna a UX mais profissional.

**Como foi implementado:**
- Componente `SearchBar.jsx` controlado, com botao de limpar.
- Em `salas.jsx`, a lista filtrada e calculada com `useMemo` combinando `selectedFloor` + `search`. A busca e case-insensitive e cobre nome da sala, tipo, aula atual e proxima aula.

---

## g) Proximos Passos

Com mais tempo, o grupo implementaria:

- API real (Node + Postgres) substituindo o AsyncStorage por uma camada cliente
- Migracao da senha para hashing + Expo SecureStore
- Notificacoes locais (Expo Notifications) lembrando o aluno 15 min antes da reserva
- Foto de perfil via ImagePicker
- Integracao com calendario nativo
- Animacoes Animated API (shake on error, fade-in entre rotas)
- Mapa visual do andar com a localizacao das salas
- Historico de reservas passadas e estatisticas de uso por usuario

---

**Disciplina:** Cross-Platform Application Development
**Professor:** Hercules Ramos
**Curso:** Ciencia da Computacao - 2o Ano
**Instituicao:** FIAP — 2026
**Integrantes:** Rogerio Deligi Ferreira Filho (RM561942) e Maria Fernanda Garavelli Dantas (RM562686)
