
export function runTests(){
  const rows = window.__ROWS||[];
  console.assert(rows.length>0, 'Deve haver linhas calculadas');
  const a = rows[0];
  console.assert(a.tco_km_n>0 && a.tco_mes_n>0, 'TCO deve ser >0');
  console.log('OK: smoke tests');
}
