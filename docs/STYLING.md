# Guía de Estilos y Diseño

Documentación completa del sistema de diseño basado en **Atomic Design** implementado en el proyecto.

## Filosofía de Diseño

### Principios Fundamentales

1. **Modularidad**: Cada componente es independiente y reutilizable
2. **Consistencia**: Mismos patrones visuales en toda la aplicación
3. **Escalabilidad**: Fácil mantenimiento y expansión del sistema
4. **Accesibilidad**: Diseño inclusivo para todos los usuarios
5. **Responsive**: Adaptación perfecta a todos los dispositivos

### Atomic Design Methodology

```
Atoms → Molecules → Organisms → Templates → Pages
  ↓        ↓          ↓          ↓         ↓
Button   SearchBar   Header   UserLayout HomePage
Input    FormField   UserCard  Dashboard  LoginPage
Icon     Navigation  UserList   ...        ...
```



### Lo siguiente que se explicará es el sistema de temas, decisiones tecnicas y el como se implementaron los componentes:


## Sistema de Temas

### Tema Claro (Light Theme)
```css
:root {
  /* Colores principales */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  
  /* Texto */
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-muted: #64748b;
  
  /* Bordes */
  --border-color: #e2e8f0;
  --border-hover: #cbd5e1;
  
  /* Estados */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}
```

### Tema Oscuro (Dark Theme)
```css
[data-theme="dark"] {
  /* Colores principales */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  
  /* Texto */
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  
  /* Bordes */
  --border-color: #475569;
  --border-hover: #64748b;
  
  /* Estados */
  --color-success: #34d399;
  --color-error: #f87171;
  --color-warning: #fbbf24;
}
```

### Implementación del Theme Toggle
```javascript
// useTheme.js
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

## Atoms (Componentes Base)

### Button
**Ubicación**: `src/components/atoms/Button.jsx`

#### Variantes Disponibles
```jsx
// Primario
<Button variant="primary">Acción Principal</Button>

// Secundario  
<Button variant="secondary">Acción Secundaria</Button>

// Peligro
<Button variant="danger">Eliminar</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano</Button>   // Default
<Button size="lg">Grande</Button>

// Estados
<Button disabled>Deshabilitado</Button>
<Button loading>Cargando...</Button>
```

#### Estilos CSS
```css
.btn-base {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 
         focus:outline-none focus:ring-2 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 
         focus:ring-blue-500;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-900 hover:bg-gray-300 
         focus:ring-gray-500 dark:bg-gray-700 
         dark:text-gray-100 dark:hover:bg-gray-600;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 
         focus:ring-red-500;
}
```

### Input
**Ubicación**: `src/components/atoms/Input.jsx`

#### Tipos y Estados
```jsx
// Tipos básicos
<Input type="text" placeholder="Nombre completo" />
<Input type="email" placeholder="correo@ejemplo.com" />
<Input type="password" placeholder="Contraseña" />

// Con estado de error
<Input 
  type="email" 
  error="Formato de email inválido"
  value={email}
  onChange={handleChange}
/>

// Deshabilitado
<Input disabled placeholder="Campo deshabilitado" />
```

#### Estilos CSS
```css
.input-base {
  @apply w-full px-3 py-2 border rounded-lg 
         bg-white dark:bg-gray-800
         text-gray-900 dark:text-gray-100
         border-gray-300 dark:border-gray-600
         focus:outline-none focus:ring-2 focus:ring-blue-500 
         focus:border-transparent
         placeholder-gray-500 dark:placeholder-gray-400
         transition-colors duration-200;
}

.input-error {
  @apply border-red-500 focus:ring-red-500;
}

.input-disabled {
  @apply bg-gray-100 dark:bg-gray-700 
         cursor-not-allowed opacity-75;
}
```

### Icon
**Ubicación**: `src/components/atoms/Icon.jsx`

#### Iconos Disponibles
```jsx
// Navegación
<Icon name="home" />
<Icon name="users" />
<Icon name="settings" />

// Acciones
<Icon name="plus" />
<Icon name="edit" />
<Icon name="trash" />
<Icon name="search" />

// Estados
<Icon name="check" />
<Icon name="x" />
<Icon name="alert" />

// UI
<Icon name="menu" />
<Icon name="close" />
<Icon name="chevron-down" />

// Tamaños
<Icon name="home" size="sm" />    // 16px
<Icon name="home" size="md" />    // 20px (default)
<Icon name="home" size="lg" />    // 24px
<Icon name="home" size="xl" />    // 32px
```

### Logo
**Ubicación**: `src/components/atoms/Logo.jsx`

```jsx
// Tamaño completo
<Logo />

