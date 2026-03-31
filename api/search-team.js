const FOTMOB_BASE = 'https://www.fotmob.com/api';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: '*/*',
  'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8',
  Referer: 'https://www.fotmob.com/',
  Origin: 'https://www.fotmob.com',
};

const TOKEN_PROXY = 'http://46.101.91.154:6006/';

async function fotmobFetch(path) {
  const url = `${FOTMOB_BASE}${path}`;

  // Try direct request
  let res = await fetch(url, { headers: HEADERS });

  // If blocked, try with x-mas token from community proxy
  if (res.status === 403) {
    try {
      const tokenRes = await fetch(TOKEN_PROXY, {
        signal: AbortSignal.timeout(4000),
      });
      const tokenData = await tokenRes.json();
      if (tokenData['x-mas']) {
        res = await fetch(url, {
          headers: { ...HEADERS, 'x-mas': tokenData['x-mas'] },
        });
      }
    } catch {
      // proxy unavailable — fall through with original 403
    }
  }

  if (!res.ok) {
    throw new Error(`FotMob API retornou status ${res.status}`);
  }

  return res.json();
}

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json({ error: 'Busca deve ter pelo menos 2 caracteres.' });
  }

  try {
    const data = await fotmobFetch(
      `/data/search/suggest?term=${encodeURIComponent(q)}&hits=20&lang=en`
    );

    // Response is an array where [0].suggestions has the results
    const suggestions = Array.isArray(data)
      ? data[0]?.suggestions || []
      : data?.suggestions || [];

    const teams = suggestions
      .filter((s) => s.type === 'team')
      .slice(0, 10)
      .map((team) => ({
        id: String(team.id),
        name: team.name || '',
        logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${team.id}.png`,
        country: team.countryCode || team.country || '',
      }));

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json({ results: teams });
  } catch (err) {
    return res.status(502).json({ error: err.message || 'Erro ao buscar times no FotMob.' });
  }
}
