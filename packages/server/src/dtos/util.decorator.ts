import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Class } from "utility-types";

export function OptionalOnUpdate(){
  return (target : Object, propertyKey: string)=>{
    IsNotEmpty({
      groups : ['create']
    })(target, propertyKey);
    IsOptional({
      groups : ['update']
    })(target, propertyKey);
  }
}
export function ExposeAll(){
  return (constructor:any) => {
    Object.getOwnPropertyNames(new constructor()).forEach(key => {
      Expose()(constructor.prototype, key)
    });
  }
}