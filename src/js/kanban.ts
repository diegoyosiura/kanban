/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 */

import '../scss/kanban.scss';
import './column';
import './card';

export class KanbanBoard extends HTMLElement {
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
}

customElements.define('kanban-board', KanbanBoard);
