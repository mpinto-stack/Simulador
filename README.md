
# EV – Comparador v8 (alpha)

**Objetivo**: base v8 com motor modular, cenários, Pareto e PWA leve. Inclui um **app.html** 100% funcional em JS (ES modules) e **fontes TS** para evoluir.

---
## Como correr (sem build)
1. Abre `app.html` num browser moderno (Chrome/Edge/Firefox). Se o browser bloquear módulos locais, usa um servidor simples:
   ```bash
   python -m http.server 8000
   # depois abre http://localhost:8000/app.html
   ```

## Como compilar (TypeScript opcional)
- Fonte TS em `src_ts` está fora do alpha; nesta entrega tens JS modular.
- Se quiseres TS já nesta release, diz e eu gero os `.ts` + `tsconfig.json` e instruções com `tsc`.

## Estrutura
```
ev_comparador_v8_alpha/
├─ app.html                # app funcional (ES modules)
├─ manifest.webmanifest    # PWA básico
├─ sw.js                   # service worker simples
├─ src/
│  ├─ data.js              # catálogo base (amostra)
│  ├─ params.js            # estado, perfis, migração v7→v8
│  ├─ energy.js            # preço efetivo do kWh e combustível
│  ├─ engine.js            # TCO/custos + Monte Carlo (stub)
│  ├─ trip.js              # planeador v2 (10–50–80 simplificado)
│  ├─ pareto.js            # frente de Pareto 2D
│  ├─ ui/
│  │  ├─ table.js          # tabela com vistas + heatmaps
│  │  ├─ charts.js         # acumulado + comparador (empilhado)
│  │  └─ recs.js           # recomendações + botão "ver no comparador"
│  └─ workers/
│     └─ compute.worker.js # worker (opcional, fallback no main)
├─ dist/                   # reservado a builds futuros
└─ tests/                  # casos de teste (JS simples)
```

## Notas técnicas
- Fórmulas preservadas de v7.9 (TCO/km = CAPEX/km + ENERGIA/km + FIXOS/km; t_10–80 ≈ 0,70×cap/pdc×60; autonomia AE verão/inverno com penalizações). Catálogo base historicamente c/IVA mas app trabalha s/IVA por defeito. Chaves antigas: `ev_v7_9_state`, `ev_v7_9_presets`, `ev_v7_9_theme`, `ev_v7_9_catalog_edits` (migradas para v8). 
- Nesta alpha: Monte Carlo é stub (gera P50=P50 determinístico).

