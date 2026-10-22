### `docs/arquitectura.md`
```markdown
# Arquitectura del Sistema: Modular por Funcionalidad

El sistema implementa una **Arquitectura Modular Orientada a Funcionalidades (Feature-Based Architecture)** tanto en el backend como en el frontend.

## Criterios de Diseño
1. **Aislamiento por Dominio**: Cada módulo de negocio (`auth`, `books`, `authors`, `genres`, `sagas`, `shelves`, `logs`) concentra su propia lógica, rutas, controladores, servicios, validaciones y entidades.
2. **Componentes Compartidos (`shared/`)**: Utilizado estrictamente para utilidades transversales como middleware de autenticación, manejo global de errores, logging HTTP, cliente Axios centralizado y componentes de layout generales.
3. **Integridad Referencial**: TypeORM administra las relaciones estrictas (`ManyToOne` / `OneToMany`) con restricciones corporativas (`RESTRICT` para evitar huérfanos y conflictos de integridad al eliminar autores, géneros o estantes con libros asociados; `SET NULL` para sagas opcionales).
4. **Seguridad JWT y Contraseñas**: Las credenciales del único administrador se almacenan de forma segura mediante `bcrypt` y se autentican mediante tokens firmados con JWT de corta/mediana expiración.