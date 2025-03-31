/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 */

import '../scss/kanban.scss';
import './column';
import './card';

class KanbanBoard extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
      <style>
        :host {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 1rem;
          background: #f4f5f7;
        }
      </style>
      <slot></slot>
    `;
    }

    addColumn(columnData: { id: string; title: string }) {
        const col = document.createElement('kanban-column');
        col.setAttribute('title', columnData.title);
        col.setAttribute('data-id', columnData.id);
        this.appendChild(col);
        return col;
    }

    addCard(columnId: string, cardData: { id: string; title: string }) {
        const col = this.querySelector(`kanban-column[data-id="${columnId}"]`);
        if (!col) {
            console.warn(`Column "${columnId}" not found.`);
            return;
        }

        const card = document.createElement('kanban-card');
        card.setAttribute('title', cardData.title);
        card.setAttribute('data-id', cardData.id);
        col.appendChild(card);
        return card;
    }

    getColumns(): HTMLElement[] {
        return Array.from(this.querySelectorAll('kanban-column'));
    }

    getCards(columnId: string): HTMLElement[] {
        const col = this.querySelector(`kanban-column[data-id="${columnId}"]`);
        return col ? Array.from(col.querySelectorAll('kanban-card')) : [];
    }

}

if (!customElements.get('kanban-board')) {
    customElements.define('kanban-board', KanbanBoard);
}
export { KanbanBoard };
// Expõe globalmente para uso programático
// @ts-ignore
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.KanbanBoard = KanbanBoard;
}