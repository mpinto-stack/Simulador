
function q(id){return document.getElementById(id)}
function fmt(n,dec){return Number(n).toLocaleString('pt-PT',{minimumFractionDigits:dec,maximumFractionDigits:dec})}
function heatStyle(v,vmin,vmax,invert){ if(vmax<=vmin) return ''; let t=(v-vmin)/(vmax-vmin); if(invert) t=1-t; const hue=120*t; return `background:linear-gradient(90deg, hsla(${hue},70%,85%,0.9) ${Math.max(8,t*100)}%, transparent ${Math.max(8,t*100)}%)`; }

function visibleColsFor(view, mode){
  const netOnly = (mode!=='both');
  const base=['marca','modelo'];
  const ess = base.concat(netOnly? ['tco_km_n','tco_mes_n','precoApos_n','eur100_n','aut_verao','t1080','rtv','rti'] : ['tco_km_n','tco_mes_n','precoApos_n','precoApos_g','eur100_n','eur100_g','aut_verao','t1080','rtv','rti']);
  const fin = base.concat(netOnly? ['precoApos_n','eurCapex_n','eur100_n','tco_km_n','tco_mes_n','km_budget','capex_m','fixos_m'] : ['precoApos_n','precoApos_g','eurCapex_n','eurCapex_g','eur100_n','eur100_g','tco_km_n','tco_km_g','tco_mes_n','tco_mes_g','km_budget','capex_m','fixos_m']);
  const trip = base.concat(['aut_verao','aut_inv','t1080','mala','km_budget']);
  const full = ['marca','modelo','precoApos_n'].concat(netOnly? []:['precoApos_g']).concat(['cap','cons','capex_m','fixos_m','eur100_n']).concat(netOnly? []:['eur100_g']).concat(['eurCapex_n']).concat(netOnly? []:['eurCapex_g']).concat(['tco_km_n']).concat(netOnly? []:['tco_km_g']).concat(['tco_mes_n']).concat(netOnly? []:['tco_mes_g']).concat(['km_budget','aut_verao','aut_inv','t1080','rtv','rti','mala']);
  return (view==='ess')?ess:(view==='fin')?fin:(view==='trip')?trip:full;
}

function headLabel(key){
  const map={ marca:'Marca', modelo:'Modelo', precoApos_n:'Preço após retoma (EUR s/IVA)', precoApos_g:'Preço após retoma (EUR c/IVA)', cap:'Cap. util (kWh)', cons:'Consumo (kWh/km)', capex_m:'Capex EUR/mês (s/IVA)', fixos_m:'Fixos EUR/mês (s/IVA)', eur100_n:'EUR energia / 100 km (s/IVA)', eur100_g:'EUR energia / 100 km (c/IVA)', eurCapex_n:'EUR capex / km (s/IVA)', eurCapex_g:'EUR capex / km (c/IVA)', tco_km_n:'TCO EUR/km (s/IVA)', tco_km_g:'TCO EUR/km (c/IVA)', tco_mes_n:'TCO EUR/mês (s/IVA)', tco_mes_g:'TCO EUR/mês (c/IVA)', km_budget:'km/mês (budget)', aut_verao:'Aut AE verão (km)', aut_inv:'Aut AE inverno (km)', t1080:'10–80% (min)', rtv:'RT verão', rti:'RT inverno', mala:'Mala (L)'};
  return map[key]||key;
}

export function buildTable(rows){ const thead=q('theadRow'); const tbody=q('tbl').querySelector('tbody'); const mode=(q('resMode').value||'net'); const view=(q('tblView').value||'ess'); const cols=visibleColsFor(view, mode); thead.innerHTML=''; tbody.innerHTML=''; cols.forEach(c=>{ const th=document.createElement('th'); th.textContent=headLabel(c); if(c==='marca') th.className='l sticky1'; if(c==='modelo') th.className='l sticky2'; thead.appendChild(th); });
  function mm(keys){ const vals=[]; rows.forEach(r=>{ keys.forEach(k=>{ if(typeof r[k]==='number') vals.push(r[k]); }); }); const mn=Math.min(...vals), mx=Math.max(...vals); return {min:mn,max:mx}; }
  const hm={ e100:mm(['eur100_n']), cx:mm(['eurCapex_n']), tco:mm(['tco_km_n']), t:mm(['t1080']) };
  rows.forEach(r=>{ const tr=document.createElement('tr'); cols.forEach(c=>{ const td=document.createElement('td'); const val=r[c]; let text=''; let style=''; if(typeof val==='number'){ const dec=(c.indexOf('tco_km')>=0||c.indexOf('eurCapex')>=0||c==='cons')?3:(c.indexOf('eur100')>=0?2:(c==='t1080'?1:(c.indexOf('tco_mes')>=0||c.indexOf('preco')>=0)?0:0)); text=fmt(val,dec); if(c==='eur100_n') style=heatStyle(val, hm.e100.min, hm.e100.max, true); if(c==='eurCapex_n') style=heatStyle(val, hm.cx.min, hm.cx.max, true); if(c==='tco_km_n') style=heatStyle(val, hm.tco.min, hm.tco.max, true); if(c==='t1080') style=heatStyle(val, hm.t.min, hm.t.max, true); }
    else if(typeof val==='boolean'){ td.textContent = val? 'Sim':'Não'; td.className= val? 'ok':'bad'; }
    else { text = val; td.className='l'; }
    if(c==='marca') td.className='l sticky1'; if(c==='modelo') td.className='l sticky2'; if(style) td.setAttribute('style',style);
    if(!(c==='rtv'||c==='rti')) td.textContent=text; tr.appendChild(td); }); tbody.appendChild(tr); });
}

export function buildKPIs(rows){ const k=document.getElementById('kpis'); if(!k) return; k.innerHTML=''; if(!rows.length) return; function kpi(t,m,s){ const d=document.createElement('div'); d.className='kpi'; d.innerHTML=`<div>${t}</div><b>${m}</b><div>${s}</div>`; k.appendChild(d);} const best=rows[0]; kpi('Melhor TCO (s/IVA)', best.marca+' '+best.modelo, `${best.tco_km_n.toFixed(3)} EUR/km · ${best.tco_mes_n.toFixed(0)} EUR/mês`); const maxKm=Math.max(...rows.map(r=>r.km_budget)); const who=rows.find(r=>r.km_budget===maxKm); if(who) kpi('Maior km/mês (budget)', who.marca+' '+who.modelo, `${maxKm.toFixed(0)} km/mês`); const arr=rows.map(x=>x.eur100_n); kpi('Energia (mix s/IVA)', `${Math.min(...arr).toFixed(2)} - ${Math.max(...arr).toFixed(2)} EUR`, '/100 km'); }
