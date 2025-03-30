import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'alice' }
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping creation');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('password', 10);
  const admin = await prisma.user.create({
    data: {
      username: 'alice',
      password: hashedPassword,
      name: 'Alice (Admin)'
    }
  });

  console.log(`Created admin user: ${admin.username}`);
  
  // You could add sample transactions here if needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
