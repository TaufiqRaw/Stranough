export function getFretDistances(scaleLength : number, fretCount : number){
  const r = [0];
  for(let i = 1; i <= fretCount-1; i++){
    r.push((scaleLength - r[i-1]) / 17.817 + r[i-1]);
  }
  return r;
}