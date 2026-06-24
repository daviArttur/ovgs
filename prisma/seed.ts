import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const road = await prisma.transportType.upsert({
    where: { name: 'Road' },
    create: { name: 'Road', description: 'Standard road delivery' },
    update: {},
  });

  const air = await prisma.transportType.upsert({
    where: { name: 'Air' },
    create: { name: 'Air', description: 'Express air delivery' },
    update: {},
  });

  const customer = await prisma.customer.upsert({
    where: { document: '12345678000195' },
    create: {
      name: 'Acme Corporation',
      document: '12345678000195',
      authorizedTransports: {
        create: [{ transportTypeId: road.id }],
      },
    },
    update: {},
  });

  await prisma.item.upsert({
    where: { sku: 'WIDGET-001' },
    create: { sku: 'WIDGET-001', name: 'Blue Widget', description: 'A blue widget' },
    update: {},
  });

  await prisma.item.upsert({
    where: { sku: 'GADGET-002' },
    create: { sku: 'GADGET-002', name: 'Red Gadget', description: 'A red gadget' },
    update: {},
  });

  console.log('Seed complete', { road: road.id, air: air.id, customer: customer.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => pool.end());
