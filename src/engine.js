
import { euroKwhEffPair } from './energy.js';
import { ivaDec } from './params.js';

function q(id){return document.getElementById(id)}
function colorFor(key){ let hash=0; for(let i=0;i<key.length;i++){ hash=((hash<<5)-hash)+key.charCodeAt(i); hash|=0; } const r=(hash>>>16)&255, g=(hash>>>8)&255, b=hash&255; return `rgb(${50+(r%180)},${50+(g%180)},${50+(b%180)})`; }

export function precoNetPara(d){
  const iva = ivaDec();
  const key=d.marca+'
'+d.modelo;
  // propostas
  const ALL=(window.DATA||[]).concat(window.CUSTOM||[]);
  let idx = ALL.findIndex(x=> (x.marca+'
'+x.modelo)===key);
  let propEl = document.getElementById('p_'+idx);
  if(propEl && +propEl.value>0) return +propEl.value;
  if(d.preco_net!=null) return d.preco_net;
  const gross=d.precoBase_gross||0;
  return (document.getElementById('catBaseIncluiIVA').checked? (gross/(1+iva)) : gross);
}

export function computeAll(){
  const anos=+q('anos').value||10,
        kmAno=+q('kmAno').value||10000,
        residual=(+q('residual').value||30)/100,
        fixosAno=+q('fixosAno').value||450,
        reserva=(+q('reserva').value||10)/100,
        penAE=(+q('penAE').value||20)/100,
        penInv=(+q('penInv').value||15)/100,
        distKm=+q('distKm').value||162,
        ret=+q('retoma').value||0,
        iva=ivaDec(),
        pair=euroKwhEffPair(),
        euro_net=pair.net, euro_gross=pair.gross,
        eur_km_fixos_net=fixosAno/kmAno,
        eur_km_fixos_gross=(fixosAno*(1+iva))/kmAno,
        orc=+q('orcMensal').value||0,
        mode=q('resMode').value||'net';

  const ALL=(window.DATA||[]).concat(window.CUSTOM||[]);
  const rows=[];
  for(const d of ALL){
    if(!(((d.precoBase_gross>0)||(d.preco_net>0)) && d.wlpt_km>0 && d.cap>0 && d.cons>0)) continue;
    const preco_net = precoNetPara(d);
    const preco_ap_net = Math.max(0, preco_net - ret);
    const preco_ap_gross = preco_ap_net*(1+iva);

    const eur_km_energia_net = d.cons*euro_net;
    const eur_km_capex_net = (preco_ap_net*(1-residual))/(anos*kmAno);
    const tco_km_net = eur_km_capex_net + eur_km_energia_net + eur_km_fixos_net;
    const tco_mes_net = tco_km_net*(kmAno/12);

    const eur_km_energia_gross = d.cons*euro_gross;
    const eur_km_capex_gross = (preco_ap_gross*(1-residual))/(anos*kmAno);
    const tco_km_gross = eur_km_capex_gross + eur_km_energia_gross + eur_km_fixos_gross;
    const tco_mes_gross = tco_km_gross*(kmAno/12);

    const capex_m = (preco_ap_net*(1-residual))/(anos*12);
    const fixos_m = (fixosAno/12);
    const var_eur_per_km = eur_km_energia_net;
    const km_budget = var_eur_per_km>0 ? Math.max(0, (orc - capex_m - fixos_m)/var_eur_per_km) : 0;

    const aut_verao = d.wlpt_km*(1-reserva)*(1-penAE);
    const aut_inv = aut_verao*(1-penInv);
    const t1080 = (0.70*d.cap)/(d.pdc||120)*60; // min
    const need_verao = 2*distKm * d.cons * (1+penAE);
    const need_inv = 2*distKm * d.cons * (1+penAE) * (1+penInv);
    const budget_kwh = d.cap*(1-reserva);
    const rtv = need_verao <= budget_kwh;
    const rti = need_inv <= budget_kwh;

    rows.push({
      key: d.marca+'
'+d.modelo,
      name: d.marca+' '+d.modelo,
      marca:d.marca, modelo:d.modelo,
      precoApos_n:preco_ap_net, precoApos_g:preco_ap_gross,
      cap:d.cap, cons:d.cons,
      eur100_n:100*eur_km_energia_net, eurCapex_n:eur_km_capex_net,
      tco_km_n:tco_km_net, tco_mes_n:tco_mes_net,
      eur100_g:100*eur_km_energia_gross, eurCapex_g:eur_km_capex_gross,
      tco_km_g:tco_km_gross, tco_mes_g:tco_mes_gross,
      capex_m, fixos_m, km_budget,
      aut_verao, aut_inv, t1080, rtv, rti, mala:d.mala,
      comp_col: colorFor(d.marca+d.modelo)
    });
  }

  rows.sort((a,b)=> a.tco_km_n - b.tco_km_n);
  window.__ROWS = rows;
  return rows;
}
