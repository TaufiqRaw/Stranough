import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Jack, Media } from "../entities";
import { EntityWithoutBase, EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { KeyOf } from "../interfaces/class-key.interface";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { Inlay } from "../entities/inlay.entity";
import { BaseEntityWithDesc } from "../entities/base-with-desc.entity";

@ExposeAll()
export class InlayDto extends BaseEntityWithDesc implements KeyOf<EntityWithoutBase<Inlay>> {
  @IsOptional()
  @IsNumber()
  scale ?: number = 1;

  @OptionalOnUpdate()
  @IsNumber()
  thumbnail?: Media;

  @IsOptional()
  @IsNumber()
  fret1 ?: Media;

  @IsOptional()
  @IsNumber()
  fret2?: Media;

  @IsOptional()
  @IsNumber()
  fret3?: Media;

  @IsOptional()
  @IsNumber()
  fret4?: Media;

  @IsOptional()
  @IsNumber()
  fret5?: Media;

  @IsOptional()
  @IsNumber()
  fret6?: Media;

  @IsOptional()
  @IsNumber()
  fret7?: Media;

  @IsOptional()
  @IsNumber()
  fret8?: Media;

  @IsOptional()
  @IsNumber()
  fret9?: Media;

  @IsOptional()
  @IsNumber()
  fret10?: Media;

  @IsOptional()
  @IsNumber()
  fret11?: Media;

  @IsOptional()
  @IsNumber()
  fret12?: Media;

  @IsOptional()
  @IsNumber()
  fret13?: Media;

  @IsOptional()
  @IsNumber()
  fret14?: Media;

  @IsOptional()
  @IsNumber()
  fret15?: Media;

  @IsOptional()
  @IsNumber()
  fret16?: Media;

  @IsOptional()
  @IsNumber()
  fret17?: Media;

  @IsOptional()
  @IsNumber()
  fret18?: Media;

  @IsOptional()
  @IsNumber()
  fret19?: Media;

  @IsOptional()
  @IsNumber()
  fret20?: Media;

  @IsOptional()
  @IsNumber()
  fret21?: Media;

  @IsOptional()
  @IsNumber()
  fret22?: Media;

  @IsOptional()
  @IsNumber()
  fret23?: Media;

  @IsOptional()
  @IsNumber()
  fret24?: Media;

  @IsOptional()
  @IsNumber()
  fret25?: Media;

  @IsOptional()
  @IsNumber()
  fret26?: Media;

  @IsOptional()
  @IsNumber()
  fret27?: Media;
}