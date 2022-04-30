<script lang="ts">
  import PopupMenu from '$lib/PopupMenu.svelte';
  import history from '@stores/history';
</script>

<PopupMenu
  label="Historique"
  icon="clock"
  items={$history}
  clear={history.clear}
/>
