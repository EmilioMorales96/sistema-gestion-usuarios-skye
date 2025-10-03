# Arquitectura del Sistema

Documentación técnica de las decisiones de diseño y arquitectura del Sistema de Gestión de Usuarios.

## Visión General de la Arquitectura

### Arquitectura General
```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   React SPA     │ ────────────────→ │   Laravel API   │
│  (Frontend)     │                   │   (Backend)     │
│                 │ ←──────────────── │                 │
└─────────────────┘    JSON/JWT      └─────────────────┘
         │                                      │
         │                                      │
         ▼                                      ▼
┌─────────────────┐                   ┌─────────────────┐
│  localStorage   │                   │   MySQL DB      │
│  (Token/Theme)  │                   │  (Usuarios)     │
└─────────────────┘                   └─────────────────┘
```

### Stack Tecnológico

| Capa | Tecnología | Versión | Justificación |
|------|------------|---------|---------------|
| Frontend | React | 18.x | Ecosistema maduro, componentes reutilizables |
| Build Tool | Vite | 7.x | Build rápido, HMR optimizado |
| Styling | Tailwind CSS | 3.x | Consistencia de diseño |
| Backend | Laravel | 11.x | Framework maduro, ORM robusto |
| Base de Datos | MySQL | 8.0 | Confiabilidad, rendimiento |
| Autenticación | Laravel Sanctum | - | Integración nativa, tokens JWT |
| Contenedores | Docker Sail | - | Entorno consistente, fácil setup |

## Arquitectura del Frontend

### Atomic Design Methodology

Implementación completa de Atomic Design para escalabilidad y mantenibilidad:

```
src/components/
├── atoms/              # Elementos básicos no divisibles
│   ├── Button.jsx      # Botones reutilizables
│   ├── Input.jsx       # Campos de entrada
│   ├── Label.jsx       # Etiquetas de formulario
│   ├── ErrorMessage.jsx # Mensajes de error
│   ├── Spinner.jsx     # Indicadores de carga
│   ├── IconBox.jsx     # Contenedores de iconos
│   └── Text.jsx        # Elementos de texto
├── molecules/          # Combinaciones de atoms
│   └── FormField.jsx   # Campo de formulario completo
├── organisms/          # Componentes complejos
│   ├── LoginForm.jsx   # Formulario de login
│   ├── RegisterForm.jsx # Formulario de registro
│   └── UserTable.jsx   # Tabla de usuarios
└── templates/          # Layouts de página
    ├── MainLayout.jsx  # Layout principal
    └── AuthLayout.jsx  # Layout de autenticación
```


#### Justificación de Atomic Design

**Ventajas Técnicas:**
- **Reutilización**: Componentes testeable individualmente
- **Escalabilidad**: Fácil agregar nuevas páginas/features
- **Mantenibilidad**: Cambios localizados en un solo lugar
- **Desarrollo Paralelo**: Equipos pueden trabajar en diferentes niveles


### Gestión de Estado

#### Context API para Temas
```javascript
// ThemeContext.jsx
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};
```

**Justificación:**
- **Simplicidad**: No requiere librerías externas como Redux
- **Performance**: Re-renderizado eficiente solo en componentes suscritos
- **Escalabilidad**: Fácil agregar más contextos (User, Settings, etc.)

#### localStorage para Persistencia
- **Tokens JWT**: Persistencia entre sesiones
- **Preferencias de tema**: Recuerda modo claro/oscuro
- **Configuración de usuario**: Expandible para futuras preferencias

### Routing y Navegación

```javascript
// App.jsx - React Router v6
<Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/user-created" element={<UserCreatedPage />} />
  <Route path="/users" element={<UsersPage />} />
</Routes>
```

**Decisiones de Routing:**
- **Redirect Root**: `/` → `/login` para flujo claro
- **Protected Routes**: Validación de token en `UsersPage`
- **Confirmation Page**: UX mejorada post-registro

## Arquitectura del Backend

### Estructura MVC

```
app/
├── Http/Controllers/
│   ├── AuthController.php    # Autenticación
│   └── UserController.php    # Gestión de usuarios
├── Models/
│   └── User.php             # Modelo de usuario (Eloquent)
└── Middleware/
    └── auth:sanctum         # Middleware de autenticación
```

### API Design Patterns

#### RESTful API Design
```
POST /api/auth/login      # Autenticación
POST /api/auth/register   # Registro
POST /api/auth/logout     # Logout
GET  /api/users          # Listado (autenticado)
```

#### Estructura de Respuesta Consistente
```json
{
  "success": boolean,
  "message": "string",
  "data": object|array,
  "meta": {
    "total": number,
    "sort_by": "string",
    "sort_direction": "asc|desc"
  }
}
```

**Justificación:**
- **Consistencia**: Mismo formato en todas las respuestas
- **Facilita Frontend**: Manejo predictible de respuestas
- **Debugging**: Estructura clara para identificar errores

### Autenticación y Seguridad

#### Laravel Sanctum
```php
// AuthController.php
$token = $user->createToken('auth-token')->plainTextToken;
```

**Ventajas de Sanctum:**
- **Integración Nativa**: Con Laravel y Eloquent
- **SPA Ready**: Diseñado para Single Page Applications
- **Token Expiration**: Manejo automático de expiración
- **Revocación**: Logout invalida tokens

#### Validación de Datos
```php
// Validación en Controller
$validated = $request->validate([
    'name' => 'required|string|max:255|min:2',
    'email' => 'required|string|email|max:255|unique:users,email',
    'password' => 'required|string|min:6|confirmed',
]);
```

