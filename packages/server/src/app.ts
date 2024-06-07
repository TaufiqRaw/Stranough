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
import * as Constants from './constants';
import { Headstock } from './entities/headstock.entity';
import { Jack } from './entities/jack.entity';
import { Knob } from './entities/knob.entity';
import { Nut } from './entities/nut.entity';
import { Peg } from './entities/peg.entity';
import { Pickguard } from './entities/pickguard.entity';
import { Switch } from './entities/switch.entity';
import { GuitarBodyTexture } from './entities/guitar-body-texture.entity';
import mikroOrmConfig from "./database/mikro-orm.config";
import { guitarModelController, mediaController } from './controllers';
import { Pickup, Wood } from './entities';
import { commonEntityRoutes } from './controllers/common-entity.controller';
import * as IO from 'socket.io'
import { initSocket } from './controllers/socket';
import { Intents } from './entities/intents.entity';
import { Client, Pool } from 'pg';
import OpenAI from 'openai';
require('dotenv').config({
  path : Constants.envPath
});

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
  switchs : EntityRepository<Switch>,
  pickups : EntityRepository<Pickup>, 
  intents : EntityRepository<Intents>,
  woods : EntityRepository<Wood>,
};

// Dependency Injection container
// can only be accessed on runtime (after the app is started)
// e.g. inside a function that not immediately evaluated
export const DI = {} as {
  repository : Repository,
  orm: MikroORM,
  em: EntityManager,
  server: http.Server,
  logger : winston.Logger,
  io : IO.Server,
  openAi : OpenAI,
}

export const app = express();
const port = Constants.serverPort;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  credentials : true,
  origin : process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
}));
app.use(express.json());
app.use((_, res, next)=>{
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
})
app.use(express.static('public'))

export async function main(){
  await initDependency();

  app.use(express.json());
  app.use(middlewares.createRequestContext);
  
  initRoutes();

  // app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);

  DI.server = app.listen(port, () => {
    DI.logger.info(`Server is running on port ${port}`);
  });
  DI.io = new IO.Server(DI.server, {
    cors : {
      origin : process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    }
  });
  initSocket();
}


function initRoutes(){

  app.use('/guitar-models', guitarModelController);
  app.use('/medias', mediaController);
  commonEntityRoutes().forEach(([path, router])=>{
    app.use(`/${path}`, router);
  })
}

async function initDependency(){
  DI.orm = await MikroORM.init(mikroOrmConfig);
  DI.em = DI.orm.em;

  DI.openAi = new OpenAI();

  initLogger();

  DI.repository = initRepository(DI.em);
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

export function initRepository(em : EntityManager){
  return {
    guitarBodies : em.getRepository(GuitarBody),
    guitarModels : em.getRepository(GuitarModel),
    medias : em.getRepository(Media),
    bridges : em.getRepository(Bridge),
    headstocks : em.getRepository(Headstock),
    jacks : em.getRepository(Jack),
    knobs : em.getRepository(Knob),
    nuts : em.getRepository(Nut),
    pegs : em.getRepository(Peg),
    pickguards : em.getRepository(Pickguard),
    switchs : em.getRepository(Switch),
    guitarBodyTextures : em.getRepository(GuitarBodyTexture),
    pickups : em.getRepository(Pickup),
    intents : em.getRepository(Intents),
    woods : em.getRepository(Wood),
  }
}

main().catch(err=>{
  DI.logger.error(err);
  process.exit(1);
})