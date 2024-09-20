import 'reflect-metadata';
import http from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/postgresql';
import morgan from 'morgan';
import * as middlewares from './middlewares';
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
import mikroOrmConfig from "./database/mikro-orm.config";
import {authController, mediaController } from './controllers';
import { ElectricGuitarModel, Order, Pickup, User, Wood } from './entities';
import { initCommonEntityRoutes } from './controllers/common-entity.controller';
import * as IO from 'socket.io'
import { AcousticGuitarModel } from './entities/_acoustic-guitar-model.entity';
import { initSocket } from './controllers/socket';
import { Inlay } from './entities/inlay.entity';
import {readFileSync} from 'fs';
import * as https from 'https'
import { Pool } from 'pg';
import {orderController} from './controllers';

require('dotenv').config({
  path : Constants.envPath
});

const options = process.env.NODE_ENV === 'production' ? {
  key: readFileSync('/etc/letsencrypt/live/ridhowaskita.my.id/privkey.pem', 'utf8'),
 cert: readFileSync('/etc/letsencrypt/live/ridhowaskita.my.id/fullchain.pem', 'utf8')
} : {};

type Repository  = {
  electricModels : EntityRepository<ElectricGuitarModel>,
  acousticModels : EntityRepository<AcousticGuitarModel>,
  inlays : EntityRepository<Inlay>,
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
  woods : EntityRepository<Wood>,
  orders : EntityRepository<Order>,
  users : EntityRepository<User>,
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
  pgPool : Pool,
}

export const app = express();
const port = Constants.serverPort;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  credentials : true,
  origin : '*',
}));
app.use(express.json());
app.use((_, res, next)=>{
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
})

// for development only, to make nginx proxy work when using ngrok
if(process.env.NODE_ENV === 'development'){
  app.use(function(req, res, next) {
    if (req.url.match('/api')){
      req.url = req.url.replace('/api', '');
    }
    next();
 });
}
app.use(express.static('public'))

export async function main(){
  await initDependency();

  app.use(express.json());
  app.use(middlewares.createRequestContext);
  
  initRoutes();

  // app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);

  DI.server = process.env.NODE_ENV === 'production' ? https.createServer(options, app).listen(port, () => {
    DI.logger.info(`Server is running on port ${port}`);
  }) : app.listen(port, () => {
    DI.logger.info(`Server is running on port ${port}`);
  });
  
  DI.io = new IO.Server(DI.server, {
    cors : {
      origin : '*',
    }
  });

  initSocket();
}


function initRoutes(){
  app.use('/medias', mediaController);
  app.use('/orders', orderController);
  app.use('/auth', authController);
  initCommonEntityRoutes().forEach(([path, router])=>{
    app.use(`/${path}`, router);
  })
}

async function initDependency(){
  DI.orm = await MikroORM.init(mikroOrmConfig);
  DI.em = DI.orm.em;
  DI.pgPool = new Pool({
    database : process.env.DB_NAME || 'backend',
    port : parseInt(process.env.DB_PORT || '5432'),
    user : process.env.DB_USER || 'postgres',
    password : process.env.DB_PASS || 'postgres',
    host : process.env.DB_HOST || 'localhost',
  });
  
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

export function initRepository(em : EntityManager) : Repository{
  return {
    electricModels : em.getRepository(ElectricGuitarModel),
    acousticModels : em.getRepository(AcousticGuitarModel),
    medias : em.getRepository(Media),
    bridges : em.getRepository(Bridge),
    headstocks : em.getRepository(Headstock),
    jacks : em.getRepository(Jack),
    knobs : em.getRepository(Knob),
    nuts : em.getRepository(Nut),
    pegs : em.getRepository(Peg),
    pickguards : em.getRepository(Pickguard),
    switchs : em.getRepository(Switch),
    pickups : em.getRepository(Pickup),
    inlays : em.getRepository(Inlay),
    woods : em.getRepository(Wood),
    orders : em.getRepository(Order),
    users : em.getRepository(User),
  }
}

main().catch(err=>{
  DI.logger.error(err);
  process.exit(1);
})