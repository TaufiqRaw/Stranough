import objectHash from "object-hash";
import { AsyncData } from "../interfaces/AsyncData";
import { SignalObject } from "../interfaces/SignalObject";
import { Owner, onCleanup, runWithOwner } from "solid-js";
import { SignalObjectUtil } from "../functions/signalObjectUtil";
import { AsyncDataUtil } from "../functions/asyncDataUtil";

type QueryKey = string | string[] ;

export namespace Network {
  const queries = new Map<string, Network.Fetcher<any>>();

  function registerQuery(queryKey : QueryKey, query : Network.Fetcher<any>){
    const key = objectHash(queryKey); 
    if(queries.has(key))
      console.warn(`Query with key ${JSON.stringify(queryKey)} already exists. Overwriting it.`);
    queries.set(key, query);
  }
  
  export function invalidateQuery(queryKey : QueryKey){
    const query = queries.get(objectHash(queryKey));
    if(query){
      query.reload();
    }
  }
  
  export class Mutator<T>{
    private state : SignalObject<AsyncData<T>>;
  
    constructor(
      private readonly queryFn : () => Promise<T>,
      private readonly args : {
        onError? : (error : Error) => void
        onSuccess? : (data : T) => void
      }
      ){
      this.state = SignalObjectUtil.create(AsyncDataUtil.blank<T>());
    }
  
    async mutate(){
      if(this.state.get().loading) return;
      
      try{
        this.state.set(AsyncDataUtil.loading<T>());

        const response = await this.queryFn();
        this.args.onSuccess?.(response);
        this.state.set({
          data : response,
          error : undefined,
          loading : false
        });
      }catch(error : any){
        this.args.onError?.(error);
        this.state.set({
          data : undefined,
          error : error || new Error('An error occurred'),
          loading : false
        });
      }
    }
  
    get() : AsyncData<T>{
      return this.state.get();
    }
  
  }

  export class Fetcher<T>{
    private state : SignalObject<AsyncData<T>>;
  
    constructor(
      queryKey : QueryKey,
      owner : Owner,
      private readonly queryFn : () => Promise<T>,
      ){
      registerQuery(queryKey, this);

      this.state = SignalObjectUtil.create(AsyncDataUtil.loading<T>());
      this.reload();

      runWithOwner(owner, ()=>{
        onCleanup(()=>{
          queries.delete(objectHash(queryKey));
        });
      })
    }
  
    async reload(){    
      try{
        this.state.set(AsyncDataUtil.loading<T>());
        const response = await this.queryFn();
        this.state.set({
          data : response,
          error : undefined,
          loading : false
        });
      }catch(error : any){
        this.state.set({
          data : undefined,
          error : error || new Error('An error occurred'),
          loading : false
        });
      }
    }
  
    get() : AsyncData<T>{
      return this.state.get();
    }
  
  }
}