import { axios } from "../axios-instance";

export function createCommonRepository<T extends {
  id : {
    get : ()=>number | undefined,
  }
}, ServerT>(
  entityName : string,
  createEntity : (...args : any[])=>T,
  signalToDto : (b : T)=>ServerT,
){
  return {
    async get (id : number, options ?: {onSave ?: (b : T)=>()=>Promise<void>}){
      const {data} = await axios.get(`/${entityName}/${id}`);
      return createEntity(data, options);
    },
  
    async create(b : T){
      const dto = signalToDto(b);
      const {data} = await axios.post(`/${entityName}`, dto);
      return data;
    },
  
    async update(b : T){
      const dto = signalToDto(b);
      await axios.put<void>(`/${entityName}/${b.id.get()}`, dto);
    },
  
    async delete(id : number){
      await axios.delete<void>(`/${entityName}/${id}`);
    },
  
    queryKey: (props?: { id?: number; page?: number }) : [string, {[x: string]: any}] => {
      const option: { [x: string]: any } = {};
      props?.id && (option.id = props?.id);
      props?.page && (option.page = props?.page);
  
      return [entityName, option];
    },
  }
}