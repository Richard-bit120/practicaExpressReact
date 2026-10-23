backend

npm install
npm run migration:run
npm run create-admin

# 1. Crear la carpeta principal y entrar

mkdir sistema-biblioteca && cd sistema-biblioteca
mkdir backend frontend docs

# 2. Inicializar el backend

cd backend
npm init -y

# 3. Instalar dependencias de producción (Express, TypeORM, MySQL, JWT, Bcrypt, Winston para logs)

npm install express cors dotenv mysql2 reflect-metadata typeorm bcrypt jsonwebtoken morgan winston winston-daily-rotate-file yup

# 4. Instalar dependencias de desarrollo (TypeScript, tipos, nodemon/ts-node-dev)

npm install -D typescript @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken @types/morgan ts-node-dev

# 5. Inicializar TypeScript

npx tsc --init

# 6. Crear la estructura de carpetas modular (Feature-based)

mkdir -p src/{config,modules/{auth,books,authors,genres,sagas,shelves,logs},shared/{middlewares,logging,errors,constants,utils},database/{migrations,seeds},scripts,tests/{integration,unit}}
frontend

# Desde la raíz del proyecto

cd .. # Salir de backend/ si estás ahí

# Crear proyecto React con Vite (JavaScript, sin TypeScript)

npm create vite@latest frontend -- --template react

# Entrar e instalar dependencias

cd frontend
npm install

# Instalar dependencias del proyecto

npm install react-router-dom axios yup

# Crear estructura modular de carpetas

mkdir -p src/{app,modules/{auth/{pages,components,hooks,services,validations},books/{pages,components,hooks,services,validations},authors/{pages,components,hooks,services,validations},genres/{pages,components,hooks,services,validations},sagas/{pages,components,hooks,services,validations},shelves/{pages,components,hooks,services,validations},logs/{pages,components,hooks,services},dashboard/{pages,components,hooks}},shared/{components/{layout,forms,tables,feedback,modals},hooks,services,context,constants,utils}}
