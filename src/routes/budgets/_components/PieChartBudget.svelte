<script lang="ts">
  import { pie } from 'd3-shape';
  import type { PieCoordinates, PieData, PieEventData } from '@interfaces';
  import { createEventDispatcher } from 'svelte';
  import randomColor from 'randomcolor';

  export let radius: number;
  export let data: PieData[];

  function handlePathHover(path: EventTarget, data: PieEventData): void {
    dispatch('slice-hover', data);
    (path as SVGElement).setAttribute('tranform', `scale(12)`);
  }

  function handlePathLeave(path: EventTarget): void {
    (path as SVGElement).setAttribute('tranform', ``);
  }

  const dispatch = createEventDispatcher();

  const dataForD3Pie: number[] = data.map(d => d.value);
  const totalAngle: number = data.reduce((acc, pieData) => {
    return acc + pieData.value;
  }, 0);

  console.log(dataForD3Pie);

  const dataAngles = pie()(dataForD3Pie);
  const coordinatesArray: PieCoordinates[] = [];

  dataAngles.forEach(angleObject => {
    const percent: number = Math.round(
      ((angleObject.data as number) * 100) / totalAngle,
    );
    const xStartAngle = Math.round(
      radius + radius * Math.cos(angleObject.startAngle),
    );
    const yStartAngle = Math.round(
      radius + radius * Math.sin(angleObject.startAngle),
    );
    const xEndAngle = Math.round(
      radius + radius * Math.cos(angleObject.endAngle),
    );
    const yEndAngle = Math.round(
      radius + radius * Math.sin(angleObject.endAngle),
    );

    coordinatesArray.push({
      data: angleObject.data as number,
      percent,
      isOuterRing: percent > 50,
      xStartAngle,
      yStartAngle,
      xEndAngle,
      yEndAngle,
    });
  });
</script>

<svg
  width={2 * radius}
  height={2 * radius}
  xmlns="http://www.w3.org/2000/svg"
  style="background-color: white;"
>
  {#each coordinatesArray as coordinates, index}
    <path
      on:click={() =>
        dispatch('slice-click', {
          ...data[index],
          percent: coordinates.percent,
        })}
      on:mouseover={e =>
        handlePathHover(e.target, {
          ...data[index],
          percent: coordinates.percent,
        })}
      on:mouseleave={e => handlePathLeave(e.target)}
      on:focus={() => {
        console.log('Focus ! Maybe usefull someday ?');
      }}
      class="pie-part"
      d={`M${coordinates.xStartAngle} ${coordinates.yStartAngle}
              A ${radius} ${radius}, 0, ${
        coordinates.isOuterRing ? 1 : 0
      }, 1, ${coordinates.xEndAngle} ${coordinates.yEndAngle}
              L ${radius} ${radius} Z`}
      fill={data[index].color ?? randomColor()}
    >
      <textPath>Coucou</textPath>
    </path>
  {/each}
</svg>

<style lang="scss">
  .pie-part {
    outline: none;
    transition: 0.4s ease-out;
    &:hover {
      opacity: 0.5;
    }
  }
</style>
