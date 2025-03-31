/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 */

export class KanbanColumn extends HTMLElement {
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Coluna';

        this.shadow.innerHTML = `<style>
        :host {
          display: flex;
          flex-direction: column;
          width: 250px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header {
          font-weight: bold;
          padding: 0.75rem;
          border-bottom: 1px solid #ddd;
        }

        .cards {
          display: flex;
          flex-direction: column;
          padding: 0.5rem;
          gap: 0.5rem;
          min-height: 80px;
        }

        .cards.drag-over {
          background: #f0f0f0;
          border: 2px dashed #aaa;
        }
      </style>
      <div class="header" id="${title}-header">${title}</div>
      <div class="cards" data-drop-zone role="list" aria-labelledby="${title}-header">
        <slot></slot>
      </div>`;

        const dropZone = this.shadow.querySelector('[data-drop-zone]')!;
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (event) => {
            const e = event as DragEvent;
            e.preventDefault();
            dropZone.classList.remove('drag-over');

            const html = e.dataTransfer?.getData('text/plain');
            if (html) {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const card = temp.firstElementChild as HTMLElement;
                if (card.tagName.toLowerCase() === 'kanban-card') {
                    dropZone.appendChild(card);
                    card.style.display = 'block';
                    card.classList.remove('dragging');

                    this.dispatchEvent(new CustomEvent('card-moved', {
                        bubbles: true,
                        detail: {
                            column: this,
                            card: card
                        }
                    }));
                }
            }
        });

        // (Extra futuro: touch drop suporte)
    }
}
customElements.define('kanban-column', KanbanColumn);
