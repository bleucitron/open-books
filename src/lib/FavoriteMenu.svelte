<script lang="ts">
  import PopupMenu from '$lib/PopupMenu.svelte';
  import favorites from '@stores/favorites';
</script>

<PopupMenu
  label="Favoris"
  icon="star"
  items={$favorites}
  clear={favorites.clear}
/>