// Tamaño compacto
<Logo compact />

// Con texto
<Logo showText />
```

### Card
**Ubicación**: `src/components/atoms/Card.jsx`

```jsx
// Card básica
<Card>
  <h3>Título de la tarjeta</h3>
  <p>Contenido de la tarjeta...</p>
</Card>

// Con padding personalizado
<Card padding="lg">Contenido con más padding</Card>

// Sin shadow
<Card shadow="none">Sin sombra</Card>
```

### Avatar
**Ubicación**: `src/components/atoms/Avatar.jsx`

```jsx
// Con imagen
<Avatar src="/images/user.jpg" alt="Usuario" />

// Con iniciales
<Avatar name="Juan Pérez" />

// Tamaños
<Avatar name="JP" size="sm" />   // 32px
<Avatar name="JP" size="md" />   // 40px (default)
<Avatar name="JP" size="lg" />   // 48px
<Avatar name="JP" size="xl" />   // 64px
```

### Badge
**Ubicación**: `src/components/atoms/Badge.jsx`

```jsx
// Variantes
<Badge variant="success">Activo</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Información</Badge>

// Tamaños
<Badge size="sm">Pequeño</Badge>
<Badge size="md">Mediano</Badge>
```

## Molecules (Combinaciones Simples)

### FormField
**Ubicación**: `src/components/molecules/FormField.jsx`

Combina: `Input` + `Label` + `Error Message`

```jsx
<FormField
  label="Correo Electrónico"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  required
/>
```

#### Estructura
```jsx
const FormField = ({ label, error, required, ...inputProps }) => {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <Input 
        {...inputProps}
        error={error}
        className={`form-input ${error ? 'input-error' : ''}`}
      />
      
      {error && (
        <span className="form-error">
          <Icon name="alert" size="sm" />
          {error}
        </span>
      )}
    </div>
  );
};
```

## Organisms (Componentes Complejos)

### Header
**Ubicación**: `src/components/organisms/Header.jsx`

Combina: `Logo` + `Navigation` + `Avatar` + `ThemeToggle`

```jsx
const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Logo />
        
        <nav className="header-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/users">Usuarios</NavLink>
        </nav>
        
        <div className="header-actions">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
