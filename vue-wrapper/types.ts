/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 */
export interface KanbanCardData {
    id: string;
    title: string;
}

export interface KanbanColumnData {
    id: string;
    title: string;
    cards: KanbanCardData[];
}
