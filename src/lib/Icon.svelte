<script lang="ts">
  export let id: string;
  export let color: string = undefined;
  export let filled = false;
  export let size = '1em';
  $: isFilled = filled;
</script>

<svg
  class="Icon"
  fill={isFilled ? color : 'none'}
  stroke={color ?? 'currentColor'}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  width={size}
  height={size}
>
  <use href={`feather-sprite.svg#${id}`} />
</svg>
