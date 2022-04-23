<script lang="ts" context="module">
  export interface DonutData {
    id: string;
    value: number;
    label?: string;
    color?: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { expoOut } from 'svelte/easing';
  import { draw } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { formatCurrency, describeArc } from '@utils';

  const dispatch = createEventDispatcher();

  const gap = 1;
  const width = 20;
  const radius = 100;
  const duration = 1000;
  const totalMotion = tweened(0, { duration, easing: expoOut });

  let displayedValue = 0;
  let displayedColor = '';
  let displayedLabel = '';

  export let scale = 1;
  export let data: DonutData[] = [];

  function update({ value, color, label }: DonutData): void {
    displayedValue = value;
    displayedColor = color;
    displayedLabel = label;
  }
  function reset(): void {
    displayedValue = $totalMotion;
    displayedColor = '';
    displayedLabel = '';
  }

  $: data.sort((d1, d2) => d2.value - d1.value);
  $: values = data.map(d => d.value);
  $: offsets = values.reduce((acc, _, i) => {
    return [...acc, i && acc[i - 1] + values[i - 1] / total];
  }, []);

  $: total = values.reduce((acc, cur) => acc + cur, 0);
  $: $totalMotion = total;
  $: displayedValue = $totalMotion;
</script>

<svg
  width="100%"
  height="100%"
  viewBox={`0 0 ${radius * 2} ${radius * 2}`}
  class="donut"
  style:transform={`scale(${scale})`}
>
  <defs>
    <clipPath id="clipCircle">
      <circle cx={radius} cy={radius} r={radius} />
    </clipPath>
  </defs>
  {#each data as d, i}
    {@const { value, color } = d}
    {@const percentage = value / total}
    {@const startAngle = offsets[i] * 360}
    {@const endAngle = startAngle + percentage * 360}
    <path
      fill="transparent"
      stroke={color}
      stroke-width={2 * width}
      d={describeArc(radius, radius, radius, startAngle, endAngle, gap)}
      clip-path="url(#clipCircle)"
      in:draw={{
        duration,
        easing: expoOut,
      }}
      on:mouseenter={() => update(d)}
      on:mouseleave={reset}
      on:click={() => dispatch('click', d)}
    />
  {/each}
  <circle cx={radius} cy={radius} r={radius - width} fill="transparent" />
  {#if displayedLabel}
    <text
      x="50%"
      y="37%"
      text-anchor="middle"
      dominant-baseline="central"
      fill={displayedColor}
      class="label"
    >
      {displayedLabel}
    </text>
  {/if}
  <text
    x="50%"
    y="50%"
    text-anchor="middle"
    dominant-baseline="central"
    fill={displayedColor}
  >
    {formatCurrency(displayedValue)}
  </text>
</svg>

<style lang="scss">
  svg {
    overflow: inherit;
    max-width: 30rem;
    max-height: 30rem;

    path {
      transform-origin: center center;
      transition: transform 0.2s ease-in;
      cursor: pointer;

      &:hover {
        transform: scale(1.05);
      }
    }

    text {
      font-size: 1.3em;
      &.label {
        font-size: 0.8rem;
      }
    }
  }
</style>
