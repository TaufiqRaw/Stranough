import { Owner, runWithOwner } from "solid-js";
import { axios } from "../axios-instance";
import { ServerEntities } from "stranough-server";

export function createCommonRepository<T extends {
  id : {
    get : ()=>number | undefined,
  }
}, ServerDTO, P extends {
  [x: string]: any;
} = {}>(
  entityName : string,
  createEntity : (...args : any[])=>T,
  signalToDto : (b : T)=>ServerDTO,
){
  return {
    async index(page : number, options ?: {limit ?: number} & P){
      const {data} = await axios.get<[ServerEntities.Headstock[], number]>(`/${entityName}`, {params: {
        page, ...options
      }});
      return data[0];
    },
    async get (id : number, options ?: {onSave ?: (b : T)=>()=>Promise<void>, owner ?: Owner}){
      const {data} = await axios.get(`/${entityName}/${id}`);
      if(options?.owner){
        return runWithOwner(options.owner, ()=>createEntity(data, options));
      }
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
  
    queryKey: (props?: { id?: number; page?: number, limit ?:number } & P) : [string, {[x: string]: any}] => {
      const option: { [x: string]: any } = {};
      Object.assign(option, props);
  
      return [entityName, option];
    },
  }
}