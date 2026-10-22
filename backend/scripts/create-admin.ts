import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../src/config/data-source';
import { Admin } from '../src/modules/auth/admin.entity';
import { ENV } from '../src/config/env';

async function createAdmin() {
  await AppDataSource.initialize();
  const adminRepo = AppDataSource.getRepository(Admin);

  const existingAdmin = await adminRepo.findOne({ where: { email: ENV.ADMIN_EMAIL } });
  if (existingAdmin) {
    console.log(`[Admin Seed] El administrador ${ENV.ADMIN_EMAIL} ya existe. No se sobrescribió.`);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(ENV.ADMIN_PASSWORD, salt);

  const admin = adminRepo.create({
    email: ENV.ADMIN_EMAIL,
    passwordHash,
  });

  await adminRepo.save(admin);
  console.log(`[Admin Seed] Administrador creado exitosamente con email: ${ENV.ADMIN_EMAIL}`);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('[Admin Seed Error]', err);
  process.exit(1);
});