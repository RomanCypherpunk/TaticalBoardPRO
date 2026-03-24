/**
 * Player movement direction instructions.
 * Each direction has a key, label (PT-BR), and a dx/dy vector
 * representing the arrow offset from the player marker.
 */
const DIRECTIONS = [
  { key: null, label: 'Nenhuma', dx: 0, dy: 0 },
  { key: 'center_right', label: 'Centro → Direita', dx: 1, dy: 0 },
  { key: 'center_left', label: 'Centro → Esquerda', dx: -1, dy: 0 },
  { key: 'upper_left', label: 'Superior → Esquerda', dx: -0.7, dy: -0.7 },
  { key: 'upper_right', label: 'Superior → Direita', dx: 0.7, dy: -0.7 },
  { key: 'upper_center', label: 'Superior → Centro', dx: 0, dy: -1 },
  { key: 'lower_right', label: 'Inferior → Direita', dx: 0.7, dy: 0.7 },
  { key: 'lower_left', label: 'Inferior → Esquerda', dx: -0.7, dy: 0.7 },
  { key: 'lower_center', label: 'Inferior → Centro', dx: 0, dy: 1 },
];

export default DIRECTIONS;
