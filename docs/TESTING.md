# Guía de Testing

Documentación completa sobre las estrategias y herramientas de testing implementadas en el proyecto.

## Filosofía de Testing

### Pirámide de Testing
```
                 E2E Tests
                /         \
           Integration Tests  
          /                   \
     Unit Tests               Component Tests
```

1. **Unit Tests**: Funciones individuales y lógica de negocio
2. **Component Tests**: Componentes React en aislamiento
3. **Integration Tests**: Interacción entre componentes y APIs
4. **E2E Tests**: Flujos completos de usuario

### Principios de Testing
- **AAA Pattern**: Arrange, Act, Assert
- **Test Behavior, Not Implementation**: Testing desde la perspectiva del usuario
- **Fail Fast**: Tests que fallan rápidamente cuando algo está mal
- **Maintainable**: Tests fáciles de mantener y entender

## Setup de Testing

### Frontend (React + Vite)

#### Dependencias Instaladas
```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jsdom": "^22.1.0",
    "vitest": "^0.34.6",
    "jest-axe": "^8.0.0"
  }
}
```

#### Configuración Vitest
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### Setup de Testing
```javascript
// src/test/setup.js
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from 'jest-axe/dist/extend-expect';

// Extend Vitest's expect with custom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia (needed for responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;
```

### Backend (Laravel + PHPUnit)

#### Configuración PHPUnit
```xml
<!-- phpunit.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>app</directory>
        </include>
    </source>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
        <env name="CACHE_DRIVER" value="array"/>
        <env name="SESSION_DRIVER" value="array"/>
        <env name="QUEUE_DRIVER" value="sync"/>
    </php>
</phpunit>
```

## Unit Tests - Frontend

### Testing de Atoms

#### Button Component
```javascript
// src/components/atoms/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct variant class', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  test('disables button when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Cargando...');
  });

  test('has correct accessibility attributes', () => {
    render(<Button aria-label="Close dialog">X</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
  });
});
```

#### Input Component
```javascript
// src/components/atoms/__tests__/Input.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input Component', () => {
  test('renders with placeholder text', () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  test('handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'test@example.com');
    
    expect(handleChange).toHaveBeenCalledTimes(17); // for each character
    expect(input).toHaveValue('test@example.com');
  });

  test('shows error state correctly', () => {
    render(<Input error="Invalid email format" />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveClass('input-error');
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  test('disables input when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
```

### Testing de Molecules

#### FormField Component
```javascript
// src/components/molecules/__tests__/FormField.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from '../FormField';

describe('FormField Component', () => {
  test('renders label and input', () => {
    render(
      <FormField 
        label="Email Address" 
        name="email" 
        type="email" 
      />
    );
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  test('shows required indicator when required', () => {
    render(
      <FormField 
        label="Password" 
        name="password" 
        type="password" 
        required 
      />
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('displays error message', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        error="Email is required" 
      />
    );
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('input-error');
  });

  test('handles form interaction correctly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <FormField 
        label="Username" 
        name="username" 
        onChange={handleChange} 
      />
    );
    
    const input = screen.getByLabelText('Username');
    await user.type(input, 'johndoe');
    
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('johndoe');
  });
});
```

### Testing de Custom Hooks

#### useAuth Hook
```javascript
// src/hooks/__tests__/useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../useAuth';
import { vi } from 'vitest';

// Mock API
vi.mock('../api/auth', () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  registerUser: vi.fn(),
}));

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('initializes with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  test('login sets user and token', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    const mockToken = 'fake-jwt-token';
    
    const { loginUser } = await import('../api/auth');
    loginUser.mockResolvedValue({
      success: true,
      user: mockUser,
      token: mockToken
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('john@example.com', 'password');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('authToken')).toBe(mockToken);
  });

  test('logout clears user and token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Set initial authenticated state
    await act(async () => {
      result.current.setUser({ id: 1, name: 'John' });
      localStorage.setItem('authToken', 'token');
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  test('handles login error', async () => {
    const { loginUser } = await import('../api/auth');
    loginUser.mockRejectedValue({
      success: false,
      message: 'Invalid credentials'
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login('wrong@email.com', 'wrongpass');
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

## Component Tests

### Testing de Organisms

#### UserCard Component
```javascript
// src/components/organisms/__tests__/UserCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '../UserCard';

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatars/john.jpg',
  created_at: '2024-01-15T10:30:00.000Z'
};

