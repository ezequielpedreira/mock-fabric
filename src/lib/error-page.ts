export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Erro ao carregar a página</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { font: 15px/1.5 "Segoe UI Variable", "Segoe UI", system-ui, -apple-system, sans-serif; background: radial-gradient(circle at 15% 10%, #d9f7fb, transparent 32rem), radial-gradient(circle at 90% 85%, #f8e5f1, transparent 30rem), #f7f9fc; color: #10213a; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 30rem; width: 100%; text-align: center; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid rgba(192, 205, 223, .7); background: rgba(255,255,255,.88); box-shadow: 0 30px 80px -46px rgba(28,73,135,.45); backdrop-filter: blur(18px); }
      h1 { font-size: 1.5rem; letter-spacing: -.03em; margin: 0 0 0.65rem; }
      p { color: #5b6678; margin: 0 0 1.75rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { min-height: 2.75rem; padding: 0.65rem 1.25rem; border-radius: .8rem; font: inherit; font-weight: 650; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: transform .2s ease, box-shadow .2s ease; }
      a:hover, button:hover { transform: translateY(-1px); }
      .primary { background: linear-gradient(118deg, #0f6cbd, #00a7bd 45%, #7450c7 75%, #d84b8d); color: #fff; box-shadow: 0 14px 28px -16px #0f6cbd; }
      .secondary { background: #fff; color: #10213a; border-color: #ced8e6; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Erro ao carregar a página</h1>
      <p>Algo deu errado. Você pode tentar recarregar ou voltar ao início.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Voltar ao início</a>
      </div>
    </div>
  </body>
</html>`;
}
