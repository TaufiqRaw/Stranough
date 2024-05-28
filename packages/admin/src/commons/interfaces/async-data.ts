export interface AsyncData<T>{
  data : T | undefined,
  error : Error | undefined,
  loading : boolean
}