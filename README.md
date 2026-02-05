# KnifeControl — Modo 2 (Headless) no Vercel

Este pacote implementa o **envio headless ao Google Forms** usando **função Serverless** do Vercel. O navegador **não** acessa o Google Forms diretamente; em vez disso, chama `piorms-submit` e a função faz o POST para o endpoint `/formResponse` do seu Form.

## 📁 Conteúdo

- `api/forms-submit.js` — Função Serverless (Node) pronta para Vercel.
- `index_headless_demo.html` — Página simples para testar o envio via API.
- `.env.example` — Variáveis de ambiente necessárias/opcionais.
- `next-app-router/app/api/forms/submit/route.ts` — **Opcional**: rota para projetos Next.js (App Router). Use se seu projeto for Next.

---

## ⚙️ Variáveis de Ambiente (Vercel → Settings → Environment Variables)

Crie as variáveis abaixo **no projeto** (Production/Preview/Development conforme necessário):

```bash
GOOGLE_FORM_VIEW_URL=https://docs.google.com/forms/d/e/1FAIpQLScKBnRZ2StGX5qIqGVPrsXbt-hTbTawDYWqR3iEELCq9of7Xw/viewform
API_KEY=troque-por-uma-chave-secreta-opcional
ALLOWED_ORIGIN=https://seu-dominio.vercel.app
```

> **Observação:** usamos o link **`/viewform`**, e a função converte automaticamente para **`/formResponse`** (o único endpoint que aceita POST externo).

---

## 🚀 Deploy no Vercel

1. Faça upload destes arquivos para o seu repositório (GitHub/GitLab/Bitbucket) ou **importe diretamente** no Vercel via “Add New Project”.
2. Configure as **variáveis de ambiente** acima.
3. Faça o **Deploy**.

A função ficará disponível em:

```
https://SEU-PROJ.vercel.app/api/forms-submit
```

---

## 🧪 Teste rápido (Front-end)

Abra o arquivo `index_headless_demo.html` hospedado junto (ou localmente) e clique em **Enviar**. O front faz:

```js
fetch('/api/forms-submit', {
  method: 'POST',
  headers: { 'Content-Type':'application/json' },
  body: JSON.stringify({
    tipo: 'Retirada',
    matricula: '10000',
    objeto: 'FACA TESTE',
    // apiKey: 'mesma-chave-da-variavel-API_KEY' // se você habilitar proteção
  })
})
```

Se a função responder `{ ok: true }`, aguarde alguns segundos e verifique a aba **“Respostas ao formulário 1”** da sua planilha vinculada.

---

## 🔐 Proteção do endpoint

- **API_KEY (opcional)**: quando setada, a função exige `apiKey` no JSON do request.
- **ALLOWED_ORIGIN (opcional)**: quando setada, a função libera CORS apenas para esse domínio.

---

## ✅ Entradas (conforme seu Forms)

- `entry.2075298705` → **Tipo de Ação** (Resposta curta)
- `entry.360956002` → **Matrícula** (Resposta curta)
- `entry.587663124` → **Objeto** (Resposta curta)

---

## ❗ Dicas importantes

- No Google Forms: **Aceitar respostas** ligado; **Coletar e-mail / Restringir ao domínio / 1 resposta** desativados.
- Perguntas em **Resposta curta** e **Obrigatórias** (sem validação adicional).
- A aba da planilha precisa se chamar exatamente **“Respostas ao formulário 1”**.

---

## 🧭 Integração ao seu `index.html` real

Troque a chamada antiga `postToForms(...)` por:

```js
await fetch('/api/forms-submit', {
  method:'POST',
  headers:{ 'Content-Type':'application/json' },
  body: JSON.stringify({ tipo, matricula, objeto /*, apiKey: '...'*/ })
});
```

Mantenha o restante do fluxo (lookup de nome/ setor via `planilha.json`, pareamento Retirada↔Devolução, etc.).

---

## 🧪 cURL (teste direto)

```bash
curl -X POST "https://SEU-PROJ.vercel.app/api/forms-submit"   -H "Content-Type: application/json"   -d '{
    "tipo": "Retirada",
    "matricula": "10000",
    "objeto": "FACA TESTE",
    "apiKey": "SE-UTILIZAR"
  }'
```
