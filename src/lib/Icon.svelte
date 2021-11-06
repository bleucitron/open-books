<script lang="ts">
  export let id: string;
  export let color: string = undefined;
  export let filled = false;
  export let size = '1em';
</script>

<svg
  class="Icon"
  fill={filled ? color : ' none'}
  stroke={color ?? 'currentColor'}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  width={size}
  height={size}
>
  <use href={`feather-sprite.svg#${id}`} />
</svg>
