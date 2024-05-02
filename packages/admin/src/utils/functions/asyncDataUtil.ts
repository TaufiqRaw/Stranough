import { AsyncData } from "../interfaces/AsyncData"

export namespace AsyncDataUtil {
  export const loading = <T>(): AsyncData<T> => ({
    data : undefined,
    error : undefined,
    loading : true
  })
  
  export const blank = <T>(): AsyncData<T> => ({
    data : undefined,
    error : undefined,
    loading : false
  })
}