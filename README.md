# 📚 Sistema de Gestión de Biblioteca

Sistema web full stack para administrar una biblioteca: libros, autores, géneros, sagas y estantes físicos. Permite registrar, consultar, editar y eliminar registros, filtrar el catálogo por múltiples criterios y visualizar logs del sistema.

---

## 🏗️ Arquitectura

- **Arquitectura modular por funcionalidad de negocio** (feature-based architecture).
- Cada módulo agrupa entidades, servicios, controladores, rutas, validaciones y componentes UI propios.
- Separación clara de responsabilidades: controladores gestionan HTTP, servicios implementan lógica de negocio, entidades representan el modelo persistente.

### Stack Tecnológico

| Capa          | Tecnologías                                                         |
| ------------- | ------------------------------------------------------------------- |
| Backend       | Node.js, Express, TypeScript, TypeORM, mysql2, bcrypt, JWT, Winston |
| Frontend      | React (JavaScript), React Router, Axios, Yup                        |
| Base de datos | MySQL 8.x                                                           |
| Autenticación | JWT (JSON Web Token)                                                |

---

## 🚀 Inicio rápido

```bash
# 1. Clonar o descomprimir el proyecto
cd sistema-biblioteca

# 2. Configurar backend
cd backend
cp .env.example .env
# Editar .env con credenciales de MySQL

# 3. Instalar dependencias del backend
npm install

# 4. Crear base de datos y ejecutar migraciones
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS biblioteca_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
npm run migration:run

# 5. Crear administrador inicial
npm run create-admin

# 6. Iniciar backend
npm run dev

# 7. Configurar frontend (en otra terminal)
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

sistema-biblioteca/
├── backend/              # API REST (Node.js + Express + TypeScript)
├── frontend/             # SPA (React + JavaScript)
├── docs/                 # Documentación
├── README.md             # Este archivo
└── .gitignore