describe('UserCard Component', () => {
  test('displays user information correctly', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe')).toHaveAttribute('src', '/avatars/john.jpg');
  });

  test('calls onEdit when Edit button is clicked', () => {
    const handleEdit = vi.fn();
    render(<UserCard user={mockUser} onEdit={handleEdit} />);
    
    fireEvent.click(screen.getByText('Editar'));
    expect(handleEdit).toHaveBeenCalledWith(mockUser);
  });

  test('calls onDelete when Delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<UserCard user={mockUser} onDelete={handleDelete} />);
    
    fireEvent.click(screen.getByText('Eliminar'));
    expect(handleDelete).toHaveBeenCalledWith(mockUser.id);
  });

  test('shows fallback avatar when no image provided', () => {
    const userWithoutAvatar = { ...mockUser, avatar: null };
    render(<UserCard user={userWithoutAvatar} />);
    
    // Avatar should show initials
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('formats creation date correctly', () => {
    render(<UserCard user={mockUser} showDate />);
    
    expect(screen.getByText(/Registrado:/)).toBeInTheDocument();
  });
});
```

#### Header Component
```javascript
// src/components/organisms/__tests__/Header.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../hooks/useAuth';
import { ThemeProvider } from '../../../hooks/useTheme';
import { Header } from '../Header';

const Wrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Header Component', () => {
  test('renders logo and navigation', () => {
    render(<Header />, { wrapper: Wrapper });
    
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
  });

  test('shows theme toggle button', () => {
    render(<Header />, { wrapper: Wrapper });
    
    const themeToggle = screen.getByRole('button', { name: /cambiar tema/i });
    expect(themeToggle).toBeInTheDocument();
  });

  test('toggles theme when theme button is clicked', () => {
    render(<Header />, { wrapper: Wrapper });
    
    const themeToggle = screen.getByRole('button', { name: /cambiar tema/i });
    fireEvent.click(themeToggle);
    
    // Verify theme changed in document
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  test('shows user menu when authenticated', () => {
    // Mock authenticated user
    const authenticatedWrapper = ({ children }) => (
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider initialUser={{ name: 'John Doe', email: 'john@example.com' }}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    render(<Header />, { wrapper: authenticatedWrapper });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menú usuario/i })).toBeInTheDocument();
  });
});
```

## Integration Tests

### API Integration
```javascript
// src/api/__tests__/auth.integration.test.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { loginUser, registerUser, logoutUser } from '../auth';

