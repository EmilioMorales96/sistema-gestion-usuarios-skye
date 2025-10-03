##  Inicio Rápido

###  Requisitos
- Docker Desktop
- Node.js 18+
- Composer

###  Instalación
```bash
# 1. Clonar repositorio
git clone [URL]
cd Proyecto_Skye_Group

# 2. Backend (Laravel)
cd skye-backend
composer install
cp .env.example .env
docker compose up -d
php artisan migrate --seed

# 3. Frontend (React)
cd ../skye-frontend
npm install
npm run dev
```

###  Acceso
- **URL**: http://localhost:5174
- **Usuario**: admin@test.com
- **Contraseña**: 123456

##  Funcionalidades

**Autenticación completa** - Login, registro, logout 
**Gestión de usuarios** - Listado con ordenamiento  
**API REST** - Endpoints seguros con JWT  
**Interfaz moderna** - React con Atomic Design  
**Base de datos** - MySQL con migraciones  
**Tema claro/oscuro** - Persistencia en localStorage  

## Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Backend | Laravel 11 + MySQL |
| Frontend | React 18 + Tailwind CSS |
| Autenticación | Laravel Sanctum (JWT) |
| Contenedores | Docker Sail |
| Build Tool | Vite |

## 📚 Documentación Completa

Para información detallada, consulta la documentación técnica:

-  **[Instalación](docs/INSTALLATION.md)** - Guía paso a paso completa
-  **[Arquitectura](docs/ARCHITECTURE.md)** - Decisiones técnicas y diseño
-  **[API](docs/API.md)** - Endpoints, ejemplos y testing
-  **[Estilos](docs/STYLING.md)** - Sistema de diseño Atomic Design
-  **[Testing](docs/TESTING.md)** - Estrategias y herramientas de testing
-  **[Deployment](docs/DEPLOYMENT.md)** - Guía de despliegue en producción

##  Estructura del Proyecto

```
Proyecto_Skye_Group/
├── skye-backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/        # Controladores de API
│   │   │   ├── AuthController.php   # Login, registro, logout
│   │   │   └── UserController.php   # Gestión de usuarios
│   │   └── Models/
│   │       └── User.php             # Modelo de usuario
│   ├── database/
│   │   ├── migrations/              # Estructura de BD
│   │   └── seeders/                 # Datos de prueba
│   ├── routes/
│   │   └── api.php                  # Rutas de API
│   ├── config/
│   │   ├── cors.php                 # Configuración CORS
│   │   └── sanctum.php              # Configuración JWT
│   ├── docker-compose.yml           # Servicios Docker
│   └── .env.example                 # Variables de entorno
│
├── skye-frontend/                   #  SPA React
│   ├── src/
│   │   ├── components/              # Arquitectura Atomic Design
│   │   │   ├── atoms/               # Elementos básicos
│   │   │   │   ├── Button.jsx       # Botón reutilizable
│   │   │   │   ├── Input.jsx        # Campo de entrada
│   │   │   │   ├── Card.jsx         # Tarjeta base
│   │   │   │   ├── Avatar.jsx       # Avatar de usuario
│   │   │   │   ├── Badge.jsx        # Etiqueta de estado
│   │   │   │   ├── Icon.jsx         # Iconos del sistema
│   │   │   │   └── Logo.jsx         # Logo del sistema
│   │   │   ├── molecules/           # Combinaciones simples
│   │   │   │   └── FormField.jsx    # Campo de formulario completo
│   │   │   ├── organisms/           # Componentes complejos
│   │   │   │   ├── Header.jsx       # Cabecera con navegación
│   │   │   │   ├── UserCard.jsx     # Tarjeta de usuario
│   │   │   │   └── UserList.jsx     # Lista de usuarios
│   │   │   └── templates/           # Layouts de página
│   │   │       └── UserLayout.jsx   # Layout principal
│   │   ├── pages/                   # Páginas de la aplicación
│   │   │   ├── LoginPage.jsx        # Página de login
│   │   │   ├── RegisterPage.jsx     # Página de registro
│   │   │   ├── UsersPage.jsx        # Página de usuarios
│   │   │   └── UserCreatedPage.jsx  # Confirmación registro
│   │   ├── contexts/                # Context providers
│   │   │   ├── ThemeContext.jsx     # Tema claro/oscuro
│   │   │   └── AuthContext.jsx      # Estado de autenticación
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useAuth.js           # Hook de autenticación
│   │   │   └── useTheme.js          # Hook de temas
│   │   ├── services/                # Servicios de API
│   │   │   └── api.js               # Cliente HTTP configurado
│   │   ├── styles/                  # Estilos globales
│   │   │   └── index.css            # CSS principal con Tailwind
│   │   ├── utils/                   # Utilidades
│   │   │   └── constants.js         # Constantes del sistema
│   │   ├── App.jsx                  # Componente raíz
│   │   └── main.jsx                 # Entrada de la aplicación
│   ├── public/                      # Archivos estáticos
│   ├── package.json                 # Dependencias Node.js
│   ├── vite.config.js               # Configuración Vite
│   └── tailwind.config.js           # Configuración Tailwind
│
├── docs/                            # 📚 Documentación técnica
│   ├── INSTALLATION.md              # Guía de instalación detallada
│   ├── ARCHITECTURE.md              # Decisiones arquitectónicas
│   ├── API.md                       # Documentación de endpoints
│   ├── STYLING.md                   # Sistema de diseño
│   ├── TESTING.md                   # Estrategias de testing
│   └── DEPLOYMENT.md                # Guía de despliegue
│
└── README.md                        # 📖 Este archivo
```


 
*Desarrollado por: CatWare Systems (Sergio Emilio Morales Hernández) | Octubre 2025