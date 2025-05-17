// src/seeder.ts
import { DataSource } from 'typeorm';
import { Inventory } from './app.entity';
import { seedInventory } from './seeder/inventory.seeder';
import * as dotenv from 'dotenv';
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Inventory],
  synchronize: true,
});

dataSource.initialize()
  .then(async () => {
    console.log('🚀 Data Source initialized!');
    await seedInventory(dataSource);
    await dataSource.destroy();
  })
  .catch((err) => {
    console.error('❌ Error initializing data source:', err);
  });
