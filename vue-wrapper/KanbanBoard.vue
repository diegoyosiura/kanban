<!-- @license MPL-2.0-->
<!-- Copyright (c) 2025 Diego Yosiura-->

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { KanbanColumnData, KanbanCardData } from './types';

const props = defineProps<{
  columns: KanbanColumnData[]
}>();

const emit = defineEmits<{
  (e: 'cardMoved', payload: { columnId: string, cardId: string }): void
}>();

const boardRef = ref<HTMLElement | null>(null);

onMounted(() => {
  boardRef.value?.addEventListener('card-moved', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    const cardId = detail.id;
    const columnEl = detail.column as HTMLElement;
    const columnId = columnEl.getAttribute('data-id') ?? 'unknown';

    emit('cardMoved', { cardId, columnId });
  });
});
</script>

<template>
  <kanban-board ref="boardRef">
    <template v-for="col in props.columns" :key="col.id">
      <kanban-column :title="col.title" :data-id="col.id">
        <template v-for="card in col.cards" :key="card.id">
          <kanban-card :title="card.title" :data-id="card.id" />
        </template>
      </kanban-column>
    </template>
  </kanban-board>
</template>
