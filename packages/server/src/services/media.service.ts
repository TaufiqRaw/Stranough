import sharp from 'sharp';
import {v4} from 'uuid'
import { join } from 'path';
import { ImageConversionOutput } from '../interfaces/image-conversion-output.interface';
import { Media, MediaProps } from '../entities/media.entity';
import {contentType} from 'mime-types';
import { DI } from '../app';
import { Request, RequestHandler, Response } from 'express';
import { validateDto } from '../utils/validate-dto.util';
import { ImageUploadDto } from '../dtos/image-upload.dto';
import { BadRequestError } from '../utils/classes/error.class.util';
import * as Constants from '../constants';
import { RequestContext } from '@mikro-orm/core';
import fs from 'fs/promises';

export namespace MediaService {
  /**
   * Format and store image to drive, also save its metadata to database.
   * 
   * @param name 
   * @param file 
   * @param option
   * @returns 
   */
  export async function storeImage(
    name : string,
    file: Express.Multer.File,
    option ? : {
      maxWidth ? : number;
      maxHeight ? : number;
      useName ? : boolean;
    },
  ) {
    const filename = (option?.useName) ? name : v4();
    const outputMetadata = await convertImgAndSave({
      imgBuffer: file.buffer,
      filename,
      resize: {
        width: option?.maxWidth,
        height: option?.maxHeight,
      },
    });

    if(!option?.useName){
      const newMedia = new Media({
        name: `${name}-${filename}`, 
        filename : outputMetadata.filename,
        mimeType: contentType(outputMetadata.format) as string,
        height: outputMetadata.height,
        width: outputMetadata.width,
      });
      await RequestContext.getEntityManager()!.persistAndFlush(newMedia);
      return newMedia;
    }

    return {
      filename: outputMetadata.filename,
      mimeType: contentType(outputMetadata.format) as string,
      height: outputMetadata.height,
      width: outputMetadata.width,
    }
  }

  export function createUserPreferenceHandler(
    options : {
      maxWidth : number,
      name : (req : Request)=>Promise<string>,
    }
  ) : RequestHandler {
    return async (req, res) => {
      const data = await validateDto(req, ImageUploadDto);
    
      if(req.file == undefined)
        throw new BadRequestError("No file uploaded");
    
      const name = await options.name(req);
      const result = await MediaService.storeImage(name, req.file, {
        maxWidth: options.maxWidth,
        useName: name !== undefined,
      });

      return res.json(result);
    }
  }

  export function createGuitarTextureHandler(
    maxSize : {
      maxWidth ? : number,
      maxHeight ? : number,
    }
  ) : RequestHandler {
    return async (req, res) => {
      const data = await validateDto(req, ImageUploadDto);
    
      if(req.file == undefined)
        throw new BadRequestError("No file uploaded");
    
      const result = await MediaService.storeImage(data.name, req.file, {
        maxWidth: maxSize.maxWidth,
        maxHeight: maxSize.maxHeight,
      });

      return res.json(result);
    }
  }

  export async function findOrphanedMedia(){
    const client = await DI.pgPool.connect();
    // const medias = registeredRepoAndMediaKeys.reduce(async (_acc, item)=>{
    //   const medias = client.query(`SELECT ${item.mediaKeys.map(i=>`${String(i)}_id`).join(',')} FROM ${em.getMetadata().get(item.repository.getEntityName()).collection}`);
    //   console.log(medias)
    //   return {}
    //   // const acc = await _acc;
    //   // medias.forEach(media=>{
    //   //   acc[(media as any).id ] = true;
    //   // })
    //   // return acc;
    // }, {} as Promise<Record<string, boolean>>)
    const foreigns = await client.query(
    `SELECT (select  r.relname from pg_class r where r.oid = c.confrelid) as base_table,
         a.attname as base_col,
         (select r.relname from pg_class r where r.oid = c.conrelid) as referencing_table,
         UNNEST((select array_agg(attname) from pg_attribute where attrelid = c.conrelid and array[attnum] <@ c.conkey)) as referencing_col,
         pg_get_constraintdef(c.oid) contraint_sql
    FROM pg_constraint c join pg_attribute a on c.confrelid=a.attrelid and a.attnum = ANY(confkey)
    WHERE c.confrelid = (select oid from pg_class where relname = 'media')
      AND c.confrelid!=c.conrelid;`
  );
    const mediaRefs = foreigns.rows.reduce((prev,i:any)=>{
      prev[i.referencing_table] = prev[i.referencing_table] ?? [];
      prev[i.referencing_table].push(i.referencing_col);
      return prev;
    }, {} as Record<string, string[]>) as Record<string, string[]>;
    
    const medias = Object.entries(mediaRefs).reduce(async (_prev,[table, cols])=>{
      const medias = await client.query(`SELECT ${cols.map(i=>`${i}`).join(',')} FROM ${table}`);
      const prev = await _prev;
      medias.rows.forEach(media=>{
        Object.values(media).forEach(id=>{
          id && (prev[id as any] = true);
        })
      });
      return prev;
    }, {} as Promise<Record<string, boolean>>)
    client.release();
  
    const referencedMedias = Object.keys(await medias).map(i=>parseInt(i));
    const mediaRepo = DI.repository.medias;
    const orphanMedias = await mediaRepo.findAndCount({
      id : {
        $nin : referencedMedias
      }
    });
    return orphanMedias;
  } 
};

async function convertImgAndSave(
  args : {
    imgBuffer: Buffer,
    filename: string,
    resize?: {
      width?: number;
      height?: number;
    };
  },
): Promise<{
  filename : string,
  format: string,
  height: number,
  width: number,
}> {
  let filename = args.filename + '.png';
  try {
    const o = sharp(args.imgBuffer);
    const metadata = await o.metadata();

    if(metadata.format === 'svg'){
      filename = args.filename + '.svg';
      await fs.writeFile(join(Constants.imagePath, filename), args.imgBuffer);
      return {
        format: 'svg',
        filename,
        width : metadata.width!,
        height : metadata.height!,
      }
    }

    if (!metadata.width || !metadata.height) {
      throw new Error('Image Metadata Error');
    }

    //resize o if needed and if o.width > resize.width and o.height > resize.height, width and height will do separately
    if (args?.resize) {
      const { width, height } = args.resize;
      if (width && metadata.width > width) o.resize({ width });
      if (height && metadata.height > height) o.resize({ height });
    }

    const outputMetadata = await o.metadata();

    return {
      ...(await o.png().toFile(join(Constants.imagePath, filename))),
      filename,
      width : outputMetadata.width!,
      height : outputMetadata.height!,
    };
  } catch (err: any) {
    throw err;
  }
}