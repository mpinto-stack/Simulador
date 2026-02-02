
import { ivaDec, saveCatalogEdits, loadCatalogEdits, applyCatalogEdits, KEYS } from './params.js';

export let DATA = [
 {marca:'Tesla', modelo:'Model Y Standard', wlpt_km:534, cap:60, cons:0.11, precoBase_gross:42325, mala:854, pdc:120},
 {marca:'Tesla', modelo:'Model 3 Standard', wlpt_km:534, cap:60, cons:0.11, precoBase_gross:37650, mala:594, pdc:120},
 {marca:'Citroen',modelo:'e-C5 Aircross 210 PLUS', wlpt_km:520, cap:73, cons:0.14, precoBase_gross:41790, mala:565, pdc:160},
 {marca:'Hyundai',modelo:'Ioniq 5 EV 570 Premium Plus', wlpt_km:570, cap:80, cons:0.14, precoBase_gross:44150, mala:520, pdc:250},
 {marca:'Kia', modelo:'EV5 Tech (PT base)', wlpt_km:520, cap:81.4, cons:0.171, precoBase_gross:49990, mala:566, pdc:115},
 {marca:'XPENG', modelo:'G6 Standard 66kWh', wlpt_km:435, cap:66, cons:0.15, precoBase_gross:43000, mala:571, pdc:280},
 {marca:'MG', modelo:'S5 Luxury Long Range', wlpt_km:465, cap:62, cons:0.13, precoBase_gross:37089, mala:453, pdc:80}
];

window.DATA = DATA; // para edits
window.CUSTOM = window.CUSTOM||[];

function q(id){ return document.getElementById(id); }

export function buildCatalog(){ const sel=q('catalogSel'); if(!sel) return; sel.innerHTML=''; const ALL = (window.DATA||[]).concat(window.CUSTOM||[]); ALL.forEach(d=>{ const o=document.createElement('option'); o.value=d.marca+'
'+d.modelo; o.textContent=d.marca+' '+d.modelo; sel.appendChild(o); }); fillCatalogFields(); }

export function fillCatalogFields(){ const key=q('catalogSel').value; const ALL=(window.DATA||[]).concat(window.CUSTOM||[]); const d=ALL.find(x=> (x.marca+'
'+x.modelo)===key ); if(!d) return; const iva = ivaDec(); const baseNet = (d.preco_net!=null)? d.preco_net : (q('catBaseIncluiIVA').checked ? ( (d.precoBase_gross||0)/(1+iva) ) : (d.precoBase_gross||0) ); q('catPreco').value=baseNet||0; q('catWLTP').value=d.wlpt_km||0; q('catCap').value=d.cap||0; q('catCons').value=d.cons||0; q('catPdc').value=d.pdc||0; q('catMala').value=d.mala||0; }

export function saveCatalogModel(){ const key=q('catalogSel').value; if(!key) return; const parts=key.split('
'); const patch={ marca:parts[0], modelo:parts[1], preco_net:+q('catPreco').value||0, wlpt_km:+q('catWLTP').value||0, cap:+q('catCap').value||0, cons:+q('catCons').value||0, pdc:+q('catPdc').value||0, mala:+q('catMala').value||0}; const j = JSON.parse(localStorage.getItem(KEYS.CATALOG_KEY)||'{}'); j[key]=patch; localStorage.setItem(KEYS.CATALOG_KEY, JSON.stringify(j)); loadCatalogEdits(); applyCatalogEdits(); buildProps(); }

export function resetCatalog(){ localStorage.removeItem(KEYS.CATALOG_KEY); }

export function buildProps(){ const c=document.getElementById('props'); if(!c) return; c.innerHTML=''; const ALL=(window.DATA||[]).concat(window.CUSTOM||[]); ALL.forEach((d,i)=>{ const id='p_'+i; const div=document.createElement('div'); div.innerHTML=`<label>${d.marca} ${d.modelo} — Proposta (EUR s/IVA)</label><input type="number" id="${id}">`; c.appendChild(div); }); }

