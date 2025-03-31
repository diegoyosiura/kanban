/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 */

const generateId = (() => {
    let counter = 0;
    return () => `kanban-card-${++counter}-${Date.now().toString(36)}`;
})();

export class KanbanCard extends HTMLElement {
    private shadow: ShadowRoot;
    private cloneEl!: HTMLElement;
    private offsetX = 0;
    private offsetY = 0;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

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

        const c = this.shadow.querySelector('.card')!;
        const card = c as HTMLElement;

        card.addEventListener('mousedown', this.onMouseDown.bind(this));
        card.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        card.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    /*** MOUSE DRAG ***/

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

    /*** TOUCH DRAG ***/

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

    /*** CLONE DRAG LOGIC ***/

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

    updateClonePosition(clientX: number, clientY: number) {
        this.cloneEl.style.left = `${clientX - this.offsetX}px`;
        this.cloneEl.style.top = `${clientY - this.offsetY}px`;
    }

    finishDrag(clientX: number, clientY: number) {
        const dropTarget = document.elementFromPoint(clientX, clientY);
        const column = dropTarget?.closest('kanban-column') as HTMLElement | null;

        if (column) {
            const cards = Array.from(column.querySelectorAll('kanban-card'))
                .filter((c) => c !== this); // exclui o próprio

            const insertBefore = cards.find((card) => {
                const rect = card.getBoundingClientRect();
                return clientY < rect.top + rect.height / 2;
            });

            if (insertBefore) {
                column.insertBefore(this, insertBefore);
            } else {
                column.appendChild(this);
            }

            this.dispatchEvent(new CustomEvent('card-moved', {
                bubbles: true,
                detail: { column, card: this, id: this.id }
            }));
        }

        this.cloneEl.remove();
        this.style.visibility = 'visible';
    }
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
customElements.define('kanban-card', KanbanCard);
