import { useState, useRef, useCallback } from 'react';
import { pctToSvg, FL, FT, FW, FH, FR, FB } from './constants';
import DIRECTIONS from '../../data/directions';

const R = 20; // marker radius
const DIR_ARROW_LEN = 34;

/**
 * Renders the SVG pattern defs anchored to the circle's bounding box.
 * x/y are set to (cx-R, cy-R) so the pattern always starts from the
 * top-left corner of the circle — regardless of where on the pitch it is.
 */
function InlinePatternDefs({ patternKey, primaryColor, secondaryColor, cx, cy, id }) {
  if (!patternKey || patternKey === 'solid') return null;

  const bx = cx - R;
  const by = cy - R;
  const s = R * 2;

  let content;
  switch (patternKey) {
    case 'cheques':
      content = (
        <>
          <rect width={s} height={s} fill={primaryColor} />
          <rect width={s / 2} height={s / 2} fill={secondaryColor} />
          <rect x={s / 2} y={s / 2} width={s / 2} height={s / 2} fill={secondaryColor} />
        </>
      );
      break;

    case 'half_half_h':
      content = (
        <>
          <rect width={s} height={s / 2} fill={primaryColor} />
          <rect y={s / 2} width={s} height={s / 2} fill={secondaryColor} />
        </>
      );
      break;

    case 'half_half_v':
      content = (
        <>
          <rect width={s / 2} height={s} fill={primaryColor} />
          <rect x={s / 2} width={s / 2} height={s} fill={secondaryColor} />
        </>
      );
      break;

    case 'stripes_v':
      content = (
        <>
          <rect width={s} height={s} fill={primaryColor} />
          {[1, 3, 5].map((i) => (
            <rect key={i} x={i * (s / 6)} width={s / 6} height={s} fill={secondaryColor} />
          ))}
        </>
      );
      break;

    case 'stripes_h':
      content = (
        <>
          <rect width={s} height={s} fill={primaryColor} />
          {[1, 3, 5].map((i) => (
            <rect key={i} y={i * (s / 6)} width={s} height={s / 6} fill={secondaryColor} />
          ))}
        </>
      );
      break;

    case 'stripes_thin':
      content = (
        <>
          <rect width={s} height={s} fill={primaryColor} />
          {[1, 3, 5, 7].map((i) => (
            <rect key={i} x={i * (s / 8)} width={s / 16} height={s} fill={secondaryColor} />
          ))}
        </>
      );
      break;

    case 'stripe_diagonal':
      content = (
        <>
          <rect width={s} height={s} fill={primaryColor} />
          <polygon points={`0,0 ${s * 0.55},0 0,${s * 0.55}`} fill={secondaryColor} />
          <polygon points={`${s},${s} ${s * 0.45},${s} ${s},${s * 0.45}`} fill={secondaryColor} />
        </>
      );
      break;

    case 'stripe_h':
      content = (
        <>
          <rect width={s} height={s} fill={primaryColor} />
          <rect y={s * 0.35} width={s} height={s * 0.3} fill={secondaryColor} />
        </>
      );
      break;

    case 'stripe_v':
      content = (
        <>
          <rect width={s} height={s} fill={primaryColor} />
          <rect x={s * 0.35} width={s * 0.3} height={s} fill={secondaryColor} />
        </>
      );
      break;

    case 'stripe_cut':
      content = (
        <>
          <rect width={s} height={s} fill={secondaryColor} />
          <polygon points={`0,0 ${s},0 0,${s}`} fill={primaryColor} />
        </>
      );
      break;

    case 'stripe_thick':
      content = (
        <>
          <rect width={s} height={s} fill={primaryColor} />
          <rect width={s / 3} height={s} fill={secondaryColor} />
          <rect x={s * 2 / 3} width={s / 3} height={s} fill={secondaryColor} />
        </>
      );
      break;

    case 'quarters':
      content = (
        <>
          <rect width={s / 2} height={s / 2} fill={primaryColor} />
          <rect x={s / 2} width={s / 2} height={s / 2} fill={secondaryColor} />
          <rect y={s / 2} width={s / 2} height={s / 2} fill={secondaryColor} />
          <rect x={s / 2} y={s / 2} width={s / 2} height={s / 2} fill={primaryColor} />
        </>
      );
      break;

    case 'vshape':
      content = (
        <>
          <rect width={s} height={s} fill={primaryColor} />
          <polygon
            points={`0,0 ${s / 2},${s * 0.6} ${s},0 ${s},${s * 0.35} ${s / 2},${s * 0.95} 0,${s * 0.35}`}
            fill={secondaryColor}
          />
        </>
      );
      break;

    default:
      return null;
  }

  return (
    <defs>
      <pattern id={id} x={bx} y={by} width={s} height={s} patternUnits="userSpaceOnUse">
        {content}
      </pattern>
    </defs>
  );
}

/**
 * Draggable player circle on the SVG pitch.
 * Uses pointer events for mouse + touch support.
 * Drag state is local to avoid re-rendering the full tree on every pixel move.
 */
