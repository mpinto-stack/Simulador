
import { ivaDec, sensEner, sensFuel } from './params.js';

export function euroKwhEffPair(){
  const hp= +document.getElementById('precoCasaHP').value || 0.19;
  const hc= +document.getElementById('precoCasaHC').value || 0.15;
  const shp=(+document.getElementById('shareHP').value||60)/100;
  const lH=(+document.getElementById('perdasCasa').value||12)/100;
  const pdc=+document.getElementById('precoDC').value || 0.40;
  const lD=(+document.getElementById('perdasDC').value||8)/100;
  const mH=(+document.getElementById('mixCasa').value||95)/100;
  const mD=(+document.getElementById('mixDC').value||5)/100;
  const impE=+document.getElementById('impElec').value || 0;
  const iva = ivaDec();
  let home=(hp*shp + hc*(1-shp))*(1+lH);
  let dc = pdc*(1+lD);
  let base = (home*mH + dc*mD) + impE;
  base = base*(1 + sensEner());
  return { net: base, gross: base*(1+iva) };
}

export function fuelPricePair(){
  const base = +document.getElementById('ice_eur_l').value || 0;
  const imp = +document.getElementById('impFuel').value || 0;
  const iva = ivaDec();
  const v = (base+imp)*(1+sensFuel());
  return { net: v, gross: v*(1+iva) };
}
