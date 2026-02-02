
export function paretoFront(rows, keys=['tco_km_n','t1080','aut_verao'], sense=['min','min','max']){
  const S = rows.map(r=>({r, v: keys.map((k,i)=> ({x:r[k], s:sense[i]})) }));
  const out=[];
  for(let i=0;i<S.length;i++){
    let dominated=false;
    for(let j=0;j<S.length && !dominated;j++) if(i!==j){
      const a=S[i].v, b=S[j].v;
      let betterOrEqual=true, strictly=false;
      for(let k=0;k<a.length;k++){
        const sa=a[k].s; const va=a[k].x; const vb=b[k].x;
        const ok = (sa==='min')? (vb<=va) : (vb>=va);
        if(!ok){ betterOrEqual=false; break; }
        if((sa==='min' && vb<va) || (sa==='max' && vb>va)) strictly=true;
      }
      if(betterOrEqual && strictly) dominated=true;
    }
    if(!dominated) out.push(S[i].r);
  }
  return out;
}