```

### UserCard
**Ubicación**: `src/components/organisms/UserCard.jsx`

Combina: `Card` + `Avatar` + `Button` + `Badge`

```jsx
const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <Card className="user-card">
      <div className="user-card-header">
        <Avatar 
          src={user.avatar} 
          name={user.name} 
          size="md" 
        />
        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          <p className="user-email">{user.email}</p>
        </div>
        <Badge variant="success">Activo</Badge>
      </div>
      
      <div className="user-card-actions">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onEdit}
        >
          <Icon name="edit" size="sm" />
          Editar
        </Button>
        
        <Button 
          variant="danger" 
          size="sm" 
          onClick={onDelete}
        >
          <Icon name="trash" size="sm" />
          Eliminar
        </Button>
      </div>
    </Card>
  );
};
```

### UserList
**Ubicación**: `src/components/organisms/UserList.jsx`

```jsx
const UserList = ({ users, loading, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="users" size="xl" />
        <h3>No hay usuarios</h3>
        <p>Aún no se han registrado usuarios</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard 
          key={user.id}
          user={user}
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user.id)}
        />
      ))}
    </div>
  );
};
```

## Templates (Estructuras de Página)

### UserLayout
**Ubicación**: `src/components/templates/UserLayout.jsx`

```jsx
const UserLayout = ({ children, title, actions }) => {
  return (
    <div className="page-layout">
      <Header />
      
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">{title}</h1>
          {actions && (
            <div className="page-actions">
              {actions}
            </div>
          )}
        </div>
        
        <div className="page-body">
          {children}
        </div>
      </main>
    </div>
  );
};
```

## Responsive Design

### Breakpoints
```css
/* Tailwind CSS Breakpoints */
sm: 640px    /* Teléfonos grandes */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Escritorios */
2xl: 1536px  /* Pantallas grandes */
```

### Patrones Responsive

#### Header Responsive
```jsx
<header className="header">
  <div className="container mx-auto px-4">
    {/* Mobile: Stack vertical */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      
      {/* Logo siempre visible */}
      <Logo className="mb-4 md:mb-0" />
      
      {/* Navegación: oculta en mobile, visible en desktop */}
      <nav className="hidden md:flex space-x-6">
        <NavLink>Dashboard</NavLink>
        <NavLink>Usuarios</NavLink>
      </nav>
      
      {/* Acciones: stack en mobile */}
      <div className="flex flex-col sm:flex-row gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </div>
  </div>
</header>
```

#### UserList Responsive
```jsx
<div className="user-list">
  {/* Grid responsive: 1 columna en mobile, 2 en tablet, 3 en desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {users.map(user => (
      <UserCard key={user.id} user={user} />
    ))}
  </div>
</div>
```

#### FormField Responsive
```css
.form-field {
  @apply mb-6;
}

.form-label {
  @apply block text-sm font-medium mb-2 
         text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full text-base sm:text-sm;
}

/* En mobile, inputs más grandes para facilitar interacción */
@media (max-width: 640px) {
  .form-input {
    @apply py-3 text-base;
  }
}
```

## Animaciones y Transiciones

### Principios de Animación
1. **Duración**: 200ms para cambios rápidos, 300ms para transiciones normales
2. **Easing**: `ease-out` para entradas, `ease-in` para salidas
3. **Propósito**: Solo animar cuando mejora la UX

### Micro-interacciones
```css
/* Hover en botones */
.btn {
  @apply transition-all duration-200 ease-out
         hover:scale-105 hover:shadow-lg;
}

/* Focus en inputs */
.input {
  @apply transition-colors duration-200
         focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50;
}

/* Fade in para elementos que aparecen */
.fade-in {
  animation: fadeIn 300ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Loading spinner */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Transiciones de Página
```jsx
// Con Framer Motion (opcional)
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);
```

## Accesibilidad (A11y)

### Principios WCAG 2.1
1. **Perceptible**: Contrastes adecuados, texto alternativo
2. **Operable**: Navegación por teclado, tiempo suficiente
3. **Comprensible**: Texto claro, comportamiento predecible
4. **Robusto**: Compatible con tecnologías asistivas

### Implementación

#### Contraste de Colores
```css
/* Ratios de contraste cumpliendo WCAG AA */
:root {
  --text-on-light: #1e293b;     /* 16.17:1 */
  --text-on-dark: #f1f5f9;      /* 18.52:1 */
  --link-color: #2563eb;        /* 7.17:1 */
  --error-color: #dc2626;       /* 5.93:1 */
}
```

#### Navegación por Teclado
```jsx
const Button = ({ children, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### ARIA Labels
```jsx
// Header con navegación accesible
<header role="banner">
  <nav role="navigation" aria-label="Navegación principal">
    <ul>
      <li><a href="/dashboard" aria-label="Ir al dashboard">Dashboard</a></li>
      <li><a href="/users" aria-label="Gestionar usuarios">Usuarios</a></li>
    </ul>
  </nav>
</header>

// Formularios accesibles
<form role="form" aria-labelledby="login-heading">
  <h2 id="login-heading">Iniciar Sesión</h2>
  
  <FormField
    label="Correo Electrónico"
    type="email"
    name="email"
    required
    aria-describedby={error ? "email-error" : undefined}
  />
  
  {error && (
    <div id="email-error" role="alert" aria-live="polite">
      {error}
    </div>
  )}
</form>

// Estados de carga
<Button disabled aria-label="Cargando, por favor espere">
  <LoadingSpinner aria-hidden="true" />
  Guardando...
</Button>
```

## Testing de Componentes

### Testing de Estilos Visuales
```javascript
// tests/components/Button.test.jsx
import { render, screen } from '@testing-library/react';
import { Button } from '../components/atoms/Button';

describe('Button Styles', () => {
  test('aplica estilos correctos por variante', () => {
    render(<Button variant="primary">Test</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveClass('bg-blue-600');
  });

  test('muestra estado de loading', () => {
    render(<Button loading>Cargando</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });
});
```

### Testing de Accesibilidad
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('no tiene violaciones de accesibilidad', async () => {
  const { container } = render(<UserCard user={mockUser} />);
  const results = await axe(container);
  
  expect(results).toHaveNoViolations();
});
```

## Herramientas de Desarrollo

### Storybook (Recomendado)
```javascript
// stories/Button.stories.js
export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Botón base del sistema de diseño'
      }
    }
  }
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Botón Primario'
  }
};

export const AllVariants = () => (
  <div className="space-y-4">
    <Button variant="primary">Primario</Button>
    <Button variant="secondary">Secundario</Button>
    <Button variant="danger">Peligro</Button>
  </div>
);
```

### Design Tokens (CSS Custom Properties)
```css
/* tokens/colors.css */
:root {
  /* Colores de marca */
  --brand-primary: #2563eb;
  --brand-secondary: #64748b;
  
  /* Grises semánticos */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  
  /* Estados semánticos */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}

/* tokens/spacing.css */
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```