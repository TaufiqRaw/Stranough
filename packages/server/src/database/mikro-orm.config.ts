import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { GuitarBodyUpdateCleanup } from "../entities/subscribers/guitar-body-update-cleanup";
import { GuitarModelUpdateCleanup } from "../entities/subscribers/guitar-model-update-cleanup.subscriber";
import { Migrator } from "@mikro-orm/migrations";
require('dotenv').config();

const config : Options = {
    driver : PostgreSqlDriver,
    timezone: '+07:00',
    dbName : process.env.DB_NAME || 'backend',
    port : parseInt(process.env.DB_PORT || '5432'),
    user : process.env.DB_USER || 'postgres',
    password : process.env.DB_PASS || 'postgres',
    host : process.env.DB_HOST || 'localhost',
    entities: ['dist/entities'],
    entitiesTs: ['src/entities'],
    extensions : [Migrator],
    subscribers : [new GuitarBodyUpdateCleanup(), new GuitarModelUpdateCleanup()],
    metadataProvider: TsMorphMetadataProvider,
    migrations: {
      path: 'dist/database/migrations',
      pathTs: 'src/database/migrations',
    },
    seeder:{
      path: 'dist/database/seeders',
      pathTs: 'src/database/seeders'
    }
};

export default config;