// Mock server
const server = setupServer(
  rest.post('http://localhost/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    
    if (email === 'admin@test.com' && password === '123456') {
      return res(ctx.json({
        success: true,
        user: { id: 1, name: 'Admin', email: 'admin@test.com' },
        token: 'mock-jwt-token'
      }));
    }
    
    return res(
      ctx.status(401),
      ctx.json({ success: false, message: 'Invalid credentials' })
    );
  }),
  
  rest.post('http://localhost/api/auth/register', (req, res, ctx) => {
    const { name, email, password } = req.body;
    
    if (email === 'existing@test.com') {
      return res(
        ctx.status(422),
        ctx.json({
          success: false,
          message: 'Validation errors',
          errors: { email: ['Email already exists'] }
        })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        user: { id: 2, name, email },
        token: 'new-user-token'
      })
    );
  }),
  
  rest.post('http://localhost/api/auth/logout', (req, res, ctx) => {
    return res(ctx.json({ success: true, message: 'Logged out' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Auth API Integration', () => {
  test('successful login returns user and token', async () => {
    const result = await loginUser('admin@test.com', '123456');
    
    expect(result.success).toBe(true);
    expect(result.user.email).toBe('admin@test.com');
    expect(result.token).toBe('mock-jwt-token');
  });

  test('failed login throws error', async () => {
    await expect(
      loginUser('wrong@email.com', 'wrongpass')
    ).rejects.toThrow('Invalid credentials');
  });

  test('successful registration returns user and token', async () => {
    const userData = {
      name: 'New User',
      email: 'new@test.com',
      password: '123456',
      password_confirmation: '123456'
    };
    
    const result = await registerUser(userData);
    
    expect(result.success).toBe(true);
    expect(result.user.name).toBe('New User');
    expect(result.token).toBe('new-user-token');
  });

  test('registration with existing email fails', async () => {
    const userData = {
      name: 'Existing User',
      email: 'existing@test.com',
      password: '123456',
      password_confirmation: '123456'
    };
    
    await expect(
      registerUser(userData)
    ).rejects.toMatchObject({
      message: 'Validation errors',
      errors: { email: ['Email already exists'] }
    });
  });

  test('logout succeeds', async () => {
    const result = await logoutUser();
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('Logged out');
  });
});
```

### Page Integration Tests
```javascript
// src/pages/__tests__/Login.integration.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../hooks/useAuth';
import { Login } from '../Login';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Page Integration', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('successful login redirects to dashboard', async () => {
    const user = userEvent.setup();
    render(<Login />, { wrapper: Wrapper });
    
    // Fill login form
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), '123456');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error for invalid credentials', async () => {
    const user = userEvent.setup();
    render(<Login />, { wrapper: Wrapper });
    
    await user.type(screen.getByLabelText(/email/i), 'wrong@email.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });
  });

  test('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<Login />, { wrapper: Wrapper });
    
    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during login', async () => {
    const user = userEvent.setup();
    render(<Login />, { wrapper: Wrapper });
    
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), '123456');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    // Button should show loading state
    expect(submitButton).toHaveTextContent(/iniciando/i);
    expect(submitButton).toBeDisabled();
  });
});
```

## Backend Tests (Laravel)

### Feature Tests

#### Authentication Tests
```php
<?php
// tests/Feature/AuthTest.php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'user' => ['id', 'name', 'email'],
                    'token'
                ])
                ->assertJson([
                    'success' => true,
                    'user' => [
                        'email' => 'test@example.com'
                    ]
                ]);
    }

    public function test_user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Credenciales incorrectas'
                ]);
    }

    public function test_user_can_register_with_valid_data()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'user' => ['id', 'name', 'email'],
                    'token'
                ])
                ->assertJson([
                    'success' => true,
                    'user' => [
                        'name' => 'John Doe',
                        'email' => 'john@example.com'
                    ]
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }

    public function test_user_cannot_register_with_existing_email()
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Logout exitoso'
                ]);

        // Verify token is revoked
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_logout()
    {
        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ]);
    }
}
```

#### User Management Tests
```php
<?php
// tests/Feature/UserTest.php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    public function test_authenticated_user_can_list_users()
    {
        // Create additional users
        User::factory()->count(5)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/users');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'users' => [
                        '*' => ['id', 'name', 'email', 'created_at']
                    ],
                    'total',
                    'sort_by',
                    'sort_direction'
                ])
                ->assertJson([
                    'success' => true,
                    'total' => 6, // 1 setUp user + 5 factory users
                    'sort_by' => 'name',
                    'sort_direction' => 'asc'
                ]);
    }

    public function test_users_can_be_sorted_by_name()
    {
        User::factory()->create(['name' => 'Zebra User']);
        User::factory()->create(['name' => 'Alpha User']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/users?sort_by=name&sort_direction=asc');

        $response->assertStatus(200);
        
        $users = $response->json('users');
        $this->assertEquals('Alpha User', $users[0]['name']);
    }

    public function test_users_can_be_sorted_by_creation_date()
    {
        $oldUser = User::factory()->create([
            'created_at' => now()->subDays(2)
        ]);
        $newUser = User::factory()->create([
            'created_at' => now()
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/users?sort_by=created_at&sort_direction=desc');

        $response->assertStatus(200);
        
        $users = $response->json('users');
        $this->assertEquals($newUser->id, $users[0]['id']);
    }

    public function test_unauthenticated_user_cannot_list_users()
    {
        $response = $this->getJson('/api/users');

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ]);
    }
}
```

### Unit Tests (Laravel)

#### Model Tests
```php
<?php
// tests/Unit/UserTest.php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_fillable_attributes()
    {
        $user = new User();
        
        $this->assertEquals([
            'name',
            'email',
            'password',
        ], $user->getFillable());
    }

    public function test_user_has_hidden_attributes()
    {
        $user = new User();
        
        $this->assertEquals([
            'password',
            'remember_token',
        ], $user->getHidden());
    }

    public function test_user_password_is_hashed()
    {
        $user = User::factory()->create([
            'password' => 'plaintext-password'
        ]);

        $this->assertNotEquals('plaintext-password', $user->password);
        $this->assertTrue(password_verify('plaintext-password', $user->password));
    }

    public function test_user_email_is_unique()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);
        
        User::factory()->create(['email' => 'test@example.com']);
    }
}
```

## Accessibility Tests

### Automated A11y Testing
```javascript
// src/test/accessibility.test.jsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import { UserCard } from '../components/organisms/UserCard';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('Button has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  test('FormField has no accessibility violations', async () => {
    const { container } = render(
      <FormField 
        label="Email Address" 
        name="email" 
        type="email" 
        required 
      />
    );
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  test('UserCard has no accessibility violations', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    const { container } = render(<UserCard user={mockUser} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  test('Form with errors maintains accessibility', async () => {
    const { container } = render(
      <form>
        <FormField 
          label="Email" 
          name="email" 
          type="email" 
          error="Please enter a valid email" 
          required 
        />
        <FormField 
          label="Password" 
          name="password" 
          type="password" 
          error="Password must be at least 6 characters" 
          required 
        />
        <Button type="submit">Submit</Button>
      </form>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Performance Tests

### Component Performance
```javascript
// src/test/performance.test.jsx
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { UserList } from '../components/organisms/UserList';

describe('Performance Tests', () => {
  test('UserList renders large dataset efficiently', () => {
    const largeUserList = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    const startTime = performance.now();
    render(<UserList users={largeUserList} />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test('Component re-renders efficiently on prop changes', () => {
    const users = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' },
    ];

    const { rerender } = render(<UserList users={users} />);

    const startTime = performance.now();
    
    // Re-render with updated props
    rerender(<UserList users={[...users, { id: 3, name: 'Bob', email: 'bob@example.com' }]} />);
    
    const endTime = performance.now();
    const rerenderTime = endTime - startTime;

    // Re-render should be even faster
    expect(rerenderTime).toBeLessThan(50);
  });
});
```

## E2E Tests (Opcional - Playwright)

### Setup Playwright
```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example
```javascript
// e2e/auth.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can login and access dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[name="email"]', 'admin@test.com');
    await page.fill('[name="password"]', '123456');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Should show user info
    await expect(page.locator('text=Bienvenido')).toBeVisible();
  });

  test('user can register new account', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[name="name"]', 'New User');
    await page.fill('[name="email"]', 'newuser@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.fill('[name="password_confirmation"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to confirmation page
    await expect(page).toHaveURL('/confirmation');
    await expect(page.locator('text=Usuario registrado exitosamente')).toBeVisible();
  });

  test('user can logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@test.com');
    await page.fill('[name="password"]', '123456');
    await page.click('button[type="submit"]');
    
    // Should be in dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Click logout
    await page.click('[aria-label="User menu"]');
    await page.click('text=Cerrar Sesión');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});
```

## Test Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:accessibility": "vitest run --reporter=verbose accessibility",
    "test:all": "npm run test:run && npm run test:e2e"
  }
}
```

### Composer Scripts (Laravel)
```json
{
  "scripts": {
    "test": "vendor/bin/phpunit",
    "test-coverage": "vendor/bin/phpunit --coverage-html coverage",
    "test-filter": "vendor/bin/phpunit --filter",
    "test-feature": "vendor/bin/phpunit tests/Feature",
    "test-unit": "vendor/bin/phpunit tests/Unit"
  }
}
```

## CI/CD Testing Pipeline

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: cd skye-frontend && npm ci
      
    - name: Run tests
      run: cd skye-frontend && npm run test:run
      
    - name: Run accessibility tests
      run: cd skye-frontend && npm run test:accessibility
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: testing
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        
    - name: Install dependencies
      run: cd skye-backend && composer install
      
    - name: Run tests
      run: cd skye-backend && php artisan test
      
  e2e-tests:
    runs-on: ubuntu-latest
    needs: [frontend-tests, backend-tests]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install Playwright
      run: cd skye-frontend && npx playwright install
      
    - name: Run E2E tests
      run: cd skye-frontend && npm run test:e2e
```

## Coverage Goals

### Frontend Coverage
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Backend Coverage
- **Classes**: > 90%
- **Methods**: > 85%
- **Lines**: > 80%

### Monitoring
```bash
# Generate coverage reports
npm run test:coverage
composer test-coverage

# View coverage reports
open coverage/index.html
open skye-backend/coverage/index.html
```

Esta guía de testing proporciona una base sólida para mantener la calidad del código y detectar errores tempranamente en el desarrollo.