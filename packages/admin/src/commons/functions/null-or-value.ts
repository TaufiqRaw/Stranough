export function nullOrValue<T>(nullOrValue : any | null, value : T){
  return nullOrValue == null ? null : value;
}