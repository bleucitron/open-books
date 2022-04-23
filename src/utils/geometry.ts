/**
 * Both polarToCartesian and describeArc are taken from
 * https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
 */

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  offset = 0,
): string {
  const full = Math.abs(endAngle - startAngle) === 360;
  const span = endAngle - startAngle;
  if (full) {
    startAngle = 0;
    endAngle = 359.99; // otherwise the arc won't draw itself
  }
  if (full || span < offset) {
    offset = 0;
  }

  const start = polarToCartesian(x, y, radius, endAngle - offset / 2);
  const end = polarToCartesian(x, y, radius, startAngle + offset / 2);

  const largeArcFlag = span - offset <= 180 ? 0 : 1;

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');

  return d;
}
