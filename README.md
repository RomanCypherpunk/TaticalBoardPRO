# Tactical Board Pro

Uma aplicacao profissional de analise tatica de futebol construida com React e SVG. Feita para tecnicos, analistas e entusiastas do futebol que precisam de uma ferramenta poderosa e intuitiva para criar, visualizar e compartilhar esquemas taticos.

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?style=flat&logo=vercel&logoColor=white)
![Licenca](https://img.shields.io/badge/licenca-MIT-green?style=flat)

---

## Visao Geral

O Tactical Board Pro e uma aplicacao de pagina unica (SPA) que replica a experiencia de ferramentas premium de analise esportiva como Chosen11, FotMob Lineup Builder e FutWiz Custom Tactics — com uma interface mais limpa e opcoes de personalizacao mais profundas.

Toda a aplicacao vive em uma unica tela: sem navegacoes entre paginas, sem redirecionamentos. Dois times sao configurados e exibidos simultaneamente em um campo de futebol renderizado em SVG, com posicionamento de jogadores por arrastar e soltar, desenho de setas taticas, gerenciamento de formacoes, integracao com dados reais do FotMob e personalizacao visual completa.

---

## Funcionalidades

### Gerenciamento de Times
- Configure dois times independentes (casa e visitante) lado a lado
- Defina nome, abreviacao e esquema de tres cores por time (primaria, secundaria, numero)
- Escolha entre **14 padroes de camisa**: solida, listras verticais/horizontais/diagonais, xadrez, metade a metade, quartos, formato V e mais
- **Busca de times reais via FotMob** — carregue elencos, cores e formacoes de times reais automaticamente
- Cada cor e padrao atualiza os marcadores dos jogadores no campo em tempo real
- Toggle de visibilidade do time visitante

### Motor de Formacoes
- **15 formacoes** disponiveis: 4-3-3, 4-2-3-1, 4-4-2, 4-1-4-1, 4-1-2-1-2, 4-2-2-2, 4-2-4, 3-4-3, 3-4-2-1, 3-5-2, 3-2-2-3, 5-4-1, 5-3-2, 5-2-3, 3-1-2-1-3 (Futebol Total de Cruyff)
- A troca de formacao **anima todos os 11 jogadores** simultaneamente para as novas posicoes com transicao CSS cubic-bezier
- Reordenacao inteligente de jogadores ao trocar formacao (matching por prioridade de posicao)
- Posicionamento padrao taticamente preciso: goleiro em y=92%, defensores ~y=78%, meio-campistas ~y=55%, atacantes ~y=24%

### Configuracao de Jogadores
- 11 titulares + reservas por time
- Campos editaveis por jogador: numero da camisa, nome completo, posicao (dropdown com 16 posicoes), instrucao tatica (texto livre)
- **Bracadeira de capitao** ("C") — exclusiva por time, alternancia unica
- **Destaque de jogador-chave** — adiciona efeito de brilho dourado no marcador
- **Indicador de direcao** — seta direcional com 8 direcoes no marcador do campo
- Sobreposicao de cor individual por jogador
- Reordenacao de jogadores na lista
- **Troca de jogadores por arraste** — arraste um jogador sobre outro no campo para trocar suas posicoes
- **Busca de jogadores via FotMob** — pesquise jogadores reais com foto e dados

### Campo e Visualizacao
- Campo de futebol completo em SVG com marcacoes precisas: areas, goleiras, circulo central, pontos de penalti, arcos de escanteio, linha do meio-campo
- **4 temas de campo**: Verde Classico (com listras de corte), Modo Escuro, Branco/Papel, Lousa
- **4 modos de visualizacao**: exibir numero da camisa / nome do jogador / abreviacao da posicao / foto do jogador dentro de cada marcador
- Posicionamento por arrastar e soltar em tempo real (pointer events — funciona em dispositivos touch)
- Jogadores restritos as bordas do campo durante o arraste
- **Orientacao do campo**: alternar entre horizontal e vertical
- **Modo tela cheia** para apresentacao

### Setas Taticas
- **4 tipos de seta**: Corrida (solida, dourada), Passe (tracejada, azul), Drible (pontilhada, verde), Pressao (pontilhada, vermelha)
- Desenho por clique: primeiro clique define a origem, segundo clique finaliza a seta
- Estilos de ponta de seta variam por tipo (triangulo, aberta, diamante)
- Selecao de setas com destaque visual e handles de edicao nos endpoints
- Modo borracha para deletar setas individualmente
- Limpar todas as setas com um clique

### Integracao FotMob
- **Busca de times** — pesquise por nome e carregue elencos reais com formacao, cores e jogadores
- **Busca de jogadores** — encontre jogadores por nome com foto, numero e posicao
- **Fotos de jogadores** — exibidas nos marcadores do campo no modo foto
- **Dados do ultimo jogo** — informacoes do fixture mais recente do time
- Banco de dados local com 100+ times pre-carregados
- Proxy de imagens para contornar restricoes de CORS

### Interface e Experiencia
- Tema escuro como padrao com paineis em glassmorfismo (backdrop blur)
- Layout responsivo: 3 colunas completas no desktop, paineis recolhiveis em tablet/mobile
- Paineis colapsam independentemente com animacao
- Atalhos de teclado: `ESC` para desselecionar/cancelar seta, `Delete`/`Backspace` para remover seta selecionada
- Interface completamente em Portugues (BR)

### Persistencia e Exportacao
- Salvamento automatico no `localStorage` a cada mudanca de estado
- Carregamento do estado salvo ao abrir a aplicacao
- Exportacao da tatica como **PNG** com upscaling 3x (alta resolucao)
- Fotos de jogadores embutidas na imagem exportada
- Arquivo exportado: `tatica.png`

---

## Stack Tecnologica

| Tecnologia | Versao | Funcao |
|---|---|---|
| [React](https://react.dev) | 18.3 | Framework de UI e modelo de componentes |
| [Vite](https://vitejs.dev) | 6.0 | Build tool e servidor de desenvolvimento (HMR) |
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | Estilizacao utility-first |
| [lucide-react](https://lucide.dev) | 0.460 | Biblioteca de icones |
| SVG (nativo) | — | Renderizacao do campo e todos os elementos interativos |
| PostCSS + Autoprefixer | — | Pipeline de processamento CSS |
| [Vercel](https://vercel.com) | — | Deploy e serverless functions (API FotMob) |

Frontend client-side com serverless functions na Vercel para proxy das APIs do FotMob.

---

## Arquitetura

### Gerenciamento de Estado

A aplicacao usa um unico `useReducer` na raiz (`App.jsx`). Todas as mutacoes de estado passam por um reducer centralizado com 16 tipos de acao, tornando as transicoes de estado explicitas e previsiveis. O estado e serializado para `localStorage` a cada dispatch.

```
App.jsx
  └── useReducer(reducer, null, initialState)
        ├── dispatch(SET_FORMATION)       # Trocar formacao com animacao
        ├── dispatch(MOVE_PLAYER)         # Mover jogador no campo
        ├── dispatch(SWAP_PLAYERS)        # Trocar posicoes entre jogadores
        ├── dispatch(UPDATE_PLAYER)       # Editar dados do jogador
        ├── dispatch(SET_CAPTAIN)         # Definir capitao do time
        ├── dispatch(ADD_ARROW)           # Adicionar seta tatica
        ├── dispatch(REMOVE_ARROW)        # Remover seta
        ├── dispatch(UPDATE_ARROW)        # Editar endpoints da seta
        ├── dispatch(CLEAR_ARROWS)        # Limpar todas as setas
        ├── dispatch(FLIP_SIDES)          # Inverter lados dos times
        ├── dispatch(RESET_POSITIONS)     # Resetar posicoes da formacao
        ├── dispatch(REORDER_PLAYER)      # Reordenar jogador na lista
        ├── dispatch(LOAD_LIVE_TEAM)      # Carregar time do FotMob
        ├── dispatch(SET_TEAM_FIELD)      # Atualizar propriedade do time
        ├── dispatch(SET_UI)              # Atualizar estado da interface
        └── dispatch(LOAD_STATE)          # Carregar estado do localStorage
```

### Formato do Estado Principal

```js
{
  teams: {
    home: {
      name, shortName, primaryColor, secondaryColor, numberColor,
      pattern,       // "solid" | "cheques" | "stripes_v" | ...
      formation,     // "4-3-3" | "4-2-3-1" | ...
      players: [
        {
          id, name, number, position, role, instruction,
          x, y,            // posicao em porcentagem (0-100)
          isSubstitute,
          isCaptain,       // bracadeira de capitao
          isKeyPlayer,     // destaque de jogador-chave
          direction,       // direcao do indicador (8 opcoes)
          colorOverride,   // cor individual opcional
          fotmobId,        // ID do jogador no FotMob (para foto)
        }
      ]
    },
    away: { /* mesma estrutura */ }
  },
  arrows: [
    { id, fromX, fromY, toX, toY, type, color, teamId }
  ],
  ui: {
    viewMode,          // "number" | "name" | "position" | "photo"
    pitchOrientation,  // "horizontal" | "vertical"
    selectedPlayer,
    selectedTeam,
    pitchStyle,        // "green" | "dark" | "white" | "chalk"
    arrowMode,         // null | "run" | "pass" | "dribble" | "press"
    selectedArrow,
    showLeftPanel,
    showRightPanel,
    showAwayTeam,
    pitchFullscreen,
    showPlayerEditor,
    showLiveSearch,
  }
}
```

### Sistema de Coordenadas SVG

O campo usa `viewBox` proporcional a um campo de futebol real (105m x 68m), com dimensoes dinamicas baseadas na orientacao (horizontal ou vertical). As posicoes dos jogadores sao armazenadas em porcentagem (0-100) e convertidas para coordenadas SVG no momento da renderizacao via utilitario `pctToSvg()`. Isso mantem o modelo de dados independente de resolucao.

```js
// src/components/Pitch/constants.js
export const pctToSvg = (xPct, yPct) => ({
  x: FL + (xPct / 100) * FW,
  y: FT + (yPct / 100) * FH
})
```

### Arvore de Componentes

```
App
├── Header
│   └── Exportar PNG
├── TeamPanel (casa) ← esquerda
│   ├── Identidade do time (nome, cores, padrao de camisa)
│   ├── Seletor de formacao
│   ├── Grid de padroes de camisa (14 opcoes)
│   ├── Buscar Elenco no FotMob
│   ├── Lista de jogadores (reordenavel)
│   └── Menu por jogador (capitao, destaque, cor, excluir)
├── PitchCanvas ← centro
│   ├── PitchSVG (marcacoes do campo com temas)
│   ├── ShirtPatternDefs (SVG <defs> dinamicos)
│   ├── ArrowSVG[] (setas taticas com handles de edicao)
│   └── PlayerMarker[] (marcadores arrastaveis com swap)
├── TeamPanel (visitante) ← direita
├── BottomToolbar
│   ├── Toggle de modo de visualizacao (numero/nome/posicao/foto)
│   ├── Seletor de tema do campo (4 temas)
│   ├── Botoes de ferramenta de seta (4 tipos + ponteiro)
│   ├── Toggle de orientacao do campo
│   ├── Toggle de visibilidade do time visitante
│   └── Botoes de acao (inverter, resetar, limpar, tela cheia)
├── PlayerEditorModal (overlay com busca FotMob integrada)
└── LiveTeamSearch (modal de busca de times do FotMob)
```

---

## Estrutura de Arquivos

```
├── api/                             # Vercel Serverless Functions
│   ├── _fotmob.js                   # Utilitario de comunicacao com API FotMob
│   ├── search-team.js               # GET /api/search-team?q=<termo>
│   ├── search-player.js             # GET /api/search-player?q=<termo>
│   ├── team-lineup.js               # GET /api/team-lineup?teamId=<id>
│   └── player-image.js              # GET /api/player-image?playerId=<id>
│
├── src/
│   ├── App.jsx                      # Componente raiz, layout, atalhos de teclado, fullscreen
│   ├── main.jsx                     # Entry point do React
│   ├── index.css                    # Estilos globais, variaveis CSS, animacoes
│   │
│   ├── state/
│   │   ├── initialState.js          # Factory de estado e geracao de jogadores padrao
│   │   └── reducer.js               # Todas as transicoes de estado (16 tipos de acao)
│   │
│   ├── data/
│   │   ├── formations.js            # 15 templates de formacao com coordenadas dinamicas
│   │   ├── positions.js             # 16 abreviacoes de posicao (GK a SS)
│   │   ├── defaults.js              # Nomes e numeros padrao (PT-BR)
│   │   ├── pitchThemes.js           # 4 temas de cores do campo
│   │   ├── arrowStyles.js           # 4 tipos de seta tatica
│   │   ├── directions.js            # 8 direcoes de movimento + nenhuma
│   │   ├── shirtPatterns.js         # 14 definicoes de padrao de camisa
│   │   ├── gridPositionMap.js       # Mapeamento de grid para posicoes taticas
│   │   └── teamsDatabase.js         # Banco de dados local de times
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Toolbar/
│   │   │   └── BottomToolbar.jsx
│   │   ├── Panels/
│   │   │   ├── TeamPanel.jsx        # Configuracao de time e lista de jogadores
│   │   │   ├── PlayerEditorModal.jsx # Editor detalhado com busca FotMob
│   │   │   └── LiveTeamSearch.jsx   # Modal de busca de times reais
│   │   └── Pitch/
│   │       ├── PitchCanvas.jsx      # Logica de setas, cliques, swap de jogadores
│   │       ├── PitchSVG.jsx         # Todas as marcacoes do campo
│   │       ├── PlayerMarker.jsx     # Circulos arrástaveis com foto, padrao, badges
│   │       ├── ArrowSVG.jsx         # Setas com markers SVG e handles de edicao
│   │       ├── ShirtPatternDefs.jsx # Gerador dinamico de padroes SVG
│   │       ├── constants.js         # Dimensoes do campo e helpers de coordenadas
│   │       └── geometry.js          # Calculos geometricos para o layout
│   │
│   └── utils/
│       ├── exportPitch.js           # SVG → Canvas → PNG com upscaling 3x
│       └── fotmob.js                # Cliente FotMob para o frontend
│
├── config/
│   ├── tailwind.config.js           # Fontes Sora/Poppins, cores customizadas
│   └── postcss.config.js
│
├── vercel.json                      # SPA rewrites + rotas de API
└── package.json
```

---

## API Endpoints (Vercel Serverless)

| Endpoint | Metodo | Descricao | Cache |
|---|---|---|---|
| `/api/search-team?q=<termo>` | GET | Busca times por nome (top 12 resultados) | 1 hora |
| `/api/team-lineup?teamId=<id>` | GET | Retorna elenco, formacao, cores e ultimo jogo | 6 horas |
| `/api/search-player?q=<nome>` | GET | Busca jogadores por nome com foto e dados | 1 hora |
| `/api/player-image?playerId=<id>` | GET | Proxy de imagem do jogador (contorna CORS) | 24 horas |

Todos os endpoints fazem proxy para a API publica do FotMob, adicionando headers e tratamento de erros.

---

## Como Rodar

### Pre-requisitos

- Node.js 18+
- npm 9+

### Instalacao

```bash
git clone https://github.com/seu-usuario/tactical-board.git
cd tactical-board
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abre em `http://localhost:5173` com hot module replacement.

### Build de Producao

```bash
npm run build
npm run preview
```

A saida vai para `dist/`. Para deploy com as serverless functions, use a Vercel CLI ou conecte o repositorio na Vercel.

---

## Decisoes Tecnicas

**SVG em vez de Canvas** — SVG da a cada elemento seu proprio no no DOM. Isso significa pointer events em jogadores individuais, alvos de clique precisos, transicoes CSS nas mudancas de posicao e reutilizacao de padroes via `<defs>` — tudo sem um loop manual de redesenho.

**`useReducer` centralizado** — Para uma SPA com estado complexo (2 times, 22 jogadores, setas, UI), um unico `useReducer` na raiz com 16 tipos de acao gerencia todas as transicoes de forma limpa. Evita o overhead de bibliotecas externas mantendo a logica de mutacao centralizada e testavel.

**Coordenadas em porcentagem** — Posicoes sao armazenadas como `{ x: 50, y: 90 }` (em %) em vez de valores em pixels. Isso desacopla completamente o modelo de dados das dimensoes do SVG, tornando o sistema independente de resolucao e facil de serializar.

**Pointer Events** — Usar `onPointerDown`, `onPointerMove`, `onPointerUp` entrega suporte nativo a touch sem nenhuma logica adicional para mobile.

**Performance no arraste** — Durante um arraste, as atualizacoes de posicao passam por `useState` local dentro de `PlayerMarker` e so sao enviadas ao reducer global no `pointerUp`. Isso evita re-renderizar toda a arvore de componentes a cada pixel de movimento.

**Padroes SVG inline** — Os padroes de camisa sao definidos como elementos `<pattern>` dentro de `<defs>` e referenciados via `fill="url(#pattern-id)"`. Ao parametrizar o padrao com as cores atuais do time, qualquer mudanca de cor reflete instantaneamente em todos os marcadores.

**Serverless Functions** — As APIs do FotMob nao permitem chamadas diretas do navegador (CORS). As serverless functions na Vercel atuam como proxy, adicionando headers necessarios e cacheando respostas para performance.

**Formacoes dinamicas** — Em vez de hardcodar coordenadas para cada formacao, o sistema parseia o padrao numerico (ex: "4-3-3") e calcula posicoes automaticamente usando tabelas de distribuicao por fileira. Isso permite adicionar novas formacoes com uma unica linha.

---

## Autor

**Enzo Xavier Santos**
Desenvolvedor de Software - 2026
