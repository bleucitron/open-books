<script lang="ts">
  import { format } from 'd3-format';
  import { formatValue } from '../../../utils';

  export let value: number;
  export let percentage: number;
  export let label: string;
  export let handleClick: () => void = () => null;
  // export let color: string;
</script>

<div class="bar" on:click={handleClick}>
  <h3>{label}</h3>
  <div class="value">
    <span>{`${formatValue(value)}`}</span>
    {`${format('.2%')(percentage)}`}
  </div>
  <div class="background" style={`width: ${percentage * 100}%`} />
</div>

<style>
  .bar {
    position: relative;
    display: flex;
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: grey;
    opacity: 0.8;
  }
</style>
