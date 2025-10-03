# Documentación de API

Documentación completa de la API REST del Sistema de Gestión de Usuarios.

## Información General

- **Base URL**: `http://localhost/api`
- **Autenticación**: Bearer Token (JWT)
- **Content-Type**: `application/json`
- **Accept**: `application/json`

## Estructura de Respuestas

Todas las respuestas de la API siguen la misma estructura:

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "string descriptivo",
  "data": {}, // o []
  "meta": {   // opcional, para listados
    "total": 15,
    "sort_by": "name",
    "sort_direction": "asc"
  }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": {  // opcional, para errores de validación
    "field_name": ["Error específico del campo"]
  }
}
```

## Autenticación

### POST /api/auth/login

Autentica un usuario con email y contraseña.

#### Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "123456"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@test.com"
  },
  "token": "1|abcd1234567890..."
}
```

#### Response Error (401)
```json
{
  "success": false,
  "message": "Credenciales incorrectas"
}
```

#### Validaciones
- `email`: requerido, formato email válido
- `password`: requerido, mínimo 6 caracteres

#### Ejemplo con cURL
```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "123456"
  }'
```

---

### POST /api/auth/register

Registra un nuevo usuario en el sistema.

#### Request
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "123456",
  "password_confirmation": "123456"
}
```

#### Response Success (201)
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 15,
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "created_at": "2025-10-03T18:30:45.000000Z"
  },
  "token": "15|xyz9876543210..."
}
```

#### Response Error (422)
```json
{
  "success": false,
  "message": "Los datos proporcionados no son válidos",
  "errors": {
    "email": ["Este correo electrónico ya está registrado"],
    "password": ["Las contraseñas no coinciden"]
  }
}
```

#### Validaciones
- `name`: requerido, string, máximo 255 caracteres, mínimo 2
- `email`: requerido, formato email válido, único en la base de datos
- `password`: requerido, mínimo 6 caracteres
- `password_confirmation`: requerido, debe coincidir con password

#### Ejemplo con cURL
```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "password": "123456",
    "password_confirmation": "123456"
  }'
```

---

### POST /api/auth/logout

Cierra la sesión del usuario actual e invalida el token.

#### Request
```http
POST /api/auth/logout
Authorization: Bearer 1|abcd1234567890...
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

#### Response Error (401)
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

#### Ejemplo con cURL
```bash
curl -X POST http://localhost/api/auth/logout \
  -H "Authorization: Bearer 1|abcd1234567890..." \
  -H "Accept: application/json"
```

## Gestión de Usuarios

### GET /api/users

Obtiene la lista de todos los usuarios registrados. **Requiere autenticación**.

#### Request
```http
GET /api/users
Authorization: Bearer 1|abcd1234567890...
```

#### Query Parameters (Opcionales)
- `sort_by`: Campo de ordenamiento (`name`, `created_at`) - Default: `name`
- `sort_direction`: Dirección del ordenamiento (`asc`, `desc`) - Default: `asc`

#### Response Success (200)
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "Administrador",
      "email": "admin@test.com",
      "created_at": "2025-09-03T17:15:10.000000Z"
    },
    {
      "id": 2,
      "name": "Ana Martínez",
      "email": "ana.martinez@ejemplo.com",
      "created_at": "2024-03-25T16:45:00.000000Z"
    },
    {
      "id": 3,
      "name": "Carlos López",
      "email": "carlos.lopez@ejemplo.com",
      "created_at": "2024-03-10T09:15:00.000000Z"
    }
  ],
  "total": 15,
  "sort_by": "name",
  "sort_direction": "asc"
}
```

#### Response Error (401)
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

#### Ejemplo con cURL
```bash
# Listado básico
curl -X GET http://localhost/api/users \
  -H "Authorization: Bearer 1|abcd1234567890..." \
  -H "Accept: application/json"

# Con ordenamiento por fecha, descendente
curl -X GET "http://localhost/api/users?sort_by=created_at&sort_direction=desc" \
  -H "Authorization: Bearer 1|abcd1234567890..." \
  -H "Accept: application/json"
```

## Códigos de Estado HTTP

| Código | Significado | Uso en la API |
|--------|-------------|---------------|
| 200 | OK | Operación exitosa (login, logout, listado) |
| 201 | Created | Recurso creado exitosamente (registro) |
| 400 | Bad Request | Request malformado |
| 401 | Unauthorized | No autenticado o token inválido |
| 422 | Unprocessable Entity | Errores de validación |
| 500 | Internal Server Error | Error interno del servidor |

## Manejo de Errores

### Error de Autenticación (401)
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

**Acción recomendada**: Redirigir al usuario al login y limpiar tokens almacenados.

