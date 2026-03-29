import { DataSource } from 'typeorm';
import { dbConfiguration } from '../connection/db_configuration';
import { UserSeeder } from './user_seeder';

async function run() {
  const dataSource = new DataSource(dbConfiguration());
  await dataSource.initialize();

  console.log('🚀 Running seeders...');
  await UserSeeder.run(dataSource);
  await dataSource.destroy();
  console.log('🎉 All seeders completed!');
}

run().catch((err) => {
  console.error('❌ Error running seeders', err);
  process.exit(1);
});
