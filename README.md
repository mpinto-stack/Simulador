
# EV – Comparador v8 (beta, GH Pages)

Esta versão está pronta para ser publicada em **GitHub Pages** (contém `.nojekyll`, `manifest.webmanifest` com `start_url='./app.html'` e registo de Service Worker). Inclui:
- **Pareto ON/OFF** (apenas não dominados) na aba Resultados;
- **%CAPEX / %Operação** na Vista Financeira;
- **Perfil PT 2026 Q1** (IVA 23%, catálogo inclui IVA, modo de resultados = ambos);
- PWA básico.

## Publicar no GitHub Pages
1. Faz upload de todos os ficheiros, tal como estão, para um repositório **público**.
2. Garante que o ficheiro `.nojekyll` está na raiz.
3. Em **Settings → Pages**: `Deploy from a branch` → `main` / `root` → **Save**.
4. Abre `https://<user>.github.io/<repo>/app.html`.
