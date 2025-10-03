# Guía de Instalación

Instrucciones detalladas para configurar y ejecutar el Sistema de Gestión de Usuarios.

## Requisitos del Sistema

### Software Requerido
- **Docker Desktop**: Para contenedores del backend
- **Node.js 18+**: Para el frontend de React
- **Composer**: Para dependencias de PHP
- **Git**: Para clonar el repositorio

### Puertos Requeridos
- **80**: Backend Laravel
- **3306**: Base de datos MySQL
- **5174**: Frontend React (se ajusta automáticamente)

## Instalación Paso a Paso

### 1. Preparación del Entorno

#### Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd Proyecto_Skye_Group
```

#### Verificar Requisitos
```bash
# Verificar Docker
docker --version

# Verificar Node.js
node --version

# Verificar Composer
composer --version
```

### 2. Configuración del Backend (Laravel)

#### Navegar al Directorio del Backend
```bash
cd skye-backend
```

#### Instalar Dependencias de PHP
```bash
composer install
```

#### Configurar Variables de Entorno
```bash
# Copiar archivo de configuración
cp .env.example .env

# El archivo .env ya está configurado para desarrollo local
# No requiere modificaciones adicionales
```

#### Iniciar Servicios con Docker Sail
```bash
# Iniciar contenedores en segundo plano
docker compose up -d

# Verificar que los contenedores estén ejecutándose
docker compose ps
```

#### Configurar Base de Datos
```bash
# Ejecutar migraciones y seeders
docker exec -it skye-backend-laravel.test-1 php artisan migrate --seed

# Verificar que la base de datos esté poblada
docker exec -it skye-backend-laravel.test-1 php artisan tinker
# En tinker: User::count() (debería devolver > 0)
# Salir: exit
```

### 3. Configuración del Frontend (React)

#### Abrir Nueva Terminal y Navegar al Frontend
```bash
cd skye-frontend
```

#### Instalar Dependencias de Node.js
```bash
npm install
```

#### Iniciar Servidor de Desarrollo
```bash
npm run dev
```

## Ejecución del Proyecto

### Iniciar Todos los Servicios

#### Terminal 1 - Backend
```bash
cd skye-backend
docker compose up -d
```

#### Terminal 2 - Frontend
```bash
cd skye-frontend
npm run dev
```

### Verificación de Funcionamiento

#### Verificar Backend
```bash
# Probar endpoint de salud
curl http://localhost/api/users

# Debería devolver error 401 (no autenticado) - esto es correcto
```

#### Verificar Frontend
- Abrir navegador en: http://localhost:5174
- Debería mostrar la pantalla de login

#### Probar Login
- Email: `admin@test.com`
- Contraseña: `123456`
- Debería redirigir a la tabla de usuarios

## Verificación Completa del Sistema

### Probar API con cURL

#### 1. Login
```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'
```

#### 2. Usar Token para Listar Usuarios
```bash
# Reemplazar {TOKEN} con el token obtenido del login
curl -X GET http://localhost/api/users \
  -H "Authorization: Bearer {TOKEN}"
```

#### 3. Registro de Usuario
```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Usuario Prueba","email":"prueba@test.com","password":"123456","password_confirmation":"123456"}'
```

## Solución de Problemas

### Backend No Inicia

#### Docker No Ejecuta Contenedores
```bash
# Verificar estado de Docker
docker info

# Reiniciar servicios
docker compose down
docker compose up -d

# Ver logs de errores
docker compose logs
```

#### Error de Permisos en Linux/Mac
```bash
# Dar permisos a directorios de Laravel
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:$USER storage bootstrap/cache
```

#### Base de Datos No Se Conecta
```bash
# Verificar contenedores MySQL
docker compose ps

# Recrear base de datos
docker compose down
docker volume rm skye-backend_sail-mysql
docker compose up -d
docker exec -it skye-backend-laravel.test-1 php artisan migrate --seed
```

### Frontend No Carga

#### Dependencias No Instaladas
```bash
# Limpiar cache y reinstalar
cd skye-frontend
rm -rf node_modules package-lock.json
npm install
```

#### Puerto Ocupado
```bash
# Matar proceso en puerto 5174
npx kill-port 5174

# O usar puerto diferente
npm run dev -- --port 3000
```

#### Error de CORS
```bash
# Verificar que backend esté ejecutándose en puerto 80
curl http://localhost

# El backend debe responder (aunque sea error 404)
```

### Problemas de Autenticación

#### Token Inválido o Expirado
- Realizar logout y login nuevamente
- Limpiar localStorage del navegador
- Verificar fecha/hora del sistema

#### Usuario Admin No Existe
```bash
# Recrear seeder
docker exec -it skye-backend-laravel.test-1 php artisan migrate:fresh --seed
```

## Comandos Útiles

### Backend (Laravel)
```bash
# Ver logs en tiempo real
docker compose logs -f laravel.test

# Acceder al contenedor
docker exec -it skye-backend-laravel.test-1 bash

# Limpiar cache
docker exec -it skye-backend-laravel.test-1 php artisan cache:clear
docker exec -it skye-backend-laravel.test-1 php artisan config:clear
```

### Frontend (React)
```bash
# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

### Base de Datos
```bash
# Acceder a MySQL
docker exec -it skye-backend-mysql-1 mysql -u sail -ppassword laravel

# Backup de base de datos
docker exec skye-backend-mysql-1 mysqldump -u sail -ppassword laravel > backup.sql

# Restaurar backup
docker exec -i skye-backend-mysql-1 mysql -u sail -ppassword laravel < backup.sql
```

## Configuración para Producción

### Variables de Entorno
```bash
# Backend (.env)
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

# Base de datos de producción
DB_HOST=tu-servidor-mysql
DB_DATABASE=nombre-bd-produccion
DB_USERNAME=usuario-produccion
DB_PASSWORD=contraseña-segura
```

### Build de Producción
```bash
# Frontend
cd skye-frontend
npm run build

# Backend
cd skye-backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Próximos Pasos

Una vez instalado correctamente:
1. Revisar la [Arquitectura del Sistema](ARCHITECTURE.md)
2. Consultar la [Documentación de API](API.md)
3. Explorar el código fuente en ambos proyectos