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

export namespace MediaService {
  /**
   * Format and store image to drive, also save its metadata to database.
   * 
   * @param name 
   * @param file 
   * @param resizeOption
   * @returns 
   */
  export async function storeImage(
    name : string,
    file: Express.Multer.File,
    resizeOption ? : {
      maxWidth ? : number;
      maxHeight ? : number;
    },
  ) {
    const filename = v4();
    const outputMetadata = await convertImgAndSave({
      imgBuffer: file.buffer,
      filename,
      resize: {
        width: resizeOption?.maxWidth,
        height: resizeOption?.maxHeight,
      },
    });

    const newMedia = new Media({
      name: `${name}-${filename}`, 
      filename : outputMetadata.filename,
      mimeType: contentType(outputMetadata.format) as string,
    });

    await RequestContext.getEntityManager()!.persistAndFlush(newMedia);

    return newMedia;
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
): Promise<ImageConversionOutput> {
  const filename = args.filename + '.png';
  try {
    const o = sharp(args.imgBuffer);
    const metadata = await o.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Image Metadata Error');
    }

    //resize o if needed and if o.width > resize.width and o.height > resize.height, width and height will do separately
    if (args?.resize) {
      const { width, height } = args.resize;
      if (width && metadata.width > width) o.resize({ width });
      if (height && metadata.height > height) o.resize({ height });
    }

    return {
      ...(await o.png().toFile(join(Constants.imagePath, filename))),
      filename,
    };
  } catch (err: any) {
    throw err;
  }
}