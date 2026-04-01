import { useState, useRef, useCallback } from 'react';
import ARROW_STYLES from '../../data/arrowStyles';
import { pctToSvg } from './constants';
import {
  canonicalToDisplayPoint,
  canonicalToPercent,
  clampToPitch,
  eventToCanonicalPoint,
} from './geometry';

const HANDLE_R = 8;

/**
 * Renders a single tactical arrow on the SVG pitch.
 * Supports selection, drag-to-move endpoints, and removal.
 */
export default function ArrowSVG({ arrow, isSelected, dispatch, pitchOrientation }) {
  const style = ARROW_STYLES[arrow.type] || ARROW_STYLES.run;
  const fromPoint = canonicalToDisplayPoint(
    pctToSvg(arrow.fromX, arrow.fromY).sx,
    pctToSvg(arrow.fromX, arrow.fromY).sy,
    pitchOrientation
  );
  const toPoint = canonicalToDisplayPoint(
    pctToSvg(arrow.toX, arrow.toY).sx,
    pctToSvg(arrow.toX, arrow.toY).sy,
    pitchOrientation
  );
  const { x: x1, y: y1 } = fromPoint;
  const { x: x2, y: y2 } = toPoint;
  const color = arrow.color || style.defaultColor;
  const markerId = `arrowhead-${arrow.id}`;

  const [dragging, setDragging] = useState(null); // 'from' | 'to' | 'body'
  const svgRef = useRef(null);
  const dragStart = useRef(null);

  let headShape;
  if (style.headType === 'diamond') {
    headShape = <polygon points="0,3.5 5,0 10,3.5 5,7" fill={color} />;
  } else if (style.headType === 'open') {
    headShape = <polyline points="0,0 10,3.5 0,7" fill="none" stroke={color} strokeWidth="1.5" />;
  } else {
    headShape = <polygon points="0,0 10,3.5 0,7" fill={color} />;
  }

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch({ type: 'SET_UI', updates: { selectedArrow: isSelected ? null : arrow.id } });
  };

  const handleHandleDown = useCallback((endpoint) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const svg = e.currentTarget.closest('svg');
    svgRef.current = svg;
    dragStart.current = { endpoint, origFrom: { x: arrow.fromX, y: arrow.fromY }, origTo: { x: arrow.toX, y: arrow.toY } };
    setDragging(endpoint);

    const handleMove = (me) => {
      if (!svgRef.current) return;
      const { x, y } = eventToCanonicalPoint(svgRef.current, me, pitchOrientation);
      const nextPoint = clampToPitch(x, y);
      const { x: px, y: py } = canonicalToPercent(nextPoint.x, nextPoint.y);

      if (endpoint === 'from') {
        dispatch({ type: 'UPDATE_ARROW', arrowId: arrow.id, updates: { fromX: px, fromY: py } });
      } else if (endpoint === 'to') {
        dispatch({ type: 'UPDATE_ARROW', arrowId: arrow.id, updates: { toX: px, toY: py } });
      } else {
        // Move entire arrow (body drag)
        const orig = dragStart.current;
        const dx = px - canonicalToPercent(x, y).x;
        const dy = py - canonicalToPercent(x, y).y;
        // For body drag we calculate offset from initial pointer position
      }
    };

    const handleUp = () => {
      setDragging(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [arrow, dispatch, pitchOrientation]);

  const lineProps = {
    stroke: color,
    strokeWidth: isSelected ? 3.5 : 2.5,
    strokeDasharray: style.dash,
    markerEnd: `url(#${markerId})`,
    opacity: 0.85,
  };

  return (
    <g>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 7"
          refX="10"
          refY="3.5"
          markerWidth="8"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          {headShape}
        </marker>
      </defs>

      {arrow.curved ? (
        <path
          d={`M ${x1} ${y1} Q ${(x1 + x2) / 2 + (y2 - y1) * 0.3} ${(y1 + y2) / 2 - (x2 - x1) * 0.3} ${x2} ${y2}`}
          fill="none"
          {...lineProps}
        />
      ) : (
        <line x1={x1} y1={y1} x2={x2} y2={y2} {...lineProps} />
      )}

      {/* Invisible wider hit area for click selection */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="transparent" strokeWidth="18"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      />

      {/* Selection handles */}
      {isSelected && (
        <>
          {/* Start handle */}
          <circle
            cx={x1} cy={y1} r={HANDLE_R}
            fill={color} stroke="#fff" strokeWidth="2"
            style={{ cursor: 'grab' }}
            onPointerDown={handleHandleDown('from')}
          />
          {/* End handle */}
          <circle
            cx={x2} cy={y2} r={HANDLE_R}
            fill={color} stroke="#fff" strokeWidth="2"
            style={{ cursor: 'grab' }}
            onPointerDown={handleHandleDown('to')}
          />
          {/* Selection glow */}
          <line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth="6" opacity="0.2"
            style={{ pointerEvents: 'none' }}
          />
        </>
      )}
    </g>
  );
}
