import 'reflect-metadata';
import http from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/postgresql';
import morgan from 'morgan';
import * as middlewares from './middlewares';
import { GuitarBody } from './entities/guitar-body.entity';
import { GuitarModel } from './entities/guitar-model.entity';
import { Media } from './entities/media.entity';
import { Bridge } from './entities/bridge.entity';
import winston from 'winston';
import multer from 'multer';
import { IMAGE_SIZE_LIMIT } from './constants';
import { Headstock } from './entities/headstock.entity';
import { Jack } from './entities/jack.entity';
import { Knob } from './entities/knob.entity';
import { Nut } from './entities/nut.entity';
import { Peg } from './entities/peg.entity';
import { Pickguard } from './entities/pickguard.entity';
import { Switch } from './entities/switch.entity';
import { GuitarBodyTexture } from './entities/guitar-body-texture.entity';
import mikroOrmConfig from "./database/mikro-orm.config";
require('express-async-errors');
require('dotenv').config();
const upload = multer({ storage: multer.memoryStorage(), limits : {fileSize : IMAGE_SIZE_LIMIT}});

type Repository  = {
  guitarBodies : EntityRepository<GuitarBody>,
  guitarBodyTextures : EntityRepository<GuitarBodyTexture>,
  guitarModels : EntityRepository<GuitarModel>,
  medias : EntityRepository<Media>, 
  bridges : EntityRepository<Bridge>,
  headstocks : EntityRepository<Headstock>,
  jacks : EntityRepository<Jack>,
  knobs : EntityRepository<Knob>,
  nuts : EntityRepository<Nut>,
  pegs : EntityRepository<Peg>,
  pickguards : EntityRepository<Pickguard>,
  switch : EntityRepository<Switch>,
};

export const DI = {} as {
  repository : Repository,
  orm: MikroORM,
  em: EntityManager,
  server: http.Server,
  logger : winston.Logger,
  upload : multer.Multer,
}

export const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

export namespace App {
  export async function main(){
    await initDependency();
  
    app.use(express.json());
    app.use(middlewares.createRequestContext);
    
    // app.use('/author', AuthorController);
    // app.use('/book', BookController);
  
    // app.use(middlewares.notFound);
    app.use(middlewares.errorHandler);
  
    DI.server = app.listen(port, () => {
      console.log(`MikroORM express TS example started at http://localhost:${port}`)});
  }
}

async function initDependency(){
  DI.orm = await MikroORM.init(mikroOrmConfig);

  DI.em = DI.orm.em;

  DI.upload = upload;

  initLogger();

  initRepository();

  DI.logger.info('APP Started');
}

function initLogger(){
  DI.logger = winston.createLogger({
    level: 'info',
    format : winston.format.json(),
    transports : [
      new winston.transports.File({filename : 'error.log', level : 'error'}),
      new winston.transports.File({filename : 'combined.log'})
    ]
  });
  if(process.env.NODE_ENV !== 'production'){
    DI.logger.add(new winston.transports.Console({
      format : winston.format.simple()
    }));
  }
}

function initRepository(){
  DI.repository = {
    guitarBodies : DI.orm.em.getRepository(GuitarBody),
    guitarModels : DI.orm.em.getRepository(GuitarModel),
    medias : DI.orm.em.getRepository(Media),
    bridges : DI.orm.em.getRepository(Bridge),
    headstocks : DI.orm.em.getRepository(Headstock),
    jacks : DI.orm.em.getRepository(Jack),
    knobs : DI.orm.em.getRepository(Knob),
    nuts : DI.orm.em.getRepository(Nut),
    pegs : DI.orm.em.getRepository(Peg),
    pickguards : DI.orm.em.getRepository(Pickguard),
    switch : DI.orm.em.getRepository(Switch),
    guitarBodyTextures : DI.orm.em.getRepository(GuitarBodyTexture),
  }
}
