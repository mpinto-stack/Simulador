
function q(id){return document.getElementById(id)}
function fmt(n,dec){return Number(n).toLocaleString('pt-PT',{minimumFractionDigits:dec,maximumFractionDigits:dec})}

function bestBy(rows, keyFn, asc){ let best=null; let valBest=null; rows.forEach(r=>{ const v=keyFn(r); if(v==null||isNaN(v)) return; if(best==null || (asc? v<valBest : v>valBest)){ best=r; valBest=v; } }); return best? {row:best, val:valBest}: null; }
function recCard(title, r, detail){ const div=document.createElement('div'); div.className='panel'; if(!r){ div.innerHTML='<b>'+title+':</b> —'; return div; } div.innerHTML='<b>'+title+':</b> '+r.marca+' '+r.modelo+'<br><span class="note">'+detail+'</span>'; div.style.borderLeft='6px solid '+r.comp_col; return div; }

export function buildRecs(){ const c=q('recsGrid'); if(!c) return; c.innerHTML=''; const rows=(window.__ROWS||[]); if(!rows.length) return; const kmAno= +document.getElementById('kmAno').value || 10000;
  const r_barato = bestBy(rows, x=> x.precoApos_n, true);
  const r_op = bestBy(rows, x=> (x.eur100_n/100) + ((x.fixos_m*12)/(kmAno)), true);
  const r_val = bestBy(rows, x=> x.eurCapex_n, true);
  const r_geral = bestBy(rows, x=> x.tco_km_n, true);
  const r_aut = bestBy(rows, x=> x.aut_verao, false);
  const r_fast = bestBy(rows, x=> -x.t1080, true);
  c.appendChild(recCard('Mais barato (aquisição)', r_barato? r_barato.row:null, r_barato? ('Preço após: '+fmt(r_barato.row.precoApos_n,0)+' EUR s/IVA') : ''));
  c.appendChild(recCard('Menor custo de operação', r_op? r_op.row:null, r_op? ('Energia+fixos: '+fmt(((r_op.row.eur100_n/100)+((r_op.row.fixos_m*12)/(kmAno))),3)+' EUR/km') : ''));
  c.appendChild(recCard('Melhor valorização', r_val? r_val.row:null, r_val? ('Depreciação: '+fmt(r_val.row.eurCapex_n,3)+' EUR/km') : ''));
  c.appendChild(recCard('Melhor compra (geral)', r_geral? r_geral.row:null, r_geral? ('TCO: '+fmt(r_geral.row.tco_km_n,3)+' EUR/km') : ''));
  c.appendChild(recCard('Mais autonomia (AE verão)', r_aut? r_aut.row:null, r_aut? ('Aut.: '+fmt(r_aut.row.aut_verao,0)+' km') : ''));
  c.appendChild(recCard('Mais rápido a carregar (10–80%)', r_fast? r_fast.row:null, r_fast? ('Tempo: '+fmt(r_fast.row.t1080,1)+' min') : ''));
}
