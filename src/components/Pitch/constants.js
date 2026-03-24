/**
 * SVG pitch coordinate constants.
 * viewBox = "0 0 1050 680" — proportional to a real 105m x 68m pitch.
 */
export const PITCH_W = 1050;
export const PITCH_H = 680;
export const MARGIN = 40;
export const FW = PITCH_W - MARGIN * 2; // field width
export const FH = PITCH_H - MARGIN * 2; // field height
export const FL = MARGIN;               // field left
export const FT = MARGIN;               // field top
export const FR = PITCH_W - MARGIN;     // field right
export const FB = PITCH_H - MARGIN;     // field bottom
export const CX = PITCH_W / 2;          // center x
export const CY = PITCH_H / 2;          // center y

/** Convert percentage (0–100) to SVG coordinates. */
export function pctToSvg(x, y) {
  return {
    sx: FL + (x / 100) * FW,
    sy: FT + (y / 100) * FH,
  };
}