export default function PlayerMarker({
  player,
  team,
  teamId,
  viewMode,
  isSelected,
  onSelect,
  onDragEnd,
}) {
  const { sx, sy } = pctToSvg(player.x, player.y);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState(null);
  const svgRef = useRef(null);

  const cx = dragging && dragPos ? dragPos.x : sx;
  const cy = dragging && dragPos ? dragPos.y : sy;

  const patternId = `ip-${teamId}-${player.id}`;
  const hasPattern = team.pattern && team.pattern !== 'solid';
  const fillColor = player.colorOverride
    ? player.colorOverride
    : hasPattern
    ? `url(#${patternId})`
    : team.primaryColor;

  const textColor = team.numberColor || team.secondaryColor;


  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      svgRef.current = e.currentTarget.closest('svg');
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
      onSelect();
    },
    [onSelect]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging || !svgRef.current) return;
      e.preventDefault();
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      setDragPos({
        x: Math.max(FL + R, Math.min(FR - R, svgP.x)),
        y: Math.max(FT + R, Math.min(FB - R, svgP.y)),
      });
    },
    [dragging]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (dragPos) {
      const px = ((dragPos.x - FL) / FW) * 100;
      const py = ((dragPos.y - FT) / FH) * 100;
      onDragEnd(Math.round(px * 10) / 10, Math.round(py * 10) / 10);
    }
    setDragPos(null);
  }, [dragging, dragPos, onDragEnd]);

  return (
    <g
      className={dragging ? '' : 'player-transition'}
      style={{ cursor: dragging ? 'grabbing' : 'pointer' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      aria-label={`${player.name} - ${player.position}`}
    >
      {/* Inline pattern defs anchored to this circle's position */}
      {!player.colorOverride && (
        <InlinePatternDefs
          patternKey={team.pattern}
          primaryColor={team.primaryColor}
          secondaryColor={team.secondaryColor}
          cx={cx}
          cy={cy}
          id={patternId}
        />
      )}

      {/* Drop shadow */}
      <circle cx={cx + 2} cy={cy + 3} r={R} fill="rgba(0,0,0,0.35)" />

      {/* Selection pulse ring */}
      {isSelected && (
        <circle cx={cx} cy={cy} r={R + 6} fill="none" stroke="rgba(59,130,246,0.7)" strokeWidth="2.5">
          <animate attributeName="r" values={`${R + 4};${R + 10};${R + 4}`} dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Main circle */}
      <circle cx={cx} cy={cy} r={R} fill={fillColor} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

      {/* Key player glow */}
      {player.isKeyPlayer && (
        <circle cx={cx} cy={cy} r={R + 2} fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Number inside circle */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontSize={15}
        fontWeight="800"
        fontFamily="Inter, sans-serif"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {String(player.number)}
      </text>

      {/* Captain badge */}
      {player.isCaptain && (
        <g>
          <circle cx={cx + R * 0.72} cy={cy - R * 0.72} r={7} fill="#FFD700" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
          <text
            x={cx + R * 0.72}
            y={cy - R * 0.72}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#000"
            fontSize="8"
            fontWeight="900"
            style={{ pointerEvents: 'none' }}
          >
            C
          </text>
        </g>
      )}

      {/* Player name badge below the circle */}
      {(() => {
        const nameText = player.name.toUpperCase();
        const charW = 5.8;
        const padX = 6;
        const rectW = nameText.length * charW + padX * 2;
        const rectH = 14;
        const labelY = cy + R + 11;
        return (
          <g style={{ pointerEvents: 'none', userSelect: 'none' }}>
            <rect
              x={cx - rectW / 2}
              y={labelY - rectH / 2}
              width={rectW}
              height={rectH}
              rx={2}
              fill={team.primaryColor}
              opacity={0.92}
            />
            <text
              x={cx}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={9.5}
              fontWeight="700"
              fontFamily="Inter, sans-serif"
              fill={textColor}
              letterSpacing="0.3"
            >
              {nameText}
            </text>
          </g>
        );
      })()}

      {/* Direction arrow */}
      {player.direction && (() => {
        const dir = DIRECTIONS.find((d) => d.key === player.direction);
        if (!dir) return null;
        const startX = cx + dir.dx * (R + 4);
        const startY = cy + dir.dy * (R + 4);
        const endX = cx + dir.dx * (R + DIR_ARROW_LEN);
        const endY = cy + dir.dy * (R + DIR_ARROW_LEN);
        const markerId = `dir-${player.id}`;
        return (
          <g style={{ pointerEvents: 'none' }}>
            <defs>
              <marker id={markerId} viewBox="0 0 10 7" refX="10" refY="3.5"
                markerWidth="7" markerHeight="5" orient="auto-start-reverse">
                <polygon points="0,0 10,3.5 0,7" fill={team.primaryColor} />
              </marker>
            </defs>
            <line
              x1={startX} y1={startY} x2={endX} y2={endY}
              stroke={team.primaryColor} strokeWidth="2.5" opacity="0.85"
              markerEnd={`url(#${markerId})`}
            />
          </g>
        );
      })()}
    </g>
  );
}
