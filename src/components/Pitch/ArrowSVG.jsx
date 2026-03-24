import ARROW_STYLES from '../../data/arrowStyles';
import { pctToSvg } from './constants';

/**
 * Renders a single tactical arrow on the SVG pitch.
 * Supports solid/dashed/dotted styles and different arrowhead types.
 */
export default function ArrowSVG({ arrow, eraserMode, onRemove }) {
  const style = ARROW_STYLES[arrow.type] || ARROW_STYLES.run;
  const { sx: x1, sy: y1 } = pctToSvg(arrow.fromX, arrow.fromY);
  const { sx: x2, sy: y2 } = pctToSvg(arrow.toX, arrow.toY);
  const color = arrow.color || style.defaultColor;
  const markerId = `arrowhead-${arrow.id}`;

  const handleClick = (e) => {
    if (!eraserMode) return;
    e.stopPropagation();
    onRemove(arrow.id);
  };

  let headShape;
  if (style.headType === 'diamond') {
    headShape = <polygon points="0,3.5 5,0 10,3.5 5,7" fill={color} />;
  } else if (style.headType === 'open') {
    headShape = <polyline points="0,0 10,3.5 0,7" fill="none" stroke={color} strokeWidth="1.5" />;
  } else {
    headShape = <polygon points="0,0 10,3.5 0,7" fill={color} />;
  }

  const lineProps = {
    stroke: color,
    strokeWidth: 2.5,
    strokeDasharray: style.dash,
    markerEnd: `url(#${markerId})`,
    opacity: eraserMode ? 0.6 : 0.85,
  };

  return (
    <g onClick={handleClick} style={{ cursor: eraserMode ? 'pointer' : 'default' }}>
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

      {/* Wider invisible hit area for eraser mode */}
      {eraserMode && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="transparent"
          strokeWidth="16"
          style={{ cursor: 'pointer' }}
          onClick={handleClick}
        />
      )}
    </g>
  );
}
