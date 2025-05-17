// src/seeder/inventory.seeder.ts
import { DataSource } from 'typeorm';
import { Inventory } from '../app.entity';

export async function seedInventory(dataSource: DataSource) {
  const inventoryRepo = dataSource.getRepository(Inventory);

  const count = await inventoryRepo.count();
  if (count > 0) {
    console.log('📦 Inventory already seeded.');
    return;
  }

  const initialData = [
    { name: 'Item A', quantity: 50 },
    { name: 'Item B', quantity: 30 },
    { name: 'Item C', quantity: 100 },
  ];

  await inventoryRepo.save(initialData);
  console.log('✅ Inventory seeded successfully!');
}
