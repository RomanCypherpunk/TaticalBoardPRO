# Tactical Board

Uma aplicação profissional de análise tática de futebol construída com React e SVG. Feita para técnicos, analistas e entusiastas do futebol que precisam de uma ferramenta poderosa e intuitiva para criar, visualizar e compartilhar esquemas táticos.

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Licença](https://img.shields.io/badge/licença-MIT-green?style=flat)

---

## Visão Geral

O Tactical Board é uma aplicação de página única (SPA) que replica a experiência de ferramentas premium de análise esportiva como Chosen11, FotMob Lineup Builder e FutWiz Custom Tactics — com uma interface mais limpa e opções de personalização mais profundas.

Toda a aplicação vive em uma única tela: sem navegações entre páginas, sem redirecionamentos. Dois times são configurados e exibidos simultaneamente em um campo de futebol renderizado em SVG, com posicionamento de jogadores por arrastar e soltar, desenho de setas táticas, gerenciamento de formações e personalização visual completa.

---

## Funcionalidades

### Gerenciamento de Times
- Configure dois times independentes (casa e visitante) lado a lado
- Defina nome, abreviação e esquema de três cores por time (primária, secundária, número)
- Escolha entre **14 padrões de camisa**: sólida, listras verticais/horizontais/diagonais, xadrez, metade a metade, quartos, formato V e mais
- Cada cor e padrão atualiza os marcadores dos jogadores no campo em tempo real

### Motor de Formações
- **15 formações** disponíveis: 4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 3-4-3, 4-1-4-1, 4-4-1-1, 4-3-2-1, 5-3-2, 5-4-1, 4-2-4, 3-4-1-2, 4-1-2-1-2, 4-2-2-2, 3-3-4
- A troca de formação **anima todos os 11 jogadores** simultaneamente para as novas posições com transição CSS cubic-bezier
- Posicionamento padrão taticamente preciso: goleiro em y=95%, defensores ~y=80%, meio-campistas ~y=55%, atacantes ~y=25%

### Configuração de Jogadores
- 11 titulares + reservas por time
- Campos editáveis por jogador: número da camisa, nome completo, posição (dropdown), instrução tática (texto livre)
- **Braçadeira de capitão** ("C") — exclusiva por time, alternância única
- **Destaque de jogador-chave** — adiciona efeito de brilho no marcador
- **Indicador de direção** — seta direcional com 8 direções na marcação do campo
- Sobreposição de cor individual por jogador
- Reordenação de jogadores na lista por arrastar e soltar

### Campo e Visualização
- Campo de futebol completo em SVG com marcações precisas: áreas, goleiras, círculo central, pontos de pênalti, arcos de escanteio, linha do meio-campo
- **4 temas de campo**: Verde Clássico (com listras de corte), Modo Escuro, Branco/Papel, Lousa
- **3 modos de visualização**: exibir número da camisa / nome do jogador / abreviação da posição dentro de cada marcador
- Posicionamento por arrastar e soltar em tempo real (pointer events — funciona em dispositivos touch)
- Jogadores restritos às bordas do campo durante o arraste

### Setas Táticas
- **4 tipos de seta**: Corrida (sólida, dourada), Passe (tracejada, azul), Drible (pontilhada, verde), Pressão (pontilhada, vermelha)
- Desenho por clique: primeiro clique define a origem, segundo clique finaliza a seta
- Estilos de ponta de seta variam por tipo (triângulo, aberta, diamante)
- Modo borracha para deletar setas individualmente
- Limpar todas as setas com um clique

### Interface e Experiência
- Tema escuro como padrão com painéis em glassmorfismo (backdrop blur)
- Layout responsivo: 3 colunas completas no desktop, painéis recolhíveis em tablet/mobile
- Painéis colapsam independentemente com animação
- Atalhos de teclado: `ESC` para desselecionar/cancelar seta, `Delete`/`Backspace` para remover seta selecionada
- Interface completamente em Português (BR)

### Persistência e Exportação
- Salvamento automático no `localStorage` a cada mudança de estado
- Carregamento do estado salvo ao abrir a aplicação
- Exportação da tática atual como arquivo **SVG** (`tatica.svg`) direto do navegador

---

## Stack Tecnológica

| Tecnologia | Versão | Função |
|---|---|---|
| [React](https://react.dev) | 18.3 | Framework de UI e modelo de componentes |
| [Vite](https://vitejs.dev) | 6.0 | Build tool e servidor de desenvolvimento (HMR) |
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | Estilização utility-first |
| [lucide-react](https://lucide.dev) | 0.460 | Biblioteca de ícones |
| SVG (nativo) | — | Renderização do campo e todos os elementos interativos |
| PostCSS + Autoprefixer | — | Pipeline de processamento CSS |

Sem backend. Sem banco de dados. Sem APIs externas. Todo o estado vive no navegador.

---

## Arquitetura

### Gerenciamento de Estado

A aplicação usa um único `useReducer` na raiz (`App.jsx`). Todas as mutações de estado passam por um reducer centralizado, tornando as transições de estado explícitas e previsíveis. O estado é serializado para `localStorage` a cada dispatch.

```
App.jsx
  └── useReducer(reducer, null, initialState)
        ├── dispatch(SET_FORMATION)
        ├── dispatch(MOVE_PLAYER)
        ├── dispatch(ADD_ARROW)
        ├── dispatch(UPDATE_PLAYER)
        └── dispatch(LOAD_STATE)
```

### Formato do Estado Principal

```js
{
  teams: {
    home: {
      name, shortName, primaryColor, secondaryColor, numberColor, shirtPattern,
      formation,
      players: [ { id, name, number, position, role, instruction, x, y, isSubstitute } ]
    },
    away: { /* mesma estrutura */ }
  },
  arrows: [ { id, fromX, fromY, toX, toY, type, color, teamId } ],
  ui: {
    viewMode,        // "number" | "name" | "position"
    selectedPlayer,
    selectedTeam,
    activePanel,
    pitchStyle,      // "green" | "dark" | "white" | "chalk"
    arrowMode,       // null | "run" | "pass" | "dribble" | "press" | "eraser"
    arrowStart,
  }
}
```

### Sistema de Coordenadas SVG

O campo usa `viewBox="0 0 1050 680"` — proporcional a um campo de futebol real (105m × 68m). As posições dos jogadores são armazenadas em porcentagem (0–100) e convertidas para coordenadas SVG no momento da renderização via utilitário `pctToSvg()`. Isso mantém o modelo de dados independente de resolução.

```js
// src/components/Pitch/constants.js
export const pctToSvg = (xPct, yPct) => ({
  x: FL + (xPct / 100) * FW,
  y: FT + (yPct / 100) * FH
})
```

### Árvore de Componentes

```
App
├── Header
├── TeamPanel (casa) ← esquerda
│   ├── Identidade do time (nome, cores, padrão de camisa)
│   ├── Seletor de formação
│   ├── Lista de jogadores (reordenável)
│   └── Banco de reservas
├── PitchCanvas ← centro
│   ├── PitchSVG (marcações do campo)
│   ├── ShirtPatternDefs (SVG <defs>)
│   ├── ArrowSVG[] (setas táticas)
│   └── PlayerMarker[] (marcadores arrastáveis)
├── TeamPanel (visitante) ← direita
├── BottomToolbar
│   ├── Toggle de modo de visualização
│   ├── Seletor de tema do campo
│   ├── Botões de ferramenta de seta
│   └── Botões de ação (inverter, resetar, limpar)
└── PlayerEditorModal (overlay, exibido ao selecionar jogador)
```

---

## Estrutura de Arquivos

```
src/
├── App.jsx                      # Componente raiz, layout, atalhos de teclado
├── main.jsx                     # Entry point do React
├── index.css                    # Estilos globais, variáveis CSS, animações
│
├── state/
│   ├── initialState.js          # Factory de estado e geração de jogadores padrão
│   └── reducer.js               # Todas as transições de estado (15+ tipos de ação)
│
├── data/
│   ├── formations.js            # 15 templates de formação com coordenadas xy
│   ├── positions.js             # Constantes de abreviação de posição
│   ├── defaults.js              # Nomes e números padrão (PT-BR)
│   ├── pitchThemes.js           # 4 temas de cores do campo
│   ├── arrowStyles.js           # Definições dos 4 tipos de seta tática
│   ├── directions.js            # Constantes de direção de movimento (8 direções)
│   └── shirtPatterns.js         # 14 chaves de padrão de camisa
│
└── components/
    ├── Header.jsx
    ├── Toolbar/
    │   └── BottomToolbar.jsx
    ├── Panels/
    │   ├── TeamPanel.jsx
    │   └── PlayerEditorModal.jsx
    └── Pitch/
        ├── PitchCanvas.jsx      # Lógica de desenho de setas, tratamento de cliques
        ├── PitchSVG.jsx         # Todas as marcações do campo
        ├── PlayerMarker.jsx     # Círculos de jogador arrastáveis (pointer events)
        ├── ArrowSVG.jsx         # Renderização de setas com markers SVG
        ├── ShirtPatternDefs.jsx # Gerador dinâmico de padrões SVG
        └── constants.js         # Dimensões do campo SVG e helpers de coordenadas
```

---

## Como Rodar

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

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

### Build de Produção

```bash
npm run build
npm run preview
```

A saída vai para `dist/`. A aplicação é completamente estática — pode ser publicada em qualquer CDN (Vercel, Netlify, GitHub Pages).

---

## Decisões Técnicas

**SVG em vez de Canvas** — SVG dá a cada elemento seu próprio nó no DOM. Isso significa pointer events em jogadores individuais, alvos de clique precisos, transições CSS nas mudanças de posição e reutilização de padrões via `<defs>` — tudo sem um loop manual de redesenho.

**`useReducer` em vez de Context/Redux** — Para uma SPA isolada sem busca de dados assíncrona, um único `useReducer` na raiz gerencia todas as transições de estado de forma limpa. Evita o overhead de bibliotecas externas de estado mantendo a lógica de mutação centralizada e testável.

**Coordenadas em porcentagem** — Posições são armazenadas como `{ x: 50, y: 90 }` (em %) em vez de valores em pixels. Isso desacopla completamente o modelo de dados das dimensões do SVG, tornando o sistema de coordenadas independente de resolução e fácil de serializar/restaurar.

**Pointer Events em vez de Mouse Events** — Usar `onPointerDown`, `onPointerMove`, `onPointerUp` em vez de eventos de mouse entrega suporte nativo a touch sem nenhuma lógica adicional para mobile.

**Performance no arraste** — Durante um arraste, as atualizações de posição passam por `useState` local dentro de `PlayerMarker` e só são enviadas ao reducer global no `pointerUp`. Isso evita re-renderizar toda a árvore de componentes a cada pixel de movimento.

**Padrões SVG inline** — Os padrões de camisa são definidos como elementos `<pattern>` dentro de `<defs>` e referenciados via `fill="url(#pattern-id)"`. Ao parametrizar o padrão com as cores atuais do time, qualquer mudança de cor reflete instantaneamente em todos os marcadores sem lógica adicional.

---

## Roadmap

- [ ] Exportação como PNG (conversão SVG para canvas)
- [ ] Setas curvas com ponto de controle bezier arrastável
- [ ] Banco de dados de times com cores reais de clubes
- [ ] Reprodução de animação (sequência de movimentos táticos)
- [ ] Link compartilhável via estado codificado na URL
- [ ] Histórico de desfazer/refazer

---

## Licença

MIT
