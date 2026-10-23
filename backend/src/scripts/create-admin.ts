import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { Admin } from "../modules/auth/admin.entity";
import bcrypt from "bcrypt";
import { env } from "../config/env";
import { logger } from "../shared/logging/logger";

const createAdmin = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Conexión a BD establecida para script de admin.");

    const adminRepository = AppDataSource.getRepository(Admin);

    // Verificar si ya existe el admin para no duplicarlo ni sobrescribirlo
    const existingAdmin = await adminRepository.findOne({
      where: { username: env.ADMIN_USER },
    });

    if (existingAdmin) {
      logger.info(
        `El administrador '${env.ADMIN_USER}' ya existe. No se sobrescribirá.`,
      );
      await AppDataSource.destroy();
      return;
    }

    const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

    const newAdmin = adminRepository.create({
      username: env.ADMIN_USER,
      password: hashedPassword,
    });

    await adminRepository.save(newAdmin);
    logger.info(`Administrador '${env.ADMIN_USER}' creado exitosamente.`);

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    logger.error("Error al crear el administrador:", error);
    process.exit(1);
  }
};

createAdmin();
