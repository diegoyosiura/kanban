/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 *
 * KanbanBoard Web Component
 *
 * A lightweight, modular and accessible Kanban board implemented as a Web Component.
 * This component uses Shadow DOM for encapsulation and exposes a programmatic API
 * to create and manipulate columns and cards.
 *
 * Can be used declaratively via HTML or programmatically with `new KanbanBoard()`.
 *
 * Example:
 * ```js
 * const board = new KanbanBoard();
 * document.body.appendChild(board);
 * board.addColumn({ id: 'todo', title: 'To Do' });
 * board.addCard('todo', { id: 'c1', title: 'Study Web Components' });
 * ```
 */

import '../scss/kanban.scss';
import './column';
import './card';

/**
 * KanbanBoard is a Web Component that acts as a container for kanban-column elements.
 * It provides a shadow DOM structure and exposes methods for dynamic column and card creation.
 */
class KanbanBoard extends HTMLElement {
    /** Shadow root of the component */
    shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    /** Lifecycle hook called when the element is added to the DOM */
    connectedCallback() {
        this.render();
    }

    /**
     * Renders the visual structure and style of the board.
     * Includes layout and background color styling.
     */
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

    /**
     * Adds a new kanban-column to the board.
     *
     * @param columnData - Object with `id` and `title` for the column
     * @returns The created HTMLElement (kanban-column)
     *
     * @example
     * board.addColumn({ id: 'todo', title: 'To Do' });
     */
    addColumn(columnData: { id: string; title: string }): HTMLElement {
        const col = document.createElement('kanban-column');
        col.setAttribute('title', columnData.title);
        col.setAttribute('data-id', columnData.id);
        this.appendChild(col);
        return col;
    }

    /**
     * Adds a kanban-card to a specific column by ID.
     *
     * @param columnId - The `data-id` of the target column
     * @param cardData - Object with `id` and `title` for the card
     * @returns The created HTMLElement (kanban-card), or undefined if column not found
     *
     * @example
     * board.addCard('todo', { id: 'c1', title: 'Finish task' });
     */
    addCard(columnId: string, cardData: { id: string; title: string }): HTMLElement | undefined {
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

    /**
     * Returns all kanban-column elements in the board.
     *
     * @returns An array of kanban-column HTMLElements
     */
    getColumns(): HTMLElement[] {
        return Array.from(this.querySelectorAll('kanban-column'));
    }

    /**
     * Returns all kanban-card elements from a given column ID.
     *
     * @param columnId - The `data-id` of the column
     * @returns An array of kanban-card HTMLElements, or empty array if column not found
     */
    getCards(columnId: string): HTMLElement[] {
        const col = this.querySelector(`kanban-column[data-id="${columnId}"]`);
        return col ? Array.from(col.querySelectorAll('kanban-card')) : [];
    }
}

// Avoid duplicate registration in HMR/dev environments
if (!customElements.get('kanban-board')) {
    customElements.define('kanban-board', KanbanBoard);
}

// Export the class for external use
export { KanbanBoard };

// Expose globally for legacy/non-module environments
// @ts-ignore
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.KanbanBoard = KanbanBoard;
}
