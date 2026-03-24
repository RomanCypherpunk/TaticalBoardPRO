/**
 * SVG <defs> block that creates <pattern> elements for each team's shirt style.
 * Each pattern fills the player marker circle.
 * teamId is used to namespace pattern IDs so home and away don't clash.
 */
export default function ShirtPatternDefs({ teamId, primaryColor, secondaryColor, pattern }) {
  const id = `shirt-${teamId}`;
  const s = 36; // pattern tile size (matches marker diameter)

  if (pattern === 'solid' || !pattern) return null;

  const patternContent = (() => {
    switch (pattern) {
      case 'cheques':
        return (
          <pattern id={id} x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
            <rect width={s} height={s} fill={primaryColor} />
            <rect x="0" y="0" width={s/2} height={s/2} fill={secondaryColor} />
            <rect x={s/2} y={s/2} width={s/2} height={s/2} fill={secondaryColor} />
          </pattern>
        );

      case 'half_half_h':
        return (
          <pattern id={id} x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
            <rect width={s} height={s/2} fill={primaryColor} />
            <rect y={s/2} width={s} height={s/2} fill={secondaryColor} />
          </pattern>
        );

      case 'half_half_v':
        return (
          <pattern id={id} x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
            <rect width={s/2} height={s} fill={primaryColor} />
            <rect x={s/2} width={s/2} height={s} fill={secondaryColor} />
          </pattern>
        );

      case 'stripes_v':
        return (
          <pattern id={id} x="0" y="0" width={s/3} height={s} patternUnits="userSpaceOnUse">
            <rect width={s/6} height={s} fill={primaryColor} />
            <rect x={s/6} width={s/6} height={s} fill={secondaryColor} />
          </pattern>
        );

      case 'stripes_h':
        return (
          <pattern id={id} x="0" y="0" width={s} height={s/3} patternUnits="userSpaceOnUse">
            <rect width={s} height={s/6} fill={primaryColor} />
            <rect y={s/6} width={s} height={s/6} fill={secondaryColor} />
          </pattern>
        );

      case 'stripes_thin':
        return (
          <pattern id={id} x="0" y="0" width={s/5} height={s} patternUnits="userSpaceOnUse">
            <rect width={s/10} height={s} fill={primaryColor} />
            <rect x={s/10} width={s/10} height={s} fill={secondaryColor} />
          </pattern>
        );

      case 'stripe_diagonal':
        return (
          <pattern id={id} x="0" y="0" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={10} height={10} fill={primaryColor} />
            <rect width={5} height={10} fill={secondaryColor} />
          </pattern>
        );

      case 'stripe_h':
        // Single horizontal stripe through center
        return (
          <pattern id={id} x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
            <rect width={s} height={s} fill={primaryColor} />
            <rect y={s * 0.35} width={s} height={s * 0.3} fill={secondaryColor} />
          </pattern>
        );

      case 'stripe_v':
        // Single vertical stripe through center
        return (
          <pattern id={id} x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
            <rect width={s} height={s} fill={primaryColor} />
            <rect x={s * 0.35} width={s * 0.3} height={s} fill={secondaryColor} />
          </pattern>
        );

      case 'stripe_cut':
        // Diagonal cut — top-left primary, bottom-right secondary
        return (
          <pattern id={id} x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
            <rect width={s} height={s} fill={secondaryColor} />
            <polygon points={`0,0 ${s},0 0,${s}`} fill={primaryColor} />
          </pattern>
        );

      case 'stripe_thick':
        return (
          <pattern id={id} x="0" y="0" width={s/2} height={s} patternUnits="userSpaceOnUse">
            <rect width={s/4} height={s} fill={primaryColor} />
            <rect x={s/4} width={s/4} height={s} fill={secondaryColor} />
          </pattern>
        );

      case 'quarters':
        return (
          <pattern id={id} x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
            <rect width={s/2} height={s/2} fill={primaryColor} />
            <rect x={s/2} y="0" width={s/2} height={s/2} fill={secondaryColor} />
            <rect x="0" y={s/2} width={s/2} height={s/2} fill={secondaryColor} />
            <rect x={s/2} y={s/2} width={s/2} height={s/2} fill={primaryColor} />
          </pattern>
        );

      case 'vshape':
        return (
          <pattern id={id} x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
            <rect width={s} height={s} fill={primaryColor} />
            <polygon points={`0,0 ${s/2},${s * 0.6} ${s},0 ${s},${s * 0.35} ${s/2},${s * 0.95} 0,${s * 0.35}`} fill={secondaryColor} />
          </pattern>
        );

      default:
        return null;
    }
  })();

  if (!patternContent) return null;
  return <defs>{patternContent}</defs>;
}

/** Returns the fill value for a player marker based on pattern. */
export function getShirtFill(teamId, pattern, primaryColor) {
  if (pattern === 'solid' || !pattern) return primaryColor;
  return `url(#shirt-${teamId})`;
}
