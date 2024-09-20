import { BaseEntity } from "@mikro-orm/core";
import { ExposeAll } from "./util.decorator";
import { KeyOf } from "../interfaces/class-key.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { Order } from "../entities";
import { IsBoolean, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";
import { GuitarBuilder } from "stranough-common";
import { IUserChatContext } from "../interfaces/user-chat-context";

@ExposeAll()
export class OrderDto extends BaseEntity implements KeyOf<EntityWithoutBase<Order>> {

  @IsNotEmpty()
  selectedItems : GuitarBuilder.SelectedItem;

  @IsOptional()
  selectedItemNames ?: IUserChatContext['selectedComponentName']; 

  @IsOptional()
  @IsString()
  @MaxLength(250)
  preferencesDescription?: string;

  @IsOptional()
  @IsString()
  oldId?: string;

  @IsOptional()
  @IsNumber()
  preferencesImgLength?: number;
  
  @IsOptional()
  @IsBoolean()
  isFinished?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastStep?: string;
}