# Guía para Ejecutar el Proyecto

Instrucciones simples para ejecutar el Sistema de Gestión de Usuarios 

##  Ejecución Local (Paso a Paso)

### Requisitos Previos
- **Docker Desktop** 
- **Node.js 18+** 
- **Git** 
###  Paso 1: Descargar el Proyecto
```bash
# Clonar o descargar el repositorio
git clone [URL_DEL_REPO]
cd Proyecto_Skye_Group
```

###  Paso 2: Configurar Backend (Laravel)
```bash
# Ir al directorio del backend
cd skye-backend

# Instalar dependencias PHP
composer install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servicios con Docker (MySQL, Redis, etc.)
docker compose up -d

# Esperar unos segundos y ejecutar migraciones
php artisan migrate --seed
```

### Paso 3: Configurar Frontend (React)
```bash
# Abrir NUEVA terminal (dejar la anterior abierta)
cd skye-frontend

# Instalar dependencias Node.js
npm install

# Iniciar servidor de desarrollo
npm run dev
```

###  Paso 4: Acceder a la Aplicación
- **URL**: http://localhost:5174
- **Usuario de prueba**: admin@test.com
- **Contraseña**: 123456

También se puede crear un usuario y probarlo sin problema, todos los usuarios tienen acceso!

** ¡Listo! **

---

##  Solución de Problemas Comunes

###  Error: "Docker no está ejecutándose"
**Solución**: Abrir Docker Desktop y esperar a que inicie completamente.

###  Error: "Puerto ocupado"
**Solución**: 
```bash
# Detener contenedores existentes
docker compose down

# Reiniciar
docker compose up -d
```

###  Error: "npm install falla"
**Solución**:
```bash
# Limpiar cache y reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

###  Error: "Base de datos vacía"
**Solución**:
```bash
# Ejecutar migraciones manualmente
cd skye-backend
php artisan migrate:fresh --seed
```

###  Error: "Composer no encontrado"
**Solución**: Instalar Composer desde [getcomposer.org](https://getcomposer.org/)

---

##  Verificación de Funcionamiento

###  Checklist Rápido
- [ ] Docker Desktop está ejecutándose
- [ ] Backend responde en: http://localhost/api/health
- [ ] Frontend carga en: http://localhost:5174
- [ ] Login funciona con admin@test.com / 123456
- [ ] Se puede ver la lista de usuarios

###  Pruebas Rápidas
```bash
# Probar API directamente
curl http://localhost/api/health

# Probar login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'
```



### Datos de Prueba
```bash
# Regenerar usuarios de prueba
cd skye-backend
php artisan migrate:fresh --seed
```

---

##  Para Evaluadores

### Acceso Rápido
1. Ejecutar los 4 pasos arriba
2. Abrir http://localhost:5174
3. Login: admin@test.com / 123456
4. Probar funcionalidades

### Funcionalidades a Probar
-  Login con validación
-  Registro de nuevos usuarios
-  Lista de usuarios con ordenamiento
-  Tema claro/oscuro
-  Responsive design
-  API REST funcional

### Tiempo Estimado de Setup
- **Primera vez**: 10-15 minutos
- **Si ya tienes Docker/Node**: 5 minutos



### Error: "Database connection"
```bash
# Verificar variables de entorno del backend
DB_HOST=localhost
DB_DATABASE=tu_base_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

### Error: "Storage permissions"
```bash
# En el servidor, dar permisos a Laravel
sudo chown -R www-data:www-data storage/
sudo chmod -R 775 storage/
```

---


## Scripts de Deploy Automático

### Script Simple para Servidor
```bash
#!/bin/bash
# deploy-simple.sh

echo "Iniciando deploy..."

# Frontend
cd skye-frontend
npm run build
echo "Frontend listo"

# Backend  
cd ../skye-backend
php artisan migrate --force
php artisan config:cache
echo "Backend optimizado"

# Restart services
sudo systemctl restart nginx php8.2-fpm
echo "Deploy completado!"
```

### GitHub Actions (Opcional)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        run: |
          ssh user@server 'cd /var/www/skye-system && git pull && ./deploy-simple.sh'
```




#### Backend (Laravel)
```php
// config/logging.php
'channels' => [
    'production' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack'],
        'ignore_exceptions' => false,
    ],
    
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'error'),
        'days' => 14,
    ],
    
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'emoji' => ':boom:',
        'level' => 'critical',
    ],
];
```