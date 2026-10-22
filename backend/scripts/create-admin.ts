import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { AppDataSource } from "../src/config/database";
import { User } from "../src/modules/auth/auth.entity";

// Cargar variables del entorno local (.env)
dotenv.config();

async function createAdmin() {
  try {
    // Inicializar conexión a DB (importante que se cree el archivo SQLite si no existe)
    await AppDataSource.initialize();
    console.log("Conexión a la base de datos establecida.");

    const userRepository = AppDataSource.getRepository(User);

    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminUser || !adminPass) {
      console.error(
        "ERROR: Faltan las variables de entorno ADMIN_USER o ADMIN_PASS.",
      );
      process.exit(1);
    }

    // Comprobar existencia
    const existingAdmin = await userRepository.findOne({
      where: { username: adminUser },
    });

    if (existingAdmin) {
      console.log(
        `El administrador "${adminUser}" ya existe. Omitiendo creación...`,
      );
    } else {
      // Encriptar contraseña
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(adminPass, saltRounds);

      // Crear e insertar
      const newAdmin = userRepository.create({
        username: adminUser,
        passwordHash,
      });

      await userRepository.save(newAdmin);
      console.log(`Administrador "${adminUser}" creado exitosamente.`);
    }
  } catch (error) {
    console.error("Error durante la ejecución del script:", error);
  } finally {
    // Cerrar la conexión
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

createAdmin();
