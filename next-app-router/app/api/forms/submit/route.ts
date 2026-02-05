// next-app-router/app/api/forms/submit/route.ts
export const runtime = 'edge';

const FORM_VIEW_URL = process.env.GOOGLE_FORM_VIEW_URL!;
const FORM_RESPONSE_URL = FORM_VIEW_URL.replace('/viewform','/formResponse');

const FIELDS = {
  tipoAcao:  'entry.2075298705',
  matricula: 'entry.360956002',
  objeto:    'entry.587663124',
};

const ALLOWED = new Set(['Retirada','Devolução','Inventário de Final de Turno']);

export async function POST(req: Request){
  try{
    const { tipo, matricula, objeto, apiKey } = await req.json();
    if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
      return new Response(JSON.stringify({ ok:false, error:'Unauthorized' }),{ status:401 });
    }
    if(!ALLOWED.has(tipo) || !matricula || !objeto){
      return new Response(JSON.stringify({ ok:false, error:'Dados inválidos' }),{ status:400 });
    }
    const body = new URLSearchParams();
    body.set(FIELDS.tipoAcao,  String(tipo));
    body.set(FIELDS.matricula, String(matricula));
    body.set(FIELDS.objeto,    String(objeto));
    body.set('fvv','1'); body.set('pageHistory','0'); body.set('submit','Submit');

    const resp = await fetch(FORM_RESPONSE_URL, {
      method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8' }, body,
      redirect:'manual'
    });
    const ok = [200,302,303].includes(resp.status);
    return new Response(JSON.stringify({ ok, status: resp.status }), {
      status: ok?200:502, headers: { 'Content-Type':'application/json' }
    });
  }catch(e:any){
    return new Response(JSON.stringify({ ok:false, error: e?.message || 'unknown' }),{ status:500 });
  }
}
