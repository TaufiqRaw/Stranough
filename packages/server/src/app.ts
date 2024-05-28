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
import { BridgeDto } from './dtos/bridge.dto';
import { JackDto } from './dtos/jack.dto';
import { Pickup } from './entities';
import { KnobDto } from './dtos/knob.dto';
import { NutDto } from './dtos/nuts.dto';
import { PickupDto } from './dtos/pickup.dto';
import { SwitchDto } from './dtos/switch.dto';
import { entityWithMediaRouterFactory } from './utils/entity-with-media-router.factory';
import { HeadstockDto } from './dtos/headstock.dto';
import { Class } from 'utility-types';
import * as R from 'remeda';
import { commonEntityRoutes } from './controllers/common-entity.controller';
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

export namespace App {
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
  }
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

  initLogger();

  initRepository();
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
    switchs : DI.orm.em.getRepository(Switch),
    guitarBodyTextures : DI.orm.em.getRepository(GuitarBodyTexture),
    pickups : DI.orm.em.getRepository(Pickup),
  }
}

App.main();