# 🧱 Kanban Web Component

![Dev Stage](https://img.shields.io/badge/status-in%20development-orange)
![Build](https://img.shields.io/github/actions/workflow/status/diegoyosiura/kanban/build.yml?label=build&logo=github)
![Coverage](https://img.shields.io/codecov/c/github/diegoyosiura/kanban?logo=codecov)
![Version](https://img.shields.io/github/package-json/v/diegoyosiura/kanban?label=version&logo=npm)


Um componente **Kanban leve, modular e acessível**, desenvolvido em **TypeScript + SCSS** com **Web Components (Shadow DOM)**, sem frameworks — compatível com qualquer aplicação moderna, incluindo **Vue 3**, **React** ou HTML puro.

> Licenciado sob [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/), pronto para uso comercial com liberdade e segurança.

---

## ✨ Funcionalidades

- ✅ Drag and drop com mouse e touch
- ✅ Shadow DOM isolado
- ✅ Composição com `<kanban-board>`, `<kanban-column>` e `<kanban-card>`
- ✅ Ordenação de cartões por posição
- ✅ Acessibilidade com teclado e ARIA
- ✅ Wrapper Vue 3 incluído (`vue-wrapper/`)

---

## 🚀 Uso com HTML puro

```html
<kanban-board>
  <kanban-column title="A Fazer">
    <kanban-card title="Tarefa 1" data-id="task-1"></kanban-card>
    <kanban-card title="Tarefa 2" data-id="task-2"></kanban-card>
  </kanban-column>
</kanban-board>

<script type="module" src="dist/kanban.es.js"></script>
<link rel="stylesheet" href="dist/kanban.css" />
```

---

## 🧹 Uso com Vue 3

```vue
<template>
  <KanbanBoard :columns="columns" @cardMoved="onCardMoved" />
</template>

<script setup lang="ts">
import KanbanBoard from '@/vue-wrapper/KanbanBoard.vue'

const columns = [
  {
    id: 'todo',
    title: 'A Fazer',
    cards: [
      { id: '1', title: 'Estudar Web Components' },
      { id: '2', title: 'Implementar drag com touch' }
    ]
  },
  {
    id: 'doing',
    title: 'Em Progresso',
    cards: [{ id: '3', title: 'Escrever README' }]
  }
]

function onCardMoved({ cardId, columnId }) {
  console.log(`📦 Card ${cardId} movido para ${columnId}`);
}
</script>
```

> O wrapper escuta eventos `cardMoved` do Web Component e os emite no contexto Vue.

---

## ⚒️ Scripts de desenvolvimento

### Web Component

```bash
npm run dev         # Desenvolvimento do Web Component
npm run build       # Gera dist/ (kanban.es.js + kanban.css)
npm run preview     # Servidor local para HTML puro
```

### Vue Wrapper

```bash
npm run dev:vue     # Desenvolvimento Vue (vue-wrapper/)
npm run build:vue   # Build Vue App
npm run preview:vue # Preview Vue App
```

---

## 📦 Estrutura de pastas

```
kanban/
├── src/              # Código-fonte Web Component (TS/SCSS)
├── dist/             # Build final
├── demo/             # HTML puro
├── vue-wrapper/      # Wrapper Vue 3 e App de exemplo
├── package.json
├── LICENSE
└── README.md
```

---

## 📜 Licença

Distribuído sob a **Mozilla Public License 2.0** (MPL-2.0).

Você pode usar, modificar e distribuir este componente inclusive em projetos comerciais, desde que mantenha as alterações sob MPL-2.0 e preserve os avisos de licença.

[Ver texto completo da licença →](https://www.mozilla.org/MPL/2.0/)

---

Feito com ❤️ por [Diego Yosiura](https://github.com/diegoyosiura)
