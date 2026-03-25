const API_BASE = 'https://v3.football.api-sports.io';

/**
 * Position mapping from API-Football grid notation to app positions.
 */
const DEFENSE_MAPS = {
  2: ['CB', 'CB'],
  3: ['CB', 'CB', 'CB'],
  4: ['LB', 'CB', 'CB', 'RB'],
  5: ['LWB', 'CB', 'CB', 'CB', 'RWB'],
};
const MIDFIELD_MAPS = {
  1: ['CDM'],
  2: ['CM', 'CM'],
  3: ['CM', 'CM', 'CM'],
  4: ['LM', 'CM', 'CM', 'RM'],
  5: ['LWB', 'CM', 'CDM', 'CM', 'RWB'],
};
const ATTACK_MID_MAPS = {
  1: ['CAM'],
  2: ['CAM', 'CAM'],
  3: ['LW', 'CAM', 'RW'],
  4: ['LW', 'CAM', 'CAM', 'RW'],
};
const ATTACK_MAPS = {
  1: ['ST'],
  2: ['ST', 'ST'],
  3: ['LW', 'ST', 'RW'],
  4: ['LW', 'ST', 'ST', 'RW'],
};

function mapGridToPosition(formation, row, col) {
  if (row === 1) return 'GK';
  const layers = formation.split('-').map(Number);
  const layerIndex = row - 2;
  if (layerIndex < 0 || layerIndex >= layers.length) return 'CM';
  const count = layers[layerIndex];
  const colIdx = col - 1;
  const totalLayers = layers.length;
  const isDefense = layerIndex === 0;
  const isAttack = layerIndex === totalLayers - 1;

  let map;
  if (isDefense) map = DEFENSE_MAPS[count];
  else if (isAttack) map = ATTACK_MAPS[count];
  else if (layerIndex === totalLayers - 2 && totalLayers >= 3)
    map = ATTACK_MID_MAPS[count] || MIDFIELD_MAPS[count];
  else map = MIDFIELD_MAPS[count];

  if (!map) return 'CM';
  return map[Math.min(colIdx, map.length - 1)] || 'CM';
}

async function apiFetch(path, apiKey) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'x-apisports-key': apiKey },
  });
  if (!res.ok) {
    const err = new Error(`API-Football HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    const msg = Object.values(data.errors).join('; ');
    const err = new Error(msg);
    err.status = 403;
    throw err;
  }
  return data;
}

/**
 * Find the most recent completed fixture from a list.
 * Completed statuses: FT, AET, PEN
 */
function findLastCompleted(fixtures) {
  const completed = fixtures.filter((f) => {
    const s = f.fixture.status?.short;
    return s === 'FT' || s === 'AET' || s === 'PEN';
  });
  if (completed.length === 0) return null;
  // Sort by date descending and return the most recent
  completed.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));
  return completed[0];
}

export default async function handler(req, res) {
  const { teamId } = req.query;

  if (!teamId || isNaN(Number(teamId))) {
    return res.status(400).json({ error: 'teamId inválido.' });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key não configurada no servidor.' });
  }

  try {
    // Step 1 — find the most recent completed fixture via season query
    // Free plan only has access to seasons 2022-2024
    const seasons = [2024, 2023, 2022];
    let fixture = null;

    for (const season of seasons) {
      const data = await apiFetch(`/fixtures?team=${teamId}&season=${season}`, apiKey);
      fixture = findLastCompleted(data.response || []);
      if (fixture) break;
    }

    if (!fixture) {
      return res.status(404).json({ error: 'Nenhuma partida finalizada encontrada para esse time.' });
    }

    const fixtureId = fixture.fixture.id;
    const isHome = fixture.teams.home.id === Number(teamId);
    const teamInfo = isHome ? fixture.teams.home : fixture.teams.away;

    // Step 2 — get lineups for that fixture
    const lineupsData = await apiFetch(`/fixtures/lineups?fixture=${fixtureId}`, apiKey);
    const lineups = lineupsData.response;

    if (!lineups || lineups.length === 0) {
      return res.status(404).json({ error: 'Escalação não disponível para essa partida.' });
    }

    const teamLineup = lineups.find((l) => l.team.id === Number(teamId));
    if (!teamLineup) {
      return res.status(404).json({ error: 'Escalação do time não encontrada nessa partida.' });
    }

    const formation = teamLineup.formation || '4-3-3';
    const colors = teamLineup.team.colors || {};

    // Normalize colors (API returns without #)
    const primaryColor = colors.player?.primary ? `#${colors.player.primary}` : null;
    const numberColor = colors.player?.number ? `#${colors.player.number}` : null;
    const secondaryColor = colors.player?.border ? `#${colors.player.border}` : null;

    // Build short name
    const shortName = teamInfo.name
      .replace(/^(FC|CF|SC|AC|AS|RC|CA|SE|CR|CD|UD|RCD|SD|US)\s+/i, '')
      .slice(0, 3)
      .toUpperCase();

    // Normalize starting XI
    const startXI = teamLineup.startXI || [];
    const players = startXI.map((entry) => {
      const p = entry.player;
      const grid = p.grid || '1:1';
      const [gridRow, gridCol] = grid.split(':').map(Number);
      const position = mapGridToPosition(formation, gridRow, gridCol);
      return {
        name: p.name,
        number: p.number || 0,
        position,
      };
    });

    // Build fixture info
    const homeScore = fixture.goals?.home ?? '?';
    const awayScore = fixture.goals?.away ?? '?';
    const fixtureDate = fixture.fixture.date ? fixture.fixture.date.slice(0, 10) : null;

    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=43200');
    return res.status(200).json({
      team: {
        name: teamInfo.name,
        shortName,
        primaryColor,
        secondaryColor,
        numberColor,
        formation,
        logo: teamInfo.logo,
      },
      players,
      fixture: {
        id: fixtureId,
        date: fixtureDate,
        home: fixture.teams.home.name,
        away: fixture.teams.away.name,
        score: `${homeScore}-${awayScore}`,
      },
    });
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ error: 'Limite de requisições atingido. Tente novamente mais tarde.' });
    }
    return res.status(502).json({ error: err.message || 'Erro ao consultar API externa.' });
  }
}
