# Preguntas Extra 



## 1. ¿Cómo organizaste los componentes según Atomic Design y por qué?



La organización siguió estrictamente la jerarquía lógica y escalabilidad del sistema Atom:

#### ** Atoms (8 componentes)**
```
src/components/atoms/
├── Button.jsx          # Botón reutilizable con variantes
├── Input.jsx           # Campo de entrada con validación
├── Label.jsx           # Etiqueta semántica
├── Text.jsx            # Componente de texto tipográfico
├── ErrorMessage.jsx    # Mensaje de error consistente
├── Spinner.jsx         # Indicador de carga
├── IconBox.jsx         # Contenedor de iconos
└── ThemeToggle.jsx     # Switcher de tema claro/oscuro
```

#### ** Molecules (1 componente)**
```
src/components/molecules/
└── FormField.jsx       # Combinación de Label + Input + ErrorMessage
```

#### ** Organisms (3 componentes)**
```
src/components/organisms/
├── LoginForm.jsx       # Formulario completo de login
├── RegisterForm.jsx    # Formulario completo de registro
└── UserTable.jsx       # Tabla completa de gestión de usuarios
```


#### ** Templates (2 componentes)**
```
src/components/templates/
├── AuthLayout.jsx      # Layout para páginas de autenticación
└── MainLayout.jsx      # Layout principal de la aplicación
```




## 2. ¿Qué problemas enfrentaste y cómo los solucionaste?


#### **Problema 1: "Comunicación entre backend y frontend**

Al principio, cuando intentaba hacer login desde React, me salían errores de CORS por todos lados. El frontend en el puerto 5173 no podía conectarse con Laravel en el puerto 80. Era frustrante porque visualmente todo se veía bien, pero nada funcionaba.

Mi Proceso de Resolución:
1. **Investigación:** Primero googleé "CORS Laravel React" y leí sobre el problema
2. **Comprensión:** Me di cuenta que son dos servidores diferentes tratando de comunicarse
3. **Prueba y Error:** Intenté varias configuraciones hasta encontrar la correcta
4. **Documentación:** Leí la documentación oficial de Laravel Sanctum
5. **Implementación:** Configuré CORS específicamente para mi setup de desarrollo

**Lo que Aprendí:** Los navegadores bloquean requests entre diferentes puertos por seguridad, pero se puede configurar para desarrollo.

#### **Problema 2: "¿Por qué se desloguea al recargar la página?"**

La Situación:
Los usuarios se logueaban perfectamente, pero al recargar la página perdían la sesión. Esto era súper molesto

Mi Proceso de Resolución:
1. **Análisis:** Me di cuenta que el token se perdía al recargar
2. **Investigación:** Busqué cómo mantener estado en React entre recargas
3. **Experimentación:** Probé diferentes enfoques (sessionStorage vs localStorage)
4. **Implementación:** Agregué verificación automática del token al iniciar la app
5. **Testing:** Probé recargando la página múltiples veces para asegurarme que funcionara

**Lo que Aprendí:** El estado de React se pierde al recargar, pero el localStorage persiste. Hay que verificar la validez del token guardado.



###  **Mi Filosofía de Resolución de Problemas:**

1. **Investigar Primero:** Google, documentación oficial, Stack Overflow
2. **Experimentar en Pequeño:** Hago pruebas rápidas antes de cambios grandes
3. **Documentar el Proceso:** Anoto lo que funciona y lo que no
4. **Pensar en el Usuario:** Siempre considero cómo afecta la experiencia final

---

## 3. ¿Cómo aseguraremos la seguridad del sistema de login?

###  **Medidas de Seguridad Implementadas**

#### **Autenticación Backend (Laravel Sanctum)**

1. **Hash Seguro de Contraseñas:**
```php
// Automático con Laravel
$user->password = Hash::make($request->password);
// Usa bcrypt con salt aleatorio
```

2. **Tokens JWT Seguros:**
```php
// AuthController.php
$token = $user->createToken('auth_token')->plainTextToken;
// Token único por sesión, expirable, revocable
```

3. **Validación de Entrada:**
```php
$request->validate([
    'email' => 'required|email|max:255',
    'password' => 'required|string|min:6|max:255',
]);
```

4. **Protección CSRF:**
```php
// Automático con Laravel Sanctum
// Protege contra Cross-Site Request Forgery
```

#### ** Seguridad Frontend**

1. **Almacenamiento Seguro de Tokens:**
```javascript
// localStorage con limpieza automática
const token = localStorage.getItem('token');
if (!token) redirectToLogin();
```

2. **Interceptores de Request:**
```javascript
// Automatic token attachment
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

3. **Validación de Formularios:**
```javascript
// Pre-validación antes de envío
if (!email || !email.includes('@')) {
  setErrors({email: 'Email inválido'});
  return;
}
```

#### **🚨 Medidas de Seguridad Adicionales**

1. **Rate Limiting:**
```php
// En routes/api.php
Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
});
```

2. **Validación de Email:**
```php
'email' => 'required|email|exists:users,email'
```

3. **Logout Seguro:**
```php
public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out successfully']);
}
```

4. **Headers de Seguridad:**
```php
// CORS configurado específicamente
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

#### **Checklist de Seguridad:**

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Validación de entrada estricta
- Protección CSRF
- Rate limiting en endpoints críticos
- CORS configurado restrictivamente
- Sanitización de datos
- Logout que revoca tokens
- Verificación de autorización en cada request
- Manejo seguro de errores (sin exposición de información sensible)



## **Conclusión**

Este proyecto demuestra la implementación exitosa de:
- Atomic Design methodology completa
- Resolución sistemática de problemas técnicos
- Seguridad robusta en autenticación
- Arquitectura escalable y mantenible
- "Best practices" de desarrollo full-stack