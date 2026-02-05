// /api/forms-submit.js — Vercel Serverless Function (Node)

export default async function handler(req, res) {
  // CORS básico (opcional)
  const allowOrigin = process.env.ALLOWED_ORIGIN;
  if (allowOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  try {
    const FORM_VIEW_URL = process.env.GOOGLE_FORM_VIEW_URL;
    if (!FORM_VIEW_URL) return res.status(500).json({ ok:false, error:'GOOGLE_FORM_VIEW_URL não definido' });
    const FORM_RESPONSE_URL = FORM_VIEW_URL.replace('/viewform','/formResponse');

    // Proteção opcional por chave
    const { tipo, matricula, objeto, apiKey } = req.body || {};
    if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
      return res.status(401).json({ ok:false, error:'Unauthorized' });
    }

    // Validações
    const allowed = new Set(['Retirada','Devolução','Inventário de Final de Turno']);
    if (!allowed.has(tipo)) return res.status(400).json({ ok:false, error:'tipo inválido' });
    if (!matricula || !objeto) return res.status(400).json({ ok:false, error:'matricula/objeto obrigatórios' });

    // Entrys do seu Form
    const F = {
      tipoAcao:  'entry.2075298705',
      matricula: 'entry.360956002',
      objeto:    'entry.587663124',
    };

    // Monta corpo x-www-form-urlencoded
    const params = new URLSearchParams();
    params.set(F.tipoAcao,  String(tipo));
    params.set(F.matricula, String(matricula));
    params.set(F.objeto,    String(objeto));
    params.set('fvv','1');
    params.set('pageHistory','0');
    params.set('submit','Submit');

    // Faz o POST ao Google Forms
    const r = await fetch(FORM_RESPONSE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'KnifeControl/1.0 (+vercel-serverless)'
      },
      body: params,
      redirect: 'manual'
    });

    const ok = [200, 302, 303].includes(r.status);
    return res.status(ok?200:502).json({ ok, status: r.status });
  } catch (e) {
    return res.status(500).json({ ok:false, error: e?.message || 'unknown' });
  }
}
