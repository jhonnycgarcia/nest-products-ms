# Product Microservice

## Dev

1. Clonar el repositorio
2. Instalar dependencias
3. Crear un archivo `.env` basado en el `env.template`
4. Ejecutar migración de prisma `npx prisma migrate dev`
5. Ejecutar `npm run start:dev`

## Documentacion de Prisma
- https://docs.nestjs.com/recipes/prisma
- Comando para inicializar las migraciones luego de definir los modelos:
```npx prisma migrate dev --name init```