### Error de Validación (422)
```json
{
  "success": false,
  "message": "Los datos proporcionados no son válidos",
  "errors": {
    "email": ["El campo email es obligatorio"],
    "password": ["El campo password debe tener al menos 6 caracteres"]
  }
}
```

**Acción recomendada**: Mostrar errores específicos en los campos correspondientes.

### Error de Servidor (500)
```json
{
  "success": false,
  "message": "Error interno del servidor"
}
```

**Acción recomendada**: Mostrar mensaje genérico al usuario y registrar error para debugging.

## Autenticación con JavaScript (Axios)

### Configuración de Cliente API
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Ejemplos de Uso
```javascript
// Login
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Registro
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Obtener usuarios
const getUsers = async (sortBy = 'name', sortDirection = 'asc') => {
  try {
    const response = await api.get('/users', {
      params: { sort_by: sortBy, sort_direction: sortDirection }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout
const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  } catch (error) {
    // Incluso si hay error, limpiamos el token local
    localStorage.removeItem('authToken');
    throw error.response?.data || error;
  }
};
```

## Testing de la API

### Script de Testing Completo
```bash
#!/bin/bash

echo "=== Testing API Completa ==="

# 1. Registro de usuario
echo "1. Registrando usuario nuevo..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Test",
    "email": "test@api.com",
    "password": "123456",
    "password_confirmation": "123456"
  }')

echo "Respuesta de registro: $REGISTER_RESPONSE"

# 2. Login con usuario registrado
echo "2. Haciendo login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@api.com",
    "password": "123456"
  }')

echo "Respuesta de login: $LOGIN_RESPONSE"

# Extraer token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token obtenido: ${TOKEN:0:20}..."

# 3. Listar usuarios
echo "3. Obteniendo lista de usuarios..."
USERS_RESPONSE=$(curl -s -X GET http://localhost/api/users \
  -H "Authorization: Bearer $TOKEN")

echo "Respuesta de usuarios: $USERS_RESPONSE"

# 4. Logout
echo "4. Cerrando sesión..."
LOGOUT_RESPONSE=$(curl -s -X POST http://localhost/api/auth/logout \
  -H "Authorization: Bearer $TOKEN")

echo "Respuesta de logout: $LOGOUT_RESPONSE"

echo "=== Testing completado ==="
```

### Colección Postman

Para testing con Postman, importar la siguiente colección:

```json
{
  "info": {
    "name": "Sistema Gestión Usuarios API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@test.com\",\n  \"password\": \"123456\"\n}"
            },
            "url": "{{baseUrl}}/auth/login"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.status === 'OK') {",
                  "    const response = pm.response.json();",
                  "    pm.collectionVariables.set('token', response.token);",
                  "}"
                ]
              }
            }
          ]
        },
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Usuario Test\",\n  \"email\": \"test@ejemplo.com\",\n  \"password\": \"123456\",\n  \"password_confirmation\": \"123456\"\n}"
            },
            "url": "{{baseUrl}}/auth/register"
          }
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/auth/logout"
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/users?sort_by=name&sort_direction=asc",
              "host": ["{{baseUrl}}"],
              "path": ["users"],
              "query": [
                {
                  "key": "sort_by",
                  "value": "name"
                },
                {
                  "key": "sort_direction",
                  "value": "asc"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

## Limitaciones y Consideraciones

### Rate Limiting
Actualmente no implementado. Para producción se recomienda:
- **Login**: 5 intentos por minuto por IP
- **Registro**: 3 registros por hora por IP
- **API General**: 60 requests por minuto por usuario autenticado

### CORS
Configurado para desarrollo local:
- `http://localhost:5173`
- `http://localhost:5174`

Para producción, actualizar en `config/cors.php`.

### Seguridad
- Passwords hasheados con bcrypt
- Tokens JWT con expiración
- Validación de entrada en todos los endpoints
- Headers de seguridad configurados

### Versionado
API actual sin versionado. Para futuras versiones:
- `/api/v1/users` 
- `/api/v2/users`

## Expansiones Futuras

### Endpoints Sugeridos
```
GET    /api/users/{id}           # Obtener usuario específico
PUT    /api/users/{id}           # Actualizar usuario
DELETE /api/users/{id}           # Eliminar usuario
POST   /api/auth/forgot-password # Recuperar contraseña
POST   /api/auth/reset-password  # Resetear contraseña
GET    /api/user/profile         # Perfil del usuario actual
PUT    /api/user/profile         # Actualizar perfil
```

### Filtros y Búsqueda
```
GET /api/users?search=juan&role=admin&created_after=2024-01-01
```

### Paginación
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 150,
    "last_page": 10
  },
  "links": {
    "first": "http://localhost/api/users?page=1",
    "last": "http://localhost/api/users?page=10",
    "prev": null,
    "next": "http://localhost/api/users?page=2"
  }
}
```