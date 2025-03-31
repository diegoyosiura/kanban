/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 *
 * KanbanCard Web Component
 *
 * This component represents an interactive card within a Kanban board column.
 * It supports drag-and-drop using both mouse and touch interactions,
 * and includes keyboard accessibility for reordering via arrow keys.
 *
 * Each card is rendered inside a shadow DOM and emits a `card-moved` event when moved.
 */

const generateId = (() => {
    let counter = 0;
    return () => `kanban-card-${++counter}-${Date.now().toString(36)}`;
})();

/**
 * Represents a single draggable card in the Kanban system.
 * Automatically generates a unique ID if one is not provided.
 *
 * @example
 * <kanban-card title="Fix bug #123" data-id="task-1"></kanban-card>
 */
export class KanbanCard extends HTMLElement {
    private shadow: ShadowRoot;
    private cloneEl!: HTMLElement;
    private offsetX = 0;
    private offsetY = 0;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    /**
     * Lifecycle hook when the component is connected to the DOM.
     * Renders the card layout and binds mouse, touch, and keyboard event listeners.
     */
    connectedCallback() {
        const title = this.getAttribute('title') || 'Card';
        if (!this.id) {
            this.id = this.getAttribute('data-id') || generateId();
            this.setAttribute('data-id', this.id);
        }

        this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 0.75rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          font-size: 0.95rem;
          cursor: grab;
          user-select: none;
          transition: transform 0.25s ease, margin 0.25s ease;
          position: relative;
        }
      </style>
      <div
        class="card"
        tabindex="0"
        role="listitem"
        aria-grabbed="false"
        aria-label="${title}">${title}</div>
    `;

        const card = this.shadow.querySelector('.card')! as HTMLElement;

        card.addEventListener('mousedown', this.onMouseDown.bind(this));
        card.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        card.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    /*** Drag and Drop with Mouse ***/

    /**
     * Initiates drag sequence on mouse down.
     */
    onMouseDown(e: MouseEvent) {
        e.preventDefault();
        this.startDrag(e.clientX, e.clientY, 'mouse');

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp, { once: true });
    }

    onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        this.updateClonePosition(e.clientX, e.clientY);
    };

    onMouseUp = (e: MouseEvent) => {
        this.finishDrag(e.clientX, e.clientY);
        document.removeEventListener('mousemove', this.onMouseMove);
    };

    /*** Drag and Drop with Touch ***/

    /**
     * Initiates drag sequence on touch start.
     */
    onTouchStart(e: TouchEvent) {
        e.preventDefault();
        const touch = e.touches[0];
        this.startDrag(touch.clientX, touch.clientY, 'touch');

        document.addEventListener('touchmove', this.onTouchMove, { passive: false });
        document.addEventListener('touchend', this.onTouchEnd, { once: true });
    }

    onTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        this.updateClonePosition(touch.clientX, touch.clientY);
    };

    onTouchEnd = (e: TouchEvent) => {
        const touch = e.changedTouches[0];
        this.finishDrag(touch.clientX, touch.clientY);
        document.removeEventListener('touchmove', this.onTouchMove);
    };

    /*** Clone and Move Logic ***/

    /**
     * Creates a draggable visual clone of the card.
     * @param clientX X position where drag started
     * @param clientY Y position where drag started
     * @param type 'mouse' | 'touch'
     */
    startDrag(clientX: number, clientY: number, type: 'mouse' | 'touch') {
        const rect = this.getBoundingClientRect();
        this.offsetX = clientX - rect.left;
        this.offsetY = clientY - rect.top;

        this.cloneEl = this.cloneNode(true) as HTMLElement;
        this.cloneEl.style.position = 'fixed';
        this.cloneEl.style.pointerEvents = 'none';
        this.cloneEl.style.opacity = '0.85';
        this.cloneEl.style.zIndex = '9999';
        this.cloneEl.style.width = `${rect.width}px`;
        this.cloneEl.style.left = `${clientX - this.offsetX}px`;
        this.cloneEl.style.top = `${clientY - this.offsetY}px`;
        document.body.appendChild(this.cloneEl);

        this.style.visibility = 'hidden';
    }

    /**
     * Updates clone position as the user drags.
     */
    updateClonePosition(clientX: number, clientY: number) {
        this.cloneEl.style.left = `${clientX - this.offsetX}px`;
        this.cloneEl.style.top = `${clientY - this.offsetY}px`;
    }

    /**
     * Finalizes the drag operation, repositions the card, and emits `card-moved` event.
     */
    finishDrag(clientX: number, clientY: number) {
        const dropTarget = document.elementFromPoint(clientX, clientY);
        const column = dropTarget?.closest('kanban-column') as HTMLElement | null;

        if (column) {
            const cards = Array.from(column.querySelectorAll('kanban-card'))
                .filter((c) => c !== this);

            const insertBefore = cards.find((card) => {
                const rect = card.getBoundingClientRect();
                return clientY < rect.top + rect.height / 2;
            });

            if (insertBefore) {
                column.insertBefore(this, insertBefore);
            } else {
                column.appendChild(this);
            }

            /**
             * @event card-moved
             * @type {CustomEvent}
             * @property {HTMLElement} detail.card - The moved card
             * @property {HTMLElement} detail.column - The column that received the card
             * @property {string} detail.id - The card's ID
             */
            this.dispatchEvent(new CustomEvent('card-moved', {
                bubbles: true,
                detail: { column, card: this, id: this.id }
            }));
        }

        this.cloneEl.remove();
        this.style.visibility = 'visible';
    }

    /*** Keyboard Navigation and Accessibility ***/

    /**
     * Handles arrow key movement and activation via Enter or Space.
     */
    onKeyDown(event: KeyboardEvent) {
        const parentColumn = this.closest('kanban-column');

        switch (event.key) {
            case 'Enter':
            case ' ': {
                event.preventDefault();
                this.setAttribute('aria-grabbed', 'true');
                break;
            }

            case 'ArrowUp':
            case 'ArrowDown': {
                event.preventDefault();
                const direction = event.key === 'ArrowUp' ? -1 : 1;
                const cards = Array.from(parentColumn?.querySelectorAll('kanban-card') || []);
                const currentIndex = cards.indexOf(this);
                const targetIndex = currentIndex + direction;

                if (cards[targetIndex]) {
                    const reference = cards[targetIndex];
                    parentColumn?.insertBefore(this, direction > 0 ? reference.nextSibling : reference);

                    this.dispatchEvent(new CustomEvent('card-moved', {
                        bubbles: true,
                        detail: { column: parentColumn, card: this, id: this.id }
                    }));
                }
                break;
            }
        }
    }
}

// Registers the element globally
customElements.define('kanban-card', KanbanCard);
