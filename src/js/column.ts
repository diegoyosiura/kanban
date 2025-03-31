/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 *
 * KanbanColumn Web Component
 *
 * This component represents a single column in a Kanban board.
 * It can receive one or more <kanban-card> elements as children, and
 * supports drag-and-drop behavior (via HTML5 API) for reordering cards.
 *
 * It uses Shadow DOM to encapsulate its structure and styles.
 * The title of the column is received via the `title` attribute.
 *
 * @example
 * <kanban-column title="In Progress">
 *   <kanban-card title="Tarefa A" data-id="a"></kanban-card>
 * </kanban-column>
 */

export class KanbanColumn extends HTMLElement {
    /** Shadow root for encapsulated rendering */
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    /**
     * Lifecycle method: triggered when the element is added to the DOM.
     * - Renders the internal structure and styles
     * - Sets up drag-and-drop events for receiving cards
     */
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

        // Highlight drop zone when dragging over
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        // Remove highlight when drag leaves
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        // Handle dropped card HTML
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

                    /**
                     * Dispatches a `card-moved` event when a card is successfully dropped.
                     *
                     * @event card-moved
                     * @type {CustomEvent}
                     * @property {HTMLElement} detail.card - the moved card
                     * @property {HTMLElement} detail.column - the column receiving the card
                     */
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

        // TODO: Add touch support in future
    }
}

// Register the custom element
customElements.define('kanban-column', KanbanColumn);