**Capas de Validación:**
1. **Frontend**: Validación inmediata (UX)
2. **Backend**: Validación definitiva (Seguridad)
3. **Base de Datos**: Constraints (Integridad)

## Base de Datos

### Diseño del Esquema

#### Tabla users
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### Migraciones de Laravel
```php
// 2014_10_12_000000_create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->timestamps();
});
```

**Ventajas de Migraciones:**
- **Control de Versiones**: Esquema versionado con código
- **Rollback**: Capacidad de revertir cambios
- **Environments**: Mismo esquema en dev/staging/prod
- **Colaboración**: Cambios de DB sincronizados en equipo

### Seeders para Datos de Prueba
```php
// UserSeeder.php
User::factory()->create([
    'name' => 'Administrador',
    'email' => 'admin@test.com',
    'password' => Hash::make('123456'),
]);
```

## Decisiones Técnicas Específicas

### 1. Separación Frontend/Backend

**Decisión:** Proyectos separados (`skye-frontend/`, `skye-backend/`)

**Justificación:**
- **Escalabilidad**: Equipos independientes
- **Deployment**: Deployments independientes
- **Tecnologías**: Stack específico para cada capa
- **Performance**: CDN para frontend, scaling para backend

### 2. Docker para Desarrollo

**Decisión:** Laravel Sail con Docker Compose

**Justificación:**
- **Consistencia**: Mismo entorno en todos los desarrolladores
- **Aislamiento**: No conflictos con software local
- **Setup Rápido**: Un comando para tener todo funcionando
- **Producción Similar**: Contenedores también en producción

### 3. Página de Confirmación Post-Registro

**Decisión:** Página intermedia antes de login

**Justificación Técnica:**
- **Separación de Responsabilidades**: Registro ≠ Autenticación
- **Seguridad**: No login automático (mejores prácticas)
- **UX**: Feedback claro del estado del registro

**Justificación de Negocio:**
- **Reducir Soporte**: Usuario entiende que debe hacer login
- **Profesionalismo**: Experiencia pulida vs. login directo
- **Oportunidad**: Espacio para información adicional

### 4. Sistema de Temas

**Decisión:** Context API + CSS Variables + localStorage

**Justificación Técnica:**
- **Performance**: CSS variables son más eficientes que re-render completo
- **Mantenibilidad**: Centralizado en un contexto
- **Extensibilidad**: Fácil agregar más temas

**Justificación extra:**
- **Accesibilidad**: Cumple WCAG 2.1 AA
- **Preferencias de Usuario**: Retención mejorada
- **Diferenciación**: Feature moderna estándar

### 5. Validación Dual (Frontend + Backend)

**Decisión:** Validación en ambas capas

**Justificación:**
- **UX**: Feedback inmediato (frontend)
- **Seguridad**: Validación definitiva (backend)
- **Robustez**: Doble verificación contra errores

### 6. CORS Específico

**Decisión:** CORS configurado para puertos específicos

```php
// cors.php
'allowed_origins' => [
    'http://localhost:5173',
    'http://localhost:5174',
],
```

**Justificación:**
- **Seguridad**: Solo orígenes específicos
- **Desarrollo**: Ports flexibles de Vite
- **Producción**: Fácil cambiar a dominio real

## Patrones de Diseño Implementados

### Frontend Patterns

1. **Component Composition Pattern**
   ```jsx
   <FormField>
     <Label>Email</Label>
     <Input type="email" />
     <ErrorMessage>Error message</ErrorMessage>
   </FormField>
   ```

2. **Custom Hooks Pattern**
   ```jsx
   const { colors, isDark, toggleTheme } = useTheme();
   ```

3. **Service Layer Pattern**
   ```jsx
   // api.js
   export const authAPI = {
     login: (email, password) => api.post('/auth/login', { email, password }),
     register: (userData) => api.post('/auth/register', userData),
   };
   ```

### Backend Patterns

1. **Repository Pattern** (implícito con Eloquent)
   ```php
   User::where('email', $email)->first();
   ```

2. **Service Container** (Laravel's IoC)
   ```php
   // Dependency injection automático
   public function __construct(UserService $userService) {}
   ```

3. **Middleware Pattern**
   ```php
   Route::middleware('auth:sanctum')->group(function () {
       Route::get('/users', [UserController::class, 'index']);
   });
   ```

## Consideraciones de Escalabilidad

### Horizontal Scaling
- **Frontend**: CDN + múltiples instancias
- **Backend**: Load balancer + múltiples containers
- **Base de Datos**: Read replicas + sharding potencial

### Performance Optimizations
- **Frontend**: Code splitting, lazy loading
- **Backend**: Query optimization, caching
- **Database**: Índices en campos de búsqueda

### Monitoring y Logging
- **Frontend**: Error boundaries, analytics
- **Backend**: Laravel logs, APM tools
- **Infrastructure**: Container monitoring

## Testing Strategy

### Frontend Testing
```javascript
// Estructura recomendada
src/
├── components/
│   └── atoms/
│       ├── Button.jsx
│       └── Button.test.jsx    # Unit tests
├── pages/
│   ├── LoginPage.jsx
│   └── LoginPage.test.jsx     # Integration tests
└── __tests__/
    └── e2e/                   # End-to-end tests
```

### Backend Testing
```php
// tests/Feature/AuthTest.php
public function test_user_can_login_with_valid_credentials()
{
    $user = User::factory()->create();
    
    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password'
    ]);
    
    $response->assertStatus(200)
            ->assertJsonStructure(['success', 'token', 'user']);
}
```