
const q = (id)=>document.getElementById(id);

// Storage keys v8
const STORAGE='ev_v8_0_state', PRESETS_KEY='ev_v8_0_presets', THEME_KEY='ev_v8_0_theme', CATALOG_KEY='ev_v8_0_catalog_edits';
// v7 keys (migração)
const OLD={S:'ev_v7_9_state',P:'ev_v7_9_presets',T:'ev_v7_9_theme',C:'ev_v7_9_catalog_edits'};

export let CUSTOM=[]; export let CAT_EDITS={};

export function ivaDec(){ return (+q('ivaPct').value||23)/100 }
export function sensEner(){ return (+q('sensEner').value||0)/100 }
export function sensFuel(){ return (+q('sensFuel').value||0)/100 }

export function saveAll(){ try{
  const ids=['anos','kmAno','residual','fixosAno','reserva','precoCasaHP','precoCasaHC','shareHP','perdasCasa','precoDC','perdasDC','mixCasa','mixDC','retoma','distKm','penAE','penInv','ice_l100','ice_eur_l','phev_ev_share','phev_batt','phev_ev_km','ivaPct','impElec','impFuel','resMode','sensEner','sensFuel','orcMensal','catBaseIncluiIVA','tblView'];
  const s={}; ids.forEach(id=>{ const el=q(id); if(!el) return; s[id] = (el.type==='checkbox')? el.checked : el.value;});
  s.custom=CUSTOM; localStorage.setItem(STORAGE, JSON.stringify(s));
} catch(e){}
}

export function loadAll(){ try{
  // migração simples v7→v8 (apenas 1ª carga)
  if(!localStorage.getItem(STORAGE)){
    const old = localStorage.getItem(OLD.S);
    if(old){ localStorage.setItem(STORAGE, old); }
    const op = localStorage.getItem(OLD.P); if(op) localStorage.setItem(PRESETS_KEY, op);
    const ot = localStorage.getItem(OLD.T); if(ot) localStorage.setItem(THEME_KEY, ot);
    const oc = localStorage.getItem(OLD.C); if(oc) localStorage.setItem(CATALOG_KEY, oc);
  }
  const s = JSON.parse(localStorage.getItem(STORAGE)||'{}');
  Object.keys(s).forEach(k=>{ if(q(k)){ if(q(k).type==='checkbox') q(k).checked=!!s[k]; else q(k).value=s[k]; }});
  if(Array.isArray(s.custom)) CUSTOM = s.custom;
} catch(e){}
}

export function exportAll(){ return {
  state: localStorage.getItem(STORAGE),
  presets: localStorage.getItem(PRESETS_KEY),
  theme: localStorage.getItem(THEME_KEY),
  catalog: localStorage.getItem(CATALOG_KEY),
  custom: CUSTOM
}}

export function importAll(s){ try{
  if(s.state) localStorage.setItem(STORAGE, s.state);
  if(s.presets) localStorage.setItem(PRESETS_KEY, s.presets);
  if(s.theme) localStorage.setItem(THEME_KEY, s.theme);
  if(s.catalog) localStorage.setItem(CATALOG_KEY, s.catalog);
  loadAll(); loadCatalogEdits(); applyCatalogEdits();
} catch(e){}
}

export function resetAll(){ try{
  localStorage.removeItem(STORAGE); localStorage.removeItem(PRESETS_KEY); localStorage.removeItem(THEME_KEY); localStorage.removeItem(CATALOG_KEY);
  CUSTOM=[]; CAT_EDITS={};
} catch(e){}
}

export function loadCatalogEdits(){ try{ const j=localStorage.getItem(CATALOG_KEY); if(j) CAT_EDITS = JSON.parse(j); }catch(e){} }
export function saveCatalogEdits(){ try{ localStorage.setItem(CATALOG_KEY, JSON.stringify(CAT_EDITS)); }catch(e){} }
export function applyCatalogEdits(){ try{ if(!CAT_EDITS) return; window.DATA = (window.DATA||[]).map(d=>{ const k=d.marca+'
'+d.modelo; const p=CAT_EDITS[k]; if(!p) return d; const out=Object.assign({}, d); if(p.preco_net!=null) out.preco_net=p.preco_net; if(p.wlpt_km!=null) out.wlpt_km=p.wlpt_km; if(p.cap!=null) out.cap=p.cap; if(p.cons!=null) out.cons=p.cons; if(p.pdc!=null) out.pdc=p.pdc; if(p.mala!=null) out.mala=p.mala; return out; }); }catch(e){} }

export function addCustom(){ const d={marca:q('cMarca').value||'', modelo:q('cModelo').value||'', preco_net:+q('cPreco').value||0, wlpt_km:+q('cWLTP').value||0, cap:+q('cCap').value||0, cons:+q('cCons').value||0, mala:+q('cMala').value||0, pdc:+q('cPdc').value||120}; if(!d.marca||!d.modelo||!d.preco_net||!d.wlpt_km||!d.cap||!d.cons){ alert('Preencher Marca, Modelo, Preço, WLTP, Cap e Consumo.'); return;} (window.CUSTOM = window.CUSTOM||[]).push(d); CUSTOM=window.CUSTOM; saveAll(); }
export function clearCustom(){ window.CUSTOM=[]; CUSTOM=[]; saveAll(); }
export function resetCatalogEdits(){ CAT_EDITS={}; saveCatalogEdits(); }

export const KEYS = {STORAGE, PRESETS_KEY, THEME_KEY, CATALOG_KEY};
