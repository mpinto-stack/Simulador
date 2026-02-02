
import { euroKwhEffPair } from './energy.js';

const q=(id)=>document.getElementById(id);

export function planTrip(){
  const sel=q('tripModel').value;
  const ALL=(window.DATA||[]).concat(window.CUSTOM||[]);
  const d = (window.__ROWS||ALL.map(x=>({marca:x.marca,modelo:x.modelo,cap:x.cap,cons:x.cons,pdc:x.pdc}))).find(x=> (x.marca+'
'+x.modelo)===sel || (x.key===sel));
  const out=q('planOut');
  if(!d){ out.textContent='Seleciona um modelo.'; return; }
  if(!(d.cap && d.cons)){ out.textContent='Modelo sem dados completos.'; return; }
  const dist=+q('tripKm').value||500;
  const v=+q('tripV').value||110;
  const penAE=(+q('penAE').value||20)/100;
  const penInv=(+q('penInv').value||15)/100;
  const res=(+q('reservaTrip').value||10)/100;
  const pair=euroKwhEffPair();
  const cons = d.cons*(1+penAE)*(1+penInv);
  const total_kwh = cons * dist;

  // curva simples 10-50-80
  const cap = d.cap;
  const pdc = d.pdc||120;
  const usable = 0.70*cap;
  const start = cap*(1-res);
  const remaining = total_kwh - start;
  const stops = remaining>0 ? Math.ceil(remaining/usable) : 0;
  const t1080 = (0.70*cap)/(pdc)*60; // min
  const charge_h = stops*(t1080/60);
  const drive_h = dist/(v>0?v:110);

  const eur_energia_net = total_kwh*pair.net;
  if((document.getElementById('resMode').value||'net')==='both'){
    const eur_energia_gross = total_kwh*pair.gross;
    out.textContent = `Modelo ${d.marca} ${d.modelo}: ${stops} paragens · tempo ~ ${(drive_h+charge_h).toFixed(2)} h · energia ${total_kwh.toFixed(1)} kWh (${eur_energia_net.toFixed(2)} EUR s/IVA; ${eur_energia_gross.toFixed(2)} EUR c/IVA).`;
  } else {
    out.textContent = `Modelo ${d.marca} ${d.modelo}: ${stops} paragens · tempo ~ ${(drive_h+charge_h).toFixed(2)} h · energia ${total_kwh.toFixed(1)} kWh (${eur_energia_net.toFixed(2)} EUR s/IVA).`;
  }
}
