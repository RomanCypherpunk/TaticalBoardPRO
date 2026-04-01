import { FB, FH, FL, FR, FT, FW, PITCH_H, PITCH_W } from './constants';

export function getPitchViewport(orientation = 'vertical') {
  return orientation === 'horizontal'
    ? { width: PITCH_H, height: PITCH_W, aspectRatio: `${PITCH_H} / ${PITCH_W}` }
    : { width: PITCH_W, height: PITCH_H, aspectRatio: `${PITCH_W} / ${PITCH_H}` };
}

export function getPitchTransform(orientation = 'vertical') {
  return orientation === 'horizontal' ? `translate(${PITCH_H} 0) rotate(90)` : undefined;
}

export function svgToCanonicalPoint(x, y, orientation = 'vertical') {
  if (orientation === 'horizontal') {
    return { x: y, y: PITCH_H - x };
  }

  return { x, y };
}

export function eventToCanonicalPoint(svg, event, orientation = 'vertical') {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;

  const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
  return svgToCanonicalPoint(svgPoint.x, svgPoint.y, orientation);
}

export function clampToPitch(x, y, padding = 0) {
  return {
    x: Math.max(FL + padding, Math.min(FR - padding, x)),
    y: Math.max(FT + padding, Math.min(FB - padding, y)),
  };
}

export function isInsidePitch(x, y) {
  return x >= FL && x <= FR && y >= FT && y <= FB;
}

export function canonicalToPercent(x, y) {
  return {
    x: ((x - FL) / FW) * 100,
    y: ((y - FT) / FH) * 100,
  };
}
