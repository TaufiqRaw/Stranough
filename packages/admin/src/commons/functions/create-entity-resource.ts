import { useNavigate } from "@solidjs/router";
import { useQueryClient } from "@tanstack/solid-query";
import { createEffect, createResource, createSignal } from "solid-js";

export function createEntityResource<T>(_id : number | undefined, 
  qcKey : string,
  createEntity : (data : any, options : any)=>T,
  getEntity : (id : number, options : any)=>Promise<T | undefined>,
  props : {
    onStore ?: (b : T)=>Promise<any>,
    onUpdate ?: (b : T)=>Promise<any>,
}){
  const queryClient = useQueryClient();
  function qcInvalidator (_id ?:number){
    const id = _id ? {id : _id} : undefined;
    queryClient.invalidateQueries({queryKey : [qcKey, {...id}]})
  };

  const [id, setId] = createSignal<number | undefined>(_id || undefined);

  const navigate = useNavigate();
  
  const [res, {refetch}] = createResource(async()=>{
    const onSave = (b : T)=>async()=>{
      if(!!id()){
        await props.onUpdate!(b); 
        //TODO : add success message
        navigate('../');
      }else{
        await props.onStore!(b);
        //TODO : add success message
        navigate('../');
      }
      qcInvalidator?.(id())
    };
  
    if(!id()){
      return createEntity(undefined, {
        onSave
      });
    }
  
    try{
      return await getEntity(id()!, {
        onSave
      });
    }catch(err){
      console.error(err);
      return undefined;
    }
  })
  createEffect(()=>{
    id() && refetch();
  })
  return {
    get : res,
    load : setId,
  }
}