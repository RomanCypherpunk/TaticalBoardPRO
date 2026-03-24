import PITCH_THEMES from '../../data/pitchThemes';
import { PITCH_W, PITCH_H, MARGIN, FW, FH, FL, FT, FR, FB, CX, CY } from './constants';

/**
 * Renders the football pitch markings as SVG elements.
 */
export default function PitchSVG({ theme }) {
  const t = PITCH_THEMES[theme];
  const lineW = theme === 'white' ? 1.5 : 2;

  // Proportional dimensions
  const penW = FW * 0.44;
  const penH = FH * 0.165;
  const goalW = FW * 0.183;
  const goalH = FH * 0.055;
  const centerR = FH * 0.148;
  const penSpot = FH * 0.117;
  const cornerR = 12;
  const goalPostW = FW * 0.1;
  const goalPostH = 10;

  return (
    <g>
      {/* Field background */}
      <rect x="0" y="0" width={PITCH_W} height={PITCH_H} fill={t.field} rx="8" />

      {/* Mowing stripes */}
      {t.stripe &&
        Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x={FL}
            y={FT + i * (FH / 12)}
            width={FW}
            height={FH / 12}
            fill={i % 2 === 0 ? t.field : t.fieldDark}
          />
        ))}

      {/* Field outline */}
      <rect x={FL} y={FT} width={FW} height={FH} fill="none" stroke={t.line} strokeWidth={lineW} />

      {/* Halfway line */}
      <line x1={FL} y1={CY} x2={FR} y2={CY} stroke={t.line} strokeWidth={lineW} />

      {/* Center circle + spot */}
      <circle cx={CX} cy={CY} r={centerR} fill="none" stroke={t.line} strokeWidth={lineW} />
      <circle cx={CX} cy={CY} r={3} fill={t.line} />

      {/* --- TOP HALF --- */}
      <rect x={CX - penW / 2} y={FT} width={penW} height={penH} fill="none" stroke={t.line} strokeWidth={lineW} />
      <rect x={CX - goalW / 2} y={FT} width={goalW} height={goalH} fill="none" stroke={t.line} strokeWidth={lineW} />
      <circle cx={CX} cy={FT + penSpot} r={3} fill={t.line} />
      <path
        d={`M ${CX - 60} ${FT + penH} A ${centerR} ${centerR} 0 0 0 ${CX + 60} ${FT + penH}`}
        fill="none"
        stroke={t.line}
        strokeWidth={lineW}
      />
      <rect
        x={CX - goalPostW / 2}
        y={FT - goalPostH}
        width={goalPostW}
        height={goalPostH}
        fill="none"
        stroke={t.line}
        strokeWidth={lineW}
        strokeDasharray="4 3"
        opacity="0.5"
      />

      {/* --- BOTTOM HALF --- */}
      <rect x={CX - penW / 2} y={FB - penH} width={penW} height={penH} fill="none" stroke={t.line} strokeWidth={lineW} />
      <rect x={CX - goalW / 2} y={FB - goalH} width={goalW} height={goalH} fill="none" stroke={t.line} strokeWidth={lineW} />
      <circle cx={CX} cy={FB - penSpot} r={3} fill={t.line} />
      <path
        d={`M ${CX - 60} ${FB - penH} A ${centerR} ${centerR} 0 0 1 ${CX + 60} ${FB - penH}`}
        fill="none"
        stroke={t.line}
        strokeWidth={lineW}
      />
      <rect
        x={CX - goalPostW / 2}
        y={FB}
        width={goalPostW}
        height={goalPostH}
        fill="none"
        stroke={t.line}
        strokeWidth={lineW}
        strokeDasharray="4 3"
        opacity="0.5"
      />

      {/* Corner arcs */}
      <path d={`M ${FL} ${FT + cornerR} A ${cornerR} ${cornerR} 0 0 1 ${FL + cornerR} ${FT}`} fill="none" stroke={t.line} strokeWidth={lineW} />
      <path d={`M ${FR - cornerR} ${FT} A ${cornerR} ${cornerR} 0 0 1 ${FR} ${FT + cornerR}`} fill="none" stroke={t.line} strokeWidth={lineW} />
      <path d={`M ${FL} ${FB - cornerR} A ${cornerR} ${cornerR} 0 0 0 ${FL + cornerR} ${FB}`} fill="none" stroke={t.line} strokeWidth={lineW} />
      <path d={`M ${FR - cornerR} ${FB} A ${cornerR} ${cornerR} 0 0 0 ${FR} ${FB - cornerR}`} fill="none" stroke={t.line} strokeWidth={lineW} />
    </g>
  );
